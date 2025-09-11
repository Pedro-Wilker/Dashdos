import { Request, Response } from 'express';
import { ListByNomeMunicipioAmploGeralService } from '../../services/AmploGeral/ListAmploGeralByMunicipioService';

export class ListByNomeMunicipioAmploGeralController {
  async handle(req: Request, res: Response) {
    const { nome_municipio } = req.query;

    if (!nome_municipio || typeof nome_municipio !== 'string') {
      return res.status(400).json({ error: 'É necessario inserir o nome do município.' });
    }

    const service = new ListByNomeMunicipioAmploGeralService();

    try {
      const result = await service.execute(nome_municipio);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}