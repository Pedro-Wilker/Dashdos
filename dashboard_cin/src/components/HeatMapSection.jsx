import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Grid,
  GridItem,
  List,
  ListItem,
  useColorModeValue,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon } from '@chakra-ui/icons';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import { getAmploGeral, getCityDetails, getTopAndLeastCities } from '../services/api';
import html2canvas from 'html2canvas';

const HeatMapSection = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const mapRef = useRef(null);
  const chartRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerPage = 10;
  const textFill = useColorModeValue('#2e3d5aff', '#e2e8f0');
  const bgSurface = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch dados gerais
  const { data: amploData, isLoading, error } = useQuery({
    queryKey: ['amploGeral'],
    queryFn: () => getAmploGeral(),
  });

  // Fetch top/least cities - DESABILITADO TEMPORARIAMENTE para evitar erro; ative após fixar API
  const { data: topLeastData } = useQuery({
    queryKey: ['topAndLeastCities', 2025, 3],
    queryFn: () => getTopAndLeastCities({ ano: 2025, limit: 3 }),
    enabled: false, // Desabilita até API estar OK; remova para ativar
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
  const getHighestPriorityStatus = (city) => {
    if (!city) return 'Não Informado';
    return (
      city.status_instalacao === 'instalado' ? 'Instalado' :
      city.status_publicacao === 'publicado' ? 'Publicado' :
      city.status_instalacao === 'aguardando' ? 'Ag. Instalação' :
      city.status_publicacao === 'aguardando' ? 'Ag. Publicação' :
      city.status_visita === 'Aprovado' ? 'Aprovado' :
      city.status_visita === 'Reprovado' ? 'Reprovado' :
      'Não Informado'
    );
  };

  // Mapa de cores por status
  const statusColors = {
    'Não Informado': '#000000',
    Instalado: '#00FF00',
    'Ag. Instalação': '#FFFF00',
    Publicado: '#0000FF',
    'Ag. Publicação': '#8B4513',
    Aprovado: '#FFA500',
    Reprovado: '#FF0000',
  };

  // Paginação com guard
  const allCities = amploData?.data || [];
  const paginatedData = allCities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(allCities.length / itemsPerPage);

  // Dados do carrossel com guard
  const cityProduction = selectedCity ? allCities.find(c => c.nome_municipio === selectedCity)?.produtividades_diarias || [] : [];
  const cityData = cityProduction.map(item => ({
    month: new Date(item.data).toLocaleDateString('pt-BR', { month: 'short' }),
    quantidade: item.quantidade || 0,
  }));

  // Dados para gráfico de área - GUARD ROBUSTO para .slice
  const topLeastCitiesSafe = Array.isArray(topLeastData?.data) ? topLeastData.data : []; // Força array
  const areaChartData = [
    ...(selectedCity ? [{ name: selectedCity, quantidade: cityProduction.reduce((sum, p) => sum + (p.quantidade || 0), 0) }] : []),
    ...(Array.isArray(topLeastCitiesSafe) && topLeastCitiesSafe.length > 0 ? topLeastCitiesSafe.slice(0, 1).map(city => ({ name: `${city.nome_municipio} (Top)`, quantidade: city.total_quantidade || 0 })) : []),
    ...(Array.isArray(topLeastCitiesSafe) && topLeastCitiesSafe.length > 0 ? topLeastCitiesSafe.slice(-1).map(city => ({ name: `${city.nome_municipio} (Least)`, quantidade: city.total_quantidade || 0 })) : []),
  ].filter(item => item.name && item.quantidade !== undefined);

  const downloadChart = async (ref, filename) => {
    if (ref.current) {
      const canvas = await html2canvas(ref.current, { backgroundColor: null });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${filename}.png`;
      link.click();
    }
  };

  const downloadTable = (data, filename) => {
    if (!Array.isArray(data) || data.length === 0) return;
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text color="red.500">{error.message}</Text>;

  return (
    <Box
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      mt={6}
      mx="auto"
      width="90%"
      bg={bgSurface}
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)" // Fix para warning de animation: valor CSS explícito
    >
      <Heading size="lg" mb={4} color={textFill} textAlign="center">
        Mapa de Calor da Bahia
      </Heading>
      <Box ref={mapRef} width="100%" textAlign="center" mb={4}>
        <ComposableMap
          width={dimensions.width}
          height={dimensions.height}
          projectionConfig={{ scale: (dimensions.width / 800) * 2800, center: [-42, -13] }}
          style={{ width: '100%', height: '100%', margin: '0 auto' }}
        >
          <Geographies geography="/bahia_municipios.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const cityData = allCities.find(c => c.nome_municipio === geo.properties.NOME);
                const status = getHighestPriorityStatus(cityData);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={statusColors[status] || '#000000'}
                    stroke="#000"
                    strokeWidth={0.5}
                    onClick={() => setSelectedCity(geo.properties.NOME)}
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
      <Box mb={4}>
        <Text fontSize="sm" color={textFill}>Legenda:</Text>
        <HStack spacing={4} justifyContent="center" wrap="wrap">
          {Object.entries(statusColors).map(([status, color]) => (
            <HStack key={status} spacing={2}>
              <Box w="15px" h="15px" bg={color} />
              <Text fontSize="sm">{status}</Text>
            </HStack>
          ))}
        </HStack>
      </Box>
      <Button
        onClick={() => setExpanded(!expanded)}
        rightIcon={expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        mb={4}
      >
        {expanded ? 'Recolher' : 'Expandir Detalhes'}
      </Button>
      {expanded && (
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
          <GridItem>
            <Table variant="simple" mb={4}>
              <Thead>
                <Tr>
                  <Th>Cidade</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((city) => (
                  <Tr
                    key={city.id || city.nome_municipio}
                    onClick={() => {
                      setSelectedCity(city.nome_municipio);
                      setModalOpen(true);
                    }}
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Td>{city.nome_municipio}</Td>
                    <Td>{getHighestPriorityStatus(city)}</Td>
                    <Td>
                      <IconButton
                        icon={<DownloadIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadTable([city], `city_${city.nome_municipio}`);
                        }}
                        size="sm"
                        aria-label="Baixar dados da cidade"
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <HStack justifyContent="center" mb={4}>
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                size="sm"
              >
                Anterior
              </Button>
              <Text fontSize="sm">{currentPage} de {totalPages}</Text>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                size="sm"
              >
                Próximo
              </Button>
              <Button
                leftIcon={<DownloadIcon />}
                onClick={() => downloadTable(paginatedData, `cidades_pagina_${currentPage}`)}
                size="sm"
                variant="outline"
              >
                Baixar Página
              </Button>
            </HStack>
          </GridItem>
          <GridItem>
            <VStack spacing={4} align="stretch">
              {selectedCity && (
                <Box ref={chartRef} mb={4}>
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
                        <Bar dataKey="quantidade" fill="#3182ce" radius={[8, 8, 0, 0]}>
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
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                  {carouselIndex === 1 && areaChartData.length === 0 && (
                    <Text textAlign="center" color="gray.500">Dados de comparação não disponíveis (API offline).</Text>
                  )}
                  <HStack justifyContent="center" mt={2} spacing={2}>
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
                      onClick={() => downloadChart(chartRef, `city_${selectedCity}_chart_${carouselIndex}`)}
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
          </GridItem>
        </Grid>
      )}
      {/* Modal Inline */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhes de {selectedCity}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedCity && <CityDetailsModal cityName={selectedCity} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Subcomponente para detalhes na seção expandida
const CityDetailsSection = ({ cityName }) => {
  const { data: cityDetails, isLoading } = useQuery({
    queryKey: ['cityDetails', cityName],
    queryFn: () => getCityDetails(cityName),
    enabled: !!cityName,
  });

  if (isLoading) return <Text>Carregando detalhes...</Text>;
  if (!cityDetails || !cityDetails.data || cityDetails.data.length === 0) return <Text>Nenhum detalhe disponível.</Text>;

  const details = cityDetails.data[0];

  return (
    <Box p={4} bg="bg.surface" borderRadius="md" boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)">
      <Heading size="md" mb={2}>Detalhes de {cityName}</Heading>
      <List spacing={2}>
        <ListItem><strong>Nome:</strong> {details.nome_municipio}</ListItem>
        <ListItem><strong>Status Visita:</strong> {details.status_visita || 'N/A'}</ListItem>
        <ListItem><strong>Status Publicação:</strong> {details.status_publicacao || 'N/A'}</ListItem>
        <ListItem><strong>Status Instalação:</strong> {details.status_instalacao || 'N/A'}</ListItem>
        <ListItem><strong>Data Visita:</strong> {details.data_visita || 'N/A'}</ListItem>
        <ListItem><strong>Data Instalação:</strong> {details.data_instalacao || 'N/A'}</ListItem>
      </List>
    </Box>
  );
};

// Subcomponente para modal
const CityDetailsModal = ({ cityName }) => {
  const { data: cityDetails, isLoading } = useQuery({
    queryKey: ['cityDetailsModal', cityName],
    queryFn: () => getCityDetails(cityName),
    enabled: !!cityName,
  });

  if (isLoading) return <Text>Carregando...</Text>;
  if (!cityDetails || !cityDetails.data || cityDetails.data.length === 0) return <Text>Nenhum detalhe disponível.</Text>;

  const details = cityDetails.data[0];
  const produtividades = details.produtividades_diarias || [];

  const downloadTable = (data, filename) => {
    if (!Array.isArray(data) || data.length === 0) return;
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  return (
    <VStack spacing={4} align="stretch">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Data</Th>
            <Th>Quantidade</Th>
          </Tr>
        </Thead>
        <Tbody>
          {produtividades.map((prod, index) => (
            <Tr key={index}>
              <Td>{new Date(prod.data).toLocaleDateString('pt-BR')}</Td>
              <Td>{prod.quantidade || 0}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button
        leftIcon={<DownloadIcon />}
        onClick={() => downloadTable(produtividades, `produtividade_${cityName}`)}
        colorScheme="blue"
      >
        Baixar Tabela de Produtividades
      </Button>
      <List spacing={2}>
        <ListItem><strong>Nome:</strong> {details.nome_municipio}</ListItem>
        <ListItem><strong>Status Visita:</strong> {details.status_visita || 'N/A'}</ListItem>
        <ListItem><strong>Status Publicação:</strong> {details.status_publicacao || 'N/A'}</ListItem>
        <ListItem><strong>Status Instalação:</strong> {details.status_instalacao || 'N/A'}</ListItem>
        <ListItem><strong>Data Visita:</strong> {details.data_visita || 'N/A'}</ListItem>
        <ListItem><strong>Data Instalação:</strong> {details.data_instalacao || 'N/A'}</ListItem>
      </List>
      <Button
        leftIcon={<DownloadIcon />}
        onClick={() => downloadTable([details], `detalhes_${cityName}`)}
        colorScheme="green"
      >
        Baixar Detalhes
      </Button>
    </VStack>
  );
};

export default HeatMapSection;