import { Request, Response } from 'express';
import { ListAmploGeralPublicacaoService } from '../../services/AmploGeral/ListAmploGeralPublicacaoService';

export class ListAmploGeralPublicacaoController {
  async handle(req: Request, res: Response) {
    const { publicacao } = req.query;

    if (!publicacao || typeof publicacao !== 'string') {
      return res.status(400).json({ error: 'É preciso inserir uma data válida.' });
    }

    const service = new ListAmploGeralPublicacaoService();

    try {
      const result = await service.execute(publicacao);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}