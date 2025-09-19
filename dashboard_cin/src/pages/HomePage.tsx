import { Box, Button, Flex, Heading, VStack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import './styles/HomePage.css';

export function HomePage() {
  const navigate = useNavigate();
  const bgMain = useColorModeValue('bg.main._light', 'bg.main._dark');
  const textColor = useColorModeValue('text._light', 'text._dark');

  return (
    <Box bg={bgMain} minH="100vh" pt="space.xl" pb="space.xl" px="space.lg" color={textColor} className="home-page">
      <VStack spacing="space.xl" align="center" justify="center">
        <Heading as="h1" size="2xl" className="home-title">
          Bem-vindo ao Dashboard CIN
        </Heading>
        <Flex gap="space.md" flexDirection={{ base: 'column', md: 'row' }} className="home-buttons">
          <Button
            colorScheme="brand"
            size="lg"
            onClick={() => navigate('/interactive')}
            aria-label="Acessar Modo Interativo"
          >
            Modo Interativo
          </Button>
          <Button
            colorScheme="brand"
            variant="outline"
            size="lg"
            onClick={() => navigate('/slideshow')}
            aria-label="Acessar Modo Slideshow"
          >
            Modo Slideshow
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}