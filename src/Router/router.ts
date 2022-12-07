import Router from 'express'
import userRouter from "@/Router/userRouter";
import authRouter from "@/Router/authRouter";
import verifyUser from "@/App/middleware/VerifyUser";

const router = Router()

router.use('/user',userRouter)
router.use('/auth',authRouter)

router.use(verifyUser)

export default router;