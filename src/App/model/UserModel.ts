import fileUpload from "express-fileupload";
import AuthModel from "@/App/model/AuthModel";
import modelResponse from "@/App/model/modelResponse";
import ApiError from "@/App/error/ApiError";
import {PrismaClient} from "@prisma/client";
import path from "path"
import fs from "fs"

const prisma = new PrismaClient()

interface dbUser {
    id: number;
    username: string;
    salt: string;
    password: string;
    photo: string;
}

const photo_path = path.join(__dirname,"../../storage/users")

class UserModel {

    async changePhoto(token: string, photo: fileUpload.UploadedFile): Promise<modelResponse | ApiError> {
        try {
            const user = await AuthModel.getUser(token) as dbUser;

            if (!user) return new ApiError(undefined, 400)

            const oldPhoto = user.photo;

            if (oldPhoto == "user") {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        photo: photo.name
                    }
                })
                photo.mv(photo_path)
            } else {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        photo: photo.name
                    }
                });
                await fs.rmSync(path.join(photo_path, user.photo))
                photo.mv(photo_path)
            }
            return new modelResponse(200);
        } catch (e: any) {
            console.warn(e.toString())
            return new ApiError(undefined,500)
        }
    }

}

export default UserModel