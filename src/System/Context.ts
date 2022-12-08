import {Server} from "@/System/Server";
import {WsServer} from "@/System/WsServer";
import {RedisServer} from "@/System/RedisServer";
import {PrismaClient} from "@prisma/client";
import {TgBot} from "@/System/TgBot";

interface ApplicationContextOptionsInterface {
    redis: RedisServer,
    wss: WsServer,
    server: Server,
    prisma: PrismaClient,
    tgBot: TgBot,
    config: {
        servername: string,
        mode: string
    }
}

class ApplicationContext {

    static redis: RedisServer;
    static wss: WsServer;
    static server: Server;
    static servername: string;
    static mode: string;
    static tgBot: TgBot;
    static prisma: PrismaClient;

    constructor(options: ApplicationContextOptionsInterface) {
        ApplicationContext.redis = options.redis;
        ApplicationContext.wss = options.wss;
        ApplicationContext.server = options.server;
        ApplicationContext.prisma = options.prisma
        ApplicationContext.tgBot = options.tgBot;

        ApplicationContext.servername = options.config.servername;
        ApplicationContext.mode = options.config.mode

        console.log(`
            Server context: 
            REDIS: ${ApplicationContext.redis != undefined} 
            EXPRESS: ${ApplicationContext.server != undefined} 
            WSS: ${ApplicationContext.wss != undefined}
            PRISMA ${ApplicationContext.prisma != undefined}
            TGBOT ${ApplicationContext.tgBot != undefined}
        `)
    }
}

export {
    ApplicationContext
}
