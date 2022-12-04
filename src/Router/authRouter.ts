import AuthController from "@/App/Controller/AuthController";
import router from "@/Router/userRouter";

const authController = new AuthController()

router.get("/login",authController.login)
router.post("/registration",authController.registration)
router.post("/checkToken",authController.checkToken)

export default router