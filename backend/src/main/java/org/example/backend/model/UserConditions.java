package org.example.backend.model;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record UserConditions(
        boolean montagePlace,
        @Min(0) @Max(90) int montageAngle,
        Direction montageDirection,  //  Enum-Typ statt String
        @Min(0) @Max(1) double montageShadeFactor
) {
}
