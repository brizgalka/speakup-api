import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import {NextFunction, Request, Response} from "express";
import ApiError from "@/App/error/ApiError";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import {ApplicationContext} from "@/System/Context";
import modelResponse from "@/App/View/modelResponse";
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


class AuthModel {

    async getUser(jwtoken: string): Promise<modelResponse | ApiError> {
        try {
            const decoded = jwt.verify(jwtoken, token_secret) as JwtPayload;
            if(decoded != undefined) {
                const username: string = decoded.username;
                const user = await prisma.user.findFirst({
                    where: {
                        username
                    }
                });
                if(user) return new modelResponse(200,user)
                else return new ApiError(undefined,500)
            } else {
                return new ApiError(undefined,500)
            }
        } catch (e: any) {
            console.warn(e.toString())
            return new ApiError(undefined,500);
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
                console.log(token_candidate.createdAt)
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

            await ApplicationContext.redis.set(tokenValue,user_uuid)

            return new modelResponse(200, {"verifyToken": token.value})
        } catch(e: any) {
            console.warn(e.toString())
            return new ApiError(undefined,500);
        }
    }

}

export default AuthModel