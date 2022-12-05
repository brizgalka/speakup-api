"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError {
    status;
    response;
    constructor(status, response) {
        this.status = status;
        this.response = response;
    }
    static badRequest(message) {
        return new ApiError(404, message);
    }
    static internal(message) {
        return new ApiError(500, message);
    }
    static forbidden(message) {
        return new ApiError(403, message);
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map