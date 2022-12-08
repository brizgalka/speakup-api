import {PrismaClient} from "@prisma/client";
import {NextFunction, Request, Response} from "express";
import ApiError from "@/App/error/ApiError";
import {ApplicationContext} from "@/System/Context";
const prisma = new PrismaClient()
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';

const saltRounds = Number(process.env.saltRounds)

class AuthController {
    async registration(req:Request,res:Response,next:NextFunction) {
        try {
            if(req.body == undefined) return next(ApiError.badRequest("Invalid body").response);

            const {username,password,email} = req.body;
            const user_uuid = req.body.uuid;

            if(!user_uuid) return next(ApiError.badRequest("Invalid UUID").response);
            if (!username) return next(ApiError.badRequest("Invalid username").response);
            if (!password) return next(ApiError.badRequest("Invalid password").response);
            if (!email) return next(ApiError.badRequest("Invalid email").response);

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

            const tokenValue = uuidv4()

            const salt = bcrypt.genSaltSync(saltRounds);
            const hash_password = bcrypt.hashSync(password, salt);

            const token = await prisma.verifyToken.create({
                data: {
                    username,
                    email,
                    password: hash_password,
                    value: tokenValue,
                    createdAt: String(Date.now())
                }
            })

            await ApplicationContext.redis.set(tokenValue,user_uuid)

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
            const user_uuid_connection = await ApplicationContext.redis.get(token)
            console.log("successful")
            if(user_uuid_connection != null) {
                if (ApplicationContext.wss.verifyUUID(user_uuid_connection)) {
                    ApplicationContext.wss.sendMessage(user_uuid_connection,{
                        "verify": "ok"
                    })
                }
            }
            return "Аккаунт успешно создан и привязан к вашему телеграмм!"
        }
    }
    async login(req:Request,res:Response,next:NextFunction) {

    }
    async checkToken(req:Request,res:Response,next:NextFunction) {

    }
}

export default AuthController