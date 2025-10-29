import type { Direction } from "./Direction";
import type { UserPvConfig } from "./UserPvConfig";

export interface UserConditionsDTO {
    userPvConfig: UserPvConfig;   // Pflichtfeld
    montageAngle: number;         // 0-90
    montageDirection: Direction;  // keine ""
    montageShadeFactor: number;   // 0-1
}
