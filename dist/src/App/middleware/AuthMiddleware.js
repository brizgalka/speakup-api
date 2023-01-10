"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = __importDefault(require("@/App/Controller/AuthController"));
const jsonwebtoken_1 = require("jsonwebtoken");
const authController = new AuthController_1.default();
async function AuthMiddleware(req, res, next) {
    try {
        const token = req.cookies["token"];
        if (token == undefined) {
            return res.sendStatus(401);
        }
        let user = null;
        user = await authController.getUser(token);
        if (user != null) {
            next();
        }
        else {
            res.clearCookie("token");
            res.sendStatus(401);
        }
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.clearCookie("token");
            res.sendStatus(401);
        }
        else {
            res.clearCookie("token");
            res.sendStatus(500);
        }
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map