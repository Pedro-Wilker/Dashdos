import { Request, Response } from 'express';
import { ListAmploGeralByStatusVisitaBreakdown } from '../../services/AmploGeral/ListAmploGeralByStatusVisitaBreakdown';

export class ListAmploGeralByStatusVisitaBreakdownController {
  async handle(req: Request, res: Response) {
    const service = new ListAmploGeralByStatusVisitaBreakdown();

    try {
      const result = await service.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar cidades por status de visita', details: error.message });
    }
  }
}