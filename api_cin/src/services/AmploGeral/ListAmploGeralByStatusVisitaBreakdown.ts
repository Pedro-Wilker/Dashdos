import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByStatusVisitaBreakdown {
  async execute() {
    const totalCitiesWithStatus = await prisma.cin_amplo_geral.count({
      where: {
        status_visita: {
          in: ['Aprovado', 'Reprovado'],
        },
      },
    });

    const approvedCities = await prisma.cin_amplo_geral.findMany({
      where: {
        status_visita: 'Aprovado',
      },
      select: {
        id: true,
        nome_municipio: true,
        status_visita: true,
      },
    });

    const rejectedCities = await prisma.cin_amplo_geral.findMany({
      where: {
        status_visita: 'Reprovado',
      },
      select: {
        id: true,
        nome_municipio: true,
        status_visita: true,
      },
    });

    const approvedCount = approvedCities.length;
    const rejectedCount = rejectedCities.length;
    const approvedPercentage = totalCitiesWithStatus > 0 ? (approvedCount / totalCitiesWithStatus) * 100 : 0;
    const rejectedPercentage = totalCitiesWithStatus > 0 ? (rejectedCount / totalCitiesWithStatus) * 100 : 0;

    return {
      approvedCount,
      rejectedCount,
      totalCitiesWithStatus,
      approvedPercentage: Number(approvedPercentage.toFixed(2)),
      rejectedPercentage: Number(rejectedPercentage.toFixed(2)),
      approvedCities,
      rejectedCities,
    };
  }
}