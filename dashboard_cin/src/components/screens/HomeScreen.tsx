import { useQuery } from '@tanstack/react-query';
import { Box, Grid, VStack, useColorModeValue } from '@chakra-ui/react';
import MetricCard from '../dashboard/MetricCard';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  getGeralMensal,
  getStatusVisitaBreakdown,
  getStatusInstalacaoBreakdown,
} from '../../services/api';
import { PresentationChartBarIcon, ChartBarIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { MonthlyData } from '../../types';
import './styles/HomeScreen.css';

interface MetricData {
  producaoMensal: {
    value: number;
    trend: {
      value: number;
      label: string;
      isPositive: boolean;
    };
  };
  producaoAnual: {
    value: number;
    subtitle: string;
    trend: {
      value: number;
      label: string;
      isPositive: boolean;
    };
  };
  cidadesContempladas: {
    value: number;
  };
  cidadesInstaladas: {
    value: number;
    donutPercentage: number;
  };
}

export function HomeScreen() {
  const bgMain = useColorModeValue('bg.main._light', 'bg.main._dark');
  const textColor = useColorModeValue('text._light', 'text._dark');

  const { data: metricData, isLoading, error } = useQuery<MetricData, Error>({
    queryKey: ['metricData'],
    queryFn: async () => {
      const geralMensalRes = await getGeralMensal();
      const visitaBreakdownRes = await getStatusVisitaBreakdown();
      const instalacaoRes = await getStatusInstalacaoBreakdown();

      const monthlyData: MonthlyData[] = geralMensalRes.data.data || [];
      const currentMonth = '2025-09';
      const currentMonthData = monthlyData.find((d) => d.monthYear === currentMonth);
      const previousMonthData = monthlyData.find((d) => d.monthYear === '2025-08');

      const monthlyProduction = currentMonthData?.quantidade || 0;
      const monthlyGrowth = previousMonthData
        ? ((monthlyProduction - previousMonthData.quantidade) / previousMonthData.quantidade) * 100
        : 0;

      const annualProduction = monthlyData.reduce((sum, d) => sum + d.quantidade, 0);
      const totalUntilPreviousMonth = monthlyData
        .filter((d) => d.monthYear < currentMonth)
        .reduce((sum, d) => sum + d.quantidade, 0);
      const annualContribution = totalUntilPreviousMonth
        ? (monthlyProduction / totalUntilPreviousMonth) * 100
        : 0;

      return {
        producaoMensal: {
          value: monthlyProduction,
          trend: {
            value: Number(monthlyGrowth.toFixed(1)),
            label: 'vs. mês anterior',
            isPositive: monthlyGrowth >= 0,
          },
        },
        producaoAnual: {
          value: annualProduction,
          subtitle: `Mês atual: ${monthlyProduction.toLocaleString('pt-BR')}`,
          trend: {
            value: Number(annualContribution.toFixed(1)),
            label: 'Contribuição mensal',
            isPositive: true,
          },
        },
        cidadesContempladas: {
          value: visitaBreakdownRes.data.data.totalCitiesWithStatus || 0,
        },
        cidadesInstaladas: {
          value: instalacaoRes.data.data.totalCitiesWithStatus || 0,
          donutPercentage: instalacaoRes.data.data.installedPercentage || 0,
        },
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Box>Erro ao carregar dados: {(error as Error).message}</Box>;

  return (
    <Box bg={bgMain} minH="100vh" pt="96px" pb="space.xl" px="space.lg" color={textColor} className="home-screen">
      <VStack spacing="space.xl" align="stretch">
        {metricData && (
          <Box mt="space.xl" mb="space.xl" className="metric-section">
            <Grid
              templateColumns={{
                base: 'repeat(auto-fit, minmax(160px, 1fr))',
                md: 'repeat(4, minmax(180px, 1fr))',
              }}
              gap="space.xs"
              px="space.lg"
            >
              <MetricCard
                title="Produção Mensal"
                value={metricData.producaoMensal.value}
                icon={PresentationChartBarIcon}
                variant="primary"
                trend={metricData.producaoMensal.trend}
              />
              <MetricCard
                title="Produção Anual"
                value={metricData.producaoAnual.value}
                subtitle={metricData.producaoAnual.subtitle}
                icon={ChartBarIcon}
                variant="secondary"
                trend={metricData.producaoAnual.trend}
              />
              <MetricCard
                title="Cidades Contempladas"
                value={metricData.cidadesContempladas.value}
                icon={MapPinIcon}
                variant="accent"
              />
              <MetricCard
                title="Cidades Instaladas"
                value={metricData.cidadesInstaladas.value}
                icon={CheckCircleIcon}
                variant="success"
                donutPercentage={metricData.cidadesInstaladas.donutPercentage}
              />
            </Grid>
          </Box>
        )}
      </VStack>
    </Box>
  );
}