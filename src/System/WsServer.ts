import {WebSocket, WebSocketServer} from "ws";
import User from "@/App/ControllerModel/User";
import {WsUser,UserStatus} from "@/App/ControllerModel/WsUser";
import { v4 as uuidv4 } from 'uuid';

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

        this.id_connection = 0;

        const interval = setInterval(() => {
            for (const connection of this.connections.entries()) {
                const ws_connection = connection[0]
                const ws_user = connection[1]
                if(Date.now() - ws_user.lastPing > this.MAX_WSCONNECTION_PINGING) {
                    this.connections.delete((ws_connection))
                }
                console.log(ws_user);
                console.log(Date.now() - ws_user.lastPing)
            }
            console.log(this.connections.size)
        },1500)
    }

    onOpen(ws: WebSocket) {
        ws.send("hello")
        console.log("on open")
    }
    sendMessage(uuid: string) {
        if(this.verifyUUID(uuid)) {
            for (const connection of this.connections.entries()) {
                const ws_connection = connection[0]
                const ws_user = connection[1]
                if (ws_user.uuid == uuid) {
                    ws_connection.send(JSON.stringify({
                        "message": "hello"
                    }))
                }
            }
        }
    }

    onConnection(ws: WebSocket) {
        console.log("new Connection")
        let found = this.verifyUUID(ws.protocol);
        console.log(found)
        if(found) {
            for (const connection of this.connections.entries()) {
                const ws_connection = connection[0]
                const ws_user = connection[1]
                if (ws_user.uuid == ws.protocol) {
                    this.connections.set(ws_connection,ws_user)
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
                    username: "AWD",
                }
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

    onMessage(data: Buffer,ws: WebSocket) {
        const msg = data.toString()
        const message = JSON.parse(data.toString())

        console.log(message)

        switch(message["message"]) {
            case "heartbeat": {
                console.log('heartbeat')
                const ws_user = this.connections.get(ws);
                if (ws_user != undefined) {
                    ws_user.lastPing = Date.now();
                    this.connections.set(ws, ws_user)
                }
                const uuid_token = message["uuid"];
                console.log(this.verifyUUID(uuid_token))
                if(!this.verifyUUID(uuid_token)) {
                    ws.close()
                }
                break;
            }
            case "sendMessage": {
                this.sendMessage(message["uuid"])
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