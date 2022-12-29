import {Response} from "express";

class ApiError  {

    status: number;
    response?: string | object;

    constructor(res: Response | undefined, status: number, response?: string | object) {
        this.status = status
        this.response = response
        if(res != undefined) {
            res.status(status).send(response)
        }
    }

}

export default ApiError