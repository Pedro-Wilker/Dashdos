import { Suspense, useState, lazy } from 'react';
import { ChakraProvider, Box, Grid, extendTheme, ColorModeScript, useColorModeValue, Button, Heading, VStack, Flex } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import Header from './components/Header';
import DashboardCard from './components/DashboardCard';
import MainSection from './components/MainSection';
import LoadingSpinner from './components/LoadingSpinner';
import { getVisitedCities, getStatusVisitaBreakdown, getStatusPublicacaoBreakdown, getStatusInstalacaoBreakdown, getAmploGeral } from './services/api';
import { useAppContext } from './main.jsx';
import { ArrowBackIcon } from '@chakra-ui/icons';

const PieChartSection = lazy(() => import('./components/PieChartSection'));
const HeatMapSection = lazy(() => import('./components/HeatMapSection')); // Novo lazy load para HeatMapSection
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
      'bg.surface': {
        _light: 'white',
        _dark: 'gray.800'
      },
      'bg.main': {
        _light: '#f5f5ef',
        _dark: 'gray.900'
      },
      'bg.cards': {
        _light: '#000000ff',
        _dark: 'gray.900'
      },
      text: {
        _light: '#1a202c',
        _dark: 'white'
      },
    },
  },
  shadows: {
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  },
});

const ErrorFallback = ({ error }) => (
  <Box>
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
      const [visitedRes, visitaBreakdownRes, publicacaoRes, instalacaoRes, amploGeralRes] = await Promise.all([
        getVisitedCities(),
        getStatusVisitaBreakdown(),
        getStatusPublicacaoBreakdown(),
        getStatusInstalacaoBreakdown(),
        getAmploGeral(),
      ]);
      return {
        '343 Cidades': { // Adicionado como primeiro
          percentage: null,
          cities: amploGeralRes.data,
        },
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
        'AG. Instalação': { // Nome alterado
          percentage: instalacaoRes.data.awaitingPercentage,
          cities: instalacaoRes.data.awaitingInstallationCities,
        },
      };
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Box>Erro ao carregar dados: {error.message}</Box>;

  if (mode === null) {
    return (
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <VStack spacing={8} align="center" justify="center" h="100vh" bg={bgMain} color={textColor}>
          <Heading as="h1" size="2xl">Bem-vindo ao Dashboard</Heading>
          <Flex gap={4}>
            <Button colorScheme="brand" onClick={() => setMode('interativa')}>Modo Interativo</Button>
            <Button colorScheme="brand" onClick={() => setMode('slideshow')}>Modo Slideshow</Button>
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
          <Slideshow />
        </Suspense>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box bg={bgMain} minH="100vh" p={4} color={textColor}>
        <Header />
        <Grid templateColumns="repeat(7, 1fr)" gap={4} mb={8}>
          {Object.keys(cardData).map((title) => (
            <DashboardCard
              key={title}
              title={title}
              percentage={cardData[title].percentage}
              cities={cardData[title].cities}
            />
          ))}
        </Grid>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingSpinner />}>
            <MainSection />
            <PieChartSection />
            <HeatMapSection /> {/* Novo componente adicionado abaixo da PieChartSection */}
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