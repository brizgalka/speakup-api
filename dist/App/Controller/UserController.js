"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const saltRounds = Number(process.env.saltRounds);
class UserController {
    async sendMessage(req, res, next) {
    }
    async deleteMessage(req, res, next) {
    }
    async changeProfile(req, res, next) {
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map