import AuthController from "@/App/Controller/AuthController";
import express from "express"
const router = express.Router()
import AuthMiddleware from "@/App/middleware/AuthMiddleware";
import {NextFunction, Request, Response} from "express";

const authController = new AuthController()

router.post("/login",authController.login)
router.post("/registration",authController.registration)
router.post("/checkToken",AuthMiddleware, authController.checkToken)

export default router