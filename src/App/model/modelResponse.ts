import {CookieOptions, Response} from "express";
import ApiError from "@/App/error/ApiError";

interface modelCookie {
    name: string;
    value: string;
    options: CookieOptions;
}

interface setCookie {
    set: modelCookie;
}

interface clearCookie {
    clear: string[];
}

function isSetCookie(obj: any): obj is setCookie {
    return 'set' in obj
}

class modelResponse {

    status: number;
    response: string | object | any;
    cookie: setCookie | clearCookie | undefined;

    constructor(status: number, response?: string | object | any, cookie?: setCookie | clearCookie | undefined) {
        this.status = status
        this.response = response
        this.cookie = cookie
    }

    static responseRequest(res: Response,response: modelResponse | ApiError) {
        if(response instanceof modelResponse) {
            if(response.cookie != undefined) {
                if(isSetCookie(response.cookie)) {
                    res.cookie(response.cookie.set.name,response.cookie.set.value,response.cookie.set.options)
                } else {
                    for(let i = 0;i < response.cookie.clear.length;i++) {
                        res.clearCookie(response.cookie.clear[i])
                    }
                }
            }
            if(response.response != undefined) {
                console.log("отвечаем")
                res.status(response.status).send(response.response)
            } else {
                res.sendStatus(response.status)
            }
        } else {
            if(response.response) {
                new ApiError(res,response.status,response.response)
            } else {
                new ApiError(res,response.status)
            }
        }
    }
}

export default modelResponse