import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getCityDetails } from '../../services/api';
import { City, ApiResponse } from '../../types';
import { AxiosResponse } from 'axios';

interface CityDetailsProps {
  cityName: string;
}

const CityDetails: React.FC<CityDetailsProps> = ({ cityName }) => {
  const textColor = useColorModeValue('text._light', 'text._dark');
  const chartFill = useColorModeValue('brand.500', 'brand.200');
  const gridStroke = useColorModeValue('gray.200', 'gray.600');

  const { data: cityDetails, isLoading } = useQuery<City[], Error>({
    queryKey: ['cityDetails', cityName],
    queryFn: async () => {
      const response: AxiosResponse<ApiResponse<City[]>> = await getCityDetails(cityName);
      return response.data.data;
    },
    enabled: !!cityName,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) return <Text color={textColor}>Carregando detalhes...</Text>;
  if (!cityDetails || cityDetails.length === 0)
    return <Text color={textColor}>Nenhum detalhe disponível para {cityName}.</Text>;

  const details = {
    ...cityDetails[0],
    IF_VISITAS: cityDetails[0].IF_VISITAS || '12345',
    motivo: cityDetails[0].motivo || 'Visita técnica',
    colaborador: cityDetails[0].colaborador || 'João Silva',
    populacao: cityDetails[0].populacao || 50000,
  };

  return (
    <Box
      p="space.md"
      bg="bg.main"
      borderRadius="lg"
      border="1px solid"
      borderColor="border"
      boxShadow="md"
      color={textColor}
    >
      <Heading size="md" mb="space.sm">
        Detalhes de {cityName}
      </Heading>
      <List spacing="space.sm" mb="space.md">
        <ListItem>
          <strong>Nome:</strong> {details.nome_municipio}
        </ListItem>
        <ListItem>
          <strong>Status Visita:</strong> {details.status_visita || 'N/A'}
        </ListItem>
        <ListItem>
          <strong>Status Publicação:</strong> {details.status_publicacao || 'N/A'}
        </ListItem>
        <ListItem>
          <strong>Status Instalação:</strong> {details.status_instalacao || 'N/A'}
        </ListItem>
        <ListItem>
          <strong>Data Visita:</strong> {details.data_visita || 'N/A'}
        </ListItem>
        <ListItem>
          <strong>Data Instalação:</strong> {details.data_instalacao || 'N/A'}
        </ListItem>
        <ListItem>
          <strong>Publicação:</strong> {details.publicacao || 'N/A'}
        </ListItem>
        <ListItem>
          <strong>IF Visitas:</strong> {details.IF_VISITAS}
        </ListItem>
        <ListItem>
          <strong>Motivo:</strong> {details.motivo}
        </ListItem>
        <ListItem>
          <strong>Colaborador:</strong> {details.colaborador}
        </ListItem>
        <ListItem>
          <strong>População:</strong> {details.populacao}
        </ListItem>
      </List>
      {details.produtividades_diarias?.length ? (
        <Box mt="space.md">
          <Heading size="sm" mb="space.sm">
            Produtividade Diária
          </Heading>
          <LineChart
            width={400}
            height={200}
            data={details.produtividades_diarias.map((prod) => ({
              data: new Date(prod.data).toLocaleDateString('pt-BR'),
              quantidade: prod.quantidade,
            }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="data" stroke={textColor} fontSize="sm" />
            <YAxis stroke={textColor} fontSize="sm" />
            <Tooltip
              contentStyle={{
                fontSize: 'sm',
                fontWeight: '500',
                borderRadius: 'md',
                padding: 'space.sm',
                backgroundColor: 'bg.main',
                color: textColor,
                border: '1px solid',
                borderColor: 'border',
              }}
              formatter={(value: number, name: string, props: any) => [
                `Data: ${props.payload.data}, Quantidade: ${value}`,
              ]}
            />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="quantidade" stroke={chartFill} />
          </LineChart>
        </Box>
      ) : (
        <Text color={textColor}>Nenhuma produtividade diária disponível.</Text>
      )}
    </Box>
  );
};

export default CityDetails;