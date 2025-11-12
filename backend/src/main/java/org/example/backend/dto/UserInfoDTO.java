package org.example.backend.dto;

import jakarta.validation.constraints.*;

public record UserInfoDTO(
        @NotNull
        @Positive
        @Max(100)
        int userRateOfElectricity,     //  1-100

        @NotNull
        @Positive
        @Max(20)
        int userHouseholdNumber,       //  1-20

        @NotNull
        @Positive
        @Max(100000)
        int userElectricityConsumption //  1-100000
) {}
