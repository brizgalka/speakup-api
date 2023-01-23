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

const mode = String(process.env.NODE_ENV)

if(mode == "PRODUCTION") {
    process.env.DATABASE_URL = process.env.PRODUCTION_DATABASE_URL
    process.env.REDIS_URL = process.env.PRODUCTION_REDIS_URL
} else {
    process.env.DATABASE_URL = process.env.DEVELOPMENT_DATABASE_URL
    process.env.REDIS_URL = process.env.DEVELOPMENT_REDIS_URL
}

const REDIS_URL = String(process.env.REDIS_URL)
const SERVER_PORT = Number(process.env.SERVER_PORT);
const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT);
const TG_TOKEN = String(process.env.TG_TOKEN);
const MAX_WSCONNECTION_PINGING = Number(process.env.MAX_WSCONNECTION_PINGING);
const COOKIE_SECRET = String(process.env.COOKIE_SECRET);

console.log(process.env.REDIS_URL)
console.log(process.env.DATABASE_URL)

let AppContext: ApplicationContext;
let webApplication: Express;

async function startup() {

    webApplication = express();
    const prisma = new PrismaClient() || undefined;

    const wsServer: WsServer = await new WsServer({
        WEBSOCKET_PORT,
        MAX_WSCONNECTION_PINGING
    });
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