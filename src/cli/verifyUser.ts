import {PrismaClient} from "@prisma/client";
import {ApplicationContext} from "@/System/Context";
import {addPath} from "module-alias";

interface dbUser {
    id: number;
    username: string;
    salt: string;
    password: string;
    email: string;
}

process.env.DATABASE_URL = "postgresql://postgres:root@localhost:5432/speak-up"

async function main() {
    process.argv.forEach(function (val, index, array) {
        if(val.includes("username=")) {
            const username = val.replace("username=","")

            verifyAccount(username)
        }
    });
}

const prisma = new PrismaClient();

async function verifyAccount(username: string) {
    const user_token = await prisma.verifyToken.findFirst({
        where: {
            username
        }
    }) as dbUser

    console.log(user_token)

    /*
    await prisma.user.create({
        data: {
            username: user_token.username,
            email: user_token.email,
            password: user_token.password,
            salt: user_token.salt,
            createdAt: new Date(),
            telegram: String(Math.random())
        }
    })

    const token = user_token.token;

    await prisma.verifyToken.delete({
        where: {
            value: token
        }
    })

    const user_uuid_connection = await ApplicationContext.redis.get(token)
    if (user_uuid_connection != null) {
        if (ApplicationContext.wss.verifyUUID(user_uuid_connection)) {
            ApplicationContext.wss.sendMessage(user_uuid_connection, {
                "verify": {
                    "status": "ok",
                }
            })
        }
    }

    await ApplicationContext.redis.del(token)

     */
}

main()