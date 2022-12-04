import {Application, Express} from "express";
import bodyParser from "body-parser";
import cors from "cors"
import {PrismaClient} from "@prisma/client"
import cookieParser from "cookie-parser"

interface ServerInterface {
    port: number,
    app: Application,
    router: Express,
    prisma: PrismaClient
}

interface ServerOptionsInterface {
    port: number,
    app: Application,
    router: Express,
    prisma: PrismaClient,
}

class Server implements ServerInterface {

    readonly port: number;
    readonly app: Application;
    readonly router: Express;
    readonly prisma: PrismaClient;

    constructor(options: ServerOptionsInterface) {
        this.port = options.port
        this.app = options.app
        this.router = options.router
        this.prisma = options.prisma

        this.app.use(cors())

        this.app.use(bodyParser.urlencoded());
        this.app.use(bodyParser.json());
        this.app.use(cookieParser())

        this.app.use(this.router)

        this.app.listen(this.port,() => {
            console.log(`server started on port ${this.port}`)
        })
    }

}

export {
    Server
}