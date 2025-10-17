package org.example.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record UserInfo(
        String id,
        String userRateOfELetricity,
        int userHouseholdNumber,
        int userElectricityConsumption
//        String userGeodata;
) {
}
