import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()
import {NextFunction, Request, Response} from "express";
import ApiError from "@/App/error/ApiError";
import jwt from "jsonwebtoken"
import {ApplicationContext} from "@/System/Context";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';

const saltRounds = Number(process.env.saltRounds)
const token_secret = String(process.env.JWT_SECRET)

interface JwtPayload {
    username: string
}

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
                const token_createdAt = token_candidate.createdAt
                const difference = Date.now() - token_createdAt.getDate()
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
                    salt,
                    email,
                    password: hash_password,
                    value: tokenValue,
                    createdAt: new Date()
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
                    username: user_token.username,
                    email: user_token.email,
                    password: user_token.password,
                    salt: user_token.salt,
                    createdAt: new Date(),
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
                        "verify": {
                            "status": "ok",
                            "token": "sd"
                        }
                    })
                }
            }

            await ApplicationContext.redis.del(token)
            return "Аккаунт успешно создан и привязан к вашему телеграмм!"
        }
    }

    async getUser(jwtoken: string) {
        try {
            const decoded = jwt.verify(jwtoken, token_secret) as JwtPayload;

            if(decoded != undefined) {
                const username: string = decoded.username;
                const user = await prisma.user.findFirst({
                    where: {
                        username
                    }
                })

                return user
            }
        } catch (e: any) {
            console.warn(e.toString())
        }
    }

    async login(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return next(ApiError.badRequest("Invalid body").response);

            const {username,password} = req.body;

            if (!username) return next(ApiError.badRequest("Invalid username").response);
            if (!password) return next(ApiError.badRequest("Invalid password").response);

            const user = await prisma.user.findFirst({
                where: {
                    username
                }
            })

            if(user == null) {
                return next(ApiError.badRequest("Wrong username or password").response);
            }

            const salt = user.salt;
            const hashPassword = bcrypt.hashSync(password, salt);

            if(user.password != hashPassword) {
                return next(ApiError.badRequest("Wrong username or password").response);
            }

            const token = jwt.sign({username}, token_secret, { expiresIn: '1800s' })

            res.cookie("token",token,{
                maxAge: 3600 * 24 * 25,
                httpOnly: true
            })
            res.json({
                token
            })
        } catch (e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }

    }
    async checkToken(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return next(ApiError.badRequest("Invalid body").response);

            res.send("auth")
        } catch (e: any) {
            console.warn(e.toString())
        }
    }
}

export default AuthController