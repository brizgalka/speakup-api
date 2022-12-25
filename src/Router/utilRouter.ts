import express from "express"
import UtilController from "@/App/Controller/UtilController";
const router = express.Router()

const utilController = new UtilController()

router.get("/generatePassword",(req,res) => {res.send(utilController.generatePassword(32))})

export default router