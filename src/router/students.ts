import { Router } from "express";
import { PrismaClient } from "@prisma/client";

export const studentRouter = Router();
const prisma = new PrismaClient();

// 📌 Route GET : Récupérer tous les étudiants
studentRouter.get("/", async (req, res) => {
  const students = await prisma.student.findMany({});
  res.json({ students: students });
});

// 📌 Route POST : Créer un étudiant
studentRouter.post("/", async (req, res) => {
    const { data } = req.body;
    const { firstName, lastName, class_id } = data;
    const newStudent = await prisma.student.create({
        data: { 
            firstName, 
            lastName, 
            class_id },
        });
    res.json(newStudent);
});
    
// 📌 Route GET : Récupérer un étudiant par id
studentRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const studentId = parseInt(id, 10);
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    res.json({ student: student });
});
    
// 📌 Route UPDATE : Modifier un étudiant par id
studentRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const studentId = parseInt(id, 10);
  const { data } = req.body;
  const { firstName, lastName, class_id } = data; // Accéder aux données via req.body

  const updatedStudent = await prisma.student.update({ 
    where: { id: studentId },
    data: {
        firstName,
        lastName,
        class_id },
    });
  res.json(updatedStudent);
});

// 📌 Route DELETE : Supprimer un étudiant par id
studentRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const studentId = parseInt(id, 10);
  await prisma.student.delete({ where: { id: studentId } });
  res.json({ message: "Student deleted" });
});

// 📌 Route POST : Ajouter un étudiant à un groupe
studentRouter.post("/:studentId/groups/:groupId", async (req, res) => {
    const studentId = parseInt(req.params.studentId, 10);
    const groupId = parseInt(req.params.groupId, 10);

    try {
        const studentGroup = await prisma.studentGroup.create({
          data: {
            student_id: studentId,
            group_id: groupId,
          },
        });
    
        res.json(studentGroup);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'ajout de l'étudiant au groupe" });
      }
})