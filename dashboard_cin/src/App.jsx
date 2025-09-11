import { Suspense, useState, lazy } from 'react';
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
} from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import Header from './components/Header';
import DashboardCard from './components/DashboardCard';
import MainSection from './components/MainSection';
import LoadingSpinner from './components/LoadingSpinner';
import {
  getVisitedCities,
  getStatusVisitaBreakdown,
  getStatusPublicacaoBreakdown,
  getStatusInstalacaoBreakdown,
  getAmploGeral,
} from './services/api';
import { useAppContext } from './main.jsx';
import { ArrowBackIcon } from '@chakra-ui/icons';

const PieChartSection = lazy(() => import('./components/PieChartSection'));
const Slideshow = lazy(() => import('./components/Slideshow'));

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
      'bg.surface': { _light: 'white', _dark: 'gray.800' },
      'bg.main': { _light: '#f5f5ef', _dark: 'gray.900' },
      'bg.cards': { _light: '#000000ff', _dark: 'gray.900' },
      text: { _light: '#1a202c', _dark: 'white' },
    },
  },
  shadows: {
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  },
});

const ErrorFallback = ({ error }) => (
  <Box p={4} color="red.500" textAlign="center">
    Erro ao carregar componente: {error.message}
  </Box>
);

function App() {
  const [mode, setMode] = useState(null);
  const { setSelectedCity } = useAppContext();
  const bgMain = useColorModeValue('bg.main._light', 'bg.main._dark');
  const textColor = useColorModeValue('text._light', 'text._dark');

  const { data: cardData, isLoading, error } = useQuery({
    queryKey: ['cardData', mode],
    queryFn: async () => {
      if (mode !== 'interativa') return {};
      const [visitedRes, visitaBreakdownRes, publicacaoRes, instalacaoRes, amploGeralRes] =
        await Promise.all([
          getVisitedCities(),
          getStatusVisitaBreakdown(),
          getStatusPublicacaoBreakdown(),
          getStatusInstalacaoBreakdown(),
          getAmploGeral(),
        ]);
      return {
        Visitados: {
          percentage: visitedRes.data.percentage,
          cities: visitedRes.data.visitedCities,
        },
        Aprovados: {
          percentage: visitaBreakdownRes.data.approvedPercentage,
          cities: visitaBreakdownRes.data.approvedCities,
        },
        Reprovados: {
          percentage: visitaBreakdownRes.data.rejectedPercentage,
          cities: visitaBreakdownRes.data.rejectedCities,
        },
        Publicados: {
          percentage: publicacaoRes.data.publishedPercentage,
          cities: publicacaoRes.data.publishedCities,
        },
        Instalados: {
          percentage: instalacaoRes.data.installedPercentage,
          cities: instalacaoRes.data.installedCities,
        },
        'Aguardando Instalacao': {
          percentage: instalacaoRes.data.awaitingPercentage,
          cities: instalacaoRes.data.awaitingInstallationCities,
        },
        '343 Cidades': {
          percentage: 100,
          cities: amploGeralRes.data,
        },
      };
    },
    enabled: mode === 'interativa',
  });

  if (mode === null) {
    return (
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Box
          minH="100vh"
          bg={bgMain}
          color={textColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          aria-label="Tela de escolha do modo da dashboard"
        >
          <VStack spacing={6}>
            <Heading size="2xl" color={textColor}>Escolha o Modo da Dashboard</Heading>
            <Button
              colorScheme="brand"
              size="lg"
              onClick={() => setMode('slideshow')}
              aria-label="Iniciar modo slideshow"
            >
              Dash Slideshow
            </Button>
            <Button
              colorScheme="brand"
              size="lg"
              onClick={() => setMode('interativa')}
              aria-label="Iniciar modo interativo"
            >
              Dash Interativa
            </Button>
          </VStack>
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box minH="100vh" bg={bgMain} color={textColor}>
        {mode === 'interativa' && (
          <>
            <Header />
            {isLoading && <LoadingSpinner />}
            {error && <Box p={4} color="red.500" textAlign="center">{error.message}</Box>}
            {!isLoading && !error && (
              <>
                <Box pt={6} pb={6} bg={bgMain}>
                  <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(7, 1fr)' }}
                    gap={6}
                    p={6}
                    maxW="1400px"
                    mx="auto"
                    aria-label="Grade de cartões de dados"
                  >
                    {Object.entries(cardData || {}).map(([title, { percentage, cities }]) => (
                      <DashboardCard
                        key={title}
                        title={title}
                        percentage={percentage}
                        cities={cities}
                      />
                    ))}
                  </Grid>
                </Box>
                <MainSection />
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <PieChartSection />
                  </Suspense>
                </ErrorBoundary>
                <Flex justifyContent="center" p={4}>
                  <Button
                    leftIcon={<ArrowBackIcon />}
                    colorScheme="brand"
                    variant="outline"
                    onClick={() => {
                      setMode(null);
                      setSelectedCity(null);
                    }}
                    aria-label="Voltar para tela de escolha"
                  >
                    Voltar
                  </Button>
                </Flex>
              </>
            )}
          </>
        )}
        {mode === 'slideshow' && (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingSpinner />}>
              <Slideshow setMode={setMode} setSelectedCity={setSelectedCity} />
            </Suspense>
          </ErrorBoundary>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;