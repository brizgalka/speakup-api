"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_alias_1 = __importDefault(require("module-alias"));
module_alias_1.default.addAlias("@", __dirname);
(0, module_alias_1.default)();
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function startup() {
    const PORT = Number(process.env.PORT) || 8080;
    const app = (0, express_1.default)();
    prisma.users.create({
        data: {
            name: "ron"
        }
    });
    let user = await prisma.users.findUnique({
        where: { id: 1 }
    });
    console.log(user?.name);
    app.get("/", (req, res) => {
        res.send("ok");
    });
    app.listen(PORT, () => {
        console.log(`server started on port {PORT}`);
    });
}
startup();
//# sourceMappingURL=main.js.map