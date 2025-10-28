package org.example.backend.model;


public record UserConditions(
        boolean montagePlace,
        Integer montageAngle,
        Direction montageDirection,
        Double montageShadeFactor
) {}
