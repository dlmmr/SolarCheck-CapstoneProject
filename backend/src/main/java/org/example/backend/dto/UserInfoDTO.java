package org.example.backend.dto;

import jakarta.validation.constraints.*;

// ALL fields use wrappers for validation
public record UserInfoDTO(
        @NotNull @Positive @Max(100)
        Integer userRateOfElectricity,    // wrapper: need @NotNull to work

        @NotNull @Positive @Max(20)
        Integer userHouseholdNumber,

        @NotNull @Positive @Max(100000)
        Integer userElectricityConsumption
) {}