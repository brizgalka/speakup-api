import moduleAlias from "module-alias";
moduleAlias.addAlias("@",__dirname);
moduleAlias()

import express from "express"
import { RedisServer } from "@/System/RedisServer"
import { PrismaClient } from '@prisma/client'

import {Server} from "@/System/Server";
import {WsServer} from "@/System/WsServer";
import router from "@/Router/router";
import {ApplicationContext} from "@/System/Context";
import {TgBot} from "@/System/TgBot";

const SERVER_PORT = Number(process.env.SERVER_PORT);
const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT);
const REDIS_URL = String(process.env.REDIS_URL);
const TG_TOKEN = String(process.env.TG_TOKEN);

let AppContext: ApplicationContext;

async function startup() {

    const app = express()

    const wsServer: WsServer = new WsServer({
        WEBSOCKET_PORT
    })

    const prisma = new PrismaClient()

    prisma.user.create({
        data: {
            username: "DWaawd",
            nickname: "awdawd",
            email: "ADWwda"
        }
    })

    const server: Server = new Server({
        port: SERVER_PORT,
        app,
        router,
        prisma
    })

    const tgBot: TgBot = new TgBot({
        token: TG_TOKEN
    })

    const redisServer: RedisServer = new RedisServer({
        urlConnection: REDIS_URL
    });

    AppContext = new ApplicationContext({
        redis: redisServer || undefined,
        server: server || undefined,
        wss: wsServer || undefined,
        prisma: prisma || undefined,
        tgBot: tgBot || undefined,
        config: {
            mode: "development",
            servername: "speak-up"
        }
    })
}

startup().then(r => {
    if(AppContext == undefined) {
        console.log('AppContext not found')
    } else {
        console.log("Application:API has been started")
    }
})

export {
    AppContext
}