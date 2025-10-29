import type { Direction } from "./Direction";

export interface UserConditionsDTO {
    montagePlace: boolean;
    montageAngle: number;        // 0-90
    montageDirection: Direction; // DTO darf kein "" enthalten
    montageShadeFactor: number;  // 0-1
}
