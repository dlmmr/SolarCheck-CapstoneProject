package org.example.backend.model;


// Required fields → primitives (more efficient, can't be null)
public record UserInfo(
        int userRateOfElectricity,        // primitive: always has a value
        int userHouseholdNumber,          // primitive: always has a value
        int userElectricityConsumption    // primitive: always has a value
) {}
