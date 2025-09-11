import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByStatusPublicacaoService {
  async execute() {
    const totalCities = await prisma.cin_amplo_geral.count();

    const publicadoCities = await prisma.cin_amplo_geral.findMany({
      where: { status_publicacao: 'publicado' },
      select: { nome_municipio: true },
    });

    const aguardandoPublicacaoCities = await prisma.cin_amplo_geral.findMany({
      where: { status_publicacao: 'aguardando_publicacao' },
      select: { nome_municipio: true },
    });

    return {
      total_cities: totalCities,
      publicado: publicadoCities.map(city => city.nome_municipio),
      aguardando_publicacao: aguardandoPublicacaoCities.map(city => city.nome_municipio),
    };
  }
}