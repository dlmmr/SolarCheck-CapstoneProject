package org.example.backend.mapper;

import org.example.backend.dto.*;
import org.example.backend.model.*;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    // DTO → Entities
    public UserInfo toUserInfo(UserInfoDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("UserInfoDTO darf nicht null sein");
        }
        return new UserInfo(
                dto.userRateOfElectricity(),
                dto.userHouseholdNumber(),
                dto.userElectricityConsumption()
        );
    }

    public UserConditions toUserConditions(UserConditionsDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("UserConditionsDTO darf nicht null sein");
        }
        return new UserConditions(
                dto.userPvConfig(),
                dto.montageAngle(),
                dto.montageDirection(),
                dto.montageShadeFactor()
        );
    }

    public UserResult toUserResult(UserResultDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("UserResultDTO darf nicht null sein");
        }
        return new UserResult(
                dto.userPossibleElectricityGeneration(),
                dto.userAmountOfPossibleSavings(),
                dto.userAmortisationTime(),
                dto.userLifetimeYieldKwh(),
                dto.userCo2SavingsKgPerYear(),
                dto.userSelfConsumptionRate(),
                dto.userAutarkyRate(),
                dto.userDailyYield(),
                dto.userDailySavings(),
                dto.userHomeofficeCoverageRate(),
                dto.userDailyEBikeRangeKm(),
                dto.userDailyECarRangeKm()
        );
    }

    // Entities → DTO
    public UserResponseDTO toUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.userId(),
                user.userInfo() != null ? toUserInfoDTO(user.userInfo()) : null,
                user.userConditions() != null ? toUserConditionsDTO(user.userConditions()) : null,
                user.userResult() != null ? toUserResultDTO(user.userResult()) : null
        );
    }

    private UserInfoDTO toUserInfoDTO(UserInfo info) {
        return new UserInfoDTO(
                info.userRateOfElectricity(),
                info.userHouseholdNumber(),
                info.userElectricityConsumption()
        );
    }

    private UserConditionsDTO toUserConditionsDTO(UserConditions conditions) {
        return new UserConditionsDTO(
                conditions.userPvConfig(),
                conditions.montageAngle(),
                conditions.montageDirection(),
                conditions.montageShadeFactor()
        );
    }

    private UserResultDTO toUserResultDTO(UserResult result) {
        // Werte runden, um Frontend-kompatible Zahlen zu liefern
        return new UserResultDTO(
                result.userPossibleElectricityGeneration(),
                result.userAmountOfPossibleSavings(),
                round(result.userAmortisationTime()),
                round(result.userLifetimeYieldKwh()),
                round(result.userCo2SavingsKgPerYear()),
                round(result.userSelfConsumptionRate()),
                round(result.userAutarkyRate()),
                round(result.userDailyYield()),              // ✅ geändert
                round(result.userDailySavings()),            // ✅ geändert
                round(result.userHomeofficeCoverageRate()),  // ✅ geändert
                round(result.userDailyEBikeRangeKm()),       // ✅ geändert
                round(result.userDailyECarRangeKm())         // ✅ geändert
        );
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
