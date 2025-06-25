import { Router } from "express";
import { PrismaClient } from "@prisma/client";

export const classRouter = Router();
const prisma = new PrismaClient();

// 📌 Route GET : Récupérer toutes les classes
classRouter.get("/", async (req, res) => {
  const classes = await prisma.class.findMany({});
  res.json({ classes: classes });
});

// 📌 Route POST : Créer une classe
classRouter.post("/", async (req, res) => {
    const { data } = req.body;
    const { name } = data;
    const newClass = await prisma.class.create({
        data: { 
            name },
        });
    res.status(201).json(newClass);
});
    
// 📌 Route GET : Récupérer une classe par id
classRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const classId = parseInt(id, 10);
    const myClass = await prisma.class.findUnique({ where: { id: classId } });
    res.json({ class: myClass });
});

// 📌 Route UPDATE : Modifier une classe par id
classRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const classId = parseInt(id, 10);
  const { data } = req.body;
  const { name } = data; // Accéder aux données via req.body

  const updatedClass = await prisma.class.update({
    where: { id: classId },
    data: {
        name,
    },
    });
    res.json(updatedClass);
});

// 📌 Route DELETE : Supprimer une classe par id
classRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const classId = parseInt(id, 10);
    await prisma.class.delete({ where: { id: classId } });
    res.json({ message: "Class deleted" });
});