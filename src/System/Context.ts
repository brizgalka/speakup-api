import {Server} from "@/System/Server";
import {WsServer} from "@/System/WsServer";
import {RedisServer} from "@/System/RedisServer";
import {PrismaClient} from "@prisma/client";

interface ApplicationContextOptionsInterface {
    redis: RedisServer,
    wss: WsServer,
    server: Server,
    prisma: PrismaClient,
    config: {
        servername: string,
        mode: string
    }
}

interface ApplicationContextInterface {
    servername: string,
    mode: string
    redis: RedisServer,
    wss: WsServer,
    server: Server,
    prisma: PrismaClient
}

class ApplicationContext implements ApplicationContextInterface{

    readonly redis: RedisServer;
    readonly wss: WsServer;
    readonly server: Server;
    readonly servername: string;
    readonly mode: string;
    readonly prisma: PrismaClient;

    constructor(options: ApplicationContextOptionsInterface) {
        this.redis = options.redis;
        this.wss = options.wss;
        this.server = options.server;
        this.prisma = options.prisma
        this.servername = options.config.servername;
        this.mode = options.config.mode

        console.log(`
            Server context: 
            REDIS: ${this.redis != undefined} 
            EXPRESS: ${this.server != undefined} 
            WSS: ${this.wss != undefined}
            PRISMA ${this.prisma != undefined}
        `)
    }
}

export {
    ApplicationContext
}
