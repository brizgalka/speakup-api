import {NextFunction, Request, Response} from "express";
import AuthController from "@/App/Controller/AuthController";
import {JsonWebTokenError} from "jsonwebtoken";

const authController = new AuthController();

export default async function AuthMiddleware(req: Request,res: Response,next: NextFunction) {
    try {
        const token = req.cookies["token"];

        if (token == undefined) {
            return res.sendStatus(401)
        }

        let user = null;

        user = await authController.getUser(token)

        if (user != null) {
            next()
        } else {
            res.clearCookie("token")
            res.sendStatus(401)
        }
    } catch (e: any) {
        if (e instanceof JsonWebTokenError) {
            res.clearCookie("token")
            res.sendStatus(401)
        } else {
            res.clearCookie("token")
            res.sendStatus(500)
        }
    }

}