import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
// import { DecodeToken, checkToken } from "../middlewares/checkToken";

export const authRouter = Router();
const prisma = new PrismaClient();

authRouter.post("/local", async (req, res) => {
    const { data } = req.body;
    const { email, password } = data;
    const userWithEmail = await prisma.user.findFirst({ where: { email: email } });
    if (!userWithEmail) {
        res.status(400).json("Email or Password is incorrect");
    }
    else {
        const isPasswordCorrect = await bcrypt.compare(password, userWithEmail.password);
        if (isPasswordCorrect) {
            const { password: _, ...userWithoutPassword } = userWithEmail;
            const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET!);
            res.json({
                token,
                ...userWithEmail
            });
        }
        else {
            res.status(400).json("Email or Password is incorrect");
        }
    }
})