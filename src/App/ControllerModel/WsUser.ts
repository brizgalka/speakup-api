import User from "@/App/ControllerModel/User";
import Guest from "@/App/ControllerModel/Guest";

export interface WsUser {
    status: UserStatus,
    user: User | Guest
}

export enum UserStatus {
    VERIFICATION = 1,
    IDLING = 2,
    PENDING = 3
}