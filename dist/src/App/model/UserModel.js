"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthModel_1 = __importDefault(require("@/App/model/AuthModel"));
const modelResponse_1 = __importDefault(require("@/App/model/modelResponse"));
const ApiError_1 = __importDefault(require("@/App/error/ApiError"));
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const photo_path = path_1.default.join(__dirname, "../../storage/users");
class UserModel {
    async changePhoto(token, photo) {
        try {
            const user = await AuthModel_1.default.getUser(token);
            if (!user)
                return new ApiError_1.default(undefined, 400);
            const oldPhoto = user.photo;
            if (oldPhoto == "user") {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        photo: photo.name
                    }
                });
                photo.mv(photo_path);
            }
            else {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        photo: photo.name
                    }
                });
                await fs_1.default.rmSync(path_1.default.join(photo_path, user.photo));
                photo.mv(photo_path);
            }
            return new modelResponse_1.default(200);
        }
        catch (e) {
            console.warn(e.toString());
            return new ApiError_1.default(undefined, 500);
        }
    }
    async changeBio(token, bio) {
        try {
            const user = await AuthModel_1.default.getUser(token);
            if (!user)
                return new ApiError_1.default(undefined, 400);
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    bio
                }
            });
            return new modelResponse_1.default(200);
        }
        catch (e) {
            console.warn(e.toString());
            return new ApiError_1.default(undefined, 500);
        }
    }
}
exports.default = UserModel;
//# sourceMappingURL=UserModel.js.map