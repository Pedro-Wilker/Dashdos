import { useState, useEffect, useRef } from 'react';
import { Box, Heading, Text, Button, VStack, HStack, Table, Thead, Tbody, Tr, Th, Td, Tabs, TabList, TabPanels, TabPanel, useColorModeValue, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon } from '@chakra-ui/icons';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useQuery } from '@tanstack/react-query';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { getAmploGeral, getCityDetails, getTopAndLeastCities } from '../services/api';
import html2canvas from 'html2canvas';
import Modal from './Modal'; // Componente genérico para modal (assuma que existe ou crie)

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

  // Fetch top/least cities (para gráfico de área)
  const { data: topLeastData } = useQuery({
    queryKey: ['topAndLeastCities', 2025, 3], // Limite de 3 cidades
    queryFn: () => getTopAndLeastCities({ ano: 2025, limit: 3 }),
  });

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 }); // Base inicial

  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        const newWidth = Math.min(rect.width * 0.8, 1200); // Limite max 1200px, 80% da seção
        const newHeight = newWidth * (600 / 800); // Aspect ratio 4:3
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
    const statuses = {
      Instalado: 'Instalado',
      'Ag. Instalação': 'Ag. Instalação',
      Publicado: 'Publicado',
      'Ag. Publicação': 'Ag. Publicação',
      Aprovado: 'Aprovado',
      Reprovado: 'Reprovado',
    };
    return (
      city.status_instalacao === 'Instalado' ? 'Instalado' :
      city.status_publicacao === 'Publicado' ? 'Publicado' :
      city.status_instalacao === 'Ag. Instalação' ? 'Ag. Instalação' :
      city.status_publicacao === 'Ag. Publicação' ? 'Ag. Publicação' :
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

  // Paginação
  const paginatedData = amploData?.data?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];
  const totalPages = Math.ceil((amploData?.data?.length || 0) / itemsPerPage);

  // Dados do carrossel
  const cityProduction = selectedCity ? amploData?.data.find(c => c.nome_municipio === selectedCity)?.produtividade || [] : [];
  const cityData = cityProduction.map(item => ({
    month: item.monthYear.split('-')[1],
    quantidade: item.quantidade || 0,
  }));
  const topLeastCityData = topLeastData?.data || [];
  const areaChartData = topLeastCityData.map(city => ({
    name: city.nome_municipio,
    quantidade: city.total_quantidade || 0,
  })).filter(city => city.name === selectedCity || topLeastData.data.some(c => c.nome_municipio === city.name));

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
      width="90%" // Não ocupa 100%, centralizado
      bg={bgSurface}
      boxShadow="sm"
    >
      <Heading size="lg" mb={4} color={textFill} textAlign="center">
        Mapa de Calor da Bahia
      </Heading>
      <Box ref={mapRef} width="100%" textAlign="center" mb={4}>
        <ComposableMap
          width={dimensions.width}
          height={dimensions.height}
          projectionConfig={{ scale: (dimensions.width / 800) * 3000, center: [-39, -12] }} // Scale maior para mapa bem amplo
          style={{ width: '100%', height: '100%', margin: '0 auto' }} // Centralizado e escalável
        >
          <Geographies geography="/bahia_municipios.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const cityData = amploData?.data.find(c => c.nome_municipio === geo.properties.NOME);
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
        <Box>
          <Grid templateColumns="2fr 1fr" gap={6}>
            <Box>
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
                    <Tr key={city.id || city.nome_municipio} onClick={() => { setSelectedCity(city.nome_municipio); setModalOpen(true); }} cursor="pointer">
                      <Td>{city.nome_municipio}</Td>
                      <Td>{getHighestPriorityStatus(city)}</Td>
                      <Td>
                        <IconButton
                          icon={<DownloadIcon />}
                          onClick={(e) => { e.stopPropagation(); downloadTable([city], `city_${city.nome_municipio}`); }}
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
                >
                  Anterior
                </Button>
                <Text>{currentPage} de {totalPages}</Text>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </HStack>
            </Box>
            <Box>
              <VStack spacing={4} align="stretch">
                {selectedCity && (
                  <Box ref={chartRef} mb={4}>
                    {carouselIndex === 0 && (
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
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="quantidade" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                    <HStack justifyContent="center" mt={2}>
                      <IconButton
                        icon={<ChevronDownIcon />}
                        onClick={() => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : 1))}
                        disabled={carouselIndex === 0}
                      />
                      <IconButton
                        icon={<ChevronDownIcon transform="rotate(180deg)" />}
                        onClick={() => setCarouselIndex((prev) => (prev < 1 ? prev + 1 : 0))}
                        disabled={carouselIndex === 1}
                      />
                      <Button
                        leftIcon={<DownloadIcon />}
                        onClick={() => downloadChart(chartRef, `city_${selectedCity}_chart`)}
                        size="sm"
                      >
                        Baixar Gráfico
                      </Button>
                    </HStack>
                  </Box>
                )}
                {selectedCity && <CityDetailsSection cityName={selectedCity} />}
              </VStack>
            </Box>
          </Grid>
        </Box>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedCity && <CityDetailsModal cityName={selectedCity} />}
      </Modal>
    </Box>
  );
};

const CityDetailsSection = ({ cityName }) => {
  const { data: cityDetails, isLoading } = useQuery({
    queryKey: ['cityDetails', cityName],
    queryFn: () => getCityDetails(cityName),
    enabled: !!cityName,
  });

  if (isLoading) return <Text>Carregando detalhes...</Text>;
  if (!cityDetails || !cityDetails.data[0]) return <Text>Nenhum detalhe disponível.</Text>;

  const details = cityDetails.data[0];

  return (
    <Box p={4} bg="bg.surface" borderRadius="md" boxShadow="md">
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

const CityDetailsModal = ({ cityName }) => {
  const { data: cityDetails, isLoading } = useQuery({
    queryKey: ['cityDetailsModal', cityName],
    queryFn: () => getCityDetails(cityName),
    enabled: !!cityName,
  });

  if (isLoading) return <Text>Carregando...</Text>;
  if (!cityDetails || !cityDetails.data[0]) return <Text>Nenhum detalhe disponível.</Text>;

  const details = cityDetails.data[0];
  const produtividades = details.produtividade || [];

  return (
    <Box>
      <Heading size="md" mb={4}>{cityName}</Heading>
      <Table variant="simple" mb={4}>
        <Thead>
          <Tr>
            <Th>Mês</Th>
            <Th>Quantidade</Th>
          </Tr>
        </Thead>
        <Tbody>
          {produtividades.map((prod, index) => (
            <Tr key={index}>
              <Td>{prod.monthYear.split('-')[1]}</Td>
              <Td>{prod.quantidade || 0}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
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
        onClick={() => downloadTable(produtividades, `produtividade_${cityName}`)}
        mt={4}
      >
        Baixar Produtividades
      </Button>
      <Button
        leftIcon={<DownloadIcon />}
        onClick={() => downloadTable([details], `detalhes_${cityName}`)}
        mt={4}
        ml={4}
      >
        Baixar Detalhes
      </Button>
    </Box>
  );
};

export default HeatMapSection;