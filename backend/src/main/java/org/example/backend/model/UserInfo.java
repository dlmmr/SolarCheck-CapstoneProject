package org.example.backend.model;


// Required fields → primitives (more efficient, can't be null)
public record UserInfo(
        int userRateOfElectricity,
        int userHouseholdNumber,
        int userElectricityConsumption
) {}
