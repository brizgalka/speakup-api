import Router from 'express'
import userRouter from "@/Router/userRouter";

const router = Router()

router.use('/user',userRouter)

export default router;