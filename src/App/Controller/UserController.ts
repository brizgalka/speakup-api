import {Request, Response, NextFunction} from "express";
import ApiError from "@/App/error/ApiError";
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const saltRounds = Number(process.env.saltRounds);

class UserController {
    async sendMessage(req:Request,res:Response,next:NextFunction) {

    }
    async deleteMessage(req:Request,res:Response,next:NextFunction) {

    }
    async changeProfile(req:Request,res:Response,next:NextFunction) {

    }
}

export default UserController