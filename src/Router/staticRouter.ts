import express, {NextFunction, Request, Response} from "express"
const router = express.Router()

import path from "path";
import fs from "fs";

const file = path.join(__dirname,'/Kollet-iedgr.txt')
const useragree = fs.readFileSync(file,"utf-8")


interface a {
    username: string
}

router.get("/getUserLogo",(req,res) => {
    if(req.query == undefined) res.send("params not found")
    const {username} = req.query
    console.log(username)
    res.sendFile(path.join(__dirname,"../../storage/users/default.png"))
})

router.get("/getUserAgree",(req:Request,res:Response,next:NextFunction) => {
    res.send(useragree)
})

export default router