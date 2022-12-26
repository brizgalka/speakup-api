"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const ChatController_1 = __importDefault(require("@/App/Controller/ChatController"));
const UserController_1 = __importDefault(require("@/App/Controller/UserController"));
const userController = new UserController_1.default();
const chatController = new ChatController_1.default();
router.post("/sendMessage", chatController.sendMessage);
router.post("/deleteMessage", chatController.deleteMessage);
router.post("/createChat", chatController.createChat);
router.get("/getUserData", userController.getUserData);
router.post("/getMessages", chatController.getMessages);
router.post("/getDialogs", chatController.getDialogs);
exports.default = router;
//# sourceMappingURL=userRouter.js.map