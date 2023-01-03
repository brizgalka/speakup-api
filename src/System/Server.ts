import {Application, Express, NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import cors from "cors"
import {PrismaClient} from "@prisma/client"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"

interface ServerInterface {
    port: number,
    app: Application,
    router: Express,
    prisma: PrismaClient,
    cookieSecret: string
}

interface ServerOptionsInterface {
    port: number,
    app: Application,
    router: Express,
    prisma: PrismaClient,
    cookieSecret: string,
}

const CorsOrigin = process.env.CORS_ORIGIN

class Server implements ServerInterface {

    readonly port: number;
    readonly app: Application;
    readonly router: Express;
    readonly prisma: PrismaClient;
    readonly cookieSecret: string;

    constructor(options: ServerOptionsInterface) {
        this.port = options.port
        this.app = options.app
        this.router = options.router
        this.prisma = options.prisma
        this.cookieSecret = options.cookieSecret

        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

        this.app.use(cors(
            {
                origin: CorsOrigin,
                methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
                preflightContinue: false,
                credentials:true,
                optionsSuccessStatus: 204
            }
        ))

        this.app.use(bodyParser.urlencoded());
        this.app.use(bodyParser.json());
        this.app.use(cookieParser(this.cookieSecret))

        this.app.use("/api",this.router);

        this.app.listen(this.port,() => {
            console.log(`server started on port ${this.port}`)
        })
    }

}

export {
    Server
}