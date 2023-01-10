import moduleAlias from "module-alias";
import * as dotenv from 'dotenv'
dotenv.config()
dotenv.config({ path: '.env.tg' })

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

const SERVER_PORT = Number(process.env.SERVER_PORT);
const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT);
const REDIS_URL = String(process.env.REDIS_URL);
const TG_TOKEN = String(process.env.TG_TOKEN);
const MAX_WSCONNECTION_PINGING = Number(process.env.MAX_WSCONNECTION_PINGING);
const COOKIE_SECRET = String(process.env.COOKIE_SECRET);

const mode = String(process.env.MODE);

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