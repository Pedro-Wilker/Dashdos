import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByStatusInstalacaoBreakdown {
  async execute() {
    const totalCitiesWithStatus = await prisma.cin_amplo_geral.count({
      where: {
        status_instalacao: {
          in: ['instalado', 'aguardando_instalacao'],
        },
      },
    });

    const installedCities = await prisma.cin_amplo_geral.findMany({
      where: {
        status_instalacao: 'instalado',
      },
      select: {
        id: true,
        nome_municipio: true,
        status_instalacao: true,
      },
    });

    const awaitingInstallationCities = await prisma.cin_amplo_geral.findMany({
      where: {
        status_instalacao: 'aguardando_instalacao',
      },
      select: {
        id: true,
        nome_municipio: true,
        status_instalacao: true,
      },
    });

    const installedCount = installedCities.length;
    const awaitingCount = awaitingInstallationCities.length;
    const installedPercentage = totalCitiesWithStatus > 0 ? (installedCount / totalCitiesWithStatus) * 100 : 0;
    const awaitingPercentage = totalCitiesWithStatus > 0 ? (awaitingCount / totalCitiesWithStatus) * 100 : 0;

    return {
      installedCount,
      awaitingCount,
      totalCitiesWithStatus,
      installedPercentage: Number(installedPercentage.toFixed(2)),
      awaitingPercentage: Number(awaitingPercentage.toFixed(2)),
      installedCities,
      awaitingInstallationCities,
    };
  }
}