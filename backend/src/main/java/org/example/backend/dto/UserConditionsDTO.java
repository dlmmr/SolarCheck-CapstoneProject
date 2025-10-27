package org.example.backend.dto;

import jakarta.validation.constraints.*;
import org.example.backend.model.Direction;

public record UserConditionsDTO(
        @NotNull
        Boolean montagePlace,             // wrapper: need @NotNull to work

        // NO @NotNull = optional field
        @Min(0) @Max(90)
        Integer montageAngle,             // wrapper: can be null

        @NotNull
        Direction montageDirection,

        // NO @NotNull = optional field
        @DecimalMin("0.0") @DecimalMax("1.0")
        Double montageShadeFactor         // wrapper: can be null
) {}