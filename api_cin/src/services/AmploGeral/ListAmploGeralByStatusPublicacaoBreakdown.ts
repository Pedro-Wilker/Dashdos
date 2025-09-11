import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByStatusPublicacaoBreakdown {
  async execute() {
    const totalCitiesWithStatus = await prisma.cin_amplo_geral.count({
      where: {
        status_publicacao: {
          in: ['publicado', 'aguardando_publicacao'],
        },
      },
    });

    const publishedCities = await prisma.cin_amplo_geral.findMany({
      where: {
        status_publicacao: 'publicado',
      },
      select: {
        id: true,
        nome_municipio: true,
        status_publicacao: true,
      },
    });

    const awaitingPublicationCities = await prisma.cin_amplo_geral.findMany({
      where: {
        status_publicacao: 'aguardando_publicacao',
      },
      select: {
        id: true,
        nome_municipio: true,
        status_publicacao: true,
      },
    });

    const publishedCount = publishedCities.length;
    const awaitingCount = awaitingPublicationCities.length;
    const publishedPercentage = totalCitiesWithStatus > 0 ? (publishedCount / totalCitiesWithStatus) * 100 : 0;
    const awaitingPercentage = totalCitiesWithStatus > 0 ? (awaitingCount / totalCitiesWithStatus) * 100 : 0;

    return {
      publishedCount,
      awaitingCount,
      totalCitiesWithStatus,
      publishedPercentage: Number(publishedPercentage.toFixed(2)),
      awaitingPercentage: Number(awaitingPercentage.toFixed(2)),
      publishedCities,
      awaitingPublicationCities,
    };
  }
}