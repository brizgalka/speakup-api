"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContext = void 0;
const module_alias_1 = __importDefault(require("module-alias"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
module_alias_1.default.addAlias("@", __dirname);
(0, module_alias_1.default)();
const express_1 = __importDefault(require("express"));
const RedisServer_1 = require("@/System/RedisServer");
const client_1 = require("@prisma/client");
const Server_1 = require("@/System/Server");
const WsServer_1 = require("@/System/WsServer");
const router_1 = __importDefault(require("@/Router/router"));
const Context_1 = require("@/System/Context");
const TgBot_1 = require("@/System/TgBot");
const SERVER_PORT = Number(process.env.SERVER_PORT);
const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT);
const REDIS_URL = String(process.env.REDIS_URL);
const TG_TOKEN = String(process.env.TG_TOKEN);
const MAX_WSCONNECTION_PINGING = Number(process.env.MAX_WSCONNECTION_PINGING);
const mode = String(process.env.MODE);
let AppContext;
exports.AppContext = AppContext;
async function startup() {
    const app = (0, express_1.default)();
    const prisma = new client_1.PrismaClient() || undefined;
    const wsServer = await new WsServer_1.WsServer({
        WEBSOCKET_PORT,
        MAX_WSCONNECTION_PINGING
    });
    const server = await new Server_1.Server({
        port: SERVER_PORT,
        app,
        router: router_1.default,
        prisma
    });
    const tgBot = await new TgBot_1.TgBot({
        token: TG_TOKEN
    });
    const redisServer = await new RedisServer_1.RedisServer({
        urlConnection: REDIS_URL
    });
    exports.AppContext = AppContext = new Context_1.ApplicationContext({
        redis: redisServer,
        server,
        wss: wsServer,
        prisma,
        tgBot,
        config: {
            mode,
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