import Router from "express"
import UserController from "@/App/Controller/UserController"

const router = Router()

const userController = new UserController();

router.get("/login",userController.login)
router.post("/registration",userController.registration)
router.post("/sendMessage",userController.sendMessage)
router.post("/deleteMessage",userController.deleteMessage)
router.post("/checkToken",userController.checkToken)
router.post("/verifyAccount",userController.verifyAccount)

export default router