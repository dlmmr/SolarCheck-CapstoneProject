import type { UserInfo } from "./Userinfo.ts";
import type { UserConditionsDTO } from "../dto/UserConditionsDTO.ts";
import type { UserResult } from "./UserResult";

export interface User {
    userId: string;
    userInfo: UserInfo;
    userConditions: UserConditionsDTO; // <-- hier den DTO-Typ verwenden
    userResult: UserResult;
}
