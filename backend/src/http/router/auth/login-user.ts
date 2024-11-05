import type { Request, Response } from "express";
import { prisma } from '../../../lib/prisma'
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function loginUser(req: Request, res: Response): Promise<string | any> {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Coloque o Username no .env" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Não foi encontrada a chave secreta JWT" });
    }

    const secret = process.env.JWT_SECRET;

    const token = sign({ username }, secret, {
      expiresIn: "1h",
    });

    return res.json({ token });

  } catch (error) {
    console.error("Erro ao tentar fazer login:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}