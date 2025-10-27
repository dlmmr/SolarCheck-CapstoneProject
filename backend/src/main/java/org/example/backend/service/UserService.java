package org.example.backend.service;

import jakarta.validation.Valid;
import org.example.backend.model.*;
import org.example.backend.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User generateUser() {
        String id = UUID.randomUUID().toString();
        User user = new User(id, null, null, null);
        return userRepository.save(user);
    }

    // aktualisiert UserInfo eines bestehenden Users
    public User updateUserinfo(String userId, UserInfo userInfo) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isEmpty()) {
            throw new IllegalArgumentException("User not found: " + userId);
        }

        User user = existingUser.get();
        User updatedUser = new User(
                user.userId(),
                userInfo,                  // neue Info
                user.userConditions(),     // bleibt gleich
                user.userResult()          // bleibt gleich
        );

        return userRepository.save(updatedUser);
    }

    public User updateUserConditions(String userId, @Valid UserConditions userConditions) {
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


    private static final double DEFAULT_POWER_KWP = 0.8;
    private static final int SOLAR_IRRADIANCE = 1000;

    public User calculateUserResult(String userId) {
        // User aus DB laden
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User mit ID " + userId + " nicht gefunden"));

        // UserConditions prüfen
        UserConditions conditions = Optional.ofNullable(user.userConditions())
                .orElseThrow(() -> new IllegalStateException(
                        "UserConditions fehlen für User mit ID " + userId + ". Bitte zuerst Bedingungen setzen."));

        // Faktoren berechnen
        double directionFactor = getDirectionFactor(conditions.montageDirection());
        double angleFactor = getAngleFactor(conditions.montageAngle());

        // Jahresertrag berechnen
        double yearlyYield = DEFAULT_POWER_KWP
                * directionFactor
                * angleFactor
                * (1 - conditions.montageShadeFactor())
                * SOLAR_IRRADIANCE;

        // Ergebnisse runden
        int possibleElectricity = (int) Math.round(yearlyYield);
        int savings = (int) Math.round(possibleElectricity * 0.3); // Beispiel: 30 Cent/kWh
        int amortisationTime = savings > 0 ? (int) Math.ceil(1000.0 / savings) : 9999; // Beispiel 1000€ Kosten

        // UserResult erstellen
        UserResult result = new UserResult(possibleElectricity, savings, amortisationTime);

        // neuen User mit Result erstellen
        User updatedUser = new User(
                user.userId(),
                user.userInfo(),
                user.userConditions(),
                result
        );

        // User speichern und zurückgeben
        return userRepository.save(updatedUser);
    }

    // Hilfsmethoden
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

        double diff = Math.abs(angle - 30); // Optimal 30°
        double factor = 1.0 - diff * 0.01;  // pro Grad Abweichung 1% Verlust
        return Math.max(factor, 0.6);       // Minimum 60%
    }

    //    ERTRAGSRECHNER
}
