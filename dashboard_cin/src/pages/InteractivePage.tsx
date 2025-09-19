import { useEffect } from 'react';
import { Box, VStack, Button, useColorModeValue, Grid } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { HomeScreen } from '../components/screens/HomeScreen';
import DashboardCard from '../components/dashboard/DashboardCard';
import { CityTable } from '../components/dashboard/CityTable';
import MainSection from '../components/dashboard/MainSection';
import CityLists from '../components/dashboard/CityLists';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  getVisitedCities,
  getStatusVisitaBreakdown,
  getStatusPublicacaoBreakdown,
  getStatusInstalacaoBreakdown,
  getAmploGeral,
} from '../services/api';
import { useAppContext } from '../contexts/AppContext';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { City } from '../types';
import './styles/InteractivePage.css';

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

const ErrorFallback = ({ error }: { error: Error }) => (
  <Box>
    Erro ao carregar componente: {error.message}
  </Box>
);

export function InteractivePage() {
  const { setSelectedCity, setCardData } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isFullDashboard = location.pathname.includes('/full');
  const bgMain = useColorModeValue('bg.main._light', 'bg.main._dark');
  const textColor = useColorModeValue('text._light', 'text._dark');

  const { data: cardData, isLoading, error } = useQuery<CardData | null>({
    queryKey: ['cardData'],
    queryFn: async () => {
      const [
        visitedRes,
        visitaBreakdownRes,
        publicacaoRes,
        instalacaoRes,
        amploGeralRes,
      ] = await Promise.all([
        getVisitedCities(),
        getStatusVisitaBreakdown(),
        getStatusPublicacaoBreakdown(),
        getStatusInstalacaoBreakdown(),
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
    enabled: isFullDashboard,
  });

  const { data: listsData } = useQuery<ListsData>({
    queryKey: ['listsData'],
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
    enabled: isFullDashboard,
  });

  useEffect(() => {
    if (cardData !== undefined) {
      setCardData(cardData);
    }
  }, [cardData, setCardData]);

  if (isLoading && isFullDashboard) return <LoadingSpinner />;
  if (error && isFullDashboard) return <Box>Erro ao carregar dados: {(error as Error).message}</Box>;

  return (
    <Box bg={bgMain} minH="100vh" pt="96px" pb="space.xl" px="space.lg" color={textColor} className="interactive-page">
      <VStack spacing="space.xl" align="stretch">
        {isFullDashboard ? (
          <>
            <Box
              bg="bg.card"
              borderRadius="lg"
              p="space.lg"
              boxShadow="var(--shadow-card)"
              mt="space.xl"
              mb="space.xl"
              className="dashboard-cards-section"
            >
              <Grid
                templateColumns={{
                  base: 'repeat(auto-fit, minmax(150px, 1fr))',
                  md: 'repeat(auto-fit, minmax(180px, 1fr))',
                  lg: 'repeat(7, minmax(200px, 1fr))',
                }}
                gap="space.md"
              >
                {cardData &&
                  Object.keys(cardData).map((title) => (
                    <DashboardCard
                      key={title}
                      title={title}
                      percentage={cardData[title].percentage}
                      cities={cardData[title].cities || []}
                    />
                  ))}
              </Grid>
            </Box>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <MainSection />
              <CityTable />
              {listsData && (
                <CityLists visits={listsData.visits} installations={listsData.installations} />
              )}
            </ErrorBoundary>
            <Button
              leftIcon={<ArrowBackIcon />}
              colorScheme="brand"
              variant="outline"
              mt="space.xl"
              alignSelf="start"
              onClick={() => navigate('/interactive')}
              className="back-button"
            >
              Voltar para HomeScreen
            </Button>
          </>
        ) : (
          <HomeScreen />
        )}
      </VStack>
    </Box>
  );
}