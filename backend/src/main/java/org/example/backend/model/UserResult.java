package org.example.backend.model;


public record UserResult(
        int userPossibleElectricityGeneration,
        int userAmountofPossibleSavings,
        int userAmortisationTime
) {}

