import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export async function checkToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fullToken = req.headers.authorization;
  if (!fullToken) {
    res.status(401).send("No token provided");
  } else {
    const [typeToken, token] = fullToken.split(" ");
    if (typeToken !== "Bearer") {
      res.status(401).send("Invalid token type");
    } else {
      try {
        console.log("token", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("decoded", decoded);
        if (decoded) {
          req.token = token;
          req.user = decoded;
          next();
        } else {
          res.status(401).send("Invalid token");
        }
      } catch (e) {
        console.log("invalid token on verify", e);
        res.status(401).send("Invalid token on verify");
      }
    }
  }
}
