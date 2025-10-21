package org.example.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record UserResult(
        int userPossibleElectricityGeneration,
        int userAmountofPossibleSavings,
        int userAmortisationTime
) {
}

