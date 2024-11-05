import type { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  username?: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction){
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(404).json({ error: "Token not provided" });
  }

  const [, token] = authorization.split(" ");

  if (!process.env.JWT_SECRET) {
    return res.json("error: não foi encontrado a chave secreta JWT");
  }

  const secret = process.env.JWT_SECRET;

  try {
    const decoded = verify(token, secret) as { username: string };
    req.username = decoded.username;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token not provided" });
  }
}