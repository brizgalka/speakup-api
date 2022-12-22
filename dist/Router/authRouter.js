"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = __importDefault(require("@/App/Controller/AuthController"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const AuthMiddleware_1 = __importDefault(require("@/App/middleware/AuthMiddleware"));
const authController = new AuthController_1.default();
router.post("/login", authController.login);
router.post("/registration", authController.registration);
router.post("/checkToken", AuthMiddleware_1.default, authController.checkToken);
exports.default = router;
//# sourceMappingURL=authRouter.js.map