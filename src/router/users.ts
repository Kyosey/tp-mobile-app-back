import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";
import { checkToken } from "../middlewares/checkToken";

export const userRouter = Router();
const prisma = new PrismaClient();

// 📌 Route GET : Récupérer tous les utilisateurs
userRouter.get("/", checkToken, async (req, res) => {
    const users = await prisma.user.findMany({});
    res.json({ users: users });
});

// 📌 Route POST : Créer un utilisateur (avec hashage du mot de passe)
userRouter.post("/", async (req, res) => {
    const { data } = req.body;
    const { email, password } = data;
    const userWithEmail = await prisma.user.findUnique({ where: { email } });

    if (userWithEmail) {
        res.status(400).json("Email already exists");
    }

    else {
        try {
            // Hasher le mot de passe avant de l'enregistrer
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS!));
            const newUser = await prisma.user.create({
                data: { 
                    email,
                    password: hashedPassword
                },
            });
    
            // Ne pas renvoyer le mot de passe hashé dans la réponse
            res.status(201).json({ id: newUser.id, email: newUser.email, createdAt: newUser.createdAt });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
        }        
    }
});
    
// 📌 Route GET : Récupérer un utilisateur par id
userRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    const myUser = await prisma.user.findUnique({ where: { id: userId } });
    res.json({ user: myUser });
});
    
// 📌 Route UPDATE : Modifier un utilisateur par id (avec hashage du mot de passe si changé)
userRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    const { data } = req.body;
    const { email, password } = data; // Accéder aux données via req.body

    try {
        let updateData: { email?: string; password?: string } = {};
        
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10); // Hasher si un nouveau mot de passe est fourni

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
});

// 📌 Route DELETE : Supprimer un utilisateur par id
userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id, 10);
  await prisma.user.delete({ where: { id: userId } });
  res.json({ message: "User deleted" });
});