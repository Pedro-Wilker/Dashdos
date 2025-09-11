import { Request, Response } from 'express';
import { ListAmploGeralByStatusInstalacaoService } from '../../services/AmploGeral/ListAmploGeralByStatusInstalacaoService';

export class ListAmploGeralByStatusInstalacaoController {
  async handle(req: Request, res: Response) {
    const service = new ListAmploGeralByStatusInstalacaoService();

    try {
      const result = await service.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}