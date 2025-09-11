import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ListProdutividadeGeralMensal {
  async execute(limit?: number) {
    const produtividades = await prisma.produtividade_diaria_cin.findMany({
      select: {
        data: true,
        quantidade: true,
      },
    });

    const monthlyTotals = produtividades.reduce((acc, prod) => {
      const monthYear = `${prod.data.getFullYear()}-${(prod.data.getMonth() + 1).toString().padStart(2, '0')}`;
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += prod.quantidade;
      return acc;
    }, {} as Record<string, number>);

    const result = Object.entries(monthlyTotals).map(([monthYear, quantidade]) => ({
      monthYear,
      quantidade,
    }));

    const sortedResult = result.sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    // Apply limit if provided
    return limit !== undefined ? sortedResult.slice(0, limit) : sortedResult;
  }
}