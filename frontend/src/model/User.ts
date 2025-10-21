import type { UserInfo } from "./Userinfo.ts";
import type { UserConditions } from "./UserConditions";
import type { UserResult } from "./UserResult";

export interface User {
    userId: string;
    userInfo: UserInfo;
    userConditions: UserConditions;
    userResult: UserResult;
}
