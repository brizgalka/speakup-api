import Router from "express"
import UserController from "@/App/Controller/UserController"

const router = Router()

const userController = new UserController();

router.post("/sendMessage",userController.sendMessage)
router.post("/deleteMessage",userController.deleteMessage)

export default router