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
router.post("/forgot-password", authController.forgotPassword);
router.post("/register", authController.registration);
router.post("/checkToken", AuthMiddleware_1.default, authController.checkToken);
router.post("/new-password", authController.newPassword);
router.post("/validate-hashId", authController.validateHashId);
router.post("/validate-verifyToken", authController.validateVerifyToken);
exports.default = router;
//# sourceMappingURL=authRouter.js.map