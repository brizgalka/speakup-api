import {NextFunction, Request, Response} from "express";
import AuthController from "@/App/Controller/AuthController";

const authController = new AuthController();

export default async function AuthMiddleware(req: Request,res: Response,next: NextFunction) {
    const token = req.cookies["token"];

    if(token == undefined) {
        return res.sendStatus(401)
    }

    const user = await authController.getUser(token)

    if(user != null) {
        next()
    }
}