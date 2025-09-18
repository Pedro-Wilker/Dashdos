import { useRef, useState } from 'react';
import { Box, Heading, Flex, Text, Icon, useColorModeValue, Button } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
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

const MotionBox = motion(Box);

// Define interface for pie chart data
interface PieData {
  name: string;
  value: number;
  cities: City[];
}

// Define interface for combined API response data
interface PieChartData {
  visitaRes: ApiResponse<StatusVisitaBreakdownResponse>;
  publicacaoRes: ApiResponse<StatusPublicacaoBreakdownResponse>;
  instalacaoRes: ApiResponse<StatusInstalacaoBreakdownResponse>;
}

const PieChartSection = () => {
  const [selectedCities, setSelectedCities] = useState<City[] | null>(null);
  const [selectedPie, setSelectedPie] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<number>(1);
  const gridStroke = useColorModeValue('#e2e8f0', '#4a5568');
  const textFill = useColorModeValue('#1a202c', '#e2e8f0');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgSurface = useColorModeValue('white', 'gray.800');
  const bgMain = useColorModeValue('#f5f5ef', 'gray.900');

  const COLORS = [
    useColorModeValue('#3182ce', '#63b3ed'),
    useColorModeValue('#e53e3e', '#fc8181'),
    useColorModeValue('#38a169', '#68d391'),
    useColorModeValue('#d69e2e', '#f6e05e'),
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const visitaData: { data: PieData[] } | null = data
    ? {
        data: [
          { name: 'Aprovados', value: data.visitaRes.data.approvedPercentage, cities: data.visitaRes.data.approvedCities },
          { name: 'Reprovados', value: data.visitaRes.data.rejectedPercentage, cities: data.visitaRes.data.rejectedCities },
        ],
      }
    : null;

  const publicacaoData: { data: PieData[] } | null = data
    ? {
        data: [
          { name: 'Publicados', value: data.publicacaoRes.data.publishedPercentage, cities: data.publicacaoRes.data.publishedCities },
          { name: 'Ag. Publicação', value: data.publicacaoRes.data.awaitingPercentage, cities: data.publicacaoRes.data.awaitingPublicationCities },
        ],
      }
    : null;

  const instalacaoData: { data: PieData[] } | null = data
    ? {
        data: [
          { name: 'Instalados', value: data.instalacaoRes.data.installedPercentage, cities: data.instalacaoRes.data.installedCities },
          { name: 'Ag. Instalação', value: data.instalacaoRes.data.awaitingPercentage, cities: data.instalacaoRes.data.awaitingInstallationCities },
        ],
      }
    : null;

  const handlePieClick = (data: { payload: PieData }) => {
    setSelectedCities(data.payload.cities);
    setSelectedPie(data.payload.name);
  };

  const handlePieDoubleClick = (nextChart: number) => {
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
    data: { data: PieData[] } | null,
    nextChart: number,
    chartRef: React.RefObject<HTMLDivElement>
  ) => (
    <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" gap={6}>
      <Box flex="1" ref={chartRef}>
        <Heading size="md" mb={4} color={textFill}>
          {title}
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Legend verticalAlign="top" height={36} />
            <Pie
              data={data?.data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}%`}
              labelLine={{ stroke: gridStroke, strokeWidth: 2 }}
              onClick={handlePieClick}
              onDoubleClick={() => nextChart <= 3 && handlePieDoubleClick(nextChart)}
              className="recharts-pie-sector"
            >
              {data?.data.map((_: PieData, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', fontSize: '14px' }}
              itemStyle={{ fontWeight: '500' }}
              formatter={(value: number, name: string, props: any) => [
                `${name}: ${value}%`,
                `Cidades: ${props.payload.cities.map((c: City) => c.nome_municipio).join(', ')}`,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <Button
          mt={4}
          colorScheme="brand"
          size="sm"
          onClick={() => downloadChart(chartRef, title.replace(/\s+/g, '_').toLowerCase())}
          aria-label={`Baixar ${title} como imagem`}
        >
          Baixar Gráfico
        </Button>
      </Box>
      {selectedCities &&
        selectedPie === data?.data.find((d: PieData) => d.cities === selectedCities)?.name && (
          <Box flex="1" maxH={{ base: '300px', md: '400px' }} overflow="auto" minW={{ base: '100%', md: '300px' }}>
            <CityList cities={selectedCities} cardTitle={selectedPie} />
          </Box>
        )}
    </Flex>
  );

  return (
    <Box bg={bgMain} pt={10} pb={10} sx={{ backgroundColor: bgMain }}>
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
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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