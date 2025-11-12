package org.example.backend.model;

public record UserResult(
        int userPossibleElectricityGeneration,
        int userAmountOfPossibleSavings,
        double userAmortisationTime,
        double userLifetimeYieldKwh,
        double userCo2SavingsKgPerYear,
        double userSelfConsumptionRate,
        double userAutarkyRate,
        double userDailyYield,
        double userDailySavings,
        double userHomeofficeCoverageRate,
        double userDailyEBikeRangeKm,
        double userDailyECarRangeKm
) {}