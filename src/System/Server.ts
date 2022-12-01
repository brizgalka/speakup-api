import {Application, Express, RouterOptions} from "express";
import bodyParser from "body-parser";
import cors from "cors"
import Router from "express"

interface ServerInterface {
    port: number,
    app: Application,
    router: Express
}

interface ServerOptionsInterface {
    port: number,
    app: Application,
    router: Express,
}


class Server implements ServerInterface {

    readonly port: number;
    readonly app: Application;
    readonly router: Express;

    constructor(options: ServerOptionsInterface) {
        this.port = options.port
        this.app = options.app
        this.router = options.router

        this.app.use(this.router)

        this.app.use(bodyParser.urlencoded());
        this.app.use(bodyParser.json());
        this.app.use(cors())

        this.app.listen(this.port,() => {
            console.log(`server started on port ${this.port}`)
        })
    }

}

export {
    Server
}