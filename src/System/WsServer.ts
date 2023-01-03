import {WebSocket, WebSocketServer} from "ws";
import {WsUser,UserStatus} from "@/App/ControllerModel/WsUser";
import { v4 as uuidv4 } from 'uuid';
import AuthController from "@/App/Controller/AuthController";

interface WsServerInterface {
    WEBSOCKET_PORT: number,
    WEBSOCKET_SERVER: WebSocketServer,
    connections: Map<WebSocket,WsUser>
    MAX_WSCONNECTION_PINGING: number,
    id_connection: number
}

interface WsOptionsInterface {
    WEBSOCKET_PORT: number
    MAX_WSCONNECTION_PINGING: number
}

const authController = new AuthController()

class WsServer implements WsServerInterface {

    readonly WEBSOCKET_PORT: number;
    readonly WEBSOCKET_SERVER: WebSocketServer;
    readonly MAX_WSCONNECTION_PINGING: number;
    id_connection: number;

    connections = new Map<WebSocket,WsUser>();

    constructor(options: WsOptionsInterface) {
        this.WEBSOCKET_PORT = options.WEBSOCKET_PORT
        this.MAX_WSCONNECTION_PINGING = options.MAX_WSCONNECTION_PINGING
        this.WEBSOCKET_SERVER = new WebSocketServer({
            port: options.WEBSOCKET_PORT
        },() => {
            console.log(`websocket server started on port ${this.WEBSOCKET_PORT}`)
        })

        this.WEBSOCKET_SERVER.on("connection",(ws: WebSocket) => this.onConnection(ws))
        this.WEBSOCKET_SERVER.on('open', (ws: WebSocket) => this.onOpen(ws))

        this.id_connection = 0

        const interval1 = setInterval(() => {
            for (const connection of this.connections.entries()) {
                const ws_connection = connection[0]
                const ws_user = connection[1]
                console.log(ws_user)
                ws_connection.ping()
                if(Date.now() - ws_user.lastPing > this.MAX_WSCONNECTION_PINGING) {
                    this.connections.delete((ws_connection))
                }
            }
        },1500)
    }

    onOpen(ws: WebSocket) {
        ws.send("hello");
    }

    sendMessage(uuid: string,message: object) {
        if(this.verifyUUID(uuid)) {
            for (const connection of this.connections.entries()) {
                const ws_connection = connection[0]
                const ws_user = connection[1]
                if (ws_user.uuid == uuid) {
                    ws_connection.send(JSON.stringify(message))
                }
            }
        }
    }

    onConnection(ws: WebSocket) {
        let found = this.verifyUUID(ws.protocol);
        if(found) {
            for (const connection of this.connections.entries()) {
                const ws_connection = connection[0]
                const ws_user = connection[1]
                console.log("reconnected")
                ws_user.user.username = null
                if (ws_user.uuid == ws.protocol) {
                    this.connections.set(ws,ws_user)
                    found = true;
                }
            }
        } else {
            const uuid = uuidv4();
            const wsUser: WsUser = {
                id: this.id_connection,
                status: UserStatus.VERIFICATION,
                lastPing: Date.now(),
                uuid,
                user: {
                    username: null,
                },
            }
            ws.send(JSON.stringify({
                "setWsUUID": uuid
            }))
            this.id_connection += 1
            this.connections.set(ws, wsUser)
        }
        ws.on("message",(data: Buffer) => this.onMessage(data,ws))
    }
    verifyUUID(uuid: string) {
        for (const connection of this.connections.entries()) {
            const ws_connection = connection[0]
            const ws_user = connection[1]
            if (ws_user.uuid == uuid) {
                return true;
            }
        }
        return false;
    }

    async onMessage(data: Buffer,ws: WebSocket) {
        const msg = data.toString()
        const message = JSON.parse(msg)

        switch(message["message"]) {
            case "heartbeat": {
                const ws_user = this.connections.get(ws);
                if (ws_user != undefined) {
                    ws_user.lastPing = Date.now();
                    this.connections.set(ws, ws_user)
                }
                const uuid_token = message["uuid"];
                if(!this.verifyUUID(uuid_token)) {
                    ws.close()
                }
                break;
            }
            case "isAuth": {
                const ws_user = this.connections.get(ws);
                if(ws_user != undefined) {
                    if (ws_user.user.username != undefined && ws_user.user.username != null) {
                        ws.send(JSON.stringify({
                            "message": "auth"
                        }))
                    } else {
                        ws.send(JSON.stringify({
                            "message": "notAuth"
                        }))
                    }
                }
                break
            }
            case "authConnection": {
                const ws_user = this.connections.get(ws);
                const token = message["data"]["token"];

                const user = await authController.getUser(token)

                if (ws_user != undefined) {
                    if (user) {
                        const username = user.username;
                        this.connections.set(ws, {
                            ...ws_user,user: {username}
                        })
                    }
                }
                break
            }
            case "sendMessage": {
                this.sendMessage(message["uuid"],{"message":"hello"})
                break;
            }
            default: {
                break
            }
        }
    }
}

export {
    WsServer,
}