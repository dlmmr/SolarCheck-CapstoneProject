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
    private static final int SOLAR_IRRADIANCE = 1000;

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
                .orElseThrow(() -> new IllegalStateException(
                        "UserConditions fehlen für User mit ID " + userId + ". Bitte zuerst Bedingungen setzen."));

        UserInfo info = Optional.ofNullable(user.userInfo())
                .orElseThrow(() -> new IllegalStateException(
                        "UserInfo fehlen für User mit ID " + userId + ". Bitte zuerst UserInfo setzen."));

        // Hier holen wir das vom User gewählte PV-Modul
        UserPvConfig pvConfig = conditions.userPvConfig();
        if (pvConfig == null) {
            throw new IllegalStateException("Kein PV-Modul gewählt für User mit ID " + userId);
        }

        double powerKwp = pvConfig.getDefaultPowerKwp();
        int installationCost = pvConfig.getInstallationCostEur();

        // Calculate direction factor
        double directionFactor = getDirectionFactor(conditions.montageDirection());

        // Use values directly - @NotNull ensures they are never null
        int angle = conditions.montageAngle();
        double angleFactor = getAngleFactor(angle);

        double shadeFactor = conditions.montageShadeFactor();

        // Calculate annual electricity generation in kWh
        double yearlyYield = powerKwp
                * directionFactor
                * angleFactor
                * (1 - shadeFactor)
                * SOLAR_IRRADIANCE;

        int possibleElectricity = (int) Math.round(yearlyYield);

        double pricePerKwh = info.userRateOfElectricity() / 100.0;
        int savings = (int) Math.round(possibleElectricity * pricePerKwh);

        int amortisationTime = savings > 0
                ? (int) Math.ceil((double) installationCost / savings)
                : Integer.MAX_VALUE;

        UserResult result = new UserResult(possibleElectricity, savings, amortisationTime);

        User updatedUser = new User(
                user.userId(),
                user.userInfo(),
                user.userConditions(),
                result
        );

        return userRepository.save(updatedUser);
    }

    // Helper methods
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
        // Clamp angle to valid range
        if (angle < 0) angle = 0;
        if (angle > 90) angle = 90;

        // Optimal angle is 30°
        double diff = Math.abs(angle - 30);
        double factor = 1.0 - diff * 0.01;  // 1% loss per degree deviation
        return Math.max(factor, 0.6);       // Minimum 60% efficiency
    }
}