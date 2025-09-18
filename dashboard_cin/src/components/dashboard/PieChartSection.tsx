import { useRef, useState } from 'react';
import { Box, Heading, Flex, Text, Icon, useColorModeValue, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import { PieChart } from '@mui/x-charts/PieChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CityList from './CityList';
import {
  getStatusVisitaBreakdown,
  getStatusPublicacaoBreakdown,
  getStatusInstalacaoBreakdown,
} from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import html2canvas from 'html2canvas';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import {
  ApiResponse,
  StatusVisitaBreakdownResponse,
  StatusPublicacaoBreakdownResponse,
  StatusInstalacaoBreakdownResponse,
  City,
} from '../../types';
import { useWindowSize } from '@react-hook/window-size';

const MotionBox = motion(Box);

const muiTheme = createTheme({
  palette: {
    mode: 'light', // Will be overridden by Chakra's color mode
  },
});

interface PieData {
  id: number;
  label: string;
  value: number;
  cities: City[];
}

interface PieChartData {
  visitaRes: ApiResponse<StatusVisitaBreakdownResponse>;
  publicacaoRes: ApiResponse<StatusPublicacaoBreakdownResponse>;
  instalacaoRes: ApiResponse<StatusInstalacaoBreakdownResponse>;
}

const PieChartSection = () => {
  const [selectedCities, setSelectedCities] = useState<City[] | null>(null);
  const [selectedPie, setSelectedPie] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<number>(1);
  const [width] = useWindowSize();
  const textFill = useColorModeValue('text._light', 'text._dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgSurface = useColorModeValue('bg.main._light', 'bg.main._dark');
  const bgMain = useColorModeValue('bg.main._light', 'bg.main._dark');

  const COLORS = [
    useColorModeValue('brand.500', 'brand.200'),
    useColorModeValue('red.500', 'red.300'),
    useColorModeValue('green.500', 'green.300'),
    useColorModeValue('yellow.500', 'yellow.300'),
  ];

  const visitaRef = useRef<HTMLDivElement>(null);
  const publicacaoRef = useRef<HTMLDivElement>(null);
  const instalacaoRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery<PieChartData, Error>({
    queryKey: ['pieChartData'],
    queryFn: async (): Promise<PieChartData> => {
      const [visitaRes, publicacaoRes, instalacaoRes] = await Promise.all([
        getStatusVisitaBreakdown() as Promise<AxiosResponse<ApiResponse<StatusVisitaBreakdownResponse>>>,
        getStatusPublicacaoBreakdown() as Promise<AxiosResponse<ApiResponse<StatusPublicacaoBreakdownResponse>>>,
        getStatusInstalacaoBreakdown() as Promise<AxiosResponse<ApiResponse<StatusInstalacaoBreakdownResponse>>>,
      ]);
      return {
        visitaRes: visitaRes.data,
        publicacaoRes: publicacaoRes.data,
        instalacaoRes: instalacaoRes.data,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const isSmallScreen = width < 400;
  const pieParams = {
    width: isSmallScreen ? 300 : 400,
    height: isSmallScreen ? 250 : 300,
    innerRadius: isSmallScreen ? 40 : 0, // Donut style for small screens
    outerRadius: isSmallScreen ? 80 : 100,
  };

  const visitaData: PieData[] | null = data
    ? [
      { id: 0, label: 'Aprovados', value: data.visitaRes.data.approvedPercentage, cities: data.visitaRes.data.approvedCities },
      { id: 1, label: 'Reprovados', value: data.visitaRes.data.rejectedPercentage, cities: data.visitaRes.data.rejectedCities },
    ]
    : null;

  const publicacaoData: PieData[] | null = data
    ? [
      { id: 0, label: 'Publicados', value: data.publicacaoRes.data.publishedPercentage, cities: data.publicacaoRes.data.publishedCities },
      { id: 1, label: 'Ag. Publicação', value: data.publicacaoRes.data.awaitingPercentage, cities: data.publicacaoRes.data.awaitingPublicationCities },
    ]
    : null;

  const instalacaoData: PieData[] | null = data
    ? [
      { id: 0, label: 'Instalados', value: data.instalacaoRes.data.installedPercentage, cities: data.instalacaoRes.data.installedCities },
      { id: 1, label: 'Ag. Instalação', value: data.instalacaoRes.data.awaitingPercentage, cities: data.instalacaoRes.data.awaitingInstallationCities },
    ]
    : null;

  const handlePieClick = (data: { id: number; label: string; value: number; cities: City[] }, nextChart: number) => {
    setSelectedCities(data.cities);
    setSelectedPie(data.label);
    if (activeChart < nextChart) {
      setActiveChart(nextChart);
    }
  };

  const downloadChart = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (ref.current) {
      const canvas = await html2canvas(ref.current, { backgroundColor: null });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${filename}.png`;
      link.click();
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Text color="red.500">{error.message}</Text>;

  const renderPie = (
    title: string,
    data: PieData[] | null,
    nextChart: number,
    chartRef: React.RefObject<HTMLDivElement>
  ) => (
    <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" gap={6}>
      <MotionBox
        flex="1"
        ref={chartRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pie-highlight"
      >
        <Heading size="md" mb={4} color={textFill}>
          {title}
        </Heading>
        <ThemeProvider theme={muiTheme}>
          <PieChart
            series={[
              {
                data: data || [],
                innerRadius: pieParams.innerRadius,
                outerRadius: pieParams.outerRadius,
                arcLabel: (item) => `${item.label}: ${item.value}%`,
                arcLabelMinAngle: 20,
                valueFormatter: (item) => `${item.label}: ${item.value}%`,
                highlightScope: { fade: 'global', highlight: 'item' },
                cx: '50%',
                cy: '50%',
              },
            ]}
            width={pieParams.width}
            height={pieParams.height}
            slotProps={{
              legend: { position: { vertical: 'top', horizontal: 'center' } },
            }}
            onItemClick={(event, { dataIndex }) => data && handlePieClick(data[dataIndex], nextChart)}
            sx={{
              '& .MuiPieArc-root': { cursor: 'pointer' },
              '& .MuiChartsAxis-tickLabel': { fill: textFill },
              '& .MuiChartsLegend-root': { fill: textFill },
            }}
          />
        </ThemeProvider>
        <Button
          mt={4}
          colorScheme="brand"
          size="sm"
          onClick={() => downloadChart(chartRef, title.replace(/\s+/g, '_').toLowerCase())}
          aria-label={`Baixar ${title} como imagem`}
        >
          Baixar Gráfico
        </Button>
      </MotionBox>
      {selectedCities &&
        selectedPie === data?.find((d) => d.cities === selectedCities)?.label && (
          <Box flex="1" maxH={{ base: '300px', md: '400px' }} overflow="auto" minW={{ base: '100%', md: '300px' }}>
            <CityList cities={selectedCities} cardTitle={selectedPie} />
          </Box>
        )}
    </Flex>
  );

  return (
    <Box bg={bgMain} pt={10} pb={10}>
      <Box
        width={{ base: '100%', md: '90%' }}
        mx="auto"
        className="card-like"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p={6}
        bg={bgSurface}
      >
        <Heading size="lg" mb={6} color={textFill}>
          Status das Visitas
        </Heading>
        <Flex direction="column" alignItems="center" gap={10}>
          <MotionBox>
            {renderPie('Status das Visitas', visitaData, 2, visitaRef)}
          </MotionBox>
          {activeChart >= 2 && (
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Icon as={FaArrowDown} boxSize={6} mb={4} color={textFill} />
              {renderPie('Status da Publicação', publicacaoData, 3, publicacaoRef)}
            </MotionBox>
          )}
          {activeChart >= 3 && (
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Icon as={FaArrowDown} boxSize={6} mb={4} color={textFill} />
              {renderPie('Status da Instalação', instalacaoData, 4, instalacaoRef)}
            </MotionBox>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default PieChartSection;