import { PrismaClient, Cargo, StatusVisita, StatusPublicacao, StatusInstalacao } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface CreateAmploGeralData {
  nome_municipio: string;
  status_infra: string;
  cidade_visita: boolean;
  periodo_visita?: Date;
  periodo_instalacao?: Date;
  data_visita?: Date;
  data_instalacao?: Date;
  status_visita: StatusVisita;
  status_publicacao: StatusPublicacao;
  status_instalacao: StatusInstalacao;
  publicacao: Date;
}

export class CreateAmploGeralService {
  async execute(data: CreateAmploGeralData, token: string) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não foi configurada');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }

    const allowedRoles = [Cargo.ADMIN, Cargo.DIRETORIA, Cargo.CARTA];
    if (!allowedRoles.includes(decoded.cargo)) {
      throw new Error('Usuário não tem permissão para criar dados em Amplo Geral');
    }

    const existingRecord = await prisma.cin_amplo_geral.findUnique({
      where: { nome_municipio: data.nome_municipio },
    });

    if (existingRecord) {
      throw new Error('Este município já possui cadastro');
    }

    const amploGeral = await prisma.cin_amplo_geral.create({
      data: {
        nome_municipio: data.nome_municipio,
        status_infra: data.status_infra,
        cidade_visita: data.cidade_visita,
        periodo_visita: data.cidade_visita ? data.periodo_visita : null,
        periodo_instalacao: data.cidade_visita ? data.periodo_instalacao : null,
        data_visita: !data.cidade_visita ? data.data_visita : null,
        data_instalacao: !data.cidade_visita ? data.data_instalacao : null,
        status_visita: data.status_visita,
        status_publicacao: data.status_publicacao,
        status_instalacao: data.status_instalacao,
        publicacao: data.publicacao,
      },
    });

    return { message: 'Amplo Geral criado', amploGeralId: amploGeral.id };
  }
}