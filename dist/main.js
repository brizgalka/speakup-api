"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContext = void 0;
const module_alias_1 = __importDefault(require("module-alias"));
module_alias_1.default.addAlias("@", __dirname);
(0, module_alias_1.default)();
const express_1 = __importDefault(require("express"));
const RedisServer_1 = require("@/System/RedisServer");
const Server_1 = require("@/System/Server");
const WsServer_1 = require("@/System/WsServer");
const router_1 = __importDefault(require("@/Router/router"));
const Context_1 = require("@/System/Context");
const SERVER_PORT = Number(process.env.SERVER_PORT);
const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT);
const REDIS_URL = String(process.env.REDIS_URL);
const client_1 = require("@prisma/client");
let AppContext;
exports.AppContext = AppContext;
async function startup() {
    const app = (0, express_1.default)();
    const wsServer = new WsServer_1.WsServer({
        WEBSOCKET_PORT
    });
    const prisma = new client_1.PrismaClient();
    const user = await prisma.user.create({
        data: {
            username: "DWaawd",
            nickname: "awdawd",
            email: "ADWwda"
        }
    });
    console.log(user);
    const server = new Server_1.Server({
        port: SERVER_PORT,
        app,
        router: router_1.default,
        prisma
    });
    const redisServer = new RedisServer_1.RedisServer({
        urlConnection: REDIS_URL
    });
    exports.AppContext = AppContext = new Context_1.ApplicationContext({
        redis: redisServer || undefined,
        server: server || undefined,
        wss: wsServer || undefined,
        prisma: prisma || undefined,
        config: {
            mode: "development",
            servername: "speak-up"
        }
    });
}
startup().then(r => {
    if (AppContext == undefined) {
        console.log('AppContext not found');
    }
    else {
        console.log("Application:API has been started");
    }
});
//# sourceMappingURL=main.js.map