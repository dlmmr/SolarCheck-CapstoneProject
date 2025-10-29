package org.example.backend.model;


public record UserConditions(
        UserPvConfig userPvConfig,
        Integer montageAngle,
        Direction montageDirection,
        Double montageShadeFactor
) {}
