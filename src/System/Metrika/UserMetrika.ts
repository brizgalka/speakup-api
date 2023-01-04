import {NextFunction} from "express";

import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()

async function metrikaMiddleware(req: Request, next: NextFunction) {

    // @ts-ignore
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    await prisma.visit.create({
        data: {
            visitAt: new Date(),
            ip: ip.toString(),
            method: req.method.toString()
        }
    });

    next()
}

export default metrikaMiddleware