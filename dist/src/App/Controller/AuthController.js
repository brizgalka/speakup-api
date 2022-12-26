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
const saltRounds = Number(process.env.saltRounds);
const token_secret = String(process.env.JWT_SECRET);
const jwtMaxAge = Number(process.env.jwtMaxAge);
class AuthController {
    async registration(req, res, next) {
        try {
            if (req.body == undefined)
                return next(ApiError_1.default.badRequest("Invalid body").response);
            const { username, password, email } = req.body;
            const user_uuid = req.body.uuid;
            if (!user_uuid)
                return next(ApiError_1.default.badRequest("Invalid UUID").response);
            if (!username)
                return next(ApiError_1.default.badRequest("Invalid username").response);
            if (!password)
                return next(ApiError_1.default.badRequest("Invalid password").response);
            if (!email)
                return next(ApiError_1.default.badRequest("Invalid email").response);
            const candidate = await prisma.user.findFirst({
                where: {
                    username
                },
            }) || await prisma.user.findFirst({
                where: {
                    email
                },
            });
            if (candidate != undefined) {
                return next(ApiError_1.default.badRequest("This email or username already taken").response);
            }
            const token_candidate = await prisma.verifyToken.findFirst({
                where: {
                    username
                },
            }) || await prisma.verifyToken.findFirst({
                where: {
                    email
                },
            });
            if (token_candidate != null) {
                const token_createdAt = token_candidate.createdAt;
                const difference = Date.now() - token_createdAt.getDate();
                console.log(token_candidate.createdAt);
                if (parseInt(String(difference / 1000)) > 300) {
                    await prisma.verifyToken.delete({
                        where: {
                            id: token_candidate?.id
                        }
                    });
                    return next(ApiError_1.default.badRequest("Token invalid. Try again").response);
                }
                else {
                    return next(ApiError_1.default.badRequest("Token already exist").response);
                }
            }
            const tokenValue = (0, uuid_1.v4)();
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const hash_password = bcrypt_1.default.hashSync(password, salt);
            const token = await prisma.verifyToken.create({
                data: {
                    username,
                    salt,
                    email,
                    password: hash_password,
                    value: tokenValue,
                    createdAt: new Date()
                }
            });
            await Context_1.ApplicationContext.redis.set(tokenValue, user_uuid);
            res.json({
                "verifyToken": token.value
            });
        }
        catch (e) {
            console.warn(e.toString());
            res.sendStatus(500);
        }
    }
    async validateVerifyToken(req, res, next) {
        try {
            if (req.body == undefined)
                return next(ApiError_1.default.badRequest("Invalid body").response);
            const { verifyToken } = req.body;
            if (!verifyToken)
                return next(ApiError_1.default.badRequest("Invalid verifyToken").response);
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
                return next(ApiError_1.default.badRequest("Invalid body").response);
            const { username } = req.body;
            const user_uuid = req.body.uuid;
            if (!username)
                return next(ApiError_1.default.badRequest("Invalid username").response);
            const user = await prisma.user.findFirst({
                where: {
                    username
                }
            });
            if (user == null) {
                return next(ApiError_1.default.badRequest("Wrong username").response);
            }
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const uuid1 = (0, uuid_1.v4)();
            const hash = bcrypt_1.default.hashSync(user_uuid, salt);
            const uuid2 = (0, uuid_1.v4)();
            const hash_id = uuid1 + hash + uuid2;
            await Context_1.ApplicationContext.redis.set(hash_id, user.username);
            await Context_1.ApplicationContext.tgBot.bot.sendMessage(user.telegram, `hello, your reset link
                http://localhost:3000/auth/forgot-password/auth-new-password/${hash_id}
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
                return next(ApiError_1.default.badRequest("Invalid body").response);
            const { hashId } = req.body;
            if (!hashId)
                return next(ApiError_1.default.badRequest("Invalid hashId").response);
            const result = await Context_1.ApplicationContext.redis.get(hashId);
            console.log(result);
            if (result) {
                res.sendStatus(200);
            }
            else {
                return next(ApiError_1.default.badRequest("Invalid hashId").response);
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
                return next(ApiError_1.default.badRequest("Invalid body").response);
            const { newPassword, hashId } = req.body;
            console.log(newPassword);
            if (!newPassword)
                return next(ApiError_1.default.badRequest("Invalid newPassword").response);
            if (!hashId)
                return next(ApiError_1.default.badRequest("Invalid hashId").response);
            const username = await Context_1.ApplicationContext.redis.get(hashId);
            if (!username)
                return next(ApiError_1.default.badRequest("Invalid hashId").response);
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
    async login(req, res, next) {
        try {
            if (req.body == undefined)
                return next(ApiError_1.default.badRequest("Invalid body").response);
            const { username, password } = req.body;
            if (!username)
                return next(ApiError_1.default.badRequest("Invalid username").response);
            if (!password)
                return next(ApiError_1.default.badRequest("Invalid password").response);
            const user = await prisma.user.findFirst({
                where: {
                    username
                }
            });
            if (user == null) {
                return next(ApiError_1.default.badRequest("Wrong username or password").response);
            }
            const salt = user.salt;
            const hashPassword = bcrypt_1.default.hashSync(password, salt);
            if (user.password != hashPassword) {
                return next(ApiError_1.default.badRequest("Wrong username or password").response);
            }
            const token = jsonwebtoken_1.default.sign({ username }, token_secret, { expiresIn: '1800s' });
            res.cookie("token", token, {
                maxAge: jwtMaxAge,
                httpOnly: true
            });
            res.json({
                token
            });
        }
        catch (e) {
            console.warn(e.toString());
            res.sendStatus(500);
        }
    }
    async checkToken(req, res, next) {
        try {
            if (req.body == undefined)
                return next(ApiError_1.default.badRequest("Invalid body").response);
            res.send("auth");
        }
        catch (e) {
            console.warn(e.toString());
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map