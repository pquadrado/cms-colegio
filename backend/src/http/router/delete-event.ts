import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export async function deleteEvent(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await prisma.evento.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
    res.status(200).json({ message: "Evento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    res.status(500).json({ error: "Erro ao excluir evento" });
  }
}
