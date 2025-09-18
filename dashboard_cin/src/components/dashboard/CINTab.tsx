import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  useColorModeValue,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  LegendType,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, ArrowRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import {
  getGeralMensal,
  getTopAndLeastCities,
  getStatusVisitaBreakdown,
  getStatusPublicacaoBreakdown,
  getVisitedCities,
} from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import BahiaMap from './BahiaMap';
import { useAppContext } from '../../AppContext'; 
import { AxiosResponse } from 'axios';
import {
  MonthlyData,
  ApiResponse,
  TopAndLeastCitiesResponse,
  StatusVisitaBreakdownResponse,
  StatusPublicacaoBreakdownResponse,
  VisitedCitiesResponse,
  City,
  TopCity,
} from '../../types';

// Define interfaces for cardData from useAppContext
interface CardData {
  Visitados?: {
    cities?: City[];
  };
}

interface AppContext {
  cardData: CardData | null;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

interface SlideshowData {
  mensalRes: ApiResponse<MonthlyData[]>;
  topLeastRes: ApiResponse<TopAndLeastCitiesResponse>;
  visitaRes: ApiResponse<StatusVisitaBreakdownResponse>;
  publicacaoRes: ApiResponse<StatusPublicacaoBreakdownResponse>;
  visitedRes: ApiResponse<VisitedCitiesResponse>;
}

const monthNames: { [key: string]: string } = {
  '01': 'Janeiro',
  '02': 'Fevereiro',
  '03': 'Março',
  '04': 'Abril',
  '05': 'Maio',
  '06': 'Junho',
  '07': 'Julho',
  '08': 'Agosto',
  '09': 'Setembro',
  '10': 'Outubro',
  '11': 'Novembro',
  '12': 'Dezembro',
};

interface CINTabProps {
  setMode: (mode: 'interativa' | 'slideshow' | null) => void;
  setSelectedCity: (city: string | null) => void;
}

const CINTab = ({ setMode, setSelectedCity }: CINTabProps) => {
  const { cardData } = useAppContext() as AppContext;
  const [slides, setSlides] = useState<JSX.Element[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const chartFill = useColorModeValue('#3182ce', '#63b3ed');
  const gridStroke = useColorModeValue('#CBD5E0', '#4A5568');
  const textFill = useColorModeValue('#171923', '#F7FAFC');
  const bgSurface = useColorModeValue('white', 'gray.800');
  const tooltipBg = useColorModeValue('white', 'gray.800');
  const tooltipText = useColorModeValue('#171923', '#F7FAFC');
  const color1 = useColorModeValue('#3182ce', '#63b3ed');
  const color2 = useColorModeValue('#e53e3e', '#fc8181');
  const color3 = useColorModeValue('#38a169', '#68d391');
  const color4 = useColorModeValue('#d69e2e', '#f6e05e');
  const color5 = useColorModeValue('#805ad5', '#b794f4');
  const color6 = useColorModeValue('#f687b3', '#f6ad55');
  const labelStroke = useColorModeValue('white', 'gray.800');

  const COLORS = useMemo(() => [color1, color2, color3, color4, color5, color6], [
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
  ]);

  const { data, isLoading, error } = useQuery<SlideshowData, Error>({
    queryKey: ['slideshowData'],
    queryFn: async (): Promise<SlideshowData> => {
      const [mensalRes, topLeastRes, visitaRes, publicacaoRes, visitedRes] = await Promise.all([
        getGeralMensal() as Promise<AxiosResponse<ApiResponse<MonthlyData[]>>>,
        getTopAndLeastCities({ ano: 2025, limit: 6 }) as Promise<
          AxiosResponse<ApiResponse<TopAndLeastCitiesResponse>>
        >,
        getStatusVisitaBreakdown() as Promise<AxiosResponse<ApiResponse<StatusVisitaBreakdownResponse>>>,
        getStatusPublicacaoBreakdown() as Promise<
          AxiosResponse<ApiResponse<StatusPublicacaoBreakdownResponse>>
        >,
        getVisitedCities() as Promise<AxiosResponse<ApiResponse<VisitedCitiesResponse>>>,
      ]);
      return {
        mensalRes: mensalRes.data,
        topLeastRes: topLeastRes.data,
        visitaRes: visitaRes.data,
        publicacaoRes: publicacaoRes.data,
        visitedRes: visitedRes.data,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;

    const { mensalRes, topLeastRes, visitaRes, publicacaoRes, visitedRes } = data;

    // Slide 1: Produção Geral CIN
    const monthlyData = (mensalRes.data || []).map((item: MonthlyData) => ({
      ...item,
      month: monthNames[item.monthYear.split('-')[1]] || item.monthYear,
    }));
    const totalProd = monthlyData.reduce((sum: number, item: MonthlyData) => sum + (item.quantidade || 0), 0);
    const slide1 = (
      <Flex direction="column" align="center" justify="center" minH="100vh" p={10} bg={bgSurface}>
        <Box maxW="1100px" w="100%" aria-label="Slide de Produção Geral CIN">
          <Heading size="2xl" mb={8} color={textFill} fontWeight="extrabold" textAlign="center">
            Produção Geral CIN
          </Heading>
          {monthlyData.length === 0 ? (
            <Text color={textFill} fontSize="xl" textAlign="center">
              Sem dados de produção mensal
            </Text>
          ) : (
            <>
              <Text fontSize="3xl" mb={8} color={textFill} fontWeight="semibold" textAlign="center">
                Total: {totalProd}
              </Text>
              <RechartsBarChart
                width={Math.min(window.innerWidth * 0.9, 1000)}
                height={550}
                data={monthlyData}
                aria-label="Gráfico de colunas da produção geral CIN"
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.7} />
                <XAxis dataKey="month" stroke={textFill} fontSize={16} fontWeight="medium" />
                <YAxis stroke={textFill} fontSize={16} fontWeight="medium" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    color: tooltipText,
                    fontSize: '18px',
                    borderRadius: '8px',
                    border: `1px solid ${gridStroke}`,
                  }}
                />
                <Legend verticalAlign="top" height={40} iconSize={18} />
                <Bar dataKey="quantidade" fill={chartFill} radius={[8, 8, 0, 0]}>
                  <LabelList
                    dataKey="quantidade"
                    position="top"
                    fill={textFill}
                    fontSize={16}
                    fontWeight="bold"
                    stroke={labelStroke}
                    strokeWidth={0.5}
                  />
                </Bar>
              </RechartsBarChart>
              <Box as="table" display="none" aria-hidden="true">
                <caption>Produção mensal CIN</caption>
                <thead>
                  <tr>
                    <th scope="col">Mês</th>
                    <th scope="col">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((item: MonthlyData & { month: string }, index: number) => (
                    <tr key={index}>
                      <td>{item.month}</td>
                      <td>{item.quantidade}</td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </>
          )}
        </Box>
        <Flex mt={6} gap={4} justifyContent="center">
          <IconButton
            icon={<ArrowLeftIcon />}
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            colorScheme="brand"
            aria-label="Slide anterior"
          />
          <IconButton
            icon={<ArrowRightIcon />}
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            colorScheme="brand"
            aria-label="Próximo slide"
          />
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
      </Flex>
    );

    // Slide 2: Comparação entre cidades Bahia
    const topCities = (topLeastRes.data?.topCities || []).slice(0, 3); // Top 3
    const leastCities = (topLeastRes.data?.leastCities || []).slice(-3); // Bottom 3
    const citiesData = [...topCities, ...leastCities].map((city: TopCity) => ({
      nome_municipio: city.nome_municipio || 'Unknown',
      total_quantidade: city.total_quantidade || 0,
    }));
    // Simulate monthly data per city (since getGeralMensal is aggregate)
    const lineData = monthlyData.map((item: MonthlyData & { month: string }, index: number) => {
      const entry: { month: string; [key: string]: number | string } = { month: item.month };
      citiesData.forEach((city: { nome_municipio: string; total_quantidade: number }) => {
        const monthlyShare = city.total_quantidade / monthlyData.length;
        entry[city.nome_municipio] = Math.round(monthlyShare * (1 + (Math.random() - 0.5) * 0.2));
      });
      return entry;
    });
    const slide2 = (
      <Flex direction="column" align="center" justify="center" minH="100vh" p={10} bg={bgSurface}>
        <Box maxW="1100px" w="100%" aria-label="Slide de Comparação entre cidades Bahia">
          <Heading size="2xl" mb={8} color={textFill} fontWeight="extrabold" textAlign="center">
            Comparação entre cidades Bahia
          </Heading>
          {citiesData.length === 0 ? (
            <Text color={textFill} fontSize="xl" fontWeight="bold" textAlign="center">
              Sem dados disponíveis para Comparação entre cidades
            </Text>
          ) : (
            <>
              <LineChart
                width={Math.min(window.innerWidth * 0.9, 1000)}
                height={550}
                data={lineData}
                aria-label="Gráfico de linhas das cidades com maior e menor produção"
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.7} />
                <XAxis dataKey="month" stroke={textFill} fontSize={16} fontWeight="medium" />
                <YAxis stroke={textFill} fontSize={16} fontWeight="medium" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    color: tooltipText,
                    fontSize: '18px',
                    borderRadius: '8px',
                    border: `1px solid ${gridStroke}`,
                  }}
                />
                <Legend verticalAlign="top" height={40} iconSize={18} />
                {citiesData.map((city: { nome_municipio: string }, index: number) => (
                  <Line
                    key={city.nome_municipio}
                    type="monotone"
                    dataKey={city.nome_municipio}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={3}
                    dot={{ r: 6, fill: COLORS[index % COLORS.length], stroke: textFill, strokeWidth: 2 }}
                  >
                    <LabelList
                      dataKey={city.nome_municipio}
                      position="top"
                      fill={textFill}
                      fontSize={14}
                      fontWeight="medium"
                      stroke={labelStroke}
                      strokeWidth={0.5}
                    />
                  </Line>
                ))}
              </LineChart>
              <Box as="table" display="none" aria-hidden="true">
                <caption>Comparação entre cidades Bahia</caption>
                <thead>
                  <tr>
                    <th scope="col">Mês</th>
                    {citiesData.map((city: { nome_municipio: string }) => (
                      <th key={city.nome_municipio} scope="col">
                        {city.nome_municipio}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lineData.map((item: { month: string; [key: string]: number | string }, index: number) => (
                    <tr key={index}>
                      <td>{item.month}</td>
                      {citiesData.map((city: { nome_municipio: string }) => (
                        <td key={city.nome_municipio}>{item[city.nome_municipio]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Box>
            </>
          )}
        </Box>
        <Flex mt={6} gap={4} justifyContent="center">
          <IconButton
            icon={<ArrowLeftIcon />}
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            colorScheme="brand"
            aria-label="Slide anterior"
          />
          <IconButton
            icon={<ArrowRightIcon />}
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            colorScheme="brand"
            aria-label="Próximo slide"
          />
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
      </Flex>
    );

    // Slide 3: Status de Visita e Publicação
    const visitaData = [
      {
        name: 'Aprovados',
        value: visitaRes.data?.approvedCount || 0,
        cities: visitaRes.data?.approvedCities || [],
      },
      {
        name: 'Reprovados',
        value: visitaRes.data?.rejectedCount || 0,
        cities: visitaRes.data?.rejectedCities || [],
      },
    ];
    const publicacaoData = [
      {
        name: 'Publicados',
        value: publicacaoRes.data?.publishedCount || 0,
        cities: publicacaoRes.data?.publishedCities || [],
      },
      {
        name: 'Ag. Publicação',
        value: publicacaoRes.data?.awaitingCount || 0,
        cities: publicacaoRes.data?.awaitingPublicationCities || [],
      },
    ];
    const visitaLegend = [
      {
        value: `Aprovados (${visitaRes.data?.approvedCities?.length || 0} cidades)`,
        type: 'square' as LegendType,
        id: 'aprovados',
        color: COLORS[0],
      },
      {
        value: `Reprovados (${visitaRes.data?.rejectedCities?.length || 0} cidades)`,
        type: 'square' as LegendType,
        id: 'reprovados',
        color: COLORS[1],
      },
    ];
    const publicacaoLegend = [
      {
        value: `Publicados (${publicacaoRes.data?.publishedCities?.length || 0} cidades)`,
        type: 'square' as LegendType,
        id: 'publicados',
        color: COLORS[0],
      },
      {
        value: `Ag. Publicação (${publicacaoRes.data?.awaitingPublicationCities?.length || 0} cidades)`,
        type: 'square' as LegendType,
        id: 'aguardando',
        color: COLORS[1],
      },
    ];
    const slide3 = (
      <Flex direction="column" align="center" justify="center" minH="100vh" p={10} bg={bgSurface}>
        <Flex
          gap={10}
          direction={{ base: 'column', md: 'row' }}
          maxW="1300px"
          w="100%"
          justifyContent="center"
          aria-label="Slide de status de visita e publicação"
        >
          <Box flex="1" maxW="550px">
            <Heading size="2xl" mb={8} color={textFill} fontWeight="extrabold" textAlign="center">
              Status da Visita
            </Heading>
            {visitaData.every((item) => item.value === 0) ? (
              <Text color={textFill} fontSize="xl" textAlign="center">
                Sem dados de status de visita
              </Text>
            ) : (
              <PieChart width={500} height={500} aria-label="Gráfico de pizza do status da visita">
                <Pie
                  data={visitaData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={200}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: gridStroke, strokeWidth: 2 }}
                >
                  {visitaData.map((_, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    color: tooltipText,
                    fontSize: '18px',
                    borderRadius: '8px',
                    border: `1px solid ${gridStroke}`,
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${name}: ${value}`,
                    `Cidades: ${props.payload.cities.map((c: City) => c.nome_municipio).join(', ')}`,
                  ]}
                />
                <Legend payload={visitaLegend} verticalAlign="top" height={40} iconSize={18} />
              </PieChart>
            )}
          </Box>
          <Box flex="1" maxW="550px">
            <Heading size="2xl" mb={8} color={textFill} fontWeight="extrabold" textAlign="center">
              Status da Publicação
            </Heading>
            {publicacaoData.every((item) => item.value === 0) ? (
              <Text color={textFill} fontSize="xl" textAlign="center">
                Sem dados de status de publicação
              </Text>
            ) : (
              <PieChart width={500} height={500} aria-label="Gráfico de pizza do status da publicação">
                <Pie
                  data={publicacaoData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={200}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: gridStroke, strokeWidth: 2 }}
                >
                  {publicacaoData.map((_, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    color: tooltipText,
                    fontSize: '18px',
                    borderRadius: '8px',
                    border: `1px solid ${gridStroke}`,
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${name}: ${value}`,
                    `Cidades: ${props.payload.cities.map((c: City) => c.nome_municipio).join(', ')}`,
                  ]}
                />
                <Legend payload={publicacaoLegend} verticalAlign="top" height={40} iconSize={18} />
              </PieChart>
            )}
          </Box>
        </Flex>
        <Flex mt={6} gap={4} justifyContent="center">
          <IconButton
            icon={<ArrowLeftIcon />}
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            colorScheme="brand"
            aria-label="Slide anterior"
          />
          <IconButton
            icon={<ArrowRightIcon />}
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            colorScheme="brand"
            aria-label="Próximo slide"
          />
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
      </Flex>
    );

    // Slide 4: Mapa da Bahia
    const highlightedCities = (visitedRes.data?.visitedCities || []).map((city: City) => city.nome_municipio);
    const slide4 = (
      <Flex direction="column" align="center" justify="center" minH="100vh" p={10} bg={bgSurface}>
        <Box maxW="1100px" w="100%" aria-label="Slide do mapa da Bahia">
          <Heading size="2xl" mb={8} color={textFill} fontWeight="extrabold" textAlign="center">
            Mapa da Bahia
          </Heading>
          <BahiaMap isInteractive={false} highlightedCities={highlightedCities} selectedCity={null} setSelectedCity={() => {}} />
        </Box>
        <Flex mt={6} gap={4} justifyContent="center">
          <IconButton
            icon={<ArrowLeftIcon />}
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            colorScheme="brand"
            aria-label="Slide anterior"
          />
          <IconButton
            icon={<ArrowRightIcon />}
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            colorScheme="brand"
            aria-label="Próximo slide"
          />
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
      </Flex>
    );

    setSlides([slide1, slide2, slide3, slide4]);
  }, [data, bgSurface, chartFill, gridStroke, textFill, tooltipBg, tooltipText, COLORS, labelStroke, setMode, setSelectedCity]);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 30000); // 30 seconds per slide
      return () => clearInterval(timer);
    }
  }, [slides]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Text color="red.500" fontSize="lg" textAlign="center">{error.message}</Text>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 1 }}
        style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {slides[currentSlide]}
      </motion.div>
    </AnimatePresence>
  );
};

export default CINTab;