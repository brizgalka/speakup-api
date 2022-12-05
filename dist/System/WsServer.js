"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsServer = void 0;
const ws_1 = require("ws");
class WsServer {
    WEBSOCKET_PORT;
    WEBSOCKET_SERVER;
    connections = new Map();
    constructor(options) {
        this.WEBSOCKET_PORT = options.WEBSOCKET_PORT;
        this.WEBSOCKET_SERVER = new ws_1.WebSocketServer({
            port: options.WEBSOCKET_PORT
        }, () => {
            console.log(`websocket server started on port ${this.WEBSOCKET_PORT}`);
        });
        this.WEBSOCKET_SERVER.on("connection", (ws) => this.onConnection(ws));
    }
    onConnection(ws) {
        ws.on("message", (msg) => this.onMessage(msg));
        const user = { nickname: "text", username: "wwda", password: "AW" };
        this.connections.set(ws, {
            status: "wda",
            user: undefined
        });
    }
    onMessage(msg) {
        console.log(msg);
    }
    onClose(ws) {
        const user = { nickname: "text", username: "wwda", password: "AW" };
        this.connections.delete(ws);
    }
}
exports.WsServer = WsServer;
//# sourceMappingURL=WsServer.js.map