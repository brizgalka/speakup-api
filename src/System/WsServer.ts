import {WebSocket, WebSocketServer} from "ws";
import User from "@/App/ControllerModel/User";

interface WsServerInterface {
    WEBSOCKET_PORT: number,
    WEBSOCKET_SERVER: WebSocketServer,
    connections: Map<User,WebSocket>
}

interface WsOptionsInterface {
    WEBSOCKET_PORT: number
}

class WsServer implements WsServerInterface {

    readonly WEBSOCKET_PORT: number;
    readonly WEBSOCKET_SERVER: WebSocketServer;
    connections = new Map<User,WebSocket>();

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
        const user: User = {nickname: "text",username: "wwda",password: "AW"};
        this.connections.set(user,ws)
    }

    onMessage(msg: string) {
        console.log(msg)
    }

    onClose(ws: WebSocket) {
        const user: User = {nickname: "text",username: "wwda",password: "AW"};
        this.connections.delete(user);
    }
}

export {
    WsServer,
}