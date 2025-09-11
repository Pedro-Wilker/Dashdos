import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListProdutividadeByCidade {
  async execute(nome_municipio: string) {
    const city = await prisma.cin_amplo_geral.findFirst({
      where: {
        nome_municipio: {
          equals: nome_municipio,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      select: {
        id: true,
        nome_municipio: true,
        produtividades_diarias: {
          select: {
            data: true,
            quantidade: true,
          },
        },
      },
    });

    if (!city) {
      return null; // Return null if city not found
    }

    const totalProdutividade = city.produtividades_diarias.reduce((sum, prod) => sum + prod.quantidade, 0);

    const monthlyProdutividade = city.produtividades_diarias.reduce((acc, prod) => {
      const monthYear = `${prod.data.getFullYear()}-${(prod.data.getMonth() + 1).toString().padStart(2, '0')}`;
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += prod.quantidade;
      return acc;
    }, {} as Record<string, number>);

    const monthlyBreakdown = Object.entries(monthlyProdutividade).map(([monthYear, quantidade]) => ({
      monthYear,
      quantidade,
    }));

    return {
      nome_municipio: city.nome_municipio,
      totalProdutividade,
      monthlyProdutividade: monthlyBreakdown.sort((a, b) => a.monthYear.localeCompare(b.monthYear)),
    };
  }
}