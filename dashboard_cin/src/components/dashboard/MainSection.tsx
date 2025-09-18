import { useWindowSize } from '@react-hook/window-size';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  VStack,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import html2canvas from 'html2canvas';
import {
  getAmploGeral,
  getTopCities,
  getGeralMensal,
} from '../../services/api';
import { City, TopCity, MonthlyData, ApiResponse } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import BahiaMap from './BahiaMap';
import CityDetails from '../common/CityDetails';
import ConditionalCharts from './ConditionalCharts';

const MotionBox = motion(Box);

const monthNames: { [key: string]: string } = {
  '01': 'Jan',
  '02': 'Fev',
  '03': 'Mar',
  '04': 'Abr',
  '05': 'Mai',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Ago',
  '09': 'Set',
  '10': 'Out',
  '11': 'Nov',
  '12': 'Dez',
};

interface MainSectionData {
  topCities: (TopCity & { NOME: string })[];
  monthlyData: (MonthlyData & { month: string })[];
}

const MainSection = () => {
  const [width] = useWindowSize();
  const chartWidth = Math.min(width * 0.9, 500);
  const chartFill = useColorModeValue('brand.500', 'brand.200');
  const gridStroke = useColorModeValue('gray.200', 'gray.600');
  const textFill = useColorModeValue('text._light', 'text._dark');
  const bgSurface = useColorModeValue('bg.main._light', 'bg.main._dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const topCitiesRef = useRef<HTMLDivElement>(null);
  const monthlyRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<MainSectionData>({
    queryKey: ['mainSectionData'],
    queryFn: async () => {
      const [topCitiesRes, mensalRes] = await Promise.all([
        getTopCities({ ano: 2025, limit: 10 }) as Promise<AxiosResponse<ApiResponse<TopCity[]>>>,
        getGeralMensal() as Promise<AxiosResponse<ApiResponse<MonthlyData[]>>>,
      ]);

      const topCitiesData = Array.isArray(topCitiesRes.data.data) ? topCitiesRes.data.data : [];
      const mensalData = Array.isArray(mensalRes.data.data) ? mensalRes.data.data : [];

      const sortedMonthlyData = mensalData
        .slice()
        .sort((a: MonthlyData, b: MonthlyData) => a.monthYear.localeCompare(b.monthYear))
        .map((item: MonthlyData) => ({
          ...item,
          month: monthNames[item.monthYear?.split('-')[1]] || item.monthYear || 'Unknown',
          quantidade: item.quantidade || 0,
        }));

      return {
        topCities: topCitiesData.map((city: TopCity) => ({
          ...city,
          NOME: city.nome_municipio || 'Unknown',
        })),
        monthlyData: sortedMonthlyData,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

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
  if (error) return <Text color="red.500" fontSize="lg" textAlign="center">{(error as Error).message}</Text>;

  const { topCities = [], monthlyData = [] } = data || {};

  const totalProd = monthlyData.reduce((sum: number, item: MonthlyData) => sum + item.quantidade, 0);

  const renderMap = () => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p="space.md"
      bg="brand.500"
      boxShadow="lg"
      height={{ base: '60vh', md: '80vh' }}
      position="relative"
    >
      <Heading size="md" mb="space.sm" fontWeight="bold" color={textFill}>
        Mapa da Bahia
      </Heading>
      <Box bg={bgSurface} pt="96px" pb="space.lg"> {/* Changed pt from "space.lg" to "96px" (80px header + 16px margin) */}
        <BahiaMap
          isInteractive={true}
          highlightedCities={topCities.map((city: TopCity & { NOME: string }) => city.NOME)}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </Box>
      {selectedCity && <CityDetails cityName={selectedCity} />}
    </MotionBox>
  );

  const renderTopCities = () => {
    const sortedTopCities = topCities.slice().sort((a: TopCity & { NOME: string }, b: TopCity & { NOME: string }) => b.total_quantidade - a.total_quantidade);

    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p="space.md"
        bg={bgSurface}
        boxShadow="md"
        ref={topCitiesRef}
      >
        <Heading size="lg" mb="space.sm" fontWeight="bold" color={textFill}>
          Cidades com Maior Produção de CINs
        </Heading>
        {sortedTopCities.length === 0 ? (
          <Text color={textFill}>Nenhuma cidade disponível</Text>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedTopCities} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                <XAxis dataKey="NOME" stroke={textFill} fontSize="sm" />
                <YAxis stroke={textFill} fontSize="sm" />
                <Tooltip
                  contentStyle={{
                    fontSize: 'sm',
                    backgroundColor: bgSurface,
                    color: textFill,
                    border: '1px solid',
                    borderColor,
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `Cidade: ${props.payload.NOME}, Quantidade: ${value}`,
                  ]}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="total_quantidade" fill={chartFill} radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="total_quantidade" position="top" fill={textFill} fontSize={14} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <Button
              mt="space.sm"
              colorScheme="brand"
              size="sm"
              onClick={() => downloadChart(topCitiesRef, 'cidades_maior_producao_cins')}
              aria-label="Baixar gráfico Cidades com maior produção de CINs como imagem"
            >
              Baixar Gráfico
            </Button>
            <Box as="table" display="none" aria-hidden="true">
              <caption>Produção por cidade</caption>
              <thead>
                <tr><th scope="col">Cidade</th><th scope="col">Quantidade</th></tr>
              </thead>
              <tbody>
                {sortedTopCities.map((city: TopCity & { NOME: string }) => (
                  <tr key={city.nome_municipio}>
                    <td>{city.NOME || 'Unknown'}</td>
                    <td>{city.total_quantidade || 0}</td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </>
        )}
      </MotionBox>
    );
  };

  const renderMonthlyData = () => (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p="space.md"
      bg={bgSurface}
      boxShadow="md"
      ref={monthlyRef}
    >
      <Heading size="lg" mb="space.sm" fontWeight="bold" color={textFill}>
        Produção CIN em Todo Lugar
      </Heading>
      {monthlyData.length === 0 ? (
        <Text color={textFill}>Nenhuma produção mensal disponível</Text>
      ) : (
        <>
          <Text fontSize="2xl" mb="space.md" color={textFill} fontWeight="semibold" textAlign="center">
            Total: {totalProd}
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={textFill} fontSize="sm" interval={0} />
              <YAxis stroke={textFill} fontSize="sm" />
              <Tooltip
                contentStyle={{
                  fontSize: 'sm',
                  backgroundColor: bgSurface,
                  color: textFill,
                  border: '1px solid',
                  borderColor,
                }}
                formatter={(value: number, name: string, props: any) => [
                  `Mês: ${props.payload.month}, Quantidade: ${value}`,
                ]}
              />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="quantidade"
                fill={chartFill}
                stroke={chartFill}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
          <Button
            mt="space.sm"
            colorScheme="brand"
            size="sm"
            onClick={() => downloadChart(monthlyRef, 'producao_cin_todo_lugar')}
            aria-label="Baixar gráfico Produção CIN em todo lugar como imagem"
          >
            Baixar Gráfico
          </Button>
          <Box as="table" display="none" aria-hidden="true">
            <caption>Produção mensal</caption>
            <thead>
              <tr><th scope="col">Mês</th><th scope="col">Quantidade</th></tr>
            </thead>
            <tbody>
              {monthlyData.map((item: MonthlyData & { month: string }, index: number) => (
                <tr key={index}>
                  <td>{item.month || 'Unknown'}</td>
                  <td>{item.quantidade || 0}</td>
                </tr>
              ))}
            </tbody>
          </Box>
        </>
      )}
    </MotionBox>
  );

  return (
    <Box bg={bgSurface} pt="space.lg" pb="space.lg">
      <Box
        borderRadius="lg"
        boxShadow="md"
        p="space.lg"
        width={{ base: '100%', md: '90%' }}
        mx="auto"
        color={textFill}
      >
        <Tabs variant="soft-rounded" colorScheme="brand">
          <TabList mb="space.md">
            <Tab>Mapa</Tab>
            <Tab>Gráficos</Tab>
            <Tab>Cidades Instaladas</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{renderMap()}</TabPanel>
            <TabPanel>
              <VStack spacing="space.lg" align="stretch">
                {renderTopCities()}
                {renderMonthlyData()}
              </VStack>
            </TabPanel>
            <TabPanel>
              <ConditionalCharts selectedCity={selectedCity} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default MainSection;