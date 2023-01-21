"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Context_1 = require("@/System/Context");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const AuthModel_1 = __importDefault(require("@/App/model/AuthModel"));
const modelResponse_1 = __importDefault(require("@/App/model/modelResponse"));
const saltRounds = Number(process.env.saltRounds);
const token_secret = String(process.env.JWT_SECRET);
const authModel = new AuthModel_1.default();
const jwtMaxAge = Number(process.env.jwtMaxAge);
class AuthController {
    async registration(req, res, next) {
        try {
            if (req.body == undefined)
                return next(new ApiError_1.default(res, 400, "Invalid Body"));
            const { username, password, email } = req.body;
            const user_uuid = req.body.uuid;
            if (!user_uuid)
                return new ApiError_1.default(res, 400, "Invalid UUID");
            if (!username)
                return new ApiError_1.default(res, 400, "Invalid username");
            if (!password)
                return new ApiError_1.default(res, 400, "Invalid password");
            if (!email)
                return new ApiError_1.default(res, 400, "Invalid email");
            if (!Context_1.ApplicationContext.wss.verifyUUID(user_uuid))
                return new ApiError_1.default(res, 400, "Invalid user_uuid");
            const result = await authModel.registration(username, password, email, user_uuid);
            modelResponse_1.default.responseRequest(res, result);
        }
        catch (e) {
            console.warn(e.toString());
            res.sendStatus(500);
        }
    }
    async validateVerifyToken(req, res, next) {
        try {
            if (req.body == undefined)
                return next(new ApiError_1.default(res, 400, ("Invalid body")));
            const { verifyToken } = req.body;
            if (!verifyToken)
                return next(new ApiError_1.default(res, 400, ("Invalid verifyToken")));
            const result = await Context_1.ApplicationContext.redis.get(verifyToken);
            if (result) {
                res.sendStatus(200);
            }
            else {
                res.sendStatus(500);
            }
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
    async verifyAccount(token, telegram) {
        try {
            const user_candidate = await prisma.user.findUnique({
                where: {
                    telegram
                }
            });
            if (user_candidate != null) {
                return "Аккаунт уже привязан";
            }
            const user_token = await prisma.verifyToken.findFirst({
                where: {
                    value: token
                }
            });
            if (user_token == null) {
                return "Неизвестный токен";
            }
            else {
                await prisma.user.create({
                    data: {
                        username: user_token.username,
                        email: user_token.email,
                        password: user_token.password,
                        salt: user_token.salt,
                        createdAt: new Date(),
                        telegram: telegram
                    }
                });
                await prisma.verifyToken.delete({
                    where: {
                        value: token
                    }
                });
                const user_uuid_connection = await Context_1.ApplicationContext.redis.get(token);
                console.log(user_uuid_connection);
                console.log(Context_1.ApplicationContext.wss);
                if (user_uuid_connection != null) {
                    if (Context_1.ApplicationContext.wss.verifyUUID(user_uuid_connection)) {
                        Context_1.ApplicationContext.wss.sendMessage(user_uuid_connection, {
                            "verify": {
                                "status": "ok",
                            }
                        });
                    }
                }
                await Context_1.ApplicationContext.redis.del(token);
                return "Аккаунт успешно создан и привязан к вашему телеграмм!";
            }
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
    async getUser(jwtoken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(jwtoken, token_secret);
            if (decoded != undefined) {
                const username = decoded.username;
                const user = await prisma.user.findFirst({
                    where: {
                        username
                    }
                });
                return user;
            }
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
    async forgotPassword(req, res, next) {
        try {
            if (req.body == undefined)
                return next(new ApiError_1.default(res, 400, ("Invalid body")));
            const { username } = req.body;
            const user_uuid = req.body.uuid;
            if (!username)
                return next(new ApiError_1.default(res, 400, ("Invalid username")));
            const user = await prisma.user.findFirst({
                where: {
                    username
                }
            });
            if (user == null) {
                return next(new ApiError_1.default(res, 400, ("Wrong username")));
            }
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const uuid1 = (0, uuid_1.v4)();
            const hash = bcrypt_1.default.hashSync(user_uuid, salt);
            const uuid2 = (0, uuid_1.v4)();
            const hash_id = (uuid1 + hash + uuid2).replace("/", ".");
            await Context_1.ApplicationContext.redis.set(hash_id, user.username);
            await Context_1.ApplicationContext.tgBot.bot.sendMessage(user.telegram, `hello, your reset link
                http://82.146.46.97:3000/auth/forgot-password/auth-new-password/${hash_id}
            `);
            res.send("Code sent to your telegram");
        }
        catch (e) {
            console.warn(e.toString());
            res.sendStatus(500);
        }
    }
    async validateHashId(req, res, next) {
        try {
            if (req.body == undefined)
                return next(new ApiError_1.default(res, 400, ("Invalid body")));
            const { hashId } = req.body;
            if (!hashId)
                return next(new ApiError_1.default(res, 400, ("Invalid hashId")));
            const result = await Context_1.ApplicationContext.redis.get(hashId);
            if (result) {
                res.sendStatus(200);
            }
            else {
                return next(new ApiError_1.default(res, 400, ("Invalid hashId")));
            }
        }
        catch (e) {
            console.warn(e.toString());
            res.sendStatus(500);
        }
    }
    async newPassword(req, res, next) {
        try {
            if (req.body == undefined)
                return next(new ApiError_1.default(res, 400, ("Invalid body")));
            const { newPassword, hashId } = req.body;
            if (!newPassword)
                return next(new ApiError_1.default(res, 400, ("Invalid newPassword")));
            if (!hashId)
                return next(new ApiError_1.default(res, 400, ("Invalid hashId")));
            const username = await Context_1.ApplicationContext.redis.get(hashId);
            if (!username)
                return next(new ApiError_1.default(res, 400, ("Invalid hashId")));
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const hash_password = bcrypt_1.default.hashSync(newPassword, salt);
            const user = await prisma.user.update({
                where: {
                    username
                },
                data: {
                    password: hash_password,
                    salt
                }
            });
            await Context_1.ApplicationContext.redis.del(hashId);
            res.send(200);
        }
        catch (e) {
            console.warn(e.toString());
            res.sendStatus(500);
        }
    }
    async changePassword(req, res, next) {
        try {
            if (req.body == undefined)
                return next(new ApiError_1.default(res, 400, ("Invalid body")));
            const { oldPassword, newPassword } = req.body;
            const token = req.cookies['token'];
            if (!oldPassword)
                return next(new ApiError_1.default(res, 400, ("Invalid oldPassword")));
            if (!newPassword)
                return next(new ApiError_1.default(res, 400, ("Invalid newPassword")));
            if (!token)
                return next(new ApiError_1.default(res, 400, ("Invalid token")));
            const result = await authModel.changePassword(token, oldPassword, newPassword);
            modelResponse_1.default.responseRequest(res, result);
        }
        catch (e) {
            res.sendStatus(500);
        }
    }
    async login(req, res, next) {
        try {
            if (req.body == undefined)
                return next(new ApiError_1.default(res, 400, ("Invalid body")));
            const { username, password } = req.body;
            if (!username)
                return next(new ApiError_1.default(res, 400, ("Invalid username")));
            if (!password)
                return next(new ApiError_1.default(res, 400, ("Invalid password")));
            const result = await authModel.login(username, password);
            modelResponse_1.default.responseRequest(res, result);
        }
        catch (e) {
            console.warn(e.toString());
            res.sendStatus(500);
        }
    }
    async logOut(req, res, next) {
        try {
            const token = req.cookies['token'];
            if (token == undefined) {
                return next(new ApiError_1.default(res, 400, ("Invalid token")));
            }
            const result = await authModel.logOut(token);
            modelResponse_1.default.responseRequest(res, result);
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
    async checkToken(req, res, next) {
        try {
            if (req.body == undefined)
                return next(new ApiError_1.default(res, 400, "Invalid body"));
            res.send("auth");
        }
        catch (err) {
            console.warn(err.toString());
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map