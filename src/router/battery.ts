import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { checkToken } from "../middlewares/checkToken";

export const batteryRouter = Router();
const prisma = new PrismaClient();

// 📌 Route GET : Récupérer toutes les données de batterie de l'utilisateur
batteryRouter.get("/", checkToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const batteryData = await prisma.batteryData.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ batteryData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
});

// 📌 Route POST : Enregistrer une nouvelle donnée de batterie
batteryRouter.post("/", checkToken, async (req, res) => {
  const userId = req.user.id;
  const { level } = req.body;

  if (typeof level !== "number") {
    return res
      .status(400)
      .json({ error: "Le champ 'level' est requis et doit être un nombre." });
  }

  try {
    const newData = await prisma.batteryData.create({
      data: {
        level,
        userId,
      },
    });
    res.json(newData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de la donnée" });
  }
});

// 📌 Route GET : Récupérer une donnée précise par ID
batteryRouter.get("/:id", checkToken, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id, 10);

  try {
    const batteryData = await prisma.batteryData.findUnique({
      where: { id },
    });

    if (!batteryData || batteryData.userId !== userId) {
      return res
        .status(404)
        .json({ error: "Donnée introuvable ou accès interdit." });
    }

    res.json({ batteryData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la donnée" });
  }
});

// 📌 Route DELETE : Supprimer une donnée de batterie
batteryRouter.delete("/:id", checkToken, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id, 10);

  try {
    const data = await prisma.batteryData.findUnique({ where: { id } });
    if (!data || data.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Accès interdit ou donnée introuvable." });
    }

    await prisma.batteryData.delete({ where: { id } });
    res.json({ message: "Donnée supprimée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});
