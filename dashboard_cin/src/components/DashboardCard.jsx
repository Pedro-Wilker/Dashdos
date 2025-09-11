import { useState } from 'react';
import { Box, Text, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import CityList from './CityList';

const MotionBox = motion(Box);

const DashboardCard = ({ title, percentage, cities }) => {
  const [isOpen, setIsOpen] = useState(false);
  const textColor = useColorModeValue('text._light', 'text._dark');
  const hoverShadow = useColorModeValue('lg', 'dark-lg');

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDoubleClick = () => {
    setIsOpen(false);
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
          {title === '343 Cidades' ? '343' : `${percentage}%`}
        </Text>
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />
      </VStack>
      {isOpen && cities && (
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
          onClick={(e) => e.stopPropagation()} // Impede bubbling para não toggle/fecha o card
          onDoubleClick={(e) => e.stopPropagation()} // Impede bubbling para double click
        >
          <CityList cities={cities} cardTitle={title} />
        </Box>
      )}
    </MotionBox>
  );
};

export default DashboardCard;