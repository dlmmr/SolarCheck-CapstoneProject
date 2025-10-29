import type { Direction } from "../dto/Direction.ts";

export interface UserConditionsDTO {
    montagePlace: boolean;
    montageAngle: number;
    montageDirection: Direction;
    montageShadeFactor: number;
}
