import Router from 'express'
import userRouter from "@/Router/userRouter";
import authRouter from "@/Router/authRouter";

const router = Router()

router.use('/user',userRouter)
router.use('/auth',authRouter)

export default router;