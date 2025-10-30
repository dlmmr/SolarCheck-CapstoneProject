import type { Direction } from "./Direction";
import type { UserPvConfig } from "./UserPvConfig";

export interface UserConditionsDTO {
    userPvConfig: UserPvConfig;   //
    montageAngle: number;         // 0-90
    montageDirection: Direction;  //
    montageShadeFactor: number;   // 0-1
}
