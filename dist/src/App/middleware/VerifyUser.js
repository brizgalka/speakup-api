"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Context_1 = require("@/System/Context");
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
function verifyUser(req, res, next) {
    const uuid = req.body.uuid;
    if (uuid == undefined) {
        return next(ApiError_1.default.badRequest("Invalid UUID. Try again").response);
    }
    if (Context_1.ApplicationContext.wss.verifyUUID(uuid)) {
        next();
    }
    else {
        return next(ApiError_1.default.badRequest("Invalid UUID. Try again").response);
    }
}
exports.default = verifyUser;
//# sourceMappingURL=VerifyUser.js.map