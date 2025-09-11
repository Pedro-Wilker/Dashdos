import { Request, Response } from 'express';
import { ListAmploGeralByPeriodoVisitaService } from '../../services/AmploGeral/ListAmploGeralByPeriodoVisitaService';

export class ListAmploGeralByPeriodoVisitaController {
  async handle(req: Request, res: Response) {
    const { periodo_visita } = req.query;

    if (!periodo_visita || typeof periodo_visita !== 'string') {
      return res.status(400).json({ error: 'É preciso inserir uma data válida.' });
    }

    const service = new ListAmploGeralByPeriodoVisitaService();

    try {
      const result = await service.execute(periodo_visita);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}