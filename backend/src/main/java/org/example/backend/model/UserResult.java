package org.example.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record UserResult(
        int userPossibleELectricityGeneration,
        int userAmountofPossibleSavings,
        int userAmortisationTime
) {
}
