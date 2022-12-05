"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationContext = void 0;
class ApplicationContext {
    redis;
    wss;
    server;
    servername;
    mode;
    tgBot;
    prisma;
    constructor(options) {
        this.redis = options.redis;
        this.wss = options.wss;
        this.server = options.server;
        this.prisma = options.prisma;
        this.tgBot = options.tgBot;
        this.servername = options.config.servername;
        this.mode = options.config.mode;
        console.log(`
            Server context: 
            REDIS: ${this.redis != undefined} 
            EXPRESS: ${this.server != undefined} 
            WSS: ${this.wss != undefined}
            PRISMA ${this.prisma != undefined}
            TGBOT ${this.tgBot != undefined}
        `);
    }
}
exports.ApplicationContext = ApplicationContext;
//# sourceMappingURL=Context.js.map