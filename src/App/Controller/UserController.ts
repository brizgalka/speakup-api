import {Request, Response, NextFunction} from "express";
import ApiError from "@/App/error/ApiError";
import VerifyToken from "@/App/ControllerModel/Token";
import bcrypt from 'bcrypt';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

const saltRounds = Number(process.env.saltRounds);

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

            const token_candidate = await prisma.verifyToken.findFirst({
                where: {
                    username
                },
            }) || await prisma.user.findFirst({
                where: {
                    email
                },
            })

            if(token_candidate != undefined) {
                return next(ApiError.badRequest("Token already exist").response)
            }

            const salt = bcrypt.genSaltSync(saltRounds);
            const tokenValue = bcrypt.hashSync(username + password + email + String(Date.now()) + String(Math.random()), salt);

            const token = await prisma.verifyToken.create({
                data: {
                    username,
                    email,
                    password,
                    value: tokenValue
                }
            })

            res.json({
                "verifyToken": token.value
            })
        } catch(e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }
    async sendMessage(req:Request,res:Response,next:NextFunction) {

    }
    async verifyAccount(token: string,telegram: string) {

        const user_token = await prisma.verifyToken.findFirst({
            where: {
                value: token
            }
        })

        if(user_token == undefined) {
            return "Unknown user"
        } else {
            await prisma.user.create({
                data: {
                    username: user_token?.username || "",
                    email: user_token?.email || "",
                    password: user_token?.password || "",
                    telegram: telegram
                }
            })
            await prisma.verifyToken.delete({
                where: {
                    value: token
                }
            })
            return "Successful"
        }
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