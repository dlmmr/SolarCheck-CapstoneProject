package org.example.backend.mapper;

import org.example.backend.dto.*;
import org.example.backend.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

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
        UserConditionsDTO dto = new UserConditionsDTO(
                UserPvConfig.CHEAP_PV_COMBI,
                35,
                Direction.SOUTH,
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
                UserPvConfig.CHEAP_PV_COMBI,
                35,
                Direction.SOUTH,
                0.1
        );
        UserResult result = new UserResult(1000, 500, 12.345, 10000.555, 300.666,
                0.85, 0.9, 5.555, 2.444, 0.777, 25.666, 120.888);


        User user = new User("1", info, cond, result);

        UserResponseDTO dto = mapper.toUserResponseDTO(user);

        assertNotNull(dto.userInfo());
        assertNotNull(dto.userConditions());
        assertNotNull(dto.userResult());


        assertEquals(12.3, dto.userResult().userAmortisationTime());
        assertEquals(10000.6, dto.userResult().userLifetimeYieldKwh());
        assertEquals(0.8, dto.userResult().userHomeofficeCoverageRate());
    }

    @Test
    void toUserResponseDTO_ShouldHandleNullSubObjects() {

        User user = new User("2", null, null, null);  // Changed from 2L to "2"

        UserResponseDTO dto = mapper.toUserResponseDTO(user);

        assertNull(dto.userInfo());
        assertNull(dto.userConditions());
        assertNull(dto.userResult());
        assertEquals("2", dto.userId());
    }

    // ---------- Round ----------

    @Test
    void toUserResponseDTO_ShouldRoundAllResultValuesToOneDecimal() {
        // Given - UserResult mit "krummen" Zahlen
        UserResult result = new UserResult(
                1234,       // possibleElectricityGeneration (int)
                567,        // amountOfPossibleSavings (int)
                12.3456,    // amortisationTime
                25000.789,  // lifetimeYieldKwh
                1500.666,   // co2SavingsKgPerYear
                45.555,     // selfConsumptionRate
                38.444,     // autarkyRate
                12.3456,    // dailyYield
                3.4567,     // dailySavings
                85.6789,    // homeofficeCoverageRate
                45.6789,    // dailyEBikeRangeKm
                180.9876    // dailyECarRangeKm
        );

        User user = new User("test-user-id", null, null, result);

        // When - Rufe die öffentliche Methode auf
        UserResponseDTO responseDTO = mapper.toUserResponseDTO(user);
        UserResultDTO dto = responseDTO.userResult();

        // Then - Alle Werte sollten auf 1 Dezimalstelle gerundet sein
        assertThat(dto.userAmortisationTime()).isEqualTo(12.3);
        assertThat(dto.userLifetimeYieldKwh()).isEqualTo(25000.8);
        assertThat(dto.userCo2SavingsKgPerYear()).isEqualTo(1500.7);
        assertThat(dto.userSelfConsumptionRate()).isEqualTo(45.6);
        assertThat(dto.userAutarkyRate()).isEqualTo(38.4);
        assertThat(dto.userDailyYield()).isEqualTo(12.3);
        assertThat(dto.userDailySavings()).isEqualTo(3.5);
        assertThat(dto.userHomeofficeCoverageRate()).isEqualTo(85.7);
        assertThat(dto.userDailyEBikeRangeKm()).isEqualTo(45.7);
        assertThat(dto.userDailyECarRangeKm()).isEqualTo(181.0);

        // Bonus: Die ersten beiden Werte werden NICHT gerundet (sind int)
        assertThat(dto.userPossibleElectricityGeneration()).isEqualTo(1234);
        assertThat(dto.userAmountOfPossibleSavings()).isEqualTo(567);
    }
}