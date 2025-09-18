import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { getCityDetails, getTopAndLeastCities } from '../../services/api';
import { ApiResponse, City, TopAndLeastCitiesResponse } from '../../types';
import { AxiosResponse } from 'axios';

const MotionBox = motion(Box);

interface ConditionalChartsProps {
  selectedCity: string | null;
}

interface ChartData {
  name: string;
  monthlyData: { month: string; quantidade: number }[];
  total_quantidade: number;
  populacao: number;
  meta: number;
  monthly_variation: number;
}

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

const ConditionalCharts = ({ selectedCity }: ConditionalChartsProps) => {
  const textFill = useColorModeValue('text._light', 'text._dark');
  const bgSurface = useColorModeValue('bg.main._light', 'bg.main._dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const chartFill = useColorModeValue('brand.500', 'brand.200');
  const gridStroke = useColorModeValue('gray.200', 'gray.600');
  const areaChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  const aggregateMonthlyData = (produtividades: City['produtividades_diarias']) => {
    const monthlyMap: { [key: string]: number } = {};
    produtividades?.forEach((prod) => {
      const date = new Date(prod.data);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyMap[monthYear] = (monthlyMap[monthYear] || 0) + prod.quantidade;
    });

    return Object.entries(monthlyMap).map(([monthYear, quantidade]) => ({
      month: monthNames[monthYear.split('-')[1]] || monthYear,
      quantidade,
    })).sort((a, b) => a.month.localeCompare(b.month));
  };

  const calculateMonthlyVariation = (monthlyData: { month: string; quantidade: number }[]) => {
    if (monthlyData.length < 2) return 0;
    const lastMonth = monthlyData[monthlyData.length - 1].quantidade;
    const prevMonth = monthlyData[monthlyData.length - 2].quantidade;
    return prevMonth === 0 ? 0 : ((lastMonth - prevMonth) / prevMonth) * 100;
  };

  const { data, isLoading, error } = useQuery<ChartData[], Error>({
    queryKey: ['conditionalChartsData', selectedCity],
    queryFn: async () => {
      if (!selectedCity) return [];

      // Fetch top and least cities
      const topLeastRes: AxiosResponse<ApiResponse<TopAndLeastCitiesResponse>> = await getTopAndLeastCities({ ano: 2025, limit: 1 });
      const topCity = topLeastRes.data.data.topCities[0] || { nome_municipio: '', total_quantidade: 0 };
      const leastCity = topLeastRes.data.data.leastCities[0] || { nome_municipio: '', total_quantidade: 0 };

      // Fetch details for selected, top, and least cities
      const cityNames = [selectedCity, topCity.nome_municipio, leastCity.nome_municipio].filter((name, index, self) => name && self.indexOf(name) === index);
      const cityDetailsPromises = cityNames.map((name) =>
        getCityDetails(name).then((res: AxiosResponse<ApiResponse<City[]>>) => res.data.data[0] || null)
      );
      const cityDetails = await Promise.all(cityDetailsPromises);

      // Process data for each city
      return cityDetails.map((city, index) => {
        if (!city) return null;
        const monthlyData = aggregateMonthlyData(city.produtividades_diarias);
        const total_quantidade = city.produtividades_diarias?.reduce((sum, prod) => sum + prod.quantidade, 0) || 0;
        return {
          name: cityNames[index],
          monthlyData,
          total_quantidade,
          populacao: city.populacao || 100000, // Fallback population
          meta: 1000, // Hardcoded meta
          monthly_variation: calculateMonthlyVariation(monthlyData),
        };
      }).filter((data): data is ChartData => data !== null);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!selectedCity,
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

  if (!selectedCity) return <Text color={textFill}>Selecione uma cidade no mapa para visualizar os gráficos.</Text>;
  if (isLoading) return <Text color={textFill}>Carregando gráficos condicionais...</Text>;
  if (error) return <Text color="red.500">Erro: {error.message}</Text>;
  if (!data || data.length === 0) return <Text color={textFill}>Nenhum dado disponível para a cidade selecionada.</Text>;

  const selectedCityData = data.find((d) => d.name === selectedCity);
  const pieData = data.map((city) => ({
    name: city.name,
    value: (city.total_quantidade / city.populacao) * 100,
  }));

  // Aggregate monthly data for bar chart (merge data for all cities by month)
  const allMonths = Array.from(new Set(data.flatMap((city) => city.monthlyData.map((m) => m.month))));
  const barChartData = allMonths.map((month) => {
    const entry: { month: string; [key: string]: string | number } = { month };
    data.forEach((city) => {
      const monthData = city.monthlyData.find((m) => m.month === month);
      entry[city.name] = monthData ? monthData.quantidade : 0;
    });
    return entry;
  });

  return (
    <VStack spacing="space.lg" align="stretch">
      {selectedCityData && (
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
          ref={areaChartRef}
        >
          <Heading size="lg" mb="space.sm" color={textFill}>
            Produção Mensal de CINs ({selectedCity})
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={selectedCityData.monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={textFill} fontSize="sm" />
              <YAxis stroke={textFill} fontSize="sm" />
              <Tooltip
                contentStyle={{
                  fontSize: 'sm',
                  backgroundColor: bgSurface,
                  color: textFill,
                  border: '1px solid',
                  borderColor,
                }}
                formatter={(value: number) => [`Quantidade: ${value}`]}
              />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="quantidade" fill={chartFill} stroke={chartFill} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
          <Button
            mt="space.sm"
            colorScheme="brand"
            size="sm"
            onClick={() => downloadChart(areaChartRef, `producao_mensal_${selectedCity}`)}
            aria-label={`Baixar gráfico Produção Mensal de ${selectedCity}`}
          >
            Baixar Gráfico
          </Button>
        </MotionBox>
      )}

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p="space.md"
        bg={bgSurface}
        boxShadow="md"
        ref={barChartRef}
      >
        <Heading size="lg" mb="space.sm" color={textFill}>
          Comparação de Produção Mensal
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={textFill} fontSize="sm" />
            <YAxis stroke={textFill} fontSize="sm" />
            <Tooltip
              contentStyle={{
                fontSize: 'sm',
                backgroundColor: bgSurface,
                color: textFill,
                border: '1px solid',
                borderColor,
              }}
              formatter={(value: number, name: string) => [`${name}: ${value}`]}
            />
            <Legend verticalAlign="top" height={36} />
            {data.map((city, index) => (
              <Bar
                key={city.name}
                dataKey={city.name}
                fill={index === 0 ? chartFill : index === 1 ? useColorModeValue('gray.400', 'gray.500') : useColorModeValue('teal.400', 'teal.200')}
                name={city.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <Button
          mt="space.sm"
          colorScheme="brand"
          size="sm"
          onClick={() => downloadChart(barChartRef, 'comparacao_producao_mensal')}
          aria-label="Baixar gráfico Comparação de Produção Mensal"
        >
          Baixar Gráfico
        </Button>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p="space.md"
        bg={bgSurface}
        boxShadow="md"
        ref={pieChartRef}
      >
        <Heading size="lg" mb="space.sm" color={textFill}>
          Produção (% da População)
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ value }) => `${value.toFixed(1)}%`}
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? chartFill : index === 1 ? useColorModeValue('gray.400', 'gray.500') : useColorModeValue('teal.400', 'teal.200')}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontSize: 'sm',
                backgroundColor: bgSurface,
                color: textFill,
                border: '1px solid',
                borderColor,
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`]}
            />
            <Legend verticalAlign="top" height={36} />
          </PieChart>
        </ResponsiveContainer>
        <Button
          mt="space.sm"
          colorScheme="brand"
          size="sm"
          onClick={() => downloadChart(pieChartRef, 'producao_percentual_populacao')}
          aria-label="Baixar gráfico Produção Percentual"
        >
          Baixar Gráfico
        </Button>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p="space.md"
        bg={bgSurface}
        boxShadow="md"
      >
        <Heading size="lg" mb="space.sm" color={textFill}>
          Metas e Variação Mensal
        </Heading>
        {data.map((city) => (
          <Box key={city.name} mb="space.sm">
            <Text fontWeight="bold" color={textFill}>
              {city.name}
            </Text>
            <Text color={textFill}>Meta: {city.meta} CINs</Text>
            <Text color={textFill}>
              Variação Mensal: {city.monthly_variation >= 0 ? '+' : ''}{city.monthly_variation.toFixed(1)}%
            </Text>
          </Box>
        ))}
      </MotionBox>
    </VStack>
  );
};

export default ConditionalCharts;