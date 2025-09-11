import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  List,
  ListItem,
  Text,
  VStack,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import { writeFile, utils } from 'xlsx';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  getVisitedCities,
  getStatusVisitaBreakdown,
  getStatusPublicacaoBreakdown,
  getStatusInstalacaoBreakdown,
  getAmploGeral,
  getCityDetails,
} from '../services/api';

const MotionModalContent = motion(ModalContent);

const CityListModal = ({ isOpen, onClose, cities, title }) => {
  const textColor = useColorModeValue('text._light', 'text._dark');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const bgSurface = useColorModeValue('bg.surface._light', 'bg.surface._dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);

  const { data: searchResult, isLoading: isSearchLoading } = useQuery({
    queryKey: ['searchCity', searchTerm, title],
    queryFn: async () => {
      if (!searchTerm) return cities;
      const res = await getCityDetails(searchTerm);
      const city = res.data[0];
      if (!city) return [];

      let cardCities = [];
      if (title === '343 Cidades') {
        cardCities = (await getAmploGeral()).data;
      } else if (title === 'Visitados') {
        cardCities = (await getVisitedCities()).data.visitedCities;
      } else if (title === 'Aprovados') {
        cardCities = (await getStatusVisitaBreakdown()).data.approvedCities;
      } else if (title === 'Reprovados') {
        cardCities = (await getStatusVisitaBreakdown()).data.rejectedCities;
      } else if (title === 'Publicados') {
        cardCities = (await getStatusPublicacaoBreakdown()).data.publishedCities;
      } else if (title === 'Instalados') {
        cardCities = (await getStatusInstalacaoBreakdown()).data.installedCities;
      } else if (title === 'Aguardando Instalacao') {
        cardCities = (await getStatusInstalacaoBreakdown()).data.awaitingInstallationCities;
      }

      return cardCities.some(c => c.nome_municipio === city.nome_municipio) ? [city] : [];
    },
    enabled: !!searchTerm,
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (!e.target.value) {
      setFilteredCities(cities);
    } else {
      setFilteredCities(searchResult || []);
    }
  };

  const exportToExcel = () => {
    if (!filteredCities || filteredCities.length === 0) {
      alert('Nenhuma cidade para exportar');
      return;
    }
    const data = filteredCities.map((city, index) => ({
      '#': index + 1,
      Cidade: city.nome_municipio,
    }));
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Cidades');
    writeFile(workbook, `${title}.xlsx`);
  };

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
        <ModalHeader fontSize="xl" fontWeight="bold" aria-label={title}>
          {title}
        </ModalHeader>
        <ModalCloseButton aria-label="Fechar modal" />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Pesquisar cidade..."
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Pesquisar cidade por nome"
            />
            {isSearchLoading && <Text>Carregando...</Text>}
            <Button
              colorScheme="brand"
              onClick={exportToExcel}
              leftIcon={<Text>📊</Text>}
              size="md"
              aria-label="Exportar lista para Excel"
            >
              Exportar para Excel
            </Button>
            <List spacing={3} className="styled-city-list">
              {filteredCities.map((city, index) => (
                <ListItem
                  key={index}
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: hoverBg }}
                  aria-label={city.nome_municipio}
                >
                  <Text fontSize="sm">
                    {index + 1}. {city.nome_municipio}
                  </Text>
                </ListItem>
              ))}
            </List>
          </VStack>
        </ModalBody>
      </MotionModalContent>
    </Modal>
  );
};

export default CityListModal;