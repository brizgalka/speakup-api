import {Request, Response, NextFunction} from "express";
import ApiError from "@/App/error/ApiError";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client'
import AuthController from "@/App/Controller/AuthController";

const prisma = new PrismaClient()

const saltRounds = Number(process.env.saltRounds);

const authController = new AuthController();

interface sendUserData {
    username: string,
    nickname: string,
    photo: string,
    email: string
}

class UserController {
    async sendMessage(req:Request,res:Response,next:NextFunction) {
        console.log("adwawd")
    }
    async deleteMessage(req:Request,res:Response,next:NextFunction) {

    }

    async getUserData(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return next(ApiError.badRequest("Invalid body").response);
            const token = req.cookies['token'];

            const user = await authController.getUser(token) as sendUserData;

            res.json({
                "username": user.username,
                "nickname": user.nickname,
                "photo": user.photo,
                "email": user.email
            })
        } catch (e: any) {
            console.warn(e.toString())
        }

    }

    async changeProfile(req:Request,res:Response,next:NextFunction) {

    }
}

export default UserController