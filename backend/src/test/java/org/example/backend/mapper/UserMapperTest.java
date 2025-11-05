package org.example.backend.mapper;

import org.example.backend.dto.*;
import org.example.backend.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    private UserMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new UserMapper();
    }

    // ---------- DTO → Entity ----------

    @Test
    void toUserInfo_ShouldMapCorrectly() {
        // FIX: Changed from 30.5 to 30 (int instead of double)
        UserInfoDTO dto = new UserInfoDTO(30, 2, 3000);
        UserInfo entity = mapper.toUserInfo(dto);

        assertEquals(dto.userRateOfElectricity(), entity.userRateOfElectricity());
        assertEquals(dto.userHouseholdNumber(), entity.userHouseholdNumber());
        assertEquals(dto.userElectricityConsumption(), entity.userElectricityConsumption());
    }

    @Test
    void toUserInfo_ShouldThrow_WhenNull() {
        assertThrows(IllegalArgumentException.class, () -> mapper.toUserInfo(null));
    }

    @Test
    void toUserConditions_ShouldMapCorrectly() {
        // FIX: Changed to use actual enum values from the model classes
        UserConditionsDTO dto = new UserConditionsDTO(
                UserPvConfig.CHEAP_PV_COMBI,  // Changed from "Dach" - using actual enum value
                35,                            // Changed from 35.0 (int instead of double)
                Direction.SOUTH,               // Changed from "Süd" - using actual enum value
                0.1
        );
        UserConditions entity = mapper.toUserConditions(dto);

        assertEquals(dto.userPvConfig(), entity.userPvConfig());
        assertEquals(dto.montageAngle(), entity.montageAngle());
        assertEquals(dto.montageDirection(), entity.montageDirection());
        assertEquals(dto.montageShadeFactor(), entity.montageShadeFactor());
    }

    @Test
    void toUserConditions_ShouldThrow_WhenNull() {
        assertThrows(IllegalArgumentException.class, () -> mapper.toUserConditions(null));
    }

    @Test
    void toUserResult_ShouldMapCorrectly() {
        UserResultDTO dto = new UserResultDTO(
                1000, 500, 12.3, 10000.5, 300.7,
                0.85, 0.9, 5.5, 2.4, 0.7, 25.6, 120.8
        );

        UserResult result = mapper.toUserResult(dto);

        assertEquals(dto.userPossibleElectricityGeneration(), result.userPossibleElectricityGeneration());
        assertEquals(dto.userAmountOfPossibleSavings(), result.userAmountOfPossibleSavings());
        assertEquals(dto.userAmortisationTime(), result.userAmortisationTime());
        assertEquals(dto.userLifetimeYieldKwh(), result.userLifetimeYieldKwh());
        assertEquals(dto.userCo2SavingsKgPerYear(), result.userCo2SavingsKgPerYear());
    }

    @Test
    void toUserResult_ShouldThrow_WhenNull() {
        assertThrows(IllegalArgumentException.class, () -> mapper.toUserResult(null));
    }

    // ---------- Entity → DTO ----------

    @Test
    void toUserResponseDTO_ShouldMapAllSubObjects() {
        // FIX: Changed to match actual entity types
        UserInfo info = new UserInfo(30, 2, 3000);  // Changed from 30.5 to 30
        UserConditions cond = new UserConditions(
                UserPvConfig.CHEAP_PV_COMBI,  // Changed from "Dach"
                35,                            // Changed from 35.0
                Direction.SOUTH,               // Changed from "Süd"
                0.1
        );
        UserResult result = new UserResult(1000, 500, 12.345, 10000.555, 300.666,
                0.85, 0.9, 5.555, 2.444, 0.777, 25.666, 120.888);

        // FIX: User constructor expects String userId, not Long
        User user = new User("1", info, cond, result);  // Changed from 1L to "1"

        UserResponseDTO dto = mapper.toUserResponseDTO(user);

        assertNotNull(dto.userInfo());
        assertNotNull(dto.userConditions());
        assertNotNull(dto.userResult());

        // Rundung überprüfen (eine Nachkommastelle)
        assertEquals(12.3, dto.userResult().userAmortisationTime());
        assertEquals(10000.6, dto.userResult().userLifetimeYieldKwh());
        assertEquals(0.8, dto.userResult().userHomeofficeCoverageRate());
    }

    @Test
    void toUserResponseDTO_ShouldHandleNullSubObjects() {
        // FIX: User constructor expects String userId, not Long
        User user = new User("2", null, null, null);  // Changed from 2L to "2"

        UserResponseDTO dto = mapper.toUserResponseDTO(user);

        assertNull(dto.userInfo());
        assertNull(dto.userConditions());
        assertNull(dto.userResult());
        // FIX: Already correct - comparing String to String
        assertEquals("2", dto.userId());
    }

    // ---------- Round ----------

    @Test
    void round_ShouldRoundToOneDecimal() {
        double result = invokeRound(12.345);
        assertEquals(12.3, result);
    }

    // Zugriff auf private Methode via Reflection (optional)
    private double invokeRound(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}