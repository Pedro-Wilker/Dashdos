import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductivityFilter {
  ano: number;
  limit?: number;
}

export class ListTopAndLeastProductiveCitiesService {
  async execute({ ano, limit = 5 }: ProductivityFilter) {
    const topCities = await prisma.produtividade_diaria_cin.groupBy({
      by: ['cin_amplo_geral_id'],
      where: {
        data: {
          gte: new Date(`${ano}-01-01`),
          lte: new Date(`${ano}-12-31T23:59:59.999Z`),
        },
      },
      _sum: {
        quantidade: true,
      },
      orderBy: {
        _sum: {
          quantidade: 'desc',
        },
      },
      take: limit,
    });

    const leastCities = await prisma.produtividade_diaria_cin.groupBy({
      by: ['cin_amplo_geral_id'],
      where: {
        data: {
          gte: new Date(`${ano}-01-01`),
          lte: new Date(`${ano}-12-31T23:59:59.999Z`),
        },
      },
      _sum: {
        quantidade: true,
      },
      orderBy: {
        _sum: {
          quantidade: 'asc',
        },
      },
      take: limit,
    });

    // Fetch nome_municipio for all city IDs
    const cityIds = [...new Set([...topCities, ...leastCities].map(city => city.cin_amplo_geral_id))];
    const cities = await prisma.cin_amplo_geral.findMany({
      where: { id: { in: cityIds } },
      select: { id: true, nome_municipio: true },
    });

    return {
      topCities: topCities.map(city => ({
        nome_municipio: cities.find(c => c.id === city.cin_amplo_geral_id)?.nome_municipio || 'Unknown',
        total_quantidade: city._sum.quantidade || 0,
      })),
      leastCities: leastCities.map(city => ({
        nome_municipio: cities.find(c => c.id === city.cin_amplo_geral_id)?.nome_municipio || 'Unknown',
        total_quantidade: city._sum.quantidade || 0,
      })),
    };
  }
}