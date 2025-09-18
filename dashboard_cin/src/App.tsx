import { Suspense, useState, lazy, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  extendTheme,
  ColorModeScript,
  useColorModeValue,
  Button,
  Heading,
  VStack,
  Flex,
  Text,
} from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import Header from './components/dashboard/Header';
import DashboardCard from './components/dashboard/DashboardCard';
import MainSection from './components/dashboard/MainSection';
import LoadingSpinner from './components/common/LoadingSpinner';
import {
  getVisitedCities,
  getStatusVisitaBreakdown,
  getStatusPublicacaoBreakdown,
  getStatusInstalacaoBreakdown,
  getAmploGeral,
} from './services/api';
import { useAppContext } from './AppContext'; 
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  City,
  ApiResponse,
  VisitedCitiesResponse,
  StatusVisitaBreakdownResponse,
  StatusPublicacaoBreakdownResponse,
  StatusInstalacaoBreakdownResponse,
} from './types';

const PieChartSection = lazy(() => import('./components/dashboard/PieChartSection'));
const HeatMapSection = lazy(() => import('./components/dashboard/HeatMapSection'));
const Slideshow = lazy(() => import('./components/dashboard/Slideshow'));

const theme = extendTheme({
  colors: {
    brand: {
      500: '#3182ce',
      600: '#2b6cb0',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: {
    Card: {
      baseStyle: {
        bg: 'bg.surface',
      },
    },
    Button: {
      baseStyle: {
        _dark: {
          bg: 'brand.600',
          color: 'white',
          _hover: {
            bg: 'brand.500',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        _dark: {
          color: 'white',
        },
      },
    },
  },
  semanticTokens: {
    colors: {
      'bg.surface': {
        _light: 'white',
        _dark: 'gray.800',
      },
      'bg.main': {
        _light: '#f5f5ef',
        _dark: 'gray.900',
      },
      'bg.cards': {
        _light: '#000000ff',
        _dark: 'gray.900',
      },
      text: {
        _light: '#1a202c',
        _dark: 'white',
      },
    },
  },
  shadows: {
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  },
});

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

function App() {
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
        getAmploGeral() as Promise<AxiosResponse<ApiResponse<City[]>>>,
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

  useEffect(() => {
    if (cardData !== undefined) {
      setCardData(cardData);
    }
  }, [cardData, setCardData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Box>Erro ao carregar dados: {(error as Error).message}</Box>;

  if (mode === null) {
    return (
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <VStack spacing={8} align="center" justify="center" h="100vh" bg={bgMain} color={textColor}>
          <Heading as="h1" size="2xl">Bem-vindo ao Dashboard CIN</Heading>
          <Flex gap={4}>
            <Button colorScheme="brand" onClick={() => setMode('interativa')}>
              Modo Interativo
            </Button>
            <Button colorScheme="brand" onClick={() => setMode('slideshow')}>
              Modo Slideshow
            </Button>
          </Flex>
        </VStack>
      </ChakraProvider>
    );
  }

  if (mode === 'slideshow') {
    return (
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Suspense fallback={<LoadingSpinner />}>
          <Slideshow setMode={setMode} setSelectedCity={setSelectedCity} />
        </Suspense>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box bg={bgMain} minH="100vh" p={4} color={textColor}>
        <Header />
        {cardData && Object.keys(cardData).length > 0 ? (
          <Grid templateColumns="repeat(7, 1fr)" gap={4} mb={8}>
            {Object.keys(cardData).map((title) => (
              <DashboardCard
                key={title}
                title={title}
                percentage={cardData[title].percentage}
                cities={cardData[title].cities || []}
              />
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={8} color={textColor}>
            <Text>Nenhum dado disponível no momento.</Text>
          </Box>
        )}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingSpinner />}>
            <MainSection />
            <PieChartSection />
            <HeatMapSection />
          </Suspense>
        </ErrorBoundary>
        <Button
          leftIcon={<ArrowBackIcon />}
          colorScheme="brand"
          variant="outline"
          mt={4}
          onClick={() => setMode(null)}
        >
          Voltar
        </Button>
      </Box>
    </ChakraProvider>
  );
}

export default App;