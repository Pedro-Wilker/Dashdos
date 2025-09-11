import { Request, Response } from 'express';
import { ListByInstalacaoAmploGeralService } from '../../services/AmploGeral/ListAmploGeralByInstalacaoService';

export class ListByInstalacaoAmploGeralController {
  async handle(req: Request, res: Response) {
    const { periodo_instalacao } = req.query;

    // Log da requisição
    console.log('Route hit: GET /api/amplo-geral/instalacao');
    console.log('Received instalacao:', periodo_instalacao, 'Type:', typeof periodo_instalacao);

    // Validação do parâmetro
    if (!periodo_instalacao || typeof periodo_instalacao !== 'string') {
      return res.status(400).json({ error: 'É preciso inserir uma data válida.' });
    }

    if (isNaN(Date.parse(periodo_instalacao))) {
      return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
    }

    // Log da data parseada
    console.log('Parsed date:', new Date(periodo_instalacao).toISOString());

    const service = new ListByInstalacaoAmploGeralService();

    try {
      const result = await service.execute(periodo_instalacao);
      // Log do resultado
      console.log('Returning records:', result.length);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}