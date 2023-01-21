"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TgBot = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const AuthController_1 = __importDefault(require("@/App/Controller/AuthController"));
const authController = new AuthController_1.default();
class TgBot {
    token;
    bot;
    constructor(options) {
        this.token = options.token;
        this.bot = new node_telegram_bot_api_1.default(this.token, { polling: true });
        console.log("tg bot has been started");
        this.bot.onText(/\/start/, async (msg, match) => {
            const chatId = msg.chat.id;
            this.bot.sendMessage(chatId, `Send verify token`);
        });
        this.bot.onText(/\/verify/, async (msg, match) => {
            const chatId = msg.chat.id;
            const text = String(msg.text);
            const args = text?.split(" ");
            const token = args[1];
            if (token == undefined) {
                this.bot.sendMessage(chatId, `/verify <token>`);
            }
            else {
                const result = await authController.verifyAccount(token, String(msg.chat.id));
                this.bot.sendMessage(chatId, result);
            }
        });
    }
}
exports.TgBot = TgBot;
//# sourceMappingURL=TgBot.js.map