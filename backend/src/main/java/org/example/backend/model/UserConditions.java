package org.example.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document
public record UserConditions(
        boolean montagePlace,
        int montageAngle,
        String montageDirection,
        int montageSunhours
) {
}
