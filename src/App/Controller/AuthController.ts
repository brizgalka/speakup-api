import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()
import {NextFunction, Request, Response} from "express";
import ApiError from "@/App/error/ApiError";
import jwt from "jsonwebtoken"
import {ApplicationContext} from "@/System/Context";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import AuthModel from "@/App/model/AuthModel";
import modelResponse from "@/App/model/modelResponse";

const saltRounds = Number(process.env.saltRounds)
const token_secret = String(process.env.JWT_SECRET)

interface JwtPayload {
    username: string
}

interface dbUser {
    id: number;
    username: string;
    salt: string;
    password: string;
}

const authModel = new AuthModel();

const jwtMaxAge = Number(process.env.jwtMaxAge)

class AuthController {
    async registration(req:Request,res:Response,next:NextFunction) {
        try {
            if(req.body == undefined) return next(new ApiError(res,400,"Invalid Body"));

            const {username,password,email} = req.body;
            const user_uuid = req.body.uuid;

            if (!user_uuid) return new ApiError(res,400,"Invalid UUID");
            if (!username) return new ApiError(res,400,"Invalid username");
            if (!password) return new ApiError(res,400,"Invalid password");
            if (!email) return new ApiError(res,400,"Invalid email");
            if(!ApplicationContext.wss.verifyUUID(user_uuid)) return new ApiError(res,400,"Invalid user_uuid");

            const result = await authModel.registration(username,password,email,user_uuid)

            modelResponse.responseRequest(res,result)
        } catch(e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }

    async validateVerifyToken(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return next(new ApiError(res,400,("Invalid body")));

            const {verifyToken} = req.body;

            if (!verifyToken) return next(new ApiError(res,400,("Invalid verifyToken")));

            const result = await ApplicationContext.redis.get(verifyToken)

            if(result) { res.sendStatus(200) } else { res.sendStatus(500) }
        }  catch (e: any) {
            console.warn(e.toString())
        }
    }

    async verifyAccount(token: string, telegram: string) {
        try {
            const user_candidate = await prisma.user.findUnique({
                where: {
                    telegram
                }
            })

            if (user_candidate != null) {
                return "Аккаунт уже привязан"
            }

            const user_token = await prisma.verifyToken.findFirst({
                where: {
                    value: token
                }
            });

            if (user_token == null) {
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
                console.log(user_uuid_connection)
                console.log(ApplicationContext.wss)
                if (user_uuid_connection != null) {
                    if (ApplicationContext.wss.verifyUUID(user_uuid_connection)) {
                        ApplicationContext.wss.sendMessage(user_uuid_connection, {
                            "verify": {
                                "status": "ok",
                            }
                        })
                    }
                }
                await ApplicationContext.redis.del(token)
                return "Аккаунт успешно создан и привязан к вашему телеграмм!"
            }
        } catch (e: any) {
            console.warn(e.toString())
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
                });

                return user
            }
        } catch (e: any) {
            console.warn(e.toString())
        }
    }

    async forgotPassword(req:Request,res:Response,next:NextFunction){
        try {
            if (req.body == undefined) return next(new ApiError(res,400,("Invalid body")));

            const {username} = req.body;
            const user_uuid = req.body.uuid;

            if (!username) return next(new ApiError(res,400,("Invalid username")));

            const user = await prisma.user.findFirst({
                where: {
                    username
                }
            })

            if(user == null) {
                return next(new ApiError(res,400,("Wrong username")));
            }

            const salt = bcrypt.genSaltSync(saltRounds);

            const uuid1 = uuidv4()
            const hash = bcrypt.hashSync(user_uuid, salt);
            const uuid2 = uuidv4()
            const hash_id = (uuid1 + hash + uuid2).replace("/",".")

            await ApplicationContext.redis.set(hash_id,user.username)
            await ApplicationContext.tgBot.bot.sendMessage(user.telegram,`hello, your reset link
                http://82.146.46.97:3000/auth/forgot-password/auth-new-password/${hash_id}
            `)
            res.send("Code sent to your telegram")
        } catch (e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }
    async validateHashId(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return next(new ApiError(res,400,("Invalid body")));

            const {hashId} = req.body;

            if (!hashId) return next(new ApiError(res,400,("Invalid hashId")));

            const result = await ApplicationContext.redis.get(hashId)

            if(result) {
                res.sendStatus(200)
            } else {
                return next(new ApiError(res,400,("Invalid hashId")));
            }
        }  catch (e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }

    async newPassword(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return next(new ApiError(res,400,("Invalid body")));

            const {newPassword,hashId} = req.body;

            if (!newPassword) return next(new ApiError(res,400,("Invalid newPassword")));
            if (!hashId) return next(new ApiError(res,400,("Invalid hashId")));

            const username = await ApplicationContext.redis.get(hashId)

            if(!username) return next(new ApiError(res,400,("Invalid hashId")));

            const salt = bcrypt.genSaltSync(saltRounds);
            const hash_password = bcrypt.hashSync(newPassword, salt);

            const user = await prisma.user.update({
                where: {
                    username
                },
                data: {
                    password: hash_password,
                    salt
                }
            })

            await ApplicationContext.redis.del(hashId)

            res.send(200)
        }  catch (e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }

    async changePassword(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return next(new ApiError(res,400,("Invalid body")));

            const {oldPassword,newPassword} = req.body;
            const token = req.cookies['token'];

            if (!oldPassword) return next(new ApiError(res,400,("Invalid oldPassword")));
            if (!newPassword) return next(new ApiError(res,400,("Invalid newPassword")));
            if (!token) return next(new ApiError(res,400,("Invalid token")));

            const result = await authModel.changePassword(token,oldPassword,newPassword)

            modelResponse.responseRequest(res,result)
        } catch (e: any) {
            res.sendStatus(500)
        }
    }

    async login(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return next(new ApiError(res,400,("Invalid body")));

            const {username,password} = req.body;

            if (!username) return next(new ApiError(res,400,("Invalid username")));
            if (!password) return next(new ApiError(res,400,("Invalid password")));

            const result = await authModel.login(username,password)

            modelResponse.responseRequest(res,result)
        } catch (e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }

    async logOut(req:Request,res:Response,next:NextFunction) {
        try {
            const token = req.cookies['token'];

            if(token == undefined) { return next(new ApiError(res,400,("Invalid token"))) }

            const result = await authModel.logOut(token)

            modelResponse.responseRequest(res,result)
        } catch (e: any) {
            console.warn(e.toString());
        }
    }

    async checkToken(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return next(new ApiError(res,400,"Invalid body"));

            res.send("auth")
        } catch (err: any) {
            console.warn(err.toString())
        }
    }
}

export default AuthController