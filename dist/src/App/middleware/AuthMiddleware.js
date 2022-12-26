"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = __importDefault(require("@/App/Controller/AuthController"));
const authController = new AuthController_1.default();
async function AuthMiddleware(req, res, next) {
    const token = req.cookies["token"];
    if (token == undefined) {
        return res.sendStatus(401);
    }
    const user = await authController.getUser(token);
    if (user != null) {
        next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map