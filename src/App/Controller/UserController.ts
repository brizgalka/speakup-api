import {Request, Response, NextFunction} from "express";
import ApiError from "@/App/error/ApiError";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client'
import AuthController from "@/App/Controller/AuthController";
import path from "path"
import fileUpload from "express-fileupload";

const prisma = new PrismaClient()

const saltRounds = Number(process.env.saltRounds);

const authController = new AuthController();

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
            if (!req.files) {
                return res.status(400).send("No files were uploaded.");
            }

            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            //const file = req.files.file;
            //const format = file.name.split('.').pop()
            //file.mv(path.join(__dirname,`/../${process.env.MUSIC_STATIC}/`,name  + `.${format}`))
            console.log(ip)
        } catch (e: any) {
            console.warn(e.toString())
        }
    }
}

export default UserController