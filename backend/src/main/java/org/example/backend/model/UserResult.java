package org.example.backend.model;

public record UserResult(
        int userPossibleElectricityGeneration,
        int userAmountOfPossibleSavings,
        double userAmortisationTime,
        double userLifetimeYieldKwh,
        double userCo2SavingsKgPerYear,
        double userSelfConsumptionRate,
        double userAutarkyRate,
        double userDailyYield,              // ✅ geändert von dailyYield
        double userDailySavings,            // ✅ geändert von dailySavings
        double userHomeofficeCoverageRate,  // ✅ geändert von homeofficeCoverageRate
        double userDailyEBikeRangeKm,       // ✅ geändert von dailyEBikeRangeKm
        double userDailyECarRangeKm         // ✅ geändert von dailyECarRangeKm
) {}