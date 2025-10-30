package org.example.backend.dto;

import jakarta.validation.constraints.*;
import org.example.backend.model.Direction;
import org.example.backend.model.UserPvConfig;

public record UserConditionsDTO(
        @NotNull
        UserPvConfig userPvConfig,           // ersetzt montagePlace

        @NotNull
        @Min(0)
        @Max(90)
        int montageAngle,                 //  Wertebereich 0-90

        @NotNull
        Direction montageDirection,           //

        @NotNull
        @DecimalMin("0.0")
        @DecimalMax("1.0")
        double montageShadeFactor             // Wertebereich 0.0-1.0
) {}
