import {Request, Response, NextFunction, request} from "express";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import ApiError from "@/App/error/ApiError";

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
        try {
            if(req.body == undefined) return next(ApiError.badRequest("Incorrect body").response);

            const username = String(req.body.username);
            const password = String(req.body.password);
            const email = String(req.body.email);

            if (!username) return next(ApiError.badRequest("Incorrect username").response)
            if (!password) return next(ApiError.badRequest("Incorrect password").response)
            if (!email) return next(ApiError.badRequest("Incorrect email").response)

            const candidate = await prisma.user.findFirst({
                where: {
                    username
                },
            }) || await prisma.user.findFirst({
                where: {
                    email
                },
            })

            if(candidate != undefined) {
                return next(ApiError.badRequest("This email or username already taken").response)
            }

            const nickname = "nickname";

            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    nickname
                }
            })

            console.log(user)

            res.send("ok")
        } catch(e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }
    async sendMessage(req:Request,res:Response,next:NextFunction) {

    }
    async verifyAccount(req:Request,res:Response,next:NextFunction) {

    }
    async deleteMessage(req:Request,res:Response,next:NextFunction) {

    }
    async changeProfile(req:Request,res:Response,next:NextFunction) {

    }
    async login(req:Request,res:Response,next:NextFunction) {

    }
    async checkToken(req:Request,res:Response,next:NextFunction) {

    }
}

export default UserController