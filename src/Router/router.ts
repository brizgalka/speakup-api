import Router, {NextFunction, Request, Response} from 'express'
import userRouter from "@/Router/userRouter";
import authRouter from "@/Router/authRouter";
import path from "path"
import AuthMiddleware from "@/App/middleware/AuthMiddleware";
import infoRouter from "@/Router/infoRouter";
import utilRouter from "@/Router/utilRouter";
import staticRouter from "@/Router/staticRouter";
import userApiRouter from "@/Router/userApiRouter";
import verifyUser from "@/App/middleware/VerifyUser";
import metrikaMiddleware from "@/System/Metrika/UserMetrika";

const router = Router();

const apiInfoPath = path.join(__dirname,"/api.info")

router.get("/",(req:Request,res:Response) => {
    res.sendFile(apiInfoPath)
})

router.use(async (req, res, next) => {
    // @ts-ignore
    await metrikaMiddleware(req,next)
})

router.use((error: any , req: Request, res: Response, next: NextFunction) => {
    if(error) {
        res.status(500)
        res.send("Server error")
    } else {
        next()
    }
})

router.use('/user',[AuthMiddleware,verifyUser],userRouter);
router.use('/auth',verifyUser,authRouter);
router.use('/info',verifyUser,infoRouter);
router.use('/util',verifyUser,utilRouter);
router.use('/userApi',userApiRouter);
router.use('/static',staticRouter);

export default router;