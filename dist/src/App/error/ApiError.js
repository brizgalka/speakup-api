"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSetCookie(obj) {
    return 'set' in obj;
}
class ApiError {
    status;
    response;
    cookie;
    constructor(res, status, response, cookie) {
        this.status = status;
        this.response = response;
        if (res != undefined) {
            if (cookie != undefined) {
                if (isSetCookie(cookie)) {
                    res.cookie(cookie.set.name, cookie.set.value, cookie.set.options);
                }
                else {
                    for (let i = 0; i < cookie.clear.length; i++) {
                        res.clearCookie(cookie.clear[i]);
                    }
                }
            }
            res.status(status).send(response);
        }
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map