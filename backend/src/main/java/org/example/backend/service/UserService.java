package org.example.backend.service;

import org.example.backend.model.*;
import org.example.backend.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Constants
    private static final int SOLAR_IRRADIANCE = 1000; //Sonnenstrahlung Konstante
    private static final int LIFETIME_YEARS = 25;
    private static final double DEGRADATION_RATE = 0.005; // 0.5%/Jahr
    private static final double CO2_PER_KWH = 0.4; // kg CO₂ pro kWh

    // Zusätzliche Konstanten für Tagesberechnung
    private static final double HOME_OFFICE_DAILY_KWH = 3.0;     // angenommener Verbrauch pro Tag im Homeoffice
    private static final double EBIKE_KWH_PER_KM = 0.015;         // Verbrauch E-Bike
    private static final double ECAR_KWH_PER_KM = 0.17;           // Verbrauch E-Auto

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User generateUser() {
        String id = UUID.randomUUID().toString();
        User user = new User(id, null, null, null);
        return userRepository.save(user);
    }

    public User updateUserinfo(String userId, UserInfo userInfo) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isEmpty()) {
            throw new IllegalArgumentException("User not found: " + userId);
        }

        User user = existingUser.get();
        User updatedUser = new User(
                user.userId(),
                userInfo,
                user.userConditions(),
                user.userResult()
        );

        return userRepository.save(updatedUser);
    }

    public User updateUserConditions(String userId, UserConditions userConditions) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isEmpty()) {
            throw new IllegalArgumentException("User not found: " + userId);
        }

        User user = existingUser.get();
        User updatedUser = new User(
                user.userId(),
                user.userInfo(),
                userConditions,
                user.userResult()
        );

        return userRepository.save(updatedUser);
    }

    // ERTRAGSRECHNER
    public User calculateUserResult(String userId) {
        // Load user from DB
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User mit ID " + userId + " nicht gefunden"));

        // Validate required data exists
        UserConditions conditions = Optional.ofNullable(user.userConditions())
                .orElseThrow(() -> new IllegalStateException("UserConditions fehlen."));

        UserInfo info = Optional.ofNullable(user.userInfo())
                .orElseThrow(() -> new IllegalStateException("UserInfo fehlen."));

        UserPvConfig pvConfig = conditions.userPvConfig();
        if (pvConfig == null) {
            throw new IllegalStateException("Kein PV-Modul gewählt.");
        }

        double powerKwp = pvConfig.getTotalModuleKwp();
        int installationCost = pvConfig.getInstallationCostEur();

        double directionFactor = getDirectionFactor(conditions.montageDirection());
        double angleFactor = getAngleFactor(conditions.montageAngle());
        double shadeFactor = conditions.montageShadeFactor();

        // --- Jahresertrag ---
        double yearlyYield = powerKwp
                * directionFactor
                * angleFactor
                * (1 - shadeFactor)
                * SOLAR_IRRADIANCE
                * pvConfig.getClippingFactor();

        int possibleElectricity = (int) Math.round(yearlyYield);

        double pricePerKwh = info.userRateOfElectricity() / 100.0;
        int savings = (int) Math.round(possibleElectricity * pricePerKwh);

        double amortisationTime = savings > 0
                ? (double) installationCost / savings
                : Double.MAX_VALUE;

        // --- Neue Berechnungen ---
        // 1) Gesamtertrag über Systemlebensdauer (25 Jahre mit Degradation)
        double lifetimeYield = 0.0;
        double yearlyFactor = 1.0;
        for (int y = 0; y < LIFETIME_YEARS; y++) {
            lifetimeYield += yearlyYield * yearlyFactor;
            yearlyFactor *= (1.0 - DEGRADATION_RATE);
        }

        // 2) CO₂-Ersparnis pro Jahr
        double co2SavingsKgPerYear = possibleElectricity * CO2_PER_KWH;

        // 3) Eigenverbrauchsquote (vereinfacht, ohne Speicher)
        double annualConsumption = info.userElectricityConsumption();
        double pvToConsumptionRatio = annualConsumption > 0 ? (possibleElectricity / annualConsumption) : 0.0;
        double selfConsumptionRate;
        if (pvToConsumptionRatio <= 0.3) selfConsumptionRate = 0.70;
        else if (pvToConsumptionRatio <= 0.7) selfConsumptionRate = 0.50;
        else if (pvToConsumptionRatio <= 1.0) selfConsumptionRate = 0.35;
        else if (pvToConsumptionRatio <= 1.5) selfConsumptionRate = 0.25;
        else selfConsumptionRate = 0.20;

        // 4) Autarkiegrad = Eigenverbrauch / Gesamtverbrauch
        double selfConsumedEnergy = selfConsumptionRate * possibleElectricity;
        double autarkyRate = (annualConsumption <= 0)
                ? 0.0
                : Math.min(1.0, selfConsumedEnergy / annualConsumption);

        // --- Tageswerte ---
        double dailyYield = roundToOneDecimal(yearlyYield / 365.0);
        double dailySavings = roundToOneDecimal(dailyYield * pricePerKwh);
        double homeofficeCoverageRate = roundToOneDecimal(calculateHomeofficeCoverageRate(dailyYield));
        double dailyEBikeRangeKm = roundToOneDecimal(calculateDailyEBikeRangeKm(dailyYield));
        double dailyECarRangeKm = roundToOneDecimal(calculateDailyECarRangeKm(dailyYield));

        // --- Ergebnisobjekt ---
        UserResult result = new UserResult(
                possibleElectricity,
                savings,
                amortisationTime,
                lifetimeYield,
                co2SavingsKgPerYear,
                selfConsumptionRate,
                autarkyRate,
                dailyYield,
                dailySavings,
                homeofficeCoverageRate,
                dailyEBikeRangeKm,
                dailyECarRangeKm
        );

        User updatedUser = new User(
                user.userId(),
                user.userInfo(),
                user.userConditions(),
                result
        );

        return userRepository.save(updatedUser);
    }

    // ----------------------------------------------------
    //  Hilfsmethoden
    // ----------------------------------------------------

    private double calculateHomeofficeCoverageRate(double dailyYieldKwh) {
        // Anteil des Homeoffice-Verbrauchs, der durch PV gedeckt wird
        return HOME_OFFICE_DAILY_KWH > 0
                ? Math.min(100.0, (dailyYieldKwh / HOME_OFFICE_DAILY_KWH) * 100.0)
                : 0.0;
    }

    private double calculateDailyEBikeRangeKm(double dailyYieldKwh) {
        // Maximale km Reichweite E-Bike pro Tag basierend auf PV-Ertrag
        return dailyYieldKwh / EBIKE_KWH_PER_KM;
    }

    private double calculateDailyECarRangeKm(double dailyYieldKwh) {
        // Maximale km Reichweite E-Auto pro Tag basierend auf PV-Ertrag
        return dailyYieldKwh / ECAR_KWH_PER_KM;
    }

    private double roundToOneDecimal(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private double getDirectionFactor(Direction direction) {
        return switch (direction) {
            case SOUTH -> 1.0;
            case SOUTHEAST, SOUTHWEST -> 0.95;
            case EAST, WEST -> 0.8;
            case NORTHEAST, NORTHWEST -> 0.65;
            case NORTH -> 0.5;
        };
    }

    private double getAngleFactor(int angle) {
        if (angle < 0) angle = 0;
        if (angle > 90) angle = 90;
        double diff = Math.abs(angle - 30);
        double factor = 1.0 - diff * 0.01;
        return Math.max(factor, 0.6);
    }
}