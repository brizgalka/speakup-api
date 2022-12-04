import {PrismaClient} from "@prisma/client";
import {NextFunction, Request, Response} from "express";
import ApiError from "@/App/error/ApiError";
import bcrypt from "bcrypt";
const prisma = new PrismaClient()

const saltRounds = Number(process.env.saltRounds);

class AuthController {
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
            }) || await prisma.verifyToken.findFirst({
                where: {
                    email
                },
            })

            if(token_candidate != undefined && token_candidate != null) {
                const token_createdAt = Number(token_candidate.createdAt)
                const difference = Date.now() - token_createdAt
                console.log(token_candidate.createdAt)
                if(parseInt(String(difference / 1000)) > 300) {
                    await prisma.verifyToken.delete({
                        where: {
                            id: token_candidate?.id
                        }
                    })
                    return next(ApiError.badRequest("Token invalid. Try again").response)
                } else {
                    return next(ApiError.badRequest("Token already exist").response)
                }
            }

            const salt = bcrypt.genSaltSync(saltRounds);
            console.log(username + password + email + String(Date.now()) + String(Math.random()))
            const tokenValue = bcrypt.hashSync(username + password + email + String(Date.now()) + String(Math.random()), salt);


            const token = await prisma.verifyToken.create({
                data: {
                    username,
                    email,
                    password,
                    value: tokenValue,
                    createdAt: String(Date.now())
                }
            })

            console.log(token)
            console.log(token.createdAt)
            console.log(Number(token.createdAt))
            console.log(Date.now() - Number(token.createdAt))

            res.json({
                "verifyToken": token.value
            })
        } catch(e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }
    async verifyAccount(token: string,telegram: string) {

        const user_candidate = await prisma.user.findUnique({
            where: {
                telegram
            }
        })

        if(user_candidate != null) {
            return "Аккаунт уже привязан"
        }

        const user_token = await prisma.verifyToken.findFirst({
            where: {
                value: token
            }
        })

        if(user_token == null) {
            return "Неизвестный токен"
        } else {
            await prisma.user.create({
                data: {
                    username: user_token?.username || "",
                    email: user_token?.email || "",
                    password: user_token?.password || "",
                    createdAt: String(Date.now()),
                    telegram: telegram
                }
            })
            await prisma.verifyToken.delete({
                where: {
                    value: token
                }
            })
            return "Аккаунт успешно создан и привязан к вашему телеграмм!"
        }
    }
    async login(req:Request,res:Response,next:NextFunction) {

    }
    async checkToken(req:Request,res:Response,next:NextFunction) {

    }
}

export default AuthController