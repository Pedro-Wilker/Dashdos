import { Request, Response } from 'express';
import { ListAllAmploGeralService } from '../../services/AmploGeral/ListAllAmploGeralService';

export class ListAllAmploGeralController {
  async handle(req: Request, res: Response) {
    const service = new ListAllAmploGeralService();

    try {
      const result = await service.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}