import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  List,
  ListItem,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon } from '@chakra-ui/icons';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useQuery } from '@tanstack/react-query';
import {
  getAmploGeral,
  getCityDetails,
  getTopAndLeastCities,
} from '../../services/api';
import { downloadChartAsImage, downloadCSV } from '../../utils/downloadChart';
import { City, TopAndLeastCitiesResponse, TopCity } from '../../types';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, AreaChart, Area, ResponsiveContainer } from 'recharts';

const HeatMapSection = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const textFill = useColorModeValue('#2e3d5aff', '#e2e8f0');
  const bgSurface = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const barColor = useColorModeValue('#3182ce', '#63b3ed');
  const areaColor = useColorModeValue('#8884d8', '#a3bffa');

  // Fetch dados gerais
  const { data: allCities = [], isLoading, error } = useQuery<City[], Error>({
    queryKey: ['amploGeral'],
    queryFn: async () => {
      const response = await getAmploGeral();
      return response.data.data;
    },
  });

  // Fetch top/least cities
  const { data: topLeastCities = { topCities: [], leastCities: [] } } = useQuery<TopAndLeastCitiesResponse, Error>({
    queryKey: ['topAndLeastCities', 2025, 3],
    queryFn: async () => {
      const response = await getTopAndLeastCities({ ano: 2025, limit: 3 });
      return response.data.data;
    },
    enabled: false,
    retry: 3,
  });

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        const newWidth = Math.min(rect.width * 0.8, 1200);
        const newHeight = newWidth * (600 / 800);
        setDimensions({ width: newWidth, height: newHeight });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Determina status de maior prioridade
  const getHighestPriorityStatus = (city: City | undefined): string => {
    if (!city) return 'Não Informado';
    return (
      city.status_instalacao === 'instalado' ? 'Instalado' :
      city.status_publicacao === 'publicado' ? 'Publicado' :
      city.status_instalacao === 'aguardando_instalacao' ? 'Ag. Instalação' :
      city.status_publicacao === 'aguardando_publicacao' ? 'Ag. Publicação' :
      city.status_visita === 'Aprovado' ? 'Aprovado' :
      city.status_visita === 'Reprovado' ? 'Reprovado' :
      'Não Informado'
    );
  };

  // Mapa de cores por status
  const statusColors: { [key: string]: string } = {
    'Não Informado': '#000000',
    Instalado: '#00FF00',
    'Ag. Instalação': '#FFFF00',
    Publicado: '#0000FF',
    'Ag. Publicação': '#8B4513',
    Aprovado: '#FFA500',
    Reprovado: '#FF0000',
  };

  // Dados do carrossel
  const cityProduction = useMemo(() => {
    return selectedCity ? allCities.find((c) => c.nome_municipio === selectedCity)?.produtividades_diarias || [] : [];
  }, [selectedCity, allCities]);

  const cityData = useMemo(() => {
    return cityProduction.map((item) => ({
      month: new Date(item.data).toLocaleDateString('pt-BR', { month: 'short' }),
      quantidade: item.quantidade || 0,
    }));
  }, [cityProduction]);

  // Dados para gráfico de área
  const topLeastCitiesSafe = useMemo(() => {
    return [...topLeastCities.topCities, ...topLeastCities.leastCities];
  }, [topLeastCities]);

  const areaChartData = useMemo(() => {
    return [
      ...(selectedCity ? [{ name: selectedCity, quantidade: cityProduction.reduce((sum: number, p) => sum + (p.quantidade || 0), 0) }] : []),
      ...(topLeastCitiesSafe.length > 0 ? topLeastCitiesSafe.slice(0, 1).map((city: TopCity) => ({ name: `${city.nome_municipio} (Top)`, quantidade: city.total_quantidade || 0 })) : []),
      ...(topLeastCitiesSafe.length > 0 ? topLeastCitiesSafe.slice(-1).map((city: TopCity) => ({ name: `${city.nome_municipio} (Least)`, quantidade: city.total_quantidade || 0 })) : []),
    ].filter((item) => item.name && item.quantidade !== undefined);
  }, [selectedCity, cityProduction, topLeastCitiesSafe]);

  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text color="red.500">{error.message}</Text>;

  return (
    <Box
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      mt="space.xl"
      mb="space.xl"
      mx="auto"
      width={{ base: '100%', md: '90%' }}
      bg={bgSurface}
      boxShadow="var(--shadow-card)"
    >
      <VStack spacing="space.lg" align="stretch">
        <Heading size="lg" color={textFill} textAlign="center">
          Mapa de Calor da Bahia
        </Heading>
        <Box ref={mapRef} width="100%" textAlign="center">
          <ComposableMap
            width={dimensions.width}
            height={dimensions.height}
            projectionConfig={{ scale: (dimensions.width / 800) * 2800, center: [-42, -13] }}
            style={{ width: '100%', height: '100%', margin: '0 auto' }}
          >
            <Geographies geography="/bahia_municipios.json">
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const cityData = allCities.find((c: City) => c.nome_municipio === geo.properties.NOME);
                  const status = getHighestPriorityStatus(cityData);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={statusColors[status] || '#000000'}
                      stroke="#000"
                      strokeWidth={0.5}
                      onClick={() => {
                        setSelectedCity(geo.properties.NOME);
                        setModalOpen(true);
                      }}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#29C3FF', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </Box>
        <HStack spacing="space.md" justifyContent="center" wrap="wrap">
          {Object.entries(statusColors).map(([status, color]: [string, string]) => (
            <HStack key={status} spacing="space.sm">
              <Box w="15px" h="15px" bg={color} />
              <Text fontSize="sm">{status}</Text>
            </HStack>
          ))}
        </HStack>
        <Button
          onClick={() => setExpanded(!expanded)}
          rightIcon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        >
          {expanded ? 'Recolher' : 'Expandir Detalhes'}
        </Button>
        {expanded && (
          <VStack spacing="space.lg" align="stretch">
            {selectedCity && (
              <Box ref={chartRef}>
                {carouselIndex === 0 && cityData.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart
                      data={cityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantidade" fill={barColor} radius={[8, 8, 0, 0]}>
                        <LabelList dataKey="quantidade" position="top" />
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                )}
                {carouselIndex === 1 && areaChartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={areaChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="quantidade"
                        stroke={areaColor}
                        fill={areaColor}
                        fillOpacity={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                {carouselIndex === 1 && areaChartData.length === 0 && (
                  <Text textAlign="center" color="gray.500">Dados de comparação não disponíveis (API offline).</Text>
                )}
                <HStack justifyContent="center" mt="space.sm" spacing="space.sm">
                  <IconButton
                    icon={<ChevronDownIcon />}
                    onClick={() => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : 1))}
                    aria-label="Gráfico Anterior"
                    size="sm"
                  />
                  <Text fontSize="sm">Gráfico {carouselIndex + 1}/2</Text>
                  <IconButton
                    icon={<ChevronDownIcon transform="rotate(180deg)" />}
                    onClick={() => setCarouselIndex((prev) => (prev < 1 ? prev + 1 : 0))}
                    aria-label="Próximo Gráfico"
                    size="sm"
                  />
                  <Button
                    leftIcon={<DownloadIcon />}
                    onClick={() => downloadChartAsImage(chartRef, `city_${selectedCity}_chart_${carouselIndex}`)}
                    size="sm"
                    variant="outline"
                  >
                    Baixar
                  </Button>
                </HStack>
              </Box>
            )}
            {selectedCity && <CityDetailsSection cityName={selectedCity} />}
          </VStack>
        )}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size={{ base: 'full', md: 'xl' }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detalhes de {selectedCity}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedCity && <CityDetailsModal cityName={selectedCity} />}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

// Subcomponente para detalhes na seção expandida
interface CityDetailsSectionProps {
  cityName: string;
}

const CityDetailsSection = ({ cityName }: CityDetailsSectionProps) => {
  const { data: cityDetails = [], isLoading } = useQuery<City[], Error>({
    queryKey: ['cityDetails', cityName],
    queryFn: async () => {
      const response = await getCityDetails(cityName);
      return response.data.data;
    },
    enabled: !!cityName,
  });

  if (isLoading) return <Text>Carregando detalhes...</Text>;
  if (cityDetails.length === 0) return <Text>Nenhum detalhe disponível.</Text>;

  const details = cityDetails[0];

  return (
    <Box p={4} bg="bg.surface" borderRadius="md" boxShadow="var(--shadow-card)">
      <Heading size="md" mb="space.sm">Detalhes de {cityName}</Heading>
      <List spacing="space.sm">
        <ListItem><strong>Nome:</strong> {details.nome_municipio}</ListItem>
        <ListItem><strong>Status Visita:</strong> {details.status_visita || 'N/A'}</ListItem>
        <ListItem><strong>Status Publicação:</strong> {details.status_publicacao || 'N/A'}</ListItem>
        <ListItem><strong>Status Instalação:</strong> {details.status_instalacao || 'N/A'}</ListItem>
        <ListItem><strong>Data Visita:</strong> {details.data_visita ?? 'N/A'}</ListItem>
        <ListItem><strong>Data Instalação:</strong> {details.data_instalacao ?? 'N/A'}</ListItem>
      </List>
    </Box>
  );
};

// Subcomponente para modal
interface CityDetailsModalProps {
  cityName: string;
}

const CityDetailsModal = ({ cityName }: CityDetailsModalProps) => {
  const { data: cityDetails = [], isLoading } = useQuery<City[], Error>({
    queryKey: ['cityDetailsModal', cityName],
    queryFn: async () => {
      const response = await getCityDetails(cityName);
      return response.data.data;
    },
    enabled: !!cityName,
  });

  if (isLoading) return <Text>Carregando...</Text>;
  if (cityDetails.length === 0) return <Text>Nenhum detalhe disponível.</Text>;

  const details = cityDetails[0];

  const downloadDetails = () => {
    const data = [{
      Nome: details.nome_municipio,
      'Status Visita': details.status_visita || 'N/A',
      'Status Publicação': details.status_publicacao || 'N/A',
      'Status Instalação': details.status_instalacao || 'N/A',
      'Data Visita': details.data_visita ?? 'N/A',
      'Data Instalação': details.data_instalacao ?? 'N/A',
    }];
    downloadCSV(data, `detalhes_${cityName}`);
  };

  return (
    <VStack spacing="space.lg" align="stretch">
      <List spacing="space.sm">
        <ListItem><strong>Nome:</strong> {details.nome_municipio}</ListItem>
        <ListItem><strong>Status Visita:</strong> {details.status_visita || 'N/A'}</ListItem>
        <ListItem><strong>Status Publicação:</strong> {details.status_publicacao || 'N/A'}</ListItem>
        <ListItem><strong>Status Instalação:</strong> {details.status_instalacao || 'N/A'}</ListItem>
        <ListItem><strong>Data Visita:</strong> {details.data_visita ?? 'N/A'}</ListItem>
        <ListItem><strong>Data Instalação:</strong> {details.data_instalacao ?? 'N/A'}</ListItem>
      </List>
      <Button
        leftIcon={<DownloadIcon />}
        onClick={downloadDetails}
        colorScheme="green"
      >
        Baixar Detalhes
      </Button>
    </VStack>
  );
};

export default HeatMapSection;