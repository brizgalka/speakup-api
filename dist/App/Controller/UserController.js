"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
const client_1 = require("@prisma/client");
const AuthController_1 = __importDefault(require("@/App/Controller/AuthController"));
const modelResponse_1 = __importDefault(require("@/App/model/modelResponse"));
const UserModel_1 = __importDefault(require("@/App/model/UserModel"));
const prisma = new client_1.PrismaClient();
const saltRounds = Number(process.env.saltRounds);
const authController = new AuthController_1.default();
const userModel = new UserModel_1.default();
class UserController {
    async sendMessage(req, res, next) {
        console.log("adwawd");
    }
    async deleteMessage(req, res, next) {
    }
    async getUserData(req, res, next) {
        try {
            if (req.body == undefined)
                return new ApiError_1.default(res, 400, "Invalid body");
            const token = req.cookies['token'];
            const user = await authController.getUser(token);
            if (!user)
                return next(res.sendStatus(401));
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
    async changePhoto(req, res, next) {
        try {
            if (req.body == undefined)
                return new ApiError_1.default(res, 400, "Invalid body");
            if (!req.files)
                return new ApiError_1.default(res, 400, "Invalid UUID");
            let file = req.files.file;
            if (!file)
                return new ApiError_1.default(res, 400, "Invalid File");
            const token = req.cookies['token'];
            if (Array.isArray(file)) {
                file = file[0];
            }
            const result = await userModel.changePhoto(token, file);
            modelResponse_1.default.responseRequest(res, result);
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
    async changeBio(req, res, next) {
        try {
            if (req.body == undefined)
                return new ApiError_1.default(res, 400, "Invalid body");
            const token = req.cookies['token'];
            const { bio } = req.body;
            if (!bio)
                return new ApiError_1.default(res, 400, "Invalid Bio");
            if (!token)
                return new ApiError_1.default(res, 401, "Invalid Token");
            const result = await userModel.changeBio(token, bio);
            modelResponse_1.default.responseRequest(res, result);
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map