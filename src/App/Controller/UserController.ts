import {Request, Response, NextFunction} from "express";
import ApiError from "@/App/error/ApiError";
import { PrismaClient } from '@prisma/client'
import AuthController from "@/App/Controller/AuthController";
import modelResponse from "@/App/model/modelResponse";
import UserModel from "@/App/model/UserModel";

const prisma = new PrismaClient()

const saltRounds = Number(process.env.saltRounds);

const authController = new AuthController();
const userModel = new UserModel();

interface sendUserData {
    username: string,
    nickname: string,
    photo: string,
    email: string,
    id: number
}

class UserController {
    async sendMessage(req:Request,res:Response,next:NextFunction) {
        console.log("adwawd")
    }
    async deleteMessage(req:Request,res:Response,next:NextFunction) {

    }

    async getUserData(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return new ApiError(res,400,"Invalid body");
            const token = req.cookies['token'];

            const user = await authController.getUser(token) as sendUserData;

            if(!user) return next(res.sendStatus(401))

            res.json({
                "id": user.id,
                "username": user.username,
                "nickname": user.nickname,
                "photo": user.photo,
                "email": user.email,
                token
            })
        } catch (e: any) {
            console.warn(e.toString())
        }

    }

    async changeProfile(req:Request,res:Response,next:NextFunction) {

    }

    async changePhoto(req: Request,res:Response,next:NextFunction){
        try {
            if (req.body == undefined) return new ApiError(res,400,"Invalid body");
            if (!req.files) return new ApiError(res,400,"Invalid UUID");

            let file = req.files.file;

            if (!file) return new ApiError(res,400,"Invalid File");

            const token = req.cookies['token'];

            if(Array.isArray(file)) {
                file = file[0]
            }

            const result = await userModel.changePhoto(token,file)

            modelResponse.responseRequest(res,result);
        } catch (e: any) {
            console.warn(e.toString())
        }
    }

    async changeBio(req: Request,res: Response,next: NextFunction) {
        try {
            if (req.body == undefined) return new ApiError(res,400,"Invalid body");

            const token = req.cookies['token'];
            const { bio } = req.body;

            if (!bio) return new ApiError(res,400,"Invalid Bio");
            if (!token) return new ApiError(res,401,"Invalid Token");

            const result = await userModel.changeBio(token, bio)

            modelResponse.responseRequest(res,result);

        } catch (e: any) {
            console.warn(e.toString())
        }
    }
}

export default UserController