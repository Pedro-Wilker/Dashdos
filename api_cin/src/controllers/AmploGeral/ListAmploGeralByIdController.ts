import { Request, Response } from 'express';
import { ListByIdAmploGeralService } from '../../services/AmploGeral/ListAmploGeralByIdService';

export class ListByIdAmploGeralController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const service = new ListByIdAmploGeralService();

    try {
      const result = await service.execute(Number(id));
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }
}