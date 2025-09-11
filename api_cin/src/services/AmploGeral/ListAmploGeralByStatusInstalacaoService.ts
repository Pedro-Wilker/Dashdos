import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByStatusInstalacaoService {
  async execute() {
    const totalCities = await prisma.cin_amplo_geral.count();

    const instaladoCities = await prisma.cin_amplo_geral.findMany({
      where: { status_instalacao: 'instalado' },
      select: { nome_municipio: true },
    });

    const aguardandoInstalacaoCities = await prisma.cin_amplo_geral.findMany({
      where: { status_instalacao: 'aguardando_instalacao' },
      select: { nome_municipio: true },
    });

    return {
      total_cities: totalCities,
      instalado: instaladoCities.map(city => city.nome_municipio),
      aguardando_instalacao: aguardandoInstalacaoCities.map(city => city.nome_municipio),
    };
  }
}