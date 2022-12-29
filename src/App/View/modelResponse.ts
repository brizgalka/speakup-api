import {Response} from "express";
import ApiError from "@/App/error/ApiError";


class modelResponse {

    status: number;
    response: string | object | any;

    constructor(status: number, response: string | object | any) {
        this.status = status
        this.response = response
    }

    static responseRequest(res: Response,response: modelResponse | ApiError) {
        if(response instanceof  modelResponse) {
            res.status(response.status).send(response.response)
        } else {
            new ApiError(res,response.status,response.response)
        }
    }

}

export default modelResponse