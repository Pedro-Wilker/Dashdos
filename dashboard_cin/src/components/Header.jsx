import { Flex, Text, Switch, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue('#1a202c', '#e2e8f0');

  return (
    <Flex
      as="header"
      bg="bg.surface"
      boxShadow="sm"
      p={4}
      justifyContent="space-between"
      alignItems="center"
      color={textColor}
      aria-label="Cabeçalho da dashboard SIGECS"
    >
      <Text fontSize="3xl" fontWeight="bold" aria-label="Título SIGECS">
        SIGECS
      </Text>
      <Flex alignItems="center" gap={2}>
        <FaSun color={colorMode === 'light' ? '#f6e05e' : '#a0aec0'} />
        <Switch
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
          colorScheme="blue"
          aria-label="Alternar modo claro/escuro"
        />
        <FaMoon color={colorMode === 'dark' ? '#f6e05e' : '#a0aec0'} />
      </Flex>
    </Flex>
  );
};

export default Header;