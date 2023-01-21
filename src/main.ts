import moduleAlias from "module-alias";
import * as dotenv from 'dotenv'
dotenv.config()
dotenv.config({ path: '.env.tg' })
dotenv.config({ path: '.env.dev' })

moduleAlias.addAlias("@",__dirname);
moduleAlias()

import express, {Express} from "express"
import { RedisServer } from "@/System/RedisServer"
import { PrismaClient } from '@prisma/client'

import {Server} from "@/System/Server";
import {WsServer} from "@/System/WsServer";
import router from "@/Router/router";
import {ApplicationContext} from "@/System/Context";
import {TgBot} from "@/System/TgBot";
import telegramView from "@/App/View/telegramView";

const mode = String(process.env.mode)

console.log(process.env.NODE_ENV)

let AppContext: ApplicationContext;
let webApplication: Express;

async function startup() {

    webApplication = express();
    const prisma = new PrismaClient() || undefined;

    const wsServer: WsServer = await new WsServer({
        WEBSOCKET_PORT,
        MAX_WSCONNECTION_PINGING
    });

    const oldWarn = console.warn;
    console.warn = (text: string) => {
        oldWarn(text);
        console.log("NEW ERROR LOG")
    }

    console.log(wsServer)

    const server: Server = await new Server({
        port: SERVER_PORT,
        app: webApplication,
        router,
        prisma,
        cookieSecret: COOKIE_SECRET
    })

    const tgBot: TgBot = await new TgBot({
        token: TG_TOKEN
    })

    const redisServer: RedisServer = await new RedisServer({
        urlConnection: REDIS_URL
    })

    AppContext = new ApplicationContext({
        redis: redisServer,
        server,
        wss: wsServer,
        prisma,
        tgBot,
        config: {
            mode,
            servername: "speak-up"
        }
    })
}

startup().then(r => {
    if(AppContext == undefined) {
        console.log('AppContext not found');
    } else {
        console.log("Application:API has been started");
    }
})

export {
    webApplication,
    ApplicationContext
}