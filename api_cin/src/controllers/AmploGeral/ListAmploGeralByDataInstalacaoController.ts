import { Request, Response } from 'express';
import { ListAmploGeralByDataInstalacao } from '../../services/AmploGeral/ListAmploGeralByDataInstalacaoService'; 

export class ListAmploGeralByDataInstalacaoController {
  async handle(req: Request, res: Response) {
    const service = new ListAmploGeralByDataInstalacao();

    try {
      const result = await service.execute();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar cidades instaladas recentemente', details: error.message });
    }
  }
}