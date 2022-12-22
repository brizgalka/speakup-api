"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsServer = void 0;
const ws_1 = require("ws");
const WsUser_1 = require("@/App/ControllerModel/WsUser");
const uuid_1 = require("uuid");
class WsServer {
    WEBSOCKET_PORT;
    WEBSOCKET_SERVER;
    MAX_WSCONNECTION_PINGING;
    id_connection;
    connections = new Map();
    constructor(options) {
        this.WEBSOCKET_PORT = options.WEBSOCKET_PORT;
        this.MAX_WSCONNECTION_PINGING = options.MAX_WSCONNECTION_PINGING;
        this.WEBSOCKET_SERVER = new ws_1.WebSocketServer({
            port: options.WEBSOCKET_PORT
        }, () => {
            console.log(`websocket server started on port ${this.WEBSOCKET_PORT}`);
        });
        this.WEBSOCKET_SERVER.on("connection", (ws) => this.onConnection(ws));
        this.WEBSOCKET_SERVER.on('open', (ws) => this.onOpen(ws));
        this.id_connection = 0;
        const interval = setInterval(() => {
            for (const connection of this.connections.entries()) {
                const ws_connection = connection[0];
                const ws_user = connection[1];
                ws_connection.ping();
                if (Date.now() - ws_user.lastPing > this.MAX_WSCONNECTION_PINGING) {
                    this.connections.delete((ws_connection));
                }
            }
        }, 1500);
    }
    onOpen(ws) {
        ws.send("hello");
    }
    sendMessage(uuid, message) {
        if (this.verifyUUID(uuid)) {
            for (const connection of this.connections.entries()) {
                const ws_connection = connection[0];
                const ws_user = connection[1];
                if (ws_user.uuid == uuid) {
                    ws_connection.send(JSON.stringify(message));
                }
            }
        }
    }
    onConnection(ws) {
        let found = this.verifyUUID(ws.protocol);
        if (found) {
            for (const connection of this.connections.entries()) {
                const ws_connection = connection[0];
                const ws_user = connection[1];
                if (ws_user.uuid == ws.protocol) {
                    this.connections.set(ws_connection, ws_user);
                    found = true;
                }
            }
        }
        else {
            const uuid = (0, uuid_1.v4)();
            const wsUser = {
                id: this.id_connection,
                status: WsUser_1.UserStatus.VERIFICATION,
                lastPing: Date.now(),
                uuid,
                user: {
                    username: "AWD",
                }
            };
            ws.send(JSON.stringify({
                "setWsUUID": uuid
            }));
            this.id_connection += 1;
            this.connections.set(ws, wsUser);
        }
        console.log(`connections: ${this.connections.size}`);
        ws.on("message", (data) => this.onMessage(data, ws));
    }
    verifyUUID(uuid) {
        for (const connection of this.connections.entries()) {
            const ws_connection = connection[0];
            const ws_user = connection[1];
            if (ws_user.uuid == uuid) {
                return true;
            }
        }
        return false;
    }
    onMessage(data, ws) {
        const msg = data.toString();
        const message = JSON.parse(msg);
        switch (message["message"]) {
            case "heartbeat": {
                const ws_user = this.connections.get(ws);
                if (ws_user != undefined) {
                    ws_user.lastPing = Date.now();
                    this.connections.set(ws, ws_user);
                }
                const uuid_token = message["uuid"];
                if (!this.verifyUUID(uuid_token)) {
                    ws.close();
                }
                break;
            }
            case "sendMessage": {
                this.sendMessage(message["uuid"], { "message": "hello" });
                break;
            }
            default: {
                break;
            }
        }
    }
}
exports.WsServer = WsServer;
//# sourceMappingURL=WsServer.js.map