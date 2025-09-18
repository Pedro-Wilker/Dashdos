import { useWindowSize } from '@react-hook/window-size';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  VStack,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { BarChart } from '@mui/x-charts/BarChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
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

const muiTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

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

const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? 'N/A'
    : `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;
};

interface MainSectionData {
  visits: (City & { NOME: string; daysLeft: number })[];
  installations: (City & { NOME: string; daysLeft: number })[];
  topCities: (TopCity & { NOME: string })[];
  monthlyData: (MonthlyData & { month: string })[];
}

const MainSection = () => {
  const [width] = useWindowSize();
  const chartWidth = Math.min(width * 0.9, 500);
  const chartFill = useColorModeValue('#3182ce', '#63b3ed');
  const gridStroke = useColorModeValue('#e2e8f0', '#4a5568');
  const textFill = useColorModeValue('#2e3d5aff', '#e2e8f0');
  const bgSurface = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgMain = useColorModeValue('#f5f5ef', 'gray.900');

  const topCitiesRef = useRef<HTMLDivElement>(null);
  const monthlyRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<MainSectionData>({
    queryKey: ['mainSectionData'],
    queryFn: async () => {
      const [amploRes, topCitiesRes, mensalRes] = await Promise.all([
        getAmploGeral() as Promise<AxiosResponse<ApiResponse<City[]>>>,
        getTopCities({ ano: 2025, limit: 10 }) as Promise<AxiosResponse<ApiResponse<TopCity[]>>>,
        getGeralMensal() as Promise<AxiosResponse<ApiResponse<MonthlyData[]>>>,
      ]);

      const amploData = Array.isArray(amploRes.data.data) ? amploRes.data.data : [];
      const topCitiesData = Array.isArray(topCitiesRes.data.data) ? topCitiesRes.data.data : [];
      const mensalData = Array.isArray(mensalRes.data.data) ? mensalRes.data.data : [];

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

      const sortedMonthlyData = mensalData
        .slice()
        .sort((a: MonthlyData, b: MonthlyData) => a.monthYear.localeCompare(b.monthYear))
        .map((item: MonthlyData) => ({
          ...item,
          month: monthNames[item.monthYear?.split('-')[1]] || item.monthYear || 'Unknown',
          quantidade: item.quantidade || 0,
        }));

      return {
        visits,
        installations,
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

  const formatDays = (days: number | null): string => {
    if (days == null) return 'N/A';
    return days === 0 ? 'Hoje' : `Faltam ${days} dia${days > 1 ? 's' : ''}`;
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
  if (error) return <Text color="red.500" fontSize="lg" textAlign="center">{(error as Error).message}</Text>;

  const { visits = [], installations = [], topCities = [], monthlyData = [] } = data || {};

  const totalProd = monthlyData.reduce((sum: number, item: MonthlyData) => sum + item.quantidade, 0);

  const renderVisits = () => (
    <Box className="card-like" border="1px solid" borderColor={borderColor} borderRadius="lg" p={4} bg={bgSurface}>
      <Heading size="lg" mb={4} fontWeight="extrabold" color={textFill}>
        Visitas da Semana
      </Heading>
      {visits.length === 0 ? (
        <Text color={textFill}>Nenhuma visita agendada para esta semana</Text>
      ) : (
        <Table variant="simple" aria-label="Tabela de visitas da semana">
          <Thead>
            <Tr>
              <Th scope="col">Cidade</Th>
              <Th scope="col">Data</Th>
              <Th scope="col">Dias</Th>
            </Tr>
          </Thead>
          <Tbody>
            {visits.map((city: City & { NOME: string; daysLeft: number }) => (
              <Tr key={city.id || city.NOME}>
                <Td>{city.NOME || 'Unknown'}</Td>
                <Td>{formatDate(city.data_visita)}</Td>
                <Td>{formatDays(city.daysLeft)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );

  const renderInstallations = () => (
    <Box className="card-like" border="1px solid" borderColor={borderColor} borderRadius="lg" p={4} bg={bgSurface}>
      <Heading size="lg" mb={4} fontWeight="extrabold" color={textFill}>
        Instalações da Semana
      </Heading>
      {installations.length === 0 ? (
        <Text color={textFill}>Nenhuma instalação agendada para esta semana</Text>
      ) : (
        <Table variant="simple" aria-label="Tabela de instalações da semana">
          <Thead>
            <Tr>
              <Th scope="col">Cidade</Th>
              <Th scope="col">Data</Th>
              <Th scope="col">Dias</Th>
            </Tr>
          </Thead>
          <Tbody>
            {installations.map((city: City & { NOME: string; daysLeft: number }) => (
              <Tr key={city.id || city.NOME}>
                <Td>{city.NOME || 'Unknown'}</Td>
                <Td>{formatDate(city.data_instalacao)}</Td>
                <Td>{formatDays(city.daysLeft)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );

  const renderLists = () => (
    <VStack spacing={6} align="stretch">
      {renderVisits()}
      {renderInstallations()}
    </VStack>
  );

  const renderMap = () => (
    <Box className="card-like" border="1px solid" borderColor={borderColor} borderRadius="lg" p={4} bg={bgSurface} height={{ base: '60vh', md: '80vh' }} position="relative">
      <Heading size="md" mb={2} fontWeight="extrabold" color={textFill}>
        Mapa da Bahia
      </Heading>
      <Box height={{ base: 'calc(100% - 40px)', md: 'calc(100% - 30px)' }} width="100%" position="relative">
        <BahiaMap
          isInteractive={true}
          highlightedCities={visits.map((city: City & { NOME: string }) => city.NOME).concat(installations.map((city: City & { NOME: string }) => city.NOME)).filter((city): city is string => city !== undefined)}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </Box>
      {selectedCity && <CityDetails cityName={selectedCity} />}
    </Box>
  );

  const renderTopCities = () => {
    const sortedTopCities = topCities.slice().sort((a: TopCity & { NOME: string }, b: TopCity & { NOME: string }) => b.total_quantidade - a.total_quantidade);

    const abbreviateName = (name: string) => {
      if (!name || name === 'Unknown') return 'Unknown';
      return name.length > 6 ? `${name.slice(0, 3)}...` : name;
    };

    const valueFormatter = (value: number | null): string => {
      if (value === null) return 'N/A';
      const cityName = sortedTopCities.find((city: TopCity & { NOME: string }) => city.total_quantidade === value)?.NOME || 'Unknown';
      return `Cidade: ${cityName}, Quantidade: ${value}`;
    };

    return (
      <Box className="card-like" border="1px solid" borderColor={borderColor} borderRadius="lg" p={4} bg={bgSurface} ref={topCitiesRef}>
        <Heading size="lg" mb={4} fontWeight="extrabold" color={textFill}>
          Cidades com maior produção de CINs
        </Heading>
        {sortedTopCities.length === 0 ? (
          <Text color={textFill}>Nenhuma cidade disponível</Text>
        ) : (
          <>
            <ThemeProvider theme={muiTheme}>
              <BarChart
                dataset={sortedTopCities}
                yAxis={[{ scaleType: 'band' as const, dataKey: 'NOME', valueFormatter: abbreviateName }]}
                series={[{ dataKey: 'total_quantidade', label: 'Produção de CINs', valueFormatter }]}
                layout="horizontal"
                width={chartWidth}
                height={300}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                sx={{
                  '& .MuiChartsAxis-tickLabel': { fill: textFill, fontSize: '12px' },
                  '& .MuiChartsAxis-line': { stroke: gridStroke },
                  '& .MuiChartsTooltip-root': { backgroundColor: bgSurface, color: textFill },
                  '& .MuiBarElement-root': { fill: chartFill },
                }}
                aria-label="Gráfico de barras horizontais das cidades com maior produção de CINs"
              />
            </ThemeProvider>
            <Button
              mt={4}
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
      </Box>
    );
  };

  const renderMonthlyData = () => (
    <Box className="card-like" border="1px solid" borderColor={borderColor} borderRadius="lg" p={4} bg={bgSurface} ref={monthlyRef}>
      <Heading size="lg" mb={4} fontWeight="extrabold" color={textFill}>
        Produção CIN em todo lugar
      </Heading>
      {monthlyData.length === 0 ? (
        <Text color={textFill}>Nenhuma produção mensal disponível</Text>
      ) : (
        <>
          <Text fontSize="3xl" mb={8} color={textFill} fontWeight="semibold" textAlign="center">
            Total: {totalProd}
          </Text>
          <RechartsBarChart
            width={chartWidth}
            height={300}
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            aria-label="Gráfico de barras da produção mensal de CINs"
          >
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={textFill} fontSize={12} interval={0} />
            <YAxis stroke={textFill} fontSize={14} />
            <Tooltip
              contentStyle={{ fontSize: '16px', fontWeight: '500', borderRadius: '8px', padding: '12px', backgroundColor: bgSurface, color: textFill }}
              formatter={(value: number, name: string, props: any) => [`Mês: ${props.payload.month}, Quantidade: ${value}`]}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="quantidade"
              fill={chartFill}
              radius={[8, 8, 0, 0]}
            >
              <LabelList dataKey="quantidade" position="top" fill={textFill} fontSize={14} />
            </Bar>
          </RechartsBarChart>
          <Button
            mt={4}
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
    </Box>
  );

  return (
    <Box bg={bgMain} pt={6} pb={6} sx={{ backgroundColor: bgMain }}>
      <Box
        bg={bgSurface}
        borderRadius="lg"
        boxShadow="sm"
        p={6}
        width={{ base: '100%', md: '90%' }}
        mx="auto"
        color={textFill}
      >
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr' }} gap={6}>
          <GridItem>
            {visits.length === 0 && installations.length === 0 ? (
              renderMap()
            ) : (
              <Tabs variant="soft-rounded" colorScheme="brand">
                <TabList mb={4}>
                  <Tab>Listas</Tab>
                  <Tab>Mapa</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>{renderLists()}</TabPanel>
                  <TabPanel>{renderMap()}</TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </GridItem>
          <GridItem>
            <VStack spacing={6} align="stretch">
              {renderTopCities()}
              {renderMonthlyData()}
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default MainSection;