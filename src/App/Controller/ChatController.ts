import {NextFunction, Request, Response} from "express";
import ApiError from "@/App/error/ApiError";
import AuthController from "./AuthController"
import {PrismaClient} from "@prisma/client";
import {decrypt,encrypt,genSecret} from "@/Utils/CRYPTO_Manager"
import {ApplicationContext} from "@/System/Context";

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
    user1Name: string,
    user2Name: string,
    secret: string
}

type returnDbDialog = dbDialog | false

export default class ChatController {

    async createChat(req:Request,res:Response,next:NextFunction) {
        try {
            if(req.body == undefined) return new ApiError(res,400,"Invalid body");

            const {username} = req.body;
            const token = req.cookies['token'];

            console.log('creating chat')

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
                return new ApiError(res,400,"Chat already exist");
            }

            if(!user) {
                return new ApiError(res,500,"Server error");
            }

            if(!new_user) {
                return new ApiError(res,400,"User not found");
            }

            const chat = await prisma.dialog.create({
                data: {
                    createdAt: new Date(),
                    secret: genSecret(16),
                    user1Id: user.id,
                    user2Id: new_user.id,
                    user1Name: user.username,
                    user2Name: new_user.username,
                    DialogName: user.username + " and " + new_user.username
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

    async getDialogInfo(req:Request,res:Response,next:NextFunction) {
        try {
            if (req.body == undefined) return new ApiError(res,400,"Invalid body");

            const {chatId} = req.body;
            const token = req.cookies['token'];

            if(!chatId) { return new ApiError(res,400,"Invalid chatId"); }

            const user: dbUser = await authController.getUser(token) as dbUser;

            const dialog = await ChatController.getDialog(chatId,user) as dbDialog

            if(dialog) {
                res.json(dialog)
            } else {
                res.send(404)
            }
        } catch (e: any) {
            res.sendStatus(500)
            console.warn(e.toString())
        }
    }


    async sendMessage(req:Request,res:Response,next:NextFunction) {
        try {
            if(req.body == undefined) return new ApiError(res,400,"Invalid body");

            const {message,chatId} = req.body;
            const token = req.cookies['token'];

            if(!message) { return new ApiError(res,400,"Invalid message"); }
            if(!chatId) { return new ApiError(res,400,"Invalid chatId") }

            if(message.length > 750) { return new ApiError(res,400,"Message to long") }

            const user: dbUser = await authController.getUser(token) as dbUser;

            const dialog = await ChatController.getDialog(chatId,user) as dbDialog;

            const secretMessage = encrypt(message,dialog.secret)

            const resultMessage = JSON.stringify(secretMessage)

            if(dialog) {
                await prisma.message.create({
                    data: {
                        createdAt: new Date(),
                        message: resultMessage,
                        senderId: user.id,
                        dialogId: dialog.id
                    }
                })
                let reciever = ""
                if(dialog.user1Id == user.id) {
                    reciever = dialog.user2Name
                } else {
                    reciever = dialog.user1Name
                }
                for (const connection of ApplicationContext.wss.connections.entries()) {
                    const ws_connection = connection[0]
                    const ws_user = connection[1]
                    if(ws_user.user.username == reciever) {
                        ApplicationContext.wss.sendMessage(ws_user.uuid,{
                            "message": "new message"
                        })
                    }
                }
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

            if(!chatId) { return new ApiError(res,400,"Invalid chatId") }

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