"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
const client_1 = require("@prisma/client");
/*const generateJwt = (id: number, username: string): string => {
    return jwt.sign(
        {id, username},
        jwt.sign(),
        {
            expiresIn: '24h'
        }
    )
}*/
const prisma = new client_1.PrismaClient();
class UserController {
    async registration(req, res, next) {
        const { username, password, email } = req.body;
        if (!username)
            return next(ApiError_1.default.badRequest("Uncorrect username"));
        if (!password)
            return next(ApiError_1.default.badRequest("Uncorrect password"));
        if (!email)
            return next(ApiError_1.default.badRequest("Uncorrect email"));
        //const candidate = await prisma.users.findUnique({
        //    where: {
        //        username: username
        //    }
        //})
        res.send("ok");
    }
    async sendMessage(req, res, next) {
    }
    async verifyAccount(req, res, next) {
    }
    async deleteMessage(req, res, next) {
    }
    async changeProfile(req, res, next) {
    }
    async login(req, res, next) {
    }
    async checkToken(req, res, next) {
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map