package org.example.backend.dto;

public record UserResponseDTO(
        String userId,
        UserInfoDTO userInfo,
        UserConditionsDTO userConditions,
        UserResultDTO userResult
) {}
