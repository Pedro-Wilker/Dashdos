import { useState } from 'react';
import { Box, Text, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import CityList from './CityList';

interface City {
  nome_municipio: string;
}

interface DashboardCardProps {
  title: string;
  percentage: number | null;
  cities: City[] | null;
}

const DashboardCard = ({ title, percentage, cities }: DashboardCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const textColor = useColorModeValue('text._light', 'text._dark');
  const bgColor = useColorModeValue('bg.main._light', 'bg.main._dark');
  const hoverShadow = useColorModeValue('var(--shadow-lg)', 'var(--shadow-lg)');

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDoubleClick = () => {
    setIsOpen(false);
  };

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
    <Box
      bg={bgColor}
      borderRadius="lg"
      boxShadow="var(--shadow-card)"
      p="space.lg"
      textAlign="center"
      _hover={{ boxShadow: hoverShadow, transform: 'scale(1.05)' }}
      transition="all 0.3s ease"
      cursor="pointer"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      role="button"
      aria-expanded={isOpen}
      aria-label={`Toggle cartão ${title}`}
      position="relative"
      zIndex={isOpen ? 10 : 1}
      color={textColor}
      minW={{ base: '150px', md: '180px', lg: '200px' }}
      maxW={{ base: '150px', md: '180px', lg: '200px' }}
      h={{ base: '120px', md: '140px', lg: '160px' }}
      className="card-like"
    >
      <VStack spacing="space.md">
        <Text fontWeight="bold" fontSize="md">{title}</Text>
        <Text fontSize="xl" color="brand.500">
          {renderPercentage()}
        </Text>
        {cities && cities.length > 0 && (
          <Text fontSize="sm" color={textColor}>
            {cities.length} cidades
          </Text>
        )}
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />
      </VStack>
      {isOpen && cities && cities.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          width="100%"
          bg={bgColor}
          boxShadow="var(--shadow-card)"
          borderRadius="md"
          p="space.md"
          maxH="300px"
          overflowY="auto"
          zIndex="10"
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
          bg={bgColor}
          boxShadow="var(--shadow-card)"
          borderRadius="md"
          p="space.md"
          textAlign="center"
          zIndex="10"
        >
          <Text>Nenhuma cidade disponível</Text>
        </Box>
      )}
    </Box>
  );
};

export default DashboardCard;