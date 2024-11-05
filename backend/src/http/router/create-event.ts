import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export async function CreateEvent(req: Request, res: Response): Promise<string | any> {
  

  const validateDateTime = (
    date: string,
    startTime: string,
    endTime: string
  ) => {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    const timeRegex = /^\d{2}:\d{2}$/;

    if (!dateRegex.test(date)) return false;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) return false;

    return true;
  };

  const {
    titulo,
    subtitulo,
    descricao,
    data,
    hora_inicio,
    hora_termino,
    local,
  } = req.body;

  if (!validateDateTime(data, hora_inicio, hora_termino)) {
    return res
      .status(400)
      .json({ error: "Data ou hora inválida. Formato: dd-mm-yyyy e hh:mm" });
  }
  try {
    const evento = await prisma.evento.create({
      data: {
        titulo,
        subtitulo,
        descricao,
        data,
        hora_inicio,
        hora_termino,
        local,
      },
    });

    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const imageLinks = req.files.map((file) => ({
      eventId: evento.id,
      value: `http://127.0.0.1:5500/backend/src/documents/${file.filename}`,
    }));

    await prisma.event_images.createMany({ data: imageLinks });

    res.status(201).json({ message: "Evento criado com sucesso!", evento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o evento." });
  }
}
