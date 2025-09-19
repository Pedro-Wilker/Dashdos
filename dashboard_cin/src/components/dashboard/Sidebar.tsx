import { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  InputGroup,
  Input,
  InputRightElement,
  Box,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import logoClaro from '../../assets/logo_claro.png';
import logoEscuro from '../../assets/logo_escuro.png';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { routes } from '../../routes';
import './styles/Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const bgColor = useColorModeValue('bg.main._light', 'bg.main._dark');
  const textColor = useColorModeValue('text._light', 'text._dark');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const logo = useColorModeValue(logoClaro, logoEscuro);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Integrate with useCitySearch.ts hook here
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent
        bg={bgColor}
        w={{ base: '70%', md: '300px' }}
        maxW="300px"
        h="calc(100vh - 2rem)"
        p={4}
        boxShadow="xl"
        borderRight="1px"
        borderColor={borderColor}
        className="sidebar-content"
      >
        <DrawerCloseButton aria-label="Fechar menu de navegação" color={textColor} />
        <DrawerHeader p={4} display="flex" alignItems="center" gap={4} borderBottom="none">
          <img src={logo} alt="SIGECS Logo" style={{ height: '32px', width: '32px' }} />
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            SIGECS
          </Text>
        </DrawerHeader>
        <DrawerBody p={2}>
          <InputGroup mb={4}>
            <Input
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={handleSearch}
              color={textColor}
              borderColor={borderColor}
              _focus={{ borderColor: 'brand.500' }}
            />
            <InputRightElement>
              <MagnifyingGlassIcon className="h-5 w-5" style={{ color: textColor }} />
            </InputRightElement>
          </InputGroup>
          <VStack as="nav" spacing={0} align="stretch">
            <Accordion allowToggle>
              {routes.map((route) => (
                route.subItems ? (
                  <AccordionItem key={route.path} border="none">
                    <AccordionButton
                      px={3}
                      py={2}
                      _hover={{ bg: 'brand.100' }}
                      as={NavLink}
                      to={route.path}
                      onClick={onClose}
                      sx={{
                        '&.active': {
                          bg: 'brand.500',
                          color: 'white',
                          _hover: { bg: 'brand.600' },
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={3} flex="1">
                        {route.icon && <route.icon className="h-5 w-5" style={{ color: textColor }} />}
                        <Text fontSize="md" color={textColor} flex="1" textAlign="left">
                          {route.label}
                        </Text>
                        <AccordionIcon color={textColor} />
                      </Box>
                    </AccordionButton>
                    <AccordionPanel pb={1} pl={6}>
                      <VStack spacing={0}>
                        {route.subItems.map((subItem) => (
                          <Box
                            as={NavLink}
                            key={subItem.path}
                            to={subItem.path}
                            px={3}
                            py={2}
                            display="flex"
                            alignItems="center"
                            gap={3}
                            fontSize="sm"
                            color={textColor}
                            _hover={{ bg: 'brand.100' }}
                            onClick={onClose}
                            sx={{
                              '&.active': {
                                bg: 'brand.200',
                                color: textColor,
                                _hover: { bg: 'brand.300' },
                              },
                            }}
                          >
                            <ChevronRightIcon className="h-3 w-5" style={{ color: textColor }} />
                            {subItem.label}
                          </Box>
                        ))}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                ) : (
                  <Box
                    as={NavLink}
                    key={route.path}
                    to={route.path}
                    px={3}
                    py={2}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    fontSize="md"
                    color={textColor}
                    _hover={{ bg: 'brand.100' }}
                    onClick={onClose}
                    sx={{
                      '&.active': {
                        bg: 'brand.500',
                        color: 'white',
                        _hover: { bg: 'brand.600' },
                      },
                    }}
                  >
                    {route.icon && <route.icon className="h-5 w-5" style={{ color: textColor }} />}
                    {route.label}
                  </Box>
                )
              ))}
            </Accordion>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;