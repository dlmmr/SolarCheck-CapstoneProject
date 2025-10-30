package org.example.backend.model;


public record UserConditions(
        UserPvConfig userPvConfig,
        int montageAngle,
        Direction montageDirection,
        double montageShadeFactor
) {}
