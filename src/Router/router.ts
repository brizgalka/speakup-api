import Router, {NextFunction, Request, Response} from 'express'
import userRouter from "@/Router/userRouter";
import authRouter from "@/Router/authRouter";
import verifyUser from "@/App/middleware/VerifyUser";
import path from "path"
import AuthMiddleware from "@/App/middleware/AuthMiddleware";
import infoRouter from "@/Router/infoRouter";
import utilRouter from "@/Router/utilRouter";
import staticRouter from "@/Router/staticRouter";
import userApiRouter from "@/Router/userApiRouter";

const router = Router()

const apiInfoPath = path.join(__dirname,"/api.info")

router.get("/",(req:Request,res:Response) => {
    res.sendFile(apiInfoPath)
})

//router.use(verifyUser);

router.use((error: any , req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    if(error) {
        res.status(500)
        res.send("Server error")
    } else {
        next()
    }
})

router.use('/user',AuthMiddleware,userRouter);
router.use('/auth',authRouter);
router.use('/info',infoRouter);
router.use('/util',utilRouter);
router.use('/userApi',userApiRouter);
router.use('/static',staticRouter);

export default router;