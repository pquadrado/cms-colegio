import { verify } from "jsonwebtoken";
import type { Request, Response } from "express"; 

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function validateToken(req: Request, res: Response): Promise<any | string | boolean> {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ valid: false, message: 'Token não fornecido' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Não foi encontrada a chave secreta JWT" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return res.json({ valid: true });
  } catch (error) {
    return res.status(401).json({ valid: false, message: 'Token inválido' });
  }
}