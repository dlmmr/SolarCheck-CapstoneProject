package org.example.backend.dto;

import jakarta.validation.constraints.*;

// Alle Felder Pflichtfelder mit validierungsrelevanten Constraints
public record UserInfoDTO(
        @NotNull
        @Positive
        @Max(100)
        Integer userRateOfElectricity,     // Pflichtfeld 1-100

        @NotNull
        @Positive
        @Max(20)
        Integer userHouseholdNumber,       // Pflichtfeld 1-20

        @NotNull
        @Positive
        @Max(100000)
        Integer userElectricityConsumption // Pflichtfeld 1-100000
) {}
