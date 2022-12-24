import {NextFunction, Request, Response} from "express";
import {ApplicationContext} from "@/System/Context";
import ApiError from "@/App/error/ApiError";

export default function verifyUser(req: Request,res: Response,next: NextFunction) {
    const uuid = req.body.uuid;
    if(uuid == undefined) {
        return next(ApiError.badRequest("Invalid UUID. Try again").response)
    }
    if(ApplicationContext.wss.verifyUUID(uuid)) {
        next()
    } else {
        return next(ApiError.badRequest("Invalid UUID. Try again").response)
    }
}