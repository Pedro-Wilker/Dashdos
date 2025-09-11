import { useEffect, useState, useRef } from 'react';
import { Box, Heading, Flex, Text, Icon, useColorModeValue, Button } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import CityList from './CityList';
import {
  getStatusVisitaBreakdown,
  getStatusPublicacaoBreakdown,
  getStatusInstalacaoBreakdown,
} from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import html2canvas from 'html2canvas';

const MotionBox = motion(Box);

const PieChartSection = () => {
  const [visitaData, setVisitaData] = useState(null);
  const [publicacaoData, setPublicacaoData] = useState(null);
  const [instalacaoData, setInstalacaoData] = useState(null);
  const [selectedCities, setSelectedCities] = useState(null);
  const [selectedPie, setSelectedPie] = useState(null);
  const [activeChart, setActiveChart] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const visitaRef = useRef(null);
  const publicacaoRef = useRef(null);
  const instalacaoRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitaRes, publicacaoRes, instalacaoRes] = await Promise.all([
          getStatusVisitaBreakdown(),
          getStatusPublicacaoBreakdown(),
          getStatusInstalacaoBreakdown(),
        ]);

        setVisitaData({
          data: [
            { name: 'Aprovados', value: visitaRes.data.approvedPercentage, cities: visitaRes.data.approvedCities },
            { name: 'Reprovados', value: visitaRes.data.rejectedPercentage, cities: visitaRes.data.rejectedCities },
          ],
        });
        setPublicacaoData({
          data: [
            { name: 'Publicados', value: publicacaoRes.data.publishedPercentage, cities: publicacaoRes.data.publishedCities },
            { name: 'Ag. Publicação', value: publicacaoRes.data.awaitingPercentage, cities: publicacaoRes.data.awaitingPublicationCities },
          ],
        });
        setInstalacaoData({
          data: [
            { name: 'Instalados', value: instalacaoRes.data.installedPercentage, cities: instalacaoRes.data.installedCities },
            { name: 'Ag. Instalação', value: instalacaoRes.data.awaitingPercentage, cities: instalacaoRes.data.awaitingInstallationCities },
          ],
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pie chart data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePieClick = (data) => {
    setSelectedCities(data.payload.cities);
    setSelectedPie(data.payload.name);
  };

  const handlePieDoubleClick = (nextChart) => {
    if (activeChart < nextChart) {
      setActiveChart(nextChart);
    }
  };

  const downloadChart = async (ref, filename) => {
    if (ref.current) {
      const canvas = await html2canvas(ref.current, { backgroundColor: null });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${filename}.png`;
      link.click();
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Text color="red.500">{error}</Text>;

  const renderPie = (title, data, nextChart, chartRef) => (
    <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" gap={6}>
      <Box flex="1" ref={chartRef}>
        <Heading size="md" mb={4} color={textFill}>{title}</Heading>
        <PieChart width={400} height={400}>
          <Legend verticalAlign="top" height={36} />
          <Pie
            data={data.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={({ name, value }) => `${name}: ${value}%`}
            labelLine={{ stroke: gridStroke, strokeWidth: 2 }}
            onClick={handlePieClick}
            onDoubleClick={() => nextChart <= 3 && handlePieDoubleClick(nextChart)}
            className="recharts-pie-sector"
          >
            {data.data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', fontSize: '14px' }}
            itemStyle={{ fontWeight: '500' }}
          />
        </PieChart>
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
      {selectedCities && selectedPie === data.data.find(d => d.cities === selectedCities)?.name && (
        <Box flex="1" maxH="400px" overflow="auto" minW="300px">
          <CityList cities={selectedCities} cardTitle={selectedPie} />
        </Box>
      )}
    </Flex>
  );

  return (
    <Box bg={bgMain} pt={10} pb={10} sx={{ backgroundColor: bgMain }}>
      <Box
        width="90%"
        mx="auto"
        className="card-like"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p={6}
        bg={bgSurface}
      >
        <Heading size="lg" mb={6} color={textFill}>Status das Visitas</Heading>
        <Flex direction="column" alignItems="center" gap={10}>
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderPie("Status das Visitas", visitaData, 2, visitaRef)}
          </MotionBox>

          {activeChart >= 2 && (
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Icon as={FaArrowDown} boxSize={6} mb={4} color={textFill} />
              {renderPie("Status da Publicação", publicacaoData, 3, publicacaoRef)}
            </MotionBox>
          )}

          {activeChart >= 3 && (
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Icon as={FaArrowDown} boxSize={6} mb={4} color={textFill} />
              {renderPie("Status da Instalação", instalacaoData, 4, instalacaoRef)}
            </MotionBox>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default PieChartSection;