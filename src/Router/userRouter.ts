import express from "express"
const router = express.Router()
import ChatController from "@/App/Controller/ChatController";
import UserController from "@/App/Controller/UserController";

const userController = new UserController();
const chatController = new ChatController()

router.post("/sendMessage",chatController.sendMessage);
router.post("/deleteMessage",chatController.deleteMessage);
router.post("/createChat",chatController.createChat);
router.get("/getUserData",userController.getUserData);
router.post("/getMessages",chatController.getMessages); //ERROR
router.post("/getDialogs",chatController.getDialogs);
router.post("/getDialogInfo",chatController.getDialogInfo);

export default router;