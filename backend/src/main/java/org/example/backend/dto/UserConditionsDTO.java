package org.example.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.example.backend.model.Direction;

public record UserConditionsDTO(
        boolean montagePlace,
        @Min(0) @Max(90) int montageAngle,
        Direction montageDirection,
        @Min(0) @Max(1) double montageShadeFactor
) {}
