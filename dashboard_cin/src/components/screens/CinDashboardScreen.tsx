import { lazy, Suspense, useState, useEffect } from 'react';
import { Box, Grid, Button, VStack, useColorModeValue, Heading, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import MetricCard from '../dashboard/MetricCard';
import DashboardCard from '../dashboard/DashboardCard';
import MainSection from '../dashboard/MainSection';
import CityLists from '../dashboard/CityLists';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  getVisitedCities,
  getStatusVisitaBreakdown,
  getStatusPublicacaoBreakdown,
  getStatusInstalacaoBreakdown,
  getAmploGeral,
  getGeralMensal,
} from '../../services/api';
import { useAppContext } from '../../contexts/AppContext';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  City,
  ApiResponse,
  VisitedCitiesResponse,
  StatusVisitaBreakdownResponse,
  StatusPublicacaoBreakdownResponse,
  StatusInstalacaoBreakdownResponse,
  MonthlyData,
} from '../../types';
import { ErrorBoundary } from 'react-error-boundary';
import { PresentationChartBarIcon, ChartBarIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const PieChartSection = lazy(() => import('../dashboard/PieChartSection'));
const HeatMapSection = lazy(() => import('../dashboard/HeatMapSection'));
const Slideshow = lazy(() => import('../dashboard/Slideshow'));

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => (
  <Box>
    Erro ao carregar componente: {error.message}
  </Box>
);

interface CardData {
  [key: string]: {
    percentage: number | null;
    cities: City[] | null;
  };
}

interface ListsData {
  visits: (City & { NOME: string; daysLeft: number })[];
  installations: (City & { NOME: string; daysLeft: number })[];
}

const CinDashboard = () => {
  const [mode, setMode] = useState<'interativa' | 'slideshow' | null>(null);
  const { setSelectedCity, setCardData } = useAppContext();
  const bgMain = useColorModeValue('bg.main._light', 'bg.main._dark');
  const textColor = useColorModeValue('text._light', 'text._dark');

  const { data: cardData, isLoading, error } = useQuery<CardData | null>({
    queryKey: ['cardData', mode],
    queryFn: async () => {
      if (mode !== 'interativa') return null;

      const [
        visitedRes,
        visitaBreakdownRes,
        publicacaoRes,
        instalacaoRes,
        amploGeralRes,
      ] = await Promise.all([
        getVisitedCities() as Promise<AxiosResponse<ApiResponse<VisitedCitiesResponse>>>,
        getStatusVisitaBreakdown() as Promise<
          AxiosResponse<ApiResponse<StatusVisitaBreakdownResponse>>
        >,
        getStatusPublicacaoBreakdown() as Promise<
          AxiosResponse<ApiResponse<StatusPublicacaoBreakdownResponse>>
        >,
        getStatusInstalacaoBreakdown() as Promise<
          AxiosResponse<ApiResponse<StatusInstalacaoBreakdownResponse>>
        >,
        getAmploGeral(),
      ]);

      const data: CardData = {
        '343 Cidades': {
          percentage: null,
          cities: amploGeralRes.data.data || [],
        },
        Visitados: {
          percentage: visitedRes.data.data.percentage ?? null,
          cities: visitedRes.data.data.visitedCities ?? [],
        },
        Aprovados: {
          percentage: visitaBreakdownRes.data.data.approvedPercentage ?? null,
          cities: visitaBreakdownRes.data.data.approvedCities ?? [],
        },
        Reprovados: {
          percentage: visitaBreakdownRes.data.data.rejectedPercentage ?? null,
          cities: visitaBreakdownRes.data.data.rejectedCities ?? [],
        },
        Publicados: {
          percentage: publicacaoRes.data.data.publishedPercentage ?? null,
          cities: publicacaoRes.data.data.publishedCities ?? [],
        },
        Instalados: {
          percentage: instalacaoRes.data.data.installedPercentage ?? null,
          cities: instalacaoRes.data.data.installedCities ?? [],
        },
        'AG. Instalação': {
          percentage: instalacaoRes.data.data.awaitingPercentage ?? null,
          cities: instalacaoRes.data.data.awaitingInstallationCities ?? [],
        },
      };
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: listsData } = useQuery<ListsData>({
    queryKey: ['listsData', mode],
    queryFn: async () => {
      const amploRes = await getAmploGeral();
      const amploData = Array.isArray(amploRes.data.data) ? amploRes.data.data : [];

      const today = new Date('2025-09-18');
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const visits = amploData
        .filter(
          (city: City) =>
            city?.data_visita &&
            new Date(city.data_visita) <= sevenDaysFromNow &&
            new Date(city.data_visita) >= today
        )
        .map((city: City) => ({
          ...city,
          NOME: city.nome_municipio || 'Unknown',
          daysLeft: Math.ceil((new Date(city.data_visita!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        }));

      const installations = amploData
        .filter(
          (city: City) =>
            city?.data_instalacao &&
            new Date(city.data_instalacao) <= sevenDaysFromNow &&
            new Date(city.data_instalacao) >= today
        )
        .map((city: City) => ({
          ...city,
          NOME: city.nome_municipio || 'Unknown',
          daysLeft: Math.ceil((new Date(city.data_instalacao!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        }));

      return { visits, installations };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: mode === 'interativa',
  });

  const { data: metricData } = useQuery({
    queryKey: ['metricData', mode],
    queryFn: async () => {
      if (mode !== 'interativa') return null;

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
    enabled: mode === 'interativa',
  });

  useEffect(() => {
    if (cardData !== undefined) {
      setCardData(cardData);
    }
  }, [cardData, setCardData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Box>Erro ao carregar dados: {(error as Error).message}</Box>;

  if (mode === null) {
    return (
      <VStack spacing="space.xl" align="center" justify="center" h="100vh" bg={bgMain} color={textColor}>
        <Heading as="h1" size="2xl">Bem-vindo ao Dashboard CIN</Heading>
        <Flex gap="space.md">
          <Button colorScheme="brand" onClick={() => setMode('interativa')}>
            Modo Interativo
          </Button>
          <Button colorScheme="brand" onClick={() => setMode('slideshow')}>
            Modo Slideshow
          </Button>
        </Flex>
      </VStack>
    );
  }

  if (mode === 'slideshow') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Slideshow setMode={setMode} setSelectedCity={setSelectedCity} />
      </Suspense>
    );
  }

  return (
    <Box bg={bgMain} minH="100vh" pt="96px" pb="space.xl" px="space.lg" color={textColor}>
      <VStack spacing="space.xl" align="stretch">
        {/* Metric Cards Section */}
        {metricData && (
          <Box mt="space.xl" mb="space.xl">
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

        {/* Dashboard Cards Section */}
        {cardData && Object.keys(cardData).length > 0 && (
          <Box
            bg="bg.card"
            borderRadius="lg"
            p="space.lg"
            boxShadow="var(--shadow-card)"
            mt="space.xl"
            mb="space.xl"
          >
            <Grid
              templateColumns={{
                base: 'repeat(auto-fit, minmax(150px, 1fr))',
                md: 'repeat(auto-fit, minmax(180px, 1fr))',
                lg: 'repeat(7, minmax(200px, 1fr))',
              }}
              gap="space.md"
            >
              {Object.keys(cardData).map((title) => (
                <DashboardCard
                  key={title}
                  title={title}
                  percentage={cardData[title].percentage}
                  cities={cardData[title].cities || []}
                />
              ))}
            </Grid>
          </Box>
        )}

        {/* Main Sections */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingSpinner />}>
            <MainSection />
            <HeatMapSection />
            {listsData && (
              <CityLists visits={listsData.visits} installations={listsData.installations} />
            )}
            <PieChartSection />
          </Suspense>
        </ErrorBoundary>

        {/* Back Button */}
        <Button
          leftIcon={<ArrowBackIcon />}
          colorScheme="brand"
          variant="outline"
          mt="space.xl"
          alignSelf="start"
          onClick={() => setMode(null)}
        >
          Voltar
        </Button>
      </VStack>
    </Box>
  );
};

export default CinDashboard;