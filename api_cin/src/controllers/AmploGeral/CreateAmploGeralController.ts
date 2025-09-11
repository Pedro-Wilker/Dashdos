import { Request, Response } from 'express';
import { CreateAmploGeralService } from '../../services/AmploGeral/CreateAmploGeralService';
import { StatusVisita, StatusPublicacao, StatusInstalacao } from '@prisma/client';

export class CreateAmploGeralController {
  async handle(req: Request, res: Response) {
    const registros = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    if (!Array.isArray(registros) || registros.length === 0) {
      return res.status(400).json({ error: 'Nenhum registro enviado.' });
    }

    const service = new CreateAmploGeralService();
    const resultados = [];

    for (const registro of registros) {
      const {
        nome_municipio,
        status_infra,
        cidade_visita,
        periodo_visita,
        periodo_instalacao,
        data_visita,
        data_instalacao,
        status_visita,
        status_publicacao,
        status_instalacao,
        publicacao,
      } = registro;

      // Validação dos campos obrigatórios
      if (
        !nome_municipio ||
        !status_infra ||
        cidade_visita === undefined ||
        !status_visita ||
        !status_publicacao ||
        !status_instalacao ||
        !publicacao
      ) {
        return res.status(400).json({
          error: `Campos obrigatórios ausentes no município "${nome_municipio}".`,
        });
      }

      if (cidade_visita) {
        if (!periodo_visita || !periodo_instalacao) {
          return res.status(400).json({
            error: `Para cidades com visita, período de visita e instalação são obrigatórios no município "${nome_municipio}".`,
          });
        }
      } else {
        if (!data_visita || !data_instalacao) {
          return res.status(400).json({
            error: `Para cidades sem visita, data de visita e instalação são obrigatórios no município "${nome_municipio}".`,
          });
        }
      }

      try {
        const result = await service.execute(
          {
            nome_municipio,
            status_infra,
            cidade_visita,
            periodo_visita: cidade_visita ? new Date(periodo_visita) : undefined,
            periodo_instalacao: cidade_visita ? new Date(periodo_instalacao) : undefined,
            data_visita: !cidade_visita ? new Date(data_visita) : undefined,
            data_instalacao: !cidade_visita ? new Date(data_instalacao) : undefined,
            status_visita,
            status_publicacao,
            status_instalacao,
            publicacao: new Date(publicacao),
          },
          token
        );
        resultados.push(result);
      } catch (error: any) {
        return res.status(400).json({
          error: `Erro ao criar município "${nome_municipio}": ${error.message}`,
        });
      }
    }

    return res.status(201).json({
      message: 'Registros criados com sucesso.',
      resultados,
    });
  }
}