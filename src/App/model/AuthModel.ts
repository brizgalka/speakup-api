import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import ApiError from "@/App/error/ApiError";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import {ApplicationContext} from "@/System/Context";
import modelResponse from "@/App/model/modelResponse";
import {NextFunction, Request, Response} from "express";
import ModelResponse from "@/App/model/modelResponse";
const prisma = new PrismaClient()

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

const jwtMaxAge = Number(process.env.jwtMaxAge)

interface dbUser {
    id: number;
    username: string;
    salt: string;
    password: string;
}


class AuthModel {

    static async getUser(jwtoken: string) {
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

    async registration(username: string, password: string, email: string, user_uuid: string): Promise<modelResponse | ApiError> {
        try {
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
                return new ApiError(undefined,400,"This email or username already taken")
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

            if(token_candidate != null) {
                const token_createdAt = token_candidate.createdAt
                const difference = Date.now() - token_createdAt.getDate()
                if(parseInt(String(difference / 1000)) > 300) {
                    await prisma.verifyToken.delete({
                        where: {
                            id: token_candidate?.id
                        }
                    })
                    return new ApiError(undefined,400,"Token invalid")
                } else {
                    return new ApiError(undefined,400,"Token already exist")
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

            await ApplicationContext.redis.set(tokenValue,user_uuid);

            return new modelResponse(200, {"verifyToken": token.value},undefined)
        } catch(e: any) {
            console.warn(e.toString())
            return new ApiError(undefined,500);
        }
    }

    async login(username: string, password: string): Promise<modelResponse | ApiError>  {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    username
                }
            })

            if(user == null) {
                return new ApiError(undefined,400,"Wrong username or password");
            }

            const salt = user.salt;
            const hashPassword = bcrypt.hashSync(password, salt);

            if(user.password != hashPassword) {
                return new ApiError(undefined,400,"Wrong username or password");
            }

            const token = jwt.sign({username}, token_secret, { expiresIn: '1800s' })

            return new modelResponse(200, {
                token,
                id: user.id,
                username: user.username
            }, {
                set: {
                    name: "token",
                    value: token,
                    options: {
                        maxAge: jwtMaxAge,
                        httpOnly: true
                    }
                }
            })
        } catch (e: any) {
            console.warn(e.toString())
            return new ApiError(undefined,500);
        }
    }

    async logOut(token: string): Promise<modelResponse | ApiError> {
        try {
            const user = await AuthModel.getUser(token) as dbUser;

            if(user) {
                for (const connection of ApplicationContext.wss.connections.entries()) {
                    const ws_connection = connection[0]
                    const ws_user = connection[1]
                    if(ws_user.user.username == user.username) {
                        ws_user.user.username = null
                    }
                }
            }

            return new modelResponse(200, undefined,{
                clear: ["token"]
            })
        } catch (e: any) {
            return new modelResponse(500, {"response": "server error"},{
                clear: ["token"]
            })
        }
    }

    async changePassword(token: string, oldPassword: string, newPassword: string): Promise<modelResponse | ApiError>  {
        try {
            const user = await AuthModel.getUser(token) as dbUser;

            const user_salt = user.salt;
            const hashPassword = bcrypt.hashSync(oldPassword, user_salt);

            if(user.password != hashPassword) {
                return new ApiError(undefined,400,("Wrong oldPassword"));
            }

            const new_salt = bcrypt.genSaltSync(saltRounds);
            const hash_password = bcrypt.hashSync(newPassword, new_salt);

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hash_password,
                    salt: new_salt
                }
            })

            return new modelResponse(200)
        } catch (e: any) {
            return new ApiError(undefined, 500)
        }
    }

}

export default AuthModel