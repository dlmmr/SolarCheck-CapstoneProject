package org.example.backend.dto;

import jakarta.validation.constraints.*;
import org.example.backend.model.Direction;
import org.example.backend.model.UserPvConfig;

public record UserConditionsDTO(
        @NotNull
        UserPvConfig userPvConfig,

        @NotNull
        @Min(0)
        @Max(90)
        int montageAngle,

        @NotNull
        Direction montageDirection,

        @NotNull
        @DecimalMin("0.0")
        @DecimalMax("1.0")
        double montageShadeFactor
) {}
