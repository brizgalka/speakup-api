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
exports.ApplicationContext = exports.webApplication = void 0;
const module_alias_1 = __importDefault(require("module-alias"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
dotenv.config({ path: '.env.tg' });
module_alias_1.default.addAlias("@", __dirname);
(0, module_alias_1.default)();
const express_1 = __importDefault(require("express"));
const RedisServer_1 = require("@/System/RedisServer");
const client_1 = require("@prisma/client");
const Server_1 = require("@/System/Server");
const WsServer_1 = require("@/System/WsServer");
const router_1 = __importDefault(require("@/Router/router"));
const Context_1 = require("@/System/Context");
Object.defineProperty(exports, "ApplicationContext", { enumerable: true, get: function () { return Context_1.ApplicationContext; } });
const TgBot_1 = require("@/System/TgBot");
const SERVER_PORT = Number(process.env.SERVER_PORT);
const WEBSOCKET_PORT = Number(process.env.WEBSOCKET_PORT);
const REDIS_URL = String(process.env.REDIS_URL);
const TG_TOKEN = String(process.env.TG_TOKEN);
const MAX_WSCONNECTION_PINGING = Number(process.env.MAX_WSCONNECTION_PINGING);
const COOKIE_SECRET = String(process.env.COOKIE_SECRET);
const mode = String(process.env.MODE);
let AppContext;
let webApplication;
exports.webApplication = webApplication;
async function startup() {
    exports.webApplication = webApplication = (0, express_1.default)();
    const prisma = new client_1.PrismaClient() || undefined;
    const wsServer = await new WsServer_1.WsServer({
        WEBSOCKET_PORT,
        MAX_WSCONNECTION_PINGING
    });
    const oldWarn = console.warn;
    console.warn = (text) => {
        oldWarn(text);
        console.log("NEW ERROR LOG");
    };
    console.log(wsServer);
    const server = await new Server_1.Server({
        port: SERVER_PORT,
        app: webApplication,
        router: router_1.default,
        prisma,
        cookieSecret: COOKIE_SECRET
    });
    const tgBot = await new TgBot_1.TgBot({
        token: TG_TOKEN
    });
    const redisServer = await new RedisServer_1.RedisServer({
        urlConnection: REDIS_URL
    });
    AppContext = new Context_1.ApplicationContext({
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