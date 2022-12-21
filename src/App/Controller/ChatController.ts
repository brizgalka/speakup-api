import {NextFunction, Request, Response} from "express";
import ApiError from "@/App/error/ApiError";
import AuthController from "./AuthController"
import {PrismaClient} from "@prisma/client";
import {decrypt,encrypt,genSecret} from "@/Utils/CRYPTO_Manager"

const prisma = new PrismaClient()

const authController = new AuthController();

interface dbUser {
    id: number
}

export default class ChatController {

    async createChat(req:Request,res:Response,next:NextFunction) {
        try {
            if(req.body == undefined) return next(ApiError.badRequest("Invalid body").response);

            const {username} = req.body;
            const token = req.cookies['token'];

            const user = await authController.getUser(token);

            const new_user: dbUser = await prisma.user.findFirst({
                where: {
                    username
                }
            }) as dbUser

            console.log(user)

            const chat_condidate = await prisma.dialog.findFirst({
                where: {
                    user1Id: new_user.id
                }
            }) || await prisma.dialog.findFirst({
                where: {
                    user2Id: new_user.id
                }
            })

            if(chat_condidate) {
                return next(ApiError.badRequest("Chat already exist").response);
            }

            if(!user) {
                return next(ApiError.badRequest("Server error").response);
            }

            if(!new_user) {
                return next(ApiError.badRequest("User not found").response);
            }

            const chat = await prisma.dialog.create({
                data: {
                    createdAt: new Date(),
                    secret: genSecret(16),
                    user1Id: user.id,
                    user2Id: new_user.id,
                }
            })

            res.sendStatus(200)
        } catch (e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }
    async sendMessage(req:Request,res:Response,next:NextFunction) {
        try {
            if(req.body == undefined) return next(ApiError.badRequest("Invalid body").response);

            const {message,chatId} = req.body;
            const token = req.cookies['token'];

            console.log("SEND MESSAGE")
            console.log(token)

            const user = await authController.getUser(token);

            console.log(user)
            console.log(`message ${message} to ${chatId}`)
        } catch (e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }
    async deleteMessage() {

    }
}