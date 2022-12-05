"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("@/App/Controller/UserController"));
const router = (0, express_1.default)();
const userController = new UserController_1.default();
router.post("/sendMessage", userController.sendMessage);
router.post("/deleteMessage", userController.deleteMessage);
exports.default = router;
//# sourceMappingURL=userRouter.js.map