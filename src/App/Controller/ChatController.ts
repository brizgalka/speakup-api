import {NextFunction, Request, Response} from "express";
import ApiError from "@/App/error/ApiError";
import AuthController from "./AuthController"
import {PrismaClient} from "@prisma/client";
import {decrypt,encrypt,genSecret} from "@/Utils/CRYPTO_Manager"

interface EncryptObject {
    iv: string,
    content: string
}

const prisma = new PrismaClient()

const authController = new AuthController();

interface dbUser {
    id: number
    username: string,
}

interface dbDialog {
    id: number,
    user1Id: number,
    user2Id: number,
    secret: string
}

type returnDbDialog = dbDialog | false

export default class ChatController {

    async createChat(req:Request,res:Response,next:NextFunction) {
        try {
            if(req.body == undefined) return next(ApiError.badRequest("Invalid body").response);

            const {username} = req.body;
            const token = req.cookies['token'];

            const user = await authController.getUser(token) as dbUser;

            console.log(user)

            const new_user: dbUser = await prisma.user.findFirst({
                where: {
                    username
                }
            }) as dbUser

            console.log(new_user);

            const chat_condidate = await prisma.dialog.findFirst({
                where: {
                    user1Id: new_user.id,
                    user2Id: user.id
                }
            }) || await prisma.dialog.findFirst({
                where: {
                    user2Id: new_user.id,
                    user1Id: user.id
                }
            })

            console.log(chat_condidate)

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
                    user1Name: user.username,
                    user2Name: new_user.username
                }
            })

            res.sendStatus(200)
        } catch (e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }
    static async getDialog(chatId: number,user: dbUser): Promise<returnDbDialog> {

        const dialog = await prisma.dialog.findFirst({
            where: {
                id: Number(chatId)
            }
        }) as dbDialog

        if(dialog.user1Id == user.id || dialog.user2Id == user.id) {
            return dialog as dbDialog
        } else {
            return false
        }
    }
    async sendMessage(req:Request,res:Response,next:NextFunction) {
        try {
            if(req.body == undefined) return next(ApiError.badRequest("Invalid body").response);

            const {message,chatId} = req.body;
            const token = req.cookies['token'];

            const user: dbUser = await authController.getUser(token) as dbUser;

            const dialog = await ChatController.getDialog(chatId,user) as dbDialog

            const secretMessage = encrypt(message,dialog.secret)

            const resultMessage = JSON.stringify(secretMessage)

            console.log(dialog)

            if(dialog) {
                await prisma.message.create({
                    data: {
                        createdAt: new Date(),
                        message: resultMessage,
                        senderId: user.id,
                        dialogId: dialog.id
                    }
                })
                res.send(200)
            } else {
                res.send("Chat not found")
            }
        } catch (e: any) {
            console.warn(e.toString())
            res.sendStatus(500)
        }
    }
    async deleteMessage() {

    }
    async getMessages(req:Request,res:Response,next:NextFunction) {
        try {
            const {chatId} = req.body;
            const token = req.cookies['token'];

            const user: dbUser = await authController.getUser(token) as dbUser;

            const dialog = await ChatController.getDialog(chatId,user)

            if(dialog) {
                const messages = await prisma.message.findMany({
                    where: {
                        dialogId: Number(chatId)
                    }
                })

                const chat_result: object[] = []

                messages.forEach(item => {
                    const msg: EncryptObject = JSON.parse(item.message)
                    const decrypt_message: string = decrypt(msg,dialog.secret)
                    chat_result.push({
                        ...item,message: decrypt_message
                    })
                })

                res.json(chat_result)
            } else {
                res.send("Chat not found")
            }
        } catch(e: any) {
            console.warn(e.toString())
        }
    }
    async getDialogs(req:Request,res:Response,next:NextFunction) {
        try {
            const token = req.cookies['token'];

            const user = await authController.getUser(token) as dbUser

            const dialogs1 = await prisma.dialog.findMany({
                where: {
                    user1Id: user.id
                }
            })

            const dialogs2 = await prisma.dialog.findMany({
                where: {
                    user2Id: user.id
                }
            })

            res.json({
                "user1": dialogs1,
                "user2": dialogs2
            })
        } catch (e: any) {
            console.warn(e.toString())
        }
    }
}