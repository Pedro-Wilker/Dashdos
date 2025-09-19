import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Image,
  IconButton,
  useColorMode,
  useColorModeValue,
  Switch,
  Text,
} from '@chakra-ui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaSun, FaMoon } from 'react-icons/fa';
import Sidebar from './Sidebar';
import logoClaro from '../../assets/logo_claro.png';
import logoEscuro from '../../assets/logo_escuro.png';
import logoSac from '../../assets/logo_sac.png';
import './styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('bg.main._light', 'bg.main._dark');
  const textFill = useColorModeValue('text._light', 'text._dark');
  const logo = useColorModeValue(logoClaro, logoEscuro);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex="docked"
        h="80px"
        bg={isScrolled ? useColorModeValue('rgba(245, 245, 239, 0.8)', 'rgba(26, 32, 44, 0.8)') : bgColor}
        backdropFilter={isScrolled ? 'blur(8px)' : 'none'}
        borderBottom="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        transition="background-color 0.3s ease"
        className="header"
      >
        <Flex align="center" justify="space-between" h="full" px="space.lg" maxW="container.xl" mx="auto">
          <Flex align="center" gap={{ base: 'space.xs', md: 'space.sm' }}>
            <Image
              src={logo}
              alt="Logo Governo do Estado"
              width={{ base: '60px', md: '80px', lg: '120px' }}
              height="auto"
              objectFit="contain"
              aria-label="Logo do Governo do Estado"
            />
            <Image
              src={logoSac}
              alt="Logo SAC"
              width={{ base: '40px', md: '50px', lg: '60px' }}
              height="auto"
              objectFit="contain"
              aria-label="Logo SAC"
            />
            <Text
              fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
              fontWeight="bold"
              color={textFill}
              aria-label="Título SIGECS"
            >
              SIGECS
            </Text>
          </Flex>
          <Flex align="center" gap={{ base: 'space.xs', md: 'space.sm' }}>
            <FaSun color={colorMode === 'light' ? '#f6e05e' : '#a0aec0'} />
            <Switch
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
              colorScheme="brand"
              aria-label="Alternar modo claro/escuro"
            />
            <FaMoon color={colorMode === 'dark' ? '#f6e05e' : '#a0aec0'} />
            <IconButton
              aria-label="Abrir menu"
              icon={isSidebarOpen ? <XMarkIcon className="h-8 w-8 stroke-2" /> : <Bars3Icon className="h-8 w-8 stroke-2" />}
              color={textFill}
              variant="ghost"
              size="lg"
              onClick={toggleSidebar}
              _hover={{ bg: 'brand.100' }}
            />
          </Flex>
        </Flex>
      </Box>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Header;