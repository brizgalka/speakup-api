import Router from 'express'
import userRouter from "@/Router/userRouter";
import authRouter from "@/Router/authRouter";
import verifyUser from "@/App/middleware/VerifyUser";
import AuthMiddleware from "@/App/middleware/AuthMiddleware";
import infoRouter from "@/Router/infoRouter";

const router = Router()

//router.use(verifyUser);

router.use('/user',userRouter);
router.use('/auth',authRouter);
router.get('/',(req,res) => {
    res.send("hgelloe")
})
router.use('/info',infoRouter);

export default router;