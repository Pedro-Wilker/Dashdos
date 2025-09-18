import { useState } from 'react';
import { Box, Text, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import CityList from './CityList';

const MotionBox = motion(Box);

interface City {
  nome_municipio: string;
}

interface DashboardCardProps {
  title: string;
  percentage: number | null; // Allow null
  cities: City[] | null;
}

const DashboardCard = ({ title, percentage, cities }: DashboardCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const textColor = useColorModeValue('text._light', 'text._dark');
  const hoverShadow = useColorModeValue('lg', 'dark-lg');

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDoubleClick = () => {
    setIsOpen(false);
  };

  // Helper function to render percentage
  const renderPercentage = () => {
    if (title === '343 Cidades') {
      return '343';
    }
    if (percentage !== null && percentage !== undefined) {
      return `${percentage}%`;
    }
    return 'N/A';
  };

  return (
    <MotionBox
      bg="bg.surface"
      borderRadius="lg"
      boxShadow="md"
      p={4}
      textAlign="center"
      whileHover={{ scale: 1.05, boxShadow: hoverShadow }}
      transition={{ duration: 0.2 }}
      cursor="pointer"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      role="button"
      aria-expanded={isOpen}
      aria-label={`Toggle cartão ${title}`}
      position="relative"
      zIndex={isOpen ? 10 : 1}
      color={textColor}
      minW="150px"
    >
      <VStack spacing={2}>
        <Text fontWeight="bold" fontSize="md">{title}</Text>
        <Text fontSize="xl" color="brand.500">
          {renderPercentage()}
        </Text>
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />
      </VStack>
      {isOpen && cities && cities.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          width="100%"
          bg="bg.surface"
          boxShadow="md"
          zIndex="10"
          borderRadius="md"
          p={2}
          maxH="300px"
          overflowY="auto"
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <CityList cities={cities} cardTitle={title} />
        </Box>
      )}
      {isOpen && (!cities || cities.length === 0) && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          width="100%"
          bg="bg.surface"
          boxShadow="md"
          zIndex="10"
          borderRadius="md"
          p={2}
          textAlign="center"
        >
          <Text>Nenhuma cidade disponível</Text>
        </Box>
      )}
    </MotionBox>
  );
};

export default DashboardCard;