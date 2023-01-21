"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Context_1 = require("@/System/Context");
const modelResponse_1 = __importDefault(require("@/App/model/modelResponse"));
const prisma = new client_1.PrismaClient();
const saltRounds = Number(process.env.saltRounds);
const token_secret = String(process.env.JWT_SECRET);
const jwtMaxAge = Number(process.env.jwtMaxAge);
class AuthModel {
    static async getUser(jwtoken) {
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
    async registration(username, password, email, user_uuid) {
        try {
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
                return new ApiError_1.default(undefined, 400, "This email or username already taken");
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
                if (parseInt(String(difference / 1000)) > 300) {
                    await prisma.verifyToken.delete({
                        where: {
                            id: token_candidate?.id
                        }
                    });
                    return new ApiError_1.default(undefined, 400, "Token invalid");
                }
                else {
                    return new ApiError_1.default(undefined, 400, "Token already exist");
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
            return new modelResponse_1.default(200, { "verifyToken": token.value }, undefined);
        }
        catch (e) {
            console.warn(e.toString());
            return new ApiError_1.default(undefined, 500);
        }
    }
    async login(username, password) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    username
                }
            });
            if (!user) {
                return new ApiError_1.default(undefined, 400, "Wrong username or password");
            }
            const salt = user.salt;
            const hashPassword = bcrypt_1.default.hashSync(password, salt);
            if (user.password != hashPassword) {
                return new ApiError_1.default(undefined, 400, "Wrong username or password");
            }
            const token = jsonwebtoken_1.default.sign({ username }, token_secret, { expiresIn: '1800s' });
            return new modelResponse_1.default(200, {
                token,
                id: user.id,
                username: user.username
            }, {
                set: {
                    name: "token",
                    value: token,
                    options: {
                        maxAge: jwtMaxAge,
                        httpOnly: true
                    }
                }
            });
        }
        catch (e) {
            console.warn(e.toString());
            return new ApiError_1.default(undefined, 500);
        }
    }
    async logOut(token) {
        try {
            const user = await AuthModel.getUser(token);
            if (!user)
                return new ApiError_1.default(undefined, 400, ("Invalid User"));
            if (user) {
                for (const connection of Context_1.ApplicationContext.wss.connections.entries()) {
                    const ws_connection = connection[0];
                    const ws_user = connection[1];
                    if (ws_user.user.username == user.username) {
                        ws_user.user.username = null;
                    }
                }
            }
            return new modelResponse_1.default(200, undefined, {
                clear: ["token"]
            });
        }
        catch (e) {
            return new modelResponse_1.default(500, { "response": "server error" }, {
                clear: ["token"]
            });
        }
    }
    async changePassword(token, oldPassword, newPassword) {
        try {
            const user = await AuthModel.getUser(token);
            if (!user)
                return new ApiError_1.default(undefined, 400, ("Invalid User"));
            const user_salt = user.salt;
            const hashPassword = bcrypt_1.default.hashSync(oldPassword, user_salt);
            if (user.password != hashPassword) {
                return new ApiError_1.default(undefined, 400, ("Wrong oldPassword"));
            }
            const new_salt = bcrypt_1.default.genSaltSync(saltRounds);
            const hash_password = bcrypt_1.default.hashSync(newPassword, new_salt);
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hash_password,
                    salt: new_salt
                }
            });
            return new modelResponse_1.default(200);
        }
        catch (e) {
            return new ApiError_1.default(undefined, 500);
        }
    }
}
exports.default = AuthModel;
//# sourceMappingURL=AuthModel.js.map