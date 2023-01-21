"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
function isSetCookie(obj) {
    return 'set' in obj;
}
class modelResponse {
    status;
    response;
    cookie;
    constructor(status, response, cookie) {
        this.status = status;
        this.response = response;
        this.cookie = cookie;
    }
    static responseRequest(res, response) {
        if (response instanceof modelResponse) {
            if (response.cookie != undefined) {
                if (isSetCookie(response.cookie)) {
                    res.cookie(response.cookie.set.name, response.cookie.set.value, response.cookie.set.options);
                }
                else {
                    for (let i = 0; i < response.cookie.clear.length; i++) {
                        res.clearCookie(response.cookie.clear[i]);
                    }
                }
            }
            if (response.response != undefined) {
                console.log("отвечаем");
                res.status(response.status).send(response.response);
            }
            else {
                res.sendStatus(response.status);
            }
        }
        else {
            if (response.response) {
                new ApiError_1.default(res, response.status, response.response);
            }
            else {
                new ApiError_1.default(res, response.status);
            }
        }
    }
}
exports.default = modelResponse;
//# sourceMappingURL=modelResponse.js.map