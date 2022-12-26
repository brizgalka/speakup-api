"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
const client_1 = require("@prisma/client");
const AuthController_1 = __importDefault(require("@/App/Controller/AuthController"));
const prisma = new client_1.PrismaClient();
const saltRounds = Number(process.env.saltRounds);
const authController = new AuthController_1.default();
class UserController {
    async sendMessage(req, res, next) {
        console.log("adwawd");
    }
    async deleteMessage(req, res, next) {
    }
    async getUserData(req, res, next) {
        try {
            if (req.body == undefined)
                return next(ApiError_1.default.badRequest("Invalid body").response);
            const token = req.cookies['token'];
            const user = await authController.getUser(token);
            res.json({
                "id": user.id,
                "username": user.username,
                "nickname": user.nickname,
                "photo": user.photo,
                "email": user.email,
                token
            });
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
    async changeProfile(req, res, next) {
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map