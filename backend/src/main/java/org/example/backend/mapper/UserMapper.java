package org.example.backend.mapper;

import org.example.backend.dto.*;
import org.example.backend.model.*;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    // DTO → Entities
    public UserInfo toUserInfo(UserInfoDTO dto) {
        return new UserInfo(dto.userRateOfElectricity(),
                dto.userHouseholdNumber(),
                dto.userElectricityConsumption());
    }

    public UserConditions toUserConditions(UserConditionsDTO dto) {
        return new UserConditions(dto.montagePlace(),
                dto.montageAngle(),
                dto.montageDirection(),
                dto.montageShadeFactor());
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
        return new UserInfoDTO(info.userRateOfElectricity(),
                info.userHouseholdNumber(),
                info.userElectricityConsumption());
    }

    private UserConditionsDTO toUserConditionsDTO(UserConditions conditions) {
        return new UserConditionsDTO(
                conditions.montagePlace(),
                conditions.montageAngle(),
                conditions.montageDirection(),
                conditions.montageShadeFactor()
        );
    }

    private UserResultDTO toUserResultDTO(UserResult result) {
        return new UserResultDTO(
                result.userPossibleElectricityGeneration(),
                result.userAmountofPossibleSavings(),
                result.userAmortisationTime()
        );
    }
}
