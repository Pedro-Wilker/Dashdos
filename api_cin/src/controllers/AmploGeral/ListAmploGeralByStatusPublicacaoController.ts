import { Request, Response } from 'express';
import { ListAmploGeralByStatusPublicacaoService } from '../../services/AmploGeral/ListAmploGeralByStatusPublicacaoService';

export class ListAmploGeralByStatusPublicacaoController {
  async handle(req: Request, res: Response) {
    const service = new ListAmploGeralByStatusPublicacaoService();

    try {
      const result = await service.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}