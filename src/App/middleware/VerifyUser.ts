import {NextFunction, Request, Response} from "express";
import {ApplicationContext} from "@/System/Context";
import ApiError from "@/App/error/ApiError";

export default function verifyUser(req: Request,res: Response,next: NextFunction) {
    const uuid = req.body.uuid;
    console.log(uuid)
    if(uuid == undefined) {
        return new ApiError(res,400,"Invalid UUID. Try again")
    }
    if(ApplicationContext.wss.verifyUUID(uuid)) {
        next()
    } else {
        return new ApiError(res,400,"Invalid UUID. Try again")
    }
}