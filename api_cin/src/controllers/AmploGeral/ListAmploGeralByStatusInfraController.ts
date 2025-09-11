import { Request, Response } from 'express';
import { ListAmploGeralByStatusInfraService } from '../../services/AmploGeral/ListAmploGeralByStatusInfraService';

export class ListAmploGeralByStatusInfraController {
  async handle(req: Request, res: Response) {
    const { status_infra } = req.query;

    if (!status_infra || typeof status_infra !== 'string') {
      return res.status(400).json({ error: 'É necessario inserir o status da infraestrutura.' });
    }

    const service = new ListAmploGeralByStatusInfraService();

    try {
      const result = await service.execute(status_infra);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}