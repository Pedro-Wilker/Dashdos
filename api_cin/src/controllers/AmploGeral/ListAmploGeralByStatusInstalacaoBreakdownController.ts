import { Request, Response } from 'express';
import { ListAmploGeralByStatusInstalacaoBreakdown } from '../../services/AmploGeral/ListAmploGeralByStatusInstalacaoBreakdown';

export class ListAmploGeralByStatusInstalacaoBreakdownController {
  async handle(req: Request, res: Response) {
    const service = new ListAmploGeralByStatusInstalacaoBreakdown();

    try {
      const result = await service.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar cidades por status de instalação', details: error.message });
    }
  }
}