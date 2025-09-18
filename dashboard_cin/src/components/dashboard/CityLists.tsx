import { useRef, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  VStack,
  Button,
} from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import CityDetailsModal from './CityDetailsModal';
import { City } from '../../types';

interface CityListsProps {
  visits: (City & { NOME: string; daysLeft: number })[];
  installations: (City & { NOME: string; daysLeft: number })[];
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? 'N/A'
    : `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;
};

const formatDays = (days: number | null): string => {
  if (days == null) return 'N/A';
  return days === 0 ? 'Hoje' : `Faltam ${days} dia${days > 1 ? 's' : ''}`;
};

const CityLists = ({ visits, installations }: CityListsProps) => {
  const textFill = useColorModeValue('text._light', 'text._dark');
  const bgSurface = useColorModeValue('bg.main._light', 'bg.main._dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const visitsRef = useRef<HTMLDivElement>(null);
  const installationsRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const downloadTable = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (ref.current) {
      const canvas = await html2canvas(ref.current, { backgroundColor: null });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${filename}.png`;
      link.click();
    }
  };

  return (
    <>
      <VStack spacing="space.lg" align="stretch" bg={bgSurface} p="space.md">
        <Box
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          p="space.md"
          boxShadow="md"
          bg={bgSurface}
          ref={visitsRef}
        >
          <Heading size="lg" mb="space.sm" fontWeight="bold" color={textFill}>
            Visitas da Semana
          </Heading>
          {visits.length === 0 ? (
            <Text color={textFill}>Nenhuma visita agendada para esta semana</Text>
          ) : (
            <>
              <Table variant="simple" aria-label="Tabela de visitas da semana">
                <Thead>
                  <Tr>
                    <Th scope="col">Cidade</Th>
                    <Th scope="col">Data</Th>
                    <Th scope="col">Dias</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {visits.map((city) => (
                    <Tr
                      key={city.id || city.NOME}
                      _hover={{ bg: hoverBg }}
                      cursor="pointer"
                      onClick={() => setSelectedCity(city.NOME)}
                    >
                      <Td>{city.NOME || 'Unknown'}</Td>
                      <Td>{formatDate(city.data_visita)}</Td>
                      <Td>{formatDays(city.daysLeft)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button
                mt="space.sm"
                colorScheme="brand"
                size="sm"
                onClick={() => downloadTable(visitsRef, 'visitas_da_semana')}
                aria-label="Baixar tabela de visitas como imagem"
              >
                Baixar Tabela
              </Button>
            </>
          )}
        </Box>
        <Box
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          p="space.md"
          boxShadow="md"
          bg={bgSurface}
          ref={installationsRef}
        >
          <Heading size="lg" mb="space.sm" fontWeight="bold" color={textFill}>
            Instalações da Semana
          </Heading>
          {installations.length === 0 ? (
            <Text color={textFill}>Nenhuma instalação agendada para esta semana</Text>
          ) : (
            <>
              <Table variant="simple" aria-label="Tabela de instalações da semana">
                <Thead>
                  <Tr>
                    <Th scope="col">Cidade</Th>
                    <Th scope="col">Data</Th>
                    <Th scope="col">Dias</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {installations.map((city) => (
                    <Tr
                      key={city.id || city.NOME}
                      _hover={{ bg: hoverBg }}
                      cursor="pointer"
                      onClick={() => setSelectedCity(city.NOME)}
                    >
                      <Td>{city.NOME || 'Unknown'}</Td>
                      <Td>{formatDate(city.data_instalacao)}</Td>
                      <Td>{formatDays(city.daysLeft)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button
                mt="space.sm"
                colorScheme="brand"
                size="sm"
                onClick={() => downloadTable(installationsRef, 'instalacoes_da_semana')}
                aria-label="Baixar tabela de instalações como imagem"
              >
                Baixar Tabela
              </Button>
            </>
          )}
        </Box>
      </VStack>
      {selectedCity && (
        <CityDetailsModal
          isOpen={!!selectedCity}
          onClose={() => setSelectedCity(null)}
          cityName={selectedCity}
        />
      )}
    </>
  );
};

export default CityLists;