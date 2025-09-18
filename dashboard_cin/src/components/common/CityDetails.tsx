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
  const chartFill = useColorModeValue('#3182ce', '#63b3ed');
  const gridStroke = useColorModeValue('#e2e8f0', '#4a5568');
  const bgSurface = useColorModeValue('white', 'gray.800');

  const { data: cityDetails, isLoading } = useQuery<City[], Error>({
    queryKey: ['cityDetails', cityName],
    queryFn: async () => {
      const response: AxiosResponse<ApiResponse<City[]>> = await getCityDetails(cityName);
      return response.data.data; // Extract the `data` array from the response
    },
    enabled: !!cityName,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Garbage collect after 10 minutes
  });

  if (isLoading) return <Text color={textColor}>Carregando detalhes...</Text>;
  if (!cityDetails || cityDetails.length === 0)
    return <Text color={textColor}>Nenhum detalhe disponível para {cityName}.</Text>;

  const details = cityDetails[0];

  return (
    <Box p={4} bg="bg.surface" borderRadius="md" boxShadow="md">
      <Heading size="md" mb={2} color={textColor}>
        Detalhes de {cityName}
      </Heading>
      <List spacing={2} mb={4}>
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
      </List>
      {details.produtividades_diarias?.length ? (
        <Box mt={4}>
          <Heading size="sm" mb={2} color={textColor}>
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
            <XAxis dataKey="data" stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={14} />
            <Tooltip
              contentStyle={{
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: bgSurface,
                color: textColor,
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