import {NextFunction, Request, Response} from "express";
import AuthController from "@/App/Controller/AuthController";

const authController = new AuthController();

type Role = "USER" | "ADMIN";

const RoleMiddleware = (role: Role) => async (req: Request,res: Response,next: NextFunction) => {
    try {
        const token = req.cookies["token"];

        if (token == undefined) {
            return res.sendStatus(401)
        }

        const user = await authController.getUser(token)

        if(user) {
            const role = user.role

            if(role == "ADMIN") {
                console.log("ADMIn")
            } else {
                console.log("USER")
            }
        } else {
            res.sendStatus(401)
        }
    } catch (e: any) {
        res.sendStatus(500)
    }
}

export default RoleMiddleware