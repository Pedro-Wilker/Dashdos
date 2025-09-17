import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListAmploGeralByMunicipioAutocompleteService {
  async execute(query: string, limit: number = 10) {
    const cities = await prisma.cin_amplo_geral.findMany({
      where: {
        nome_municipio: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        nome_municipio: true
      },
      take: limit,
      orderBy: { nome_municipio: 'asc' }
    });

    return cities;
  }
}