import AuthController from "@/App/Controller/AuthController";
import express from "express"
const router = express.Router()
import AuthMiddleware from "@/App/middleware/AuthMiddleware";
import {NextFunction, Request, Response} from "express";

const authController = new AuthController();

router.post("/login",authController.login);
router.post("/forgot-password",authController.forgotPassword);
router.post("/register",authController.registration);
router.post("/checkToken",AuthMiddleware, authController.checkToken);
router.post("/new-password", authController.newPassword);
router.post("/validate-hashId", authController.validateHashId);
router.post("/validate-verifyToken", authController.validateVerifyToken);
router.post("/change-password",AuthMiddleware, authController.changePassword);

export default router;