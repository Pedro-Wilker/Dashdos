import { Request, Response } from 'express';
import { ListAmploGeralByStatusPublicacaoBreakdown } from '../../services/AmploGeral/ListAmploGeralByStatusPublicacaoBreakdown';

export class ListAmploGeralByStatusPublicacaoBreakdownController {
  async handle(req: Request, res: Response) {
    const service = new ListAmploGeralByStatusPublicacaoBreakdown();

    try {
      const result = await service.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar cidades por status de publicação', details: error.message });
    }
  }
}