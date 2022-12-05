import {WebSocket, WebSocketServer} from "ws";
import User from "@/App/ControllerModel/User";
import {WsUser,UserStatus} from "@/App/ControllerModel/WsUser";

interface WsServerInterface {
    WEBSOCKET_PORT: number,
    WEBSOCKET_SERVER: WebSocketServer,
    connections: Map<WebSocket,WsUser>
}

interface WsOptionsInterface {
    WEBSOCKET_PORT: number
}

class WsServer implements WsServerInterface {

    readonly WEBSOCKET_PORT: number;
    readonly WEBSOCKET_SERVER: WebSocketServer;
    connections = new Map<WebSocket,WsUser>();

    constructor(options: WsOptionsInterface) {
        this.WEBSOCKET_PORT = options.WEBSOCKET_PORT
        this.WEBSOCKET_SERVER = new WebSocketServer({
            port: options.WEBSOCKET_PORT
        },() => {
            console.log(`websocket server started on port ${this.WEBSOCKET_PORT}`)
        })
        this.WEBSOCKET_SERVER.on("connection",(ws: WebSocket) => this.onConnection(ws))
    }

    onConnection(ws: WebSocket) {
        ws.on("message",(msg: string) => this.onMessage(msg))
        const wsUser: WsUser = {
            status: UserStatus.VERIFICATION,
            user: {
                username: "AWD"
            }
        }
        this.connections.set(ws,wsUser)
    }

    onMessage(msg: string) {
        const message = JSON.parse(msg.toString())
        console.log(message);
    }

    onClose(ws: WebSocket) {
        const user: User = {nickname: "text",username: "wwda",password: "AW"};
        this.connections.delete(ws);
    }
}

export {
    WsServer,
}