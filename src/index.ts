import cors from "cors";
// import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { studentRouter } from "./router/students";
import { classRouter } from "./router/classes";
import { groupRouter } from "./router/groups";
import { userRouter } from "./router/users";
import { authRouter } from "./router/auth";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter)
apiRouter.use("/students", studentRouter)
apiRouter.use("/classes", classRouter)
apiRouter.use("/groups", groupRouter)
apiRouter.use("/users", userRouter)

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});