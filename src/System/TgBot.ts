import TelegramBot from 'node-telegram-bot-api'
import UserController from "@/App/Controller/UserController";

interface TgBotInterface {
    token: string,
    bot: TelegramBot
}

interface TgBotOptions {
    token: string
}

const userController = new UserController();

class TgBot implements TgBotInterface {

    readonly token: string;
    readonly bot: TelegramBot;

    constructor(options: TgBotOptions) {
        this.token = options.token

        this.bot = new TelegramBot(this.token, {polling: true});

        console.log("tg bot has been started");

        this.bot.onText(/\/start/, async (msg, match) => {

            const chatId = msg.chat.id;

            this.bot.sendMessage(chatId, `Send verify token`);
        });

        this.bot.onText(/\/verify/, async (msg, match) => {

            const chatId = msg.chat.id;

            const text = String(msg.text);

            const args: string[] = text?.split(" ");

            const token: string | undefined = args[1];

            if(token == undefined) {
                this.bot.sendMessage(chatId, `/verify <token>`);
            } else {
                this.bot.sendMessage(chatId, `in process..`);

                const result = await userController.verifyAccount(token,String(msg.chat.id))
                console.log(result)
            }
        });
    }

}

export {
    TgBot
}