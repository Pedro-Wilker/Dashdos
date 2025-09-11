import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  useColorModeValue,
  Box,
  Heading,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getCityDetails } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const MotionModalContent = motion(ModalContent);

const DetailsModalList = ({ isOpen, onClose, cityName }) => {
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const textColor = useColorModeValue('text._light', 'text._dark');
  const chartFill = useColorModeValue('#3182ce', '#63b3ed');
  const gridStroke = useColorModeValue('#e2e8f0', '#4a5568');
  const bgSurface = useColorModeValue('bg.surface._light', 'bg.surface._dark');

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        const response = await getCityDetails(cityName);
        setCityData(response.data[0]);
        setLoading(false);
      } catch (err) {
        setError('Falha ao buscar detalhes da cidade');
        setLoading(false);
      }
    };
    if (isOpen && cityName) {
      fetchCityDetails();
    }
  }, [cityName, isOpen]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateDaysDifference = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return ` (em ${diffDays} dia${diffDays === 1 ? '' : 's'})`;
    } else if (diffDays < 0) {
      return ` (${Math.abs(diffDays)} dia${Math.abs(diffDays) === 1 ? '' : 's'} atrás)`;
    } else {
      return ' (hoje)';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Text color="red.500">{error}</Text>;
  if (!cityData || !cityData.produtividades_diarias) {
    return <Text color="red.500">Dados da cidade não disponíveis</Text>;
  }

  const chartData = cityData.produtividades_diarias.map((item) => ({
    data: formatDate(item.data),
    quantidade: item.quantidade,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <MotionModalContent
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        bg={bgSurface}
        borderRadius="lg"
        boxShadow="lg"
        color={textColor}
      >
        <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center" aria-label={`Detalhes de ${cityData.nome_municipio}`}>
          {cityData.nome_municipio}
        </ModalHeader>
        <ModalCloseButton aria-label="Fechar modal" />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text><strong>Status Infraestrutura:</strong> {cityData.status_infra || 'N/A'}</Text>
            <Text><strong>Cidade já foi visitada?</strong> {cityData.cidade_visita ? 'Sim' : 'Não'}</Text>
            <Text>
              <strong>Período Visita:</strong> {formatDate(cityData.periodo_visita)}
              {calculateDaysDifference(cityData.periodo_visita)}
            </Text>
            <Text>
              <strong>Período Instalação:</strong> {formatDate(cityData.periodo_instalacao)}
              {calculateDaysDifference(cityData.periodo_instalacao)}
            </Text>
            {cityData.data_visita && (
              <Text>
                <strong>Data da Visita:</strong> {formatDate(cityData.data_visita)}
                {calculateDaysDifference(cityData.data_visita)}
              </Text>
            )}
            {cityData.data_instalacao && (
              <Text>
                <strong>Data da Instalação:</strong> {formatDate(cityData.data_instalacao)}
                {calculateDaysDifference(cityData.data_instalacao)}
              </Text>
            )}
            <Text><strong>Status Visita:</strong> {cityData.status_visita || 'N/A'}</Text>
            <Text>
              <strong>Status Publicação:</strong>{' '}
              {cityData.status_publicacao === 'publicado' ? 'Publicado' : 'Aguardando Publicação'}
            </Text>
            <Text>
              <strong>Status Instalação:</strong>{' '}
              {cityData.status_instalacao === 'instalado' ? 'Instalado' : 'Aguardando Instalação'}
            </Text>
            <Text>
              <strong>Publicação:</strong> {formatDate(cityData.publicacao)}
              {calculateDaysDifference(cityData.publicacao)}
            </Text>
            <Box mt={6}>
              <Heading size="md" mb={4}>Produtividade Diária</Heading>
              <AreaChart
                width={Math.min(window.innerWidth * 0.85, 600)}
                height={300}
                data={chartData}
                aria-label={`Gráfico de produtividade diária de ${cityData.nome_municipio}`}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartFill} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartFill} stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis
                  dataKey="data"
                  stroke={textColor}
                  fontSize={14}
                  tickFormatter={(date) => date.split('/').slice(0, 2).join('/')}
                />
                <YAxis stroke={textColor} fontSize={14} />
                <Tooltip
                  cursor={{ stroke: chartFill, strokeWidth: 2 }}
                  contentStyle={{ fontSize: '16px', fontWeight: '500', borderRadius: '8px', padding: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="quantidade"
                  stroke={chartFill}
                  fill="url(#areaGradient)"
                  fillOpacity={1}
                  activeDot={{ r: 8, fill: '#d69e2e', stroke: textColor, strokeWidth: 2 }}
                />
              </AreaChart>
            </Box>
          </VStack>
        </ModalBody>
      </MotionModalContent>
    </Modal>
  );
};

export default DetailsModalList;