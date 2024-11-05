import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export async function getAllEvents(req: Request, res: Response) {
  try {
    const events = await prisma.evento.findMany({
      include: {
        imagens: true,
      },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
}
