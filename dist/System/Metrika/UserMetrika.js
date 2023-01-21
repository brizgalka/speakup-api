"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function metrikaMiddleware(req, next) {
    // @ts-ignore
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await prisma.visit.create({
        data: {
            visitAt: new Date(),
            ip: ip.toString(),
            method: req.method.toString()
        }
    });
    next();
}
exports.default = metrikaMiddleware;
//# sourceMappingURL=UserMetrika.js.map