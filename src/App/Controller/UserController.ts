import {Request, Response, NextFunction, request} from "express";
import jwt from "jsonwebtoken";
import ApiError from "@/App/error/ApiError";
import {PrismaClient} from "@prisma/client";

/*const generateJwt = (id: number, username: string): string => {
    return jwt.sign(
        {id, username},
        jwt.sign(),
        {
            expiresIn: '24h'
        }
    )
}*/

const prisma = new PrismaClient()

class UserController {
    async registration(req:Request,res:Response,next:NextFunction) {
        const {username,password,email} = req.body;

        if(!username) return next(ApiError.badRequest("Uncorrect username"))
        if(!password) return next(ApiError.badRequest("Uncorrect password"))
        if(!email) return next(ApiError.badRequest("Uncorrect email"))

        const candidate = await prisma.users.findUnique({
            where: {
                id: 0
            }
        })

        res.send("ok")
    }
    async sendMessage(req:Request,res:Response,next:NextFunction) {

    }
    async deleteMessage(req:Request,res:Response,next:NextFunction) {

    }
    async changeProfile(req:Request,res:Response,next:NextFunction) {

    }
    async login(req:Request,res:Response,next:NextFunction) {

    }
    async check(req:Request,res:Response,next:NextFunction) {

    }
}

export default UserController