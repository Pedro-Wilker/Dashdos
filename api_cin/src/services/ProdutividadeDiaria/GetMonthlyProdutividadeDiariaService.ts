import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MonthlyProductivityFilter {
  cin_amplo_geral_id: number;
  ano: number;
}

export class GetMonthlyProductivityService {
  async execute({ cin_amplo_geral_id, ano }: MonthlyProductivityFilter) {
    const municipio = await prisma.cin_amplo_geral.findUnique({
      where: { id: cin_amplo_geral_id },
      select: { nome_municipio: true },
    });
    if (!municipio) {
      throw new Error('Município não encontrado em cin_amplo_geral');
    }

    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
    ];
    const result: { [key: string]: number } = {};

    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(`${ano}-${String(i + 1).padStart(2, '0')}-01`);
      const monthEnd = new Date(ano, i + 1, 0, 23, 59, 59, 999);

      const total = await prisma.produtividade_diaria_cin.aggregate({
        where: {
          cin_amplo_geral_id,
          data: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          quantidade: true,
        },
      });

      result[months[i]] = total._sum.quantidade || 0;
    }

    return { nome_municipio: municipio.nome_municipio, ano, ...result };
  }
}