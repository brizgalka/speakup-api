import moduleAlias from "module-alias";
moduleAlias.addAlias("@",__dirname);
moduleAlias()

import express from "express"
import { RedisServer } from "@/System/RedisServer"
import {Server} from "@/System/Server";

import {WsServer} from "@/System/WsServer";
import router from "@/Router/router";
import {ApplicationContext} from "@/System/Context";
import { PrismaClient } from '@prisma/client'

const SERVER_PORT = Number(process.env.SERVER_PORT);
const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT);
const REDIS_URL = String(process.env.REDIS_URL);

let AppContext: ApplicationContext;

async function startup() {

    const app = express()

    const wsServer: WsServer = new WsServer({
        WEBSOCKET_PORT
    })

    const server: Server = new Server({
        port: SERVER_PORT,
        app,
        router
    })

    const redisServer: RedisServer = new RedisServer({
        urlConnection: REDIS_URL
    })

    const prisma = new PrismaClient()

    AppContext = new ApplicationContext({
        redis: redisServer || undefined,
        server: server || undefined,
        wss: wsServer || undefined,
        prisma: prisma || undefined,
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