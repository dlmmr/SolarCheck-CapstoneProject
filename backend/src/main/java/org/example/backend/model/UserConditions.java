package org.example.backend.model;



// Mix: required → primitives, optional → wrappers
public record UserConditions(
        boolean montagePlace,             // primitive: always has a value
        Integer montageAngle,             // WRAPPER: CAN BE NULL ✅
        Direction montageDirection,       // enum: always has a value
        Double montageShadeFactor         // WRAPPER: CAN BE NULL ✅
) {}
