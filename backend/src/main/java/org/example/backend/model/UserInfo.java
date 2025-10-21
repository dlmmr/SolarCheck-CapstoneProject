package org.example.backend.model;


import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record UserInfo(
        int userRateOfElectricity,
        int userHouseholdNumber,
        int userElectricityConsumption
) {
}
