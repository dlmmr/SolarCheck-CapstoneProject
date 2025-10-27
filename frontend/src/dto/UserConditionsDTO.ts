export type Direction =
    | ""
    | "NORTH"
    | "NORTHEAST"
    | "EAST"
    | "SOUTHEAST"
    | "SOUTH"
    | "SOUTHWEST"
    | "WEST"
    | "NORTHWEST";

export interface UserConditionsDTO {
    montagePlace: boolean;
    montageAngle: number;            // 0 - 90
    montageDirection: Direction;     // Enum-String
    montageShadeFactor: number;      // 0 - 1
}
