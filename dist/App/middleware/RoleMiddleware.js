"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = __importDefault(require("@/App/Controller/AuthController"));
const authController = new AuthController_1.default();
const RoleMiddleware = (role) => async (req, res, next) => {
    try {
        const token = req.cookies["token"];
        if (token == undefined) {
            return res.sendStatus(401);
        }
        const user = await authController.getUser(token);
        if (user) {
            const role = user.role;
            if (role == "ADMIN") {
                console.log("ADMIn");
            }
            else {
                console.log("USER");
            }
        }
        else {
            res.sendStatus(401);
        }
    }
    catch (e) {
        res.sendStatus(500);
    }
};
exports.default = RoleMiddleware;
//# sourceMappingURL=RoleMiddleware.js.map