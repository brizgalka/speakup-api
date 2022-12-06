import User from "@/App/ControllerModel/User";
import Guest from "@/App/ControllerModel/Guest";

export interface WsUser {
    id: number,
    status: UserStatus,
    lastPing: number;
    uuid: string,
    user: User | Guest
}

export enum UserStatus {
    VERIFICATION = 1,
    IDLING = 2,
    PENDING = 3,
}