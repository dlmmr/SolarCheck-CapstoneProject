package org.example.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UserInfoDTO(
        @NotNull @Positive int userRateOfElectricity,
        @Positive int userHouseholdNumber,
        @Positive int userElectricityConsumption
) {}