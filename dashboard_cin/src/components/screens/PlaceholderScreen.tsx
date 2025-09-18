import { Box, Heading, useColorModeValue } from '@chakra-ui/react';

interface PlaceholderScreenProps {
  title: string;
}

const PlaceholderScreen = ({ title }: PlaceholderScreenProps) => {
  const bgMain = useColorModeValue('bg.main._light', 'bg.main._dark');
  const textColor = useColorModeValue('text._light', 'text._dark');

  return (
    <Box bg={bgMain} minH="100vh" pt="96px" px="space.lg" color={textColor}>
      <Heading as="h1" size="xl" mb="space.lg">
        {title}
      </Heading>
      <Box>Conteúdo para {title} em desenvolvimento.</Box>
    </Box>
  );
};

export default PlaceholderScreen;