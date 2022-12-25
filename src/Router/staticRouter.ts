import express from "express"
const router = express.Router()
import path from "path"

interface a {
    username: string
}

router.get("/getUserLogo",(req,res) => {
    if(req.query == undefined) res.send("params not found")
    const {username} = req.query
    console.log(username)
    res.sendFile(path.join(__dirname,"../../storage/users/default.png"))
})

export default router