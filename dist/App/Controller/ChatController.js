"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
const AuthController_1 = __importDefault(require("./AuthController"));
const client_1 = require("@prisma/client");
const CRYPTO_Manager_1 = require("@/Utils/CRYPTO_Manager");
const Context_1 = require("@/System/Context");
const prisma = new client_1.PrismaClient();
const authController = new AuthController_1.default();
class ChatController {
    async createChat(req, res, next) {
        try {
            if (req.body == undefined)
                return new ApiError_1.default(res, 400, "Invalid body");
            const { username } = req.body;
            const token = req.cookies['token'];
            const user = await authController.getUser(token);
            const new_user = await prisma.user.findFirst({
                where: {
                    username
                }
            });
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
            });
            if (chat_condidate) {
                return new ApiError_1.default(res, 400, "Chat already exist");
            }
            if (!user) {
                return new ApiError_1.default(res, 500, "Server error");
            }
            if (!new_user) {
                return new ApiError_1.default(res, 400, "User not found");
            }
            const chat = await prisma.dialog.create({
                data: {
                    createdAt: new Date(),
                    secret: (0, CRYPTO_Manager_1.genSecret)(16),
                    user1: {
                        connect: {
                            id: user.id
                        }
                    },
                    user2: {
                        connect: {
                            id: new_user.id
                        }
                    },
                    user1Name: user.username,
                    user2Name: new_user.username,
                    DialogName: user.username + " and " + new_user.username
                }
            });
            res.sendStatus(200);
        }
        catch (e) {
            console.warn(e.toString());
            res.sendStatus(500);
        }
    }
    static async getDialog(chatId, user) {
        try {
            const dialog = await prisma.dialog.findFirst({
                where: {
                    id: Number(chatId)
                }
            });
            if (dialog.user1Id == user.id || dialog.user2Id == user.id) {
                return dialog;
            }
            else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    }
    async getDialogInfo(req, res, next) {
        try {
            if (req.body == undefined)
                return new ApiError_1.default(res, 400, "Invalid body");
            const { chatId } = req.body;
            const token = req.cookies['token'];
            if (!chatId) {
                return new ApiError_1.default(res, 400, "Invalid chatId");
            }
            const user = await authController.getUser(token);
            const dialog = await ChatController.getDialog(chatId, user);
            if (dialog) {
                res.json(dialog);
            }
            else {
                res.send(404);
            }
        }
        catch (e) {
            res.sendStatus(500);
            console.warn(e.toString());
        }
    }
    async sendMessage(req, res, next) {
        try {
            if (req.body == undefined)
                return new ApiError_1.default(res, 400, "Invalid body");
            const { message, chatId } = req.body;
            const token = req.cookies['token'];
            if (!message) {
                return new ApiError_1.default(res, 400, "Invalid message");
            }
            if (!chatId) {
                return new ApiError_1.default(res, 400, "Invalid chatId");
            }
            if (message.length > 850) {
                return new ApiError_1.default(res, 400, "Message to long");
            }
            const user = await authController.getUser(token);
            const dialog = await ChatController.getDialog(chatId, user);
            const secretMessage = (0, CRYPTO_Manager_1.encrypt)(message, dialog.secret);
            const resultMessage = JSON.stringify(secretMessage);
            if (dialog) {
                await prisma.message.create({
                    data: {
                        createdAt: new Date(),
                        message: resultMessage,
                        senderId: user.id,
                        dialogId: dialog.id
                    }
                });
                let reciever = "";
                if (dialog.user1 == user) {
                    reciever = dialog.user2Name;
                }
                else {
                    reciever = dialog.user1Name;
                }
                for (const connection of Context_1.ApplicationContext.wss.connections.entries()) {
                    const ws_connection = connection[0];
                    const ws_user = connection[1];
                    if (ws_user.user.username == reciever) {
                        Context_1.ApplicationContext.wss.sendMessage(ws_user.uuid, {
                            "message": "new message",
                            "data": {
                                chatId,
                                message
                            }
                        });
                    }
                    return 1;
                }
                res.send(200);
            }
            else {
                res.send("Chat not found");
            }
        }
        catch (e) {
            console.warn(e.toString());
            res.sendStatus(500);
        }
    }
    async deleteMessage() {
    }
    async getMessages(req, res, next) {
        try {
            const { chatId } = req.body;
            const token = req.cookies['token'];
            if (!chatId) {
                return new ApiError_1.default(res, 400, "Invalid chatId");
            }
            const user = await authController.getUser(token);
            const dialog = await ChatController.getDialog(chatId, user);
            if (dialog) {
                const messages = await prisma.message.findMany({
                    where: {
                        dialogId: Number(chatId)
                    }
                });
                const chat_result = [];
                messages.forEach(item => {
                    const msg = JSON.parse(item.message);
                    const decrypt_message = (0, CRYPTO_Manager_1.decrypt)(msg, dialog.secret);
                    chat_result.push({
                        ...item, message: decrypt_message
                    });
                });
                res.json(chat_result);
            }
            else {
                res.send("Chat not found");
            }
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
    async getDialogs(req, res, next) {
        try {
            const token = req.cookies['token'];
            const user = await authController.getUser(token);
            const dialogs1 = await prisma.dialog.findMany({
                where: {
                    user1: user
                }
            });
            const dialogs2 = await prisma.dialog.findMany({
                where: {
                    user2: user
                }
            });
            res.json({
                "user1": dialogs1,
                "user2": dialogs2
            });
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
}
exports.default = ChatController;
//# sourceMappingURL=ChatController.js.map