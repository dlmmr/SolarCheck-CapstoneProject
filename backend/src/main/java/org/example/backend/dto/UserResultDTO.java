package org.example.backend.dto;

public record UserResultDTO(
        int userPossibleElectricityGeneration,
        int userAmountOfPossibleSavings,
        int userAmortisationTime
) {}
