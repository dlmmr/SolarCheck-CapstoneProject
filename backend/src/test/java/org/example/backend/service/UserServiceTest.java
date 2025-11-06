package org.example.backend.service;

import org.example.backend.model.*;
import org.example.backend.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    // Konstanten für Tests (synchron mit UserService)
    private static final double CO2_PER_KWH = 0.4;
    private static final int LIFETIME_YEARS = 25;
    private static final double HOME_OFFICE_DAILY_KWH = 3.0;
    private static final double EBIKE_KWH_PER_KM = 0.015;
    private static final double ECAR_KWH_PER_KM = 0.17;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ===================================
    // generateUser Tests
    // ===================================
    @Test
    void generateUser_shouldSaveUserWithRandomId() {
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.generateUser();

        assertNotNull(result.userId());
        assertNull(result.userInfo());
        assertNull(result.userConditions());
        assertNull(result.userResult());
        verify(userRepository).save(any(User.class));
    }

    // ===================================
    // updateUserinfo Tests
    // ===================================
    @Test
    void updateUserinfo_shouldReplaceUserInfo() {
        UserConditions existingConditions = new UserConditions(
                UserPvConfig.CHEAP_PV_COMBI, 30, Direction.SOUTH, 0.2
        );
        User existing = new User("1", null, existingConditions, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserInfo newInfo = new UserInfo(30, 2, 4000);

        User updated = userService.updateUserinfo("1", newInfo);

        assertEquals(newInfo, updated.userInfo());
        assertEquals(existingConditions, updated.userConditions());
        verify(userRepository).save(updated);
    }

    @Test
    void updateUserinfo_shouldThrowIfUserNotFound() {
        when(userRepository.findById("999")).thenReturn(Optional.empty());
        UserInfo newInfo = new UserInfo(30, 2, 4000);

        assertThrows(IllegalArgumentException.class, () -> userService.updateUserinfo("999", newInfo));
    }

    // ===================================
    // updateUserConditions Tests
    // ===================================
    @Test
    void updateUserConditions_shouldSetConditions() {
        User existing = new User("1", null, null, null);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.3
        );

        when(userRepository.findById("1")).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.updateUserConditions("1", conditions);

        assertEquals(conditions, updated.userConditions());
        verify(userRepository).save(updated);
    }

    @Test
    void updateUserConditions_shouldThrowIfUserNotFound() {
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.3
        );
        when(userRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> userService.updateUserConditions("999", conditions));
    }

    // ===================================
    // calculateUserResult Tests
    // ===================================
    @Test
    void calculateUserResult_shouldCalculateBasedOnConditions() {
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");

        assertNotNull(updated.userResult());

        // Grundlegende Plausibilitätstests
        assertTrue(updated.userResult().userPossibleElectricityGeneration() > 0);
        assertTrue(updated.userResult().userAmountOfPossibleSavings() > 0);
        assertTrue(updated.userResult().userAmortisationTime() > 0);
        assertTrue(updated.userResult().userLifetimeYieldKwh() > 0);

        // CO2-Ersparnis basiert auf bekannter Formel
        double expectedCo2 = updated.userResult().userPossibleElectricityGeneration() * CO2_PER_KWH;
        assertEquals(expectedCo2, updated.userResult().userCo2SavingsKgPerYear(), 0.01);

        // Eigenverbrauchsquote liegt in bekanntem Bereich
        assertTrue(updated.userResult().userSelfConsumptionRate() >= 0.15);
        assertTrue(updated.userResult().userSelfConsumptionRate() <= 0.35);

        // Autarkiegrad ist zwischen 0 und 1
        assertTrue(updated.userResult().userAutarkyRate() >= 0.0);
        assertTrue(updated.userResult().userAutarkyRate() <= 1.0);
    }

    @Test
    void calculateUserResult_shouldReturnZeroYieldWhenFullShade() {
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.NORTH, 1.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");

        assertEquals(0, updated.userResult().userPossibleElectricityGeneration());
        assertEquals(0, updated.userResult().userAmountOfPossibleSavings());
        assertEquals(Double.MAX_VALUE, updated.userResult().userAmortisationTime());
        assertEquals(0.0, updated.userResult().userLifetimeYieldKwh());
        assertEquals(0.0, updated.userResult().userCo2SavingsKgPerYear());

        // Bei ratio < 0.6 → selfConsumptionRate = 0.35
        assertEquals(0.35, updated.userResult().userSelfConsumptionRate());
        assertEquals(0.0, updated.userResult().userAutarkyRate());
    }

    @Test
    void calculateUserResult_shouldThrowWhenNoConditionsSet() {
        UserInfo info = new UserInfo(30, 2, 4000);
        User user = new User("1", info, null, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        assertThrows(IllegalStateException.class, () -> userService.calculateUserResult("1"));
    }

    @Test
    void calculateUserResult_shouldThrowWhenNoUserInfoSet() {
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User user = new User("1", null, conditions, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(user));

        assertThrows(IllegalStateException.class, () -> userService.calculateUserResult("1"));
    }

    @Test
    void calculateUserResult_shouldThrowWhenUserNotFound() {
        when(userRepository.findById("999")).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> userService.calculateUserResult("999"));
    }

    @Test
    void calculateUserResult_shouldUseDifferentPvConfigCorrectly() {
        UserInfo info = new UserInfo(30, 2, 4000);

        // CHEAP_PV_COMBI (2 Module, 0.8 kWp)
        UserConditions cheapConditions = new UserConditions(
                UserPvConfig.CHEAP_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User cheapUser = new User("1", info, cheapConditions, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(cheapUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User cheapResult = userService.calculateUserResult("1");

        // PREMIUM_PV_COMBI (4 Module, 1.6 kWp)
        UserConditions premiumConditions = new UserConditions(
                UserPvConfig.PREMIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User premiumUser = new User("2", info, premiumConditions, null);
        when(userRepository.findById("2")).thenReturn(Optional.of(premiumUser));

        User premiumResult = userService.calculateUserResult("2");

        // Premium hat mehr Module → höhere Werte
        assertTrue(premiumResult.userResult().userPossibleElectricityGeneration() >
                cheapResult.userResult().userPossibleElectricityGeneration());
        assertTrue(premiumResult.userResult().userAmountOfPossibleSavings() >
                cheapResult.userResult().userAmountOfPossibleSavings());
        assertTrue(premiumResult.userResult().userLifetimeYieldKwh() >
                cheapResult.userResult().userLifetimeYieldKwh());
        assertTrue(premiumResult.userResult().userCo2SavingsKgPerYear() >
                cheapResult.userResult().userCo2SavingsKgPerYear());
    }

    // ===================================
    // Tests für Tageswerte
    // ===================================

    @Test
    void calculateUserResult_shouldCalculateDailyValuesCorrectly() {
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");
        UserResult result = updated.userResult();

        // Tagesertrag ist positiv
        assertTrue(result.userDailyYield() > 0);

        // Tagesersparnis basiert auf Tagesertrag
        double expectedDailySavings = result.userDailyYield() * (info.userRateOfElectricity() / 100.0);
        assertEquals(expectedDailySavings, result.userDailySavings(), 0.1);

        // Homeoffice Coverage berechnet korrekt (max 100%)
        double expectedCoverage = Math.min(100.0, (result.userDailyYield() / HOME_OFFICE_DAILY_KWH) * 100.0);
        assertEquals(expectedCoverage, result.userHomeofficeCoverageRate(), 0.1);

        // E-Bike Reichweite
        double expectedEBikeRange = result.userDailyYield() / EBIKE_KWH_PER_KM;
        assertEquals(expectedEBikeRange, result.userDailyEBikeRangeKm(), 0.1);

        // E-Auto Reichweite
        double expectedECarRange = result.userDailyYield() / ECAR_KWH_PER_KM;
        assertEquals(expectedECarRange, result.userDailyECarRangeKm(), 0.1);
    }

    // ===================================
    // Tests für Richtungsfaktoren
    // ===================================

    @Test
    void calculateUserResult_shouldRespectDirectionFactors() {
        UserInfo info = new UserInfo(30, 2, 4000);

        // Test mit SOUTH (bester Fall: Faktor 1.0)
        UserConditions southConditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User southUser = new User("1", info, southConditions, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(southUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        User southResult = userService.calculateUserResult("1");

        // Test mit NORTH (schlechtester Fall: Faktor 0.5)
        UserConditions northConditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.NORTH, 0.0
        );
        User northUser = new User("2", info, northConditions, null);
        when(userRepository.findById("2")).thenReturn(Optional.of(northUser));
        User northResult = userService.calculateUserResult("2");

        // Süden sollte mehr Ertrag bringen als Norden
        assertTrue(southResult.userResult().userPossibleElectricityGeneration() >
                northResult.userResult().userPossibleElectricityGeneration());
    }

    // ===================================
    // Tests für Winkelfaktoren
    // ===================================

    @Test
    void calculateUserResult_shouldHandleExtremeAngles() {
        UserInfo info = new UserInfo(30, 2, 4000);

        // Negativer Winkel → wird auf 0 gesetzt
        UserConditions negativeAngle = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, -10, Direction.SOUTH, 0.0
        );
        User negUser = new User("1", info, negativeAngle, null);
        when(userRepository.findById("1")).thenReturn(Optional.of(negUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        User negResult = userService.calculateUserResult("1");
        assertTrue(negResult.userResult().userPossibleElectricityGeneration() > 0);

        // Optimaler Winkel (30°)
        UserConditions optimalAngle = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User optUser = new User("2", info, optimalAngle, null);
        when(userRepository.findById("2")).thenReturn(Optional.of(optUser));
        User optResult = userService.calculateUserResult("2");
        assertTrue(optResult.userResult().userPossibleElectricityGeneration() > 0);

        // Winkel über 90° → wird auf 90 gesetzt
        UserConditions highAngle = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 100, Direction.SOUTH, 0.0
        );
        User highUser = new User("3", info, highAngle, null);
        when(userRepository.findById("3")).thenReturn(Optional.of(highUser));
        User highResult = userService.calculateUserResult("3");
        assertTrue(highResult.userResult().userPossibleElectricityGeneration() > 0);

        // Optimaler Winkel sollte am besten sein
        assertTrue(optResult.userResult().userPossibleElectricityGeneration() >=
                negResult.userResult().userPossibleElectricityGeneration());
        assertTrue(optResult.userResult().userPossibleElectricityGeneration() >=
                highResult.userResult().userPossibleElectricityGeneration());
    }

    // ===================================
    // Tests für Lebenszeitberechnung
    // ===================================

    @Test
    void calculateUserResult_shouldCalculateLifetimeYieldWithDegradation() {
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");

        int yearlyYield = updated.userResult().userPossibleElectricityGeneration();
        double lifetimeYield = updated.userResult().userLifetimeYieldKwh();

        // Lifetime Yield muss kleiner sein als (Jahresertrag * 25 Jahre)
        // wegen Degradation
        assertTrue(lifetimeYield < yearlyYield * LIFETIME_YEARS);

        // Aber größer als (Jahresertrag * 25 * (1 - DEGRADATION_RATE)^25)
        // (grobe Untergrenze)
        assertTrue(lifetimeYield > yearlyYield * 20);
    }

    // ===================================
    // Tests für Eigenverbrauch und Autarkie
    // ===================================

    @Test
    void calculateUserResult_shouldCalculateSelfConsumptionRateBasedOnRatio() {
        UserInfo info = new UserInfo(30, 2, 4000);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");

        double generation = updated.userResult().userPossibleElectricityGeneration();
        double ratio = generation / info.userElectricityConsumption();
        double selfConsumption = updated.userResult().userSelfConsumptionRate();

        // Eigenverbrauchsquote basiert auf ratio
        if (ratio < 0.6) {
            assertEquals(0.35, selfConsumption, 0.001);
        } else if (ratio < 1.0) {
            assertEquals(0.25, selfConsumption, 0.001);
        } else if (ratio < 1.5) {
            assertEquals(0.20, selfConsumption, 0.001);
        } else {
            assertEquals(0.15, selfConsumption, 0.001);
        }
    }

    @Test
    void calculateUserResult_shouldCalculateAutarkyRateCorrectly() {
        // Niedriger Verbrauch → hoher Autarkiegrad (max 1.0)
        UserInfo infoLow = new UserInfo(30, 2, 500);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User userLow = new User("1", infoLow, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(userLow));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updatedLow = userService.calculateUserResult("1");

        // Autarkiegrad kann nicht über 1.0 liegen
        assertTrue(updatedLow.userResult().userAutarkyRate() >= 0.0);
        assertTrue(updatedLow.userResult().userAutarkyRate() <= 1.0);

        // Hoher Verbrauch → niedriger Autarkiegrad
        UserInfo infoHigh = new UserInfo(30, 2, 50000);
        User userHigh = new User("2", infoHigh, conditions, null);
        when(userRepository.findById("2")).thenReturn(Optional.of(userHigh));

        User updatedHigh = userService.calculateUserResult("2");

        assertTrue(updatedHigh.userResult().userAutarkyRate() >= 0.0);
        assertTrue(updatedHigh.userResult().userAutarkyRate() < updatedLow.userResult().userAutarkyRate());
    }

    @Test
    void calculateUserResult_shouldHandleZeroConsumption() {
        UserInfo info = new UserInfo(30, 2, 0);
        UserConditions conditions = new UserConditions(
                UserPvConfig.MEDIUM_PV_COMBI, 30, Direction.SOUTH, 0.0
        );
        User user = new User("1", info, conditions, null);

        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.calculateUserResult("1");

        // Bei Verbrauch = 0 → Autarkiegrad = 0
        assertEquals(0.0, updated.userResult().userAutarkyRate(), 0.001);
    }
}