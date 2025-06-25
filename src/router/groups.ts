import { Router } from "express";
import { PrismaClient } from "@prisma/client";

export const groupRouter = Router();
const prisma = new PrismaClient();

// 📌 Route GET : Récupérer tous les groupes
groupRouter.get("/", async (req, res) => {
  const groups = await prisma.group.findMany({});
  res.json({ groups: groups });
});

// 📌 Route POST : Créer un groupe
groupRouter.post("/", async (req, res) => {
    const { data } = req.body;
    const { name } = data;
    const newGroup = await prisma.group.create({
        data: { 
            name },
        });
    res.status(201).json(newGroup);
});
    
// 📌 Route GET : Récupérer un groupe par id
groupRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const groupId = parseInt(id, 10);
    const myGroup = await prisma.group.findUnique({ where: { id: groupId } });
    res.json({ group: myGroup });
});
    
// 📌 Route UPDATE : Modifier un groupe par id
groupRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const groupId = parseInt(id, 10);
  const { data } = req.body;
  const { name } = data; // Accéder aux données via req.body

  const updatedGroup = await prisma.group.update({
    where: { id: groupId },
    data: {
        name,
    },
    });
    res.json(updatedGroup);
});

// 📌 Route DELETE : Supprimer un groupe par id
groupRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const groupId = parseInt(id, 10);
  await prisma.group.delete({ where: { id: groupId } });
  res.json({ message: "Group deleted" });
});