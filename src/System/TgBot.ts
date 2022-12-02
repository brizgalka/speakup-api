import TelegramBot from 'node-telegram-bot-api'

interface TgBotInterface {
    token: string,
    bot: TelegramBot
}

interface TgBotOptions {
    token: string
}

class TgBot implements TgBotInterface {

    readonly token: string;
    readonly bot: TelegramBot;

    constructor(options: TgBotOptions) {
        this.token = options.token

        this.bot = new TelegramBot(this.token, {polling: true});

        console.log("tg bot has been started");

        this.bot.onText(/\/start/, (msg, match) => {

            const chatId = msg.chat.id;

            this.bot.sendMessage(chatId, `Uncaught ReferenceError: userId is not defined`);
        });
    }

}

export {
    TgBot
}