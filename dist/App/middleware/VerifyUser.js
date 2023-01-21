"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Context_1 = require("@/System/Context");
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
function verifyUser(req, res, next) {
    const uuid = req.body.uuid;
    console.log(uuid);
    if (uuid == undefined) {
        return new ApiError_1.default(res, 400, "Invalid UUID. Try again");
    }
    if (Context_1.ApplicationContext.wss.verifyUUID(uuid)) {
        next();
    }
    else {
        return new ApiError_1.default(res, 400, "Invalid UUID. Try again");
    }
}
exports.default = verifyUser;
//# sourceMappingURL=VerifyUser.js.map