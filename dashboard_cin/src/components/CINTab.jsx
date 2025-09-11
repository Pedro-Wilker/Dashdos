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
  BarChart,
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
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, ArrowRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import {
  getGeralMensal,
  getTopAndLeastCities,
  getStatusVisitaBreakdown,
  getStatusPublicacaoBreakdown,
} from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import BahiaMap from './BahiaMap';
import { useAppContext } from '../main.jsx';

const monthNames = {
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

const CINTab = ({ setMode, setSelectedCity }) => {
  const { cardData } = useAppContext();
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const chartFill = useColorModeValue('#3182ce', '#63b3ed');
  const gridStroke = useColorModeValue('#CBD5E0', '#4A5568');
  const textFill = useColorModeValue('#171923', '#F7FAFC');
  const bgSurface = useColorModeValue('bg.surface._light', 'bg.surface._dark');
  const tooltipBg = useColorModeValue('white', 'gray.800');
  const tooltipText = useColorModeValue('#171923', '#F7FAFC');
  const color1 = useColorModeValue('#3182ce', '#63b3ed');
  const color2 = useColorModeValue('#e53e3e', '#fc8181');
  const color3 = useColorModeValue('#38a169', '#68d391');
  const color4 = useColorModeValue('#d69e2e', '#f6e05e');
  const color5 = useColorModeValue('#805ad5', '#b794f4');
  const color6 = useColorModeValue('#f687b3', '#f6ad55');
  const labelStroke = useColorModeValue('white', 'gray.800');

  const COLORS = useMemo(() => [color1, color2, color3, color4, color5, color6], [color1, color2, color3, color4, color5, color6]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['slideshowData'],
    queryFn: async () => {
      const [mensalRes, topLeastRes, visitaRes, publicacaoRes] = await Promise.all([
        getGeralMensal(),
        getTopAndLeastCities({ limit: 3 }),
        getStatusVisitaBreakdown(),
        getStatusPublicacaoBreakdown(),
      ]);
      return { mensalRes, topLeastRes, visitaRes, publicacaoRes };
    },
  });

  useEffect(() => {
    if (!data) return;

    const { mensalRes, topLeastRes, visitaRes, publicacaoRes } = data;

    const monthlyData = mensalRes.data.map(item => ({
      ...item,
      month: monthNames[item.monthYear.split('-')[1]] || item.monthYear,
    }));
    const totalProd = monthlyData.reduce((sum, item) => sum + (item.quantidade || 0), 0);
    const slide1 = (
      <Flex direction="column" align="center" justify="center" minH="100vh" p={10} bg={bgSurface}>
        <Box maxW="1100px" w="100%" aria-label="Slide de Produção Geral CIN">
          <Heading size="2xl" mb={8} color={textFill} fontWeight="extrabold" textAlign="center">
            Produção Geral CIN
          </Heading>
          {monthlyData.length === 0 ? (
            <Text color={textFill} fontSize="xl" textAlign="center">Sem dados de produção mensal</Text>
          ) : (
            <>
              <Text fontSize="3xl" mb={8} color={textFill} fontWeight="semibold" textAlign="center">
                Total: {totalProd}
              </Text>
              <BarChart
                width={Math.min(window.innerWidth * 0.9, 1000)}
                height={550}
                data={monthlyData}
                aria-label="Gráfico de colunas da produção geral CIN"
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.7} />
                <XAxis dataKey="month" stroke={textFill} fontSize={16} fontWeight="medium" />
                <YAxis stroke={textFill} fontSize={16} fontWeight="medium" />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, color: tooltipText, fontSize: '18px', borderRadius: '8px', border: `1px solid ${gridStroke}` }}
                />
                <Legend verticalAlign="top" height={40} iconSize={18} />
                <Bar
                  dataKey="quantidade"
                  fill={chartFill}
                  radius={[8, 8, 0, 0]}
                >
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
              </BarChart>
              <Box as="table" display="none" aria-hidden="false">
                <caption>Produção mensal CIN</caption>
                <thead>
                  <tr><th scope="col">Mês</th><th scope="col">Quantidade</th></tr>
                </thead>
                <tbody>
                  {monthlyData.map((item, index) => (
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

    const topCities = (topLeastRes.data.topCities || []).slice(0, 3);
    const leastCities = (topLeastRes.data.leastCities || []).slice(0, 3);
    const citiesData = [...topCities, ...leastCities].map(city => ({
      NOME: city.nome_municipio || 'Unknown', 
      total_quantidade: city.total_quantidade || 0,
    }));
    const lineData = monthlyData.map(item => {
      const entry = { month: item.month };
      citiesData.forEach(city => {
        entry[city.NOME] = Math.random() * 100; 
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
                  contentStyle={{ backgroundColor: tooltipBg, color: tooltipText, fontSize: '18px', borderRadius: '8px', border: `1px solid ${gridStroke}` }}
                />
                <Legend verticalAlign="top" height={40} iconSize={18} />
                {citiesData.map((city, index) => (
                  <Line
                    key={city.NOME}
                    type="monotone"
                    dataKey={city.NOME}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={3}
                    dot={{ r: 6, fill: COLORS[index % COLORS.length], stroke: textFill, strokeWidth: 2 }}
                  >
                    <LabelList
                      dataKey={city.NOME}
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
              <Box as="table" display="none" aria-hidden="false">
                <caption>Comparação entre cidades Bahia</caption>
                <thead>
                  <tr><th scope="col">Mês</th>{citiesData.map(city => <th key={city.NOME} scope="col">{city.NOME}</th>)}</tr>
                </thead>
                <tbody>
                  {lineData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.month}</td>
                      {citiesData.map(city => <td key={city.NOME}>{item[city.NOME]}</td>)}
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

    const visitaData = {
      data: [
        { name: 'Aprovados', value: visitaRes.data.approvedPercentage || 0, cities: visitaRes.data.approvedCities || [] },
        { name: 'Reprovados', value: visitaRes.data.rejectedPercentage || 0, cities: visitaRes.data.rejectedCities || [] },
      ],
    };
    const publicacaoData = {
      data: [
        { name: 'Publicados', value: publicacaoRes.data.publishedPercentage || 0, cities: publicacaoRes.data.publishedCities || [] },
        { name: 'Ag. Publicação', value: publicacaoRes.data.awaitingPercentage || 0, cities: publicacaoRes.data.awaitingPublicationCities || [] },
      ],
    };
    const visitaLegend = [
      { value: `Aprovados (${(visitaRes.data.approvedCities || []).length} cidades)`, color: COLORS[0] },
      { value: `Reprovados (${(visitaRes.data.rejectedCities || []).length} cidades)`, color: COLORS[1] },
    ];
    const publicacaoLegend = [
      { value: `Publicados (${(publicacaoRes.data.publishedCities || []).length} cidades)`, color: COLORS[0] },
      { value: `Ag. Publicação (${(publicacaoRes.data.awaitingPublicationCities || []).length} cidades)`, color: COLORS[1] },
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
            {visitaData.data.every(item => item.value === 0) ? (
              <Text color={textFill} fontSize="xl" textAlign="center">Sem dados de status de visita</Text>
            ) : (
              <PieChart width={500} height={500} aria-label="Gráfico de pizza do status da visita">
                <Pie
                  data={visitaData.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={200}
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={{ stroke: gridStroke, strokeWidth: 2 }}
                  className="recharts-pie-sector"
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                >
                  {visitaData.data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, color: tooltipText, fontSize: '18px', borderRadius: '8px', border: `1px solid ${gridStroke}` }}
                />
                <Legend payload={visitaLegend} verticalAlign="top" height={40} iconSize={18} />
              </PieChart>
            )}
          </Box>
          <Box flex="1" maxW="550px">
            <Heading size="2xl" mb={8} color={textFill} fontWeight="extrabold" textAlign="center">
              Status da Publicação
            </Heading>
            {publicacaoData.data.every(item => item.value === 0) ? (
              <Text color={textFill} fontSize="xl" textAlign="center">Sem dados de status de publicação</Text>
            ) : (
              <PieChart width={500} height={500} aria-label="Gráfico de pizza do status da publicação">
                <Pie
                  data={publicacaoData.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={200}
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={{ stroke: gridStroke, strokeWidth: 2 }}
                  className="recharts-pie-sector"
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                >
                  {publicacaoData.data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, color: tooltipText, fontSize: '18px', borderRadius: '8px', border: `1px solid ${gridStroke}` }}
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

    const highlightedCities = cardData?.Visitados?.cities?.map(city => city.NOME || city.nome_municipio) || [];
    const slide4 = (
      <Flex direction="column" align="center" justify="center" minH="100vh" p={10} bg={bgSurface}>
        <Box maxW="1100px" w="100%" aria-label="Slide do mapa da Bahia">
          <Heading size="2xl" mb={8} color={textFill} fontWeight="extrabold" textAlign="center">
            Mapa da Bahia
          </Heading>
          <BahiaMap isInteractive={false} highlightedCities={highlightedCities} />
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
  }, [data, cardData, bgSurface, chartFill, gridStroke, textFill, tooltipBg, tooltipText, COLORS, labelStroke]);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 15000);
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