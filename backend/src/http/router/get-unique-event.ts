import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export async function getUniqueEvents(req: Request, res: Response): Promise<any> {
  const { id } = req.params;

  try {
    const event = await prisma.evento.findUnique({
      where: { id: parseInt(id, 10) },
      include: { imagens: true },
    });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    res.status(500).json({ error: "Erro ao buscar evento" });
  }
}
