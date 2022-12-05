"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = __importDefault(require("@/App/Controller/AuthController"));
const userRouter_1 = __importDefault(require("@/Router/userRouter"));
const authController = new AuthController_1.default();
userRouter_1.default.get("/login", authController.login);
userRouter_1.default.post("/registration", authController.registration);
userRouter_1.default.post("/checkToken", authController.checkToken);
exports.default = userRouter_1.default;
//# sourceMappingURL=authRouter.js.map