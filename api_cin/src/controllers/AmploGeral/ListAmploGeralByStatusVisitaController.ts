import { Request, Response } from 'express';
import { ListAmploGeralByStatusVisitaService } from '../../services/AmploGeral/ListAmploGeralByStatusVisitaService';
import { StatusVisita } from '@prisma/client';

export class ListAmploGeralByStatusVisitaController {
  async handle(req: Request, res: Response) {
    const { status_visita } = req.query;

    if (!status_visita || typeof status_visita !== 'string') {
      return res.status(400).json({ error: 'status_visita é obrigatório e deve ser uma string' });
    }

    if (!Object.values(StatusVisita).includes(status_visita as StatusVisita)) {
      return res.status(400).json({ error: 'status_visita deve ser Aprovado ou Reprovado' });
    }

    const service = new ListAmploGeralByStatusVisitaService();

    try {
      const result = await service.execute(status_visita as StatusVisita);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}   