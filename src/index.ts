import cors from "cors";
// import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { userRouter } from "./router/users";
import { authRouter } from "./router/auth";
import { batteryRouter } from "./router/battery";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/battery", batteryRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
