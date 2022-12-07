"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationContext = void 0;
class ApplicationContext {
    static redis;
    static wss;
    static server;
    static servername;
    static mode;
    static tgBot;
    static prisma;
    constructor(options) {
        ApplicationContext.redis = options.redis;
        ApplicationContext.wss = options.wss;
        ApplicationContext.server = options.server;
        ApplicationContext.prisma = options.prisma;
        ApplicationContext.tgBot = options.tgBot;
        ApplicationContext.servername = options.config.servername;
        ApplicationContext.mode = options.config.mode;
        console.log(`
            Server context: 
            REDIS: ${ApplicationContext.redis != undefined} 
            EXPRESS: ${ApplicationContext.server != undefined} 
            WSS: ${ApplicationContext.wss != undefined}
            PRISMA ${ApplicationContext.prisma != undefined}
            TGBOT ${ApplicationContext.tgBot != undefined}
        `);
    }
}
exports.ApplicationContext = ApplicationContext;
//# sourceMappingURL=Context.js.map