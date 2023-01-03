import {CookieOptions, Response} from "express";

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

class ApiError  {

    status: number;
    response?: string | object;
    cookie?: setCookie | clearCookie | undefined;

    constructor(res: Response | undefined, status: number, response?: string | object, cookie?: setCookie | clearCookie | undefined) {
        this.status = status
        this.response = response
        if(res != undefined) {
            if(cookie != undefined) {
                if(isSetCookie(cookie)) {
                    res.cookie(cookie.set.name,cookie.set.value,cookie.set.options)
                } else {
                    for(let i = 0;i < cookie.clear.length;i++) {
                        res.clearCookie(cookie.clear[i])
                    }
                }
            }
            res.status(status).send(response)
        }
    }

}

export default ApiError