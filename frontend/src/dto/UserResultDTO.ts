export interface UserResultDTO {
    userPossibleElectricityGeneration: number;
    userAmountOfPossibleSavings: number;
    userAmortisationTime: number;
    userLifetimeYieldKwh: number;
    userCo2SavingsKgPerYear: number;
    userSelfConsumptionRate: number;
    userAutarkyRate: number;
    userDailyYield: number;
    userDailySavings: number;
    userDailyEBikeRangeKm: number;
    userDailyECarRangeKm: number;
    userHomeofficeCoverageRate: number; // 0–1
}