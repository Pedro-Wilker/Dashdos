import { useState } from 'react';
import { Box, List, ListItem, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import CityListModal from './CityListModal';
import CityDetailsModal from './CityDetailsModal'; // Novo componente adicionado

const MotionBox = motion(Box);

const CityList = ({ cities, cardTitle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const visibleCities = cities?.slice(0, 10) || [];
  const textColor = useColorModeValue('text._light', 'text._dark');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  if (!cities || cities.length === 0) {
    return <Text color={textColor}>Nenhuma cidade disponível</Text>;
  }

  return (
    <>
      <MotionBox
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        overflow="hidden"
        className="styled-city-list"
        color={textColor}
        aria-label={`Lista de cidades para ${cardTitle}`}
      >
        <List spacing={2} p={4}>
          {visibleCities.map((city, index) => (
            <ListItem
              key={index}
              p={2}
              borderRadius="md"
              _hover={{ bg: hoverBg }}
              cursor="pointer"
              onClick={() => setSelectedCity(city.nome_municipio)} // Abre modal de detalhes
              aria-label={`Detalhes de ${city.nome_municipio}`}
            >
              <Text fontSize="sm">{city.nome_municipio}</Text>
            </ListItem>
          ))}
          {cities.length > 10 && (
            <ListItem>
              <Text fontSize="sm">...</Text>
              <Button
                size="sm"
                colorScheme="brand"
                mt={2}
                onClick={() => setIsModalOpen(true)}
                aria-label={`Ver mais cidades para ${cardTitle}`}
              >
                Ver Mais
              </Button>
            </ListItem>
          )}
        </List>
      </MotionBox>
      <CityListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cities={cities}
        title={`Lista de todas as cidades ${cardTitle}`}
      />
      <CityDetailsModal
        isOpen={!!selectedCity}
        onClose={() => setSelectedCity(null)}
        cityName={selectedCity}
      />
    </>
  );
};

export default CityList;