import moduleAlias from "module-alias";
moduleAlias.addAlias("@",__dirname);
moduleAlias()

import User from "./App/ControllerModel/User";
import express from "express"
import cors from "cors"
import router from "@/Router/router";
import bodyParser from "body-parser";

import {WebSocketServer,WebSocket} from "ws"
import { PrismaClient } from '@prisma/client'
import {WsServer} from "@/System/WsServer";

const SERVER_PORT = Number(process.env.SERVER_PORT);
const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT);

async function startup() {

    const app = express()
    const wsServer: WsServer = new WsServer({
        WEBSOCKET_PORT
    })

    app.use(bodyParser())
    app.use(cors())

    app.use(router);

    app.listen(SERVER_PORT,() => {
        console.log(`server started on port ${SERVER_PORT}`)
    })

}

startup()