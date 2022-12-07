import {NextFunction, Request, Response} from "express";
import {ApplicationContext} from "@/System/Context";
import ApiError from "@/App/error/ApiError";

const wsServer = ApplicationContext.wss;

export default function verifyUser(req: Request,res: Response,next: NextFunction) {
    const uuid = req.body.uuid;
    if(uuid == undefined) {
        return next(ApiError.badRequest("Invalid UUID. Try again").response)
    }
    if(wsServer.verifyUUID(uuid)) {
        next()
    } else {
        return next(ApiError.badRequest("Invalid UUID. Try again").response)
    }
}