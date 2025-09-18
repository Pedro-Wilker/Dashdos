import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FixedSizeList } from 'react-window';
import { writeFile, utils } from 'xlsx';
import { motion } from 'framer-motion';
import { useCitySearch } from '../../hooks/useCitySearch';

const MotionModalContent = motion(ModalContent);

interface CityListModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: Array<{ nome_municipio: string }>;
  title: string;
}

const CityListModal: React.FC<CityListModalProps> = ({ isOpen, onClose, cities, title }) => {
  const textColor = useColorModeValue('text._light', 'text._dark');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');
  const { searchTerm, filteredCities, isSearchLoading, handleSearch } = useCitySearch(cities, title);

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

  const Row: React.FC<{ index: number; style: React.CSSProperties }> = ({ index, style }) => (
    <div
      style={{
        ...style,
        padding: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      className="styled-city-list"
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <Text fontSize="sm" color={textColor}>
        {index + 1}. {filteredCities[index]?.nome_municipio || 'Cidade não disponível'}
      </Text>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <MotionModalContent
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        bg="bg.surface"
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
            {filteredCities.length > 0 ? (
              <FixedSizeList
                height={400}
                width="100%"
                itemCount={filteredCities.length}
                itemSize={40}
              >
                {Row}
              </FixedSizeList>
            ) : (
              <Text>Nenhuma cidade encontrada.</Text>
            )}
          </VStack>
        </ModalBody>
      </MotionModalContent>
    </Modal>
  );
};

export default CityListModal;