import type { UserInfoDTO } from "./UserInfoDTO";
import type { UserConditionsDTO } from "./UserConditionsDTO";
import type { UserResultDTO } from "./UserResultDTO";

export interface UserResponseDTO {
    userId: string;
    userInfo: UserInfoDTO | null;
    userConditions: UserConditionsDTO | null;
    userResult: UserResultDTO | null;
}