"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("@/App/Controller/UserController"));
const router = (0, express_1.default)();
const userController = new UserController_1.default();
router.get("/login", userController.login);
router.post("/registration", userController.registration);
router.post("/sendMessage", userController.sendMessage);
router.post("/deleteMessage", userController.deleteMessage);
router.post("/checkToken", userController.checkToken);
router.post("/verifyAccount", userController.verifyAccount);
exports.default = router;
//# sourceMappingURL=userRouter.js.map