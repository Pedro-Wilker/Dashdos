import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByVisitedCities {
  async execute() {
    const totalCities = await prisma.cin_amplo_geral.count();
    const visitedCities = await prisma.cin_amplo_geral.findMany({
      where: {
        periodo_visita: {
          not: null,
        },
      },
      select: {
        id: true,
        nome_municipio: true,
        periodo_visita: true,
      },
    });

    const visitedCount = visitedCities.length;
    const percentage = totalCities > 0 ? (visitedCount / totalCities) * 100 : 0;

    return {
      visitedCount,
      totalCities,
      percentage: Number(percentage.toFixed(2)),
      visitedCities,
    };
  }
}