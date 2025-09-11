import { useState } from 'react';
import { Box, IconButton, useColorModeValue, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { ExternalLinkIcon, CloseIcon, ArrowBackIcon } from '@chakra-ui/icons';
import CINTab from './CINTab';
import CartaTab from './CartaTab';

const Slideshow = ({ setMode, setSelectedCity }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const bgSurface = useColorModeValue('bg.surface._light', 'bg.surface._dark');

  const toggleFullscreen = () => {
    if (!document.fullscreenEnabled) {
      alert('Tela cheia não suportada neste navegador');
      return;
    }
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Fullscreen error:', err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error('Exit fullscreen error:', err));
    }
  };

  return (
    <Box h="100vh" position="relative" overflow="hidden" bg={bgSurface}>
      <IconButton
        icon={<ArrowBackIcon />}
        onClick={() => {
          setMode(null);
          setSelectedCity(null);
        }}
        position="absolute"
        top={4}
        left={4}
        colorScheme="brand"
        variant="outline"
        size="lg"
        aria-label="Voltar para tela de escolha"
        zIndex={10}
      />
      <IconButton
        icon={isFullscreen ? <CloseIcon /> : <ExternalLinkIcon />}
        onClick={toggleFullscreen}
        position="absolute"
        top={4}
        right={4}
        colorScheme="brand"
        size="lg"
        aria-label={isFullscreen ? 'Sair do modo tela cheia' : 'Entrar no modo tela cheia'}
        zIndex={10}
      />
      <Tabs
        variant="unstyled"
        index={activeTab}
        onChange={(index) => setActiveTab(index)}
        isFitted
        mt={4}
      >
        <TabList>
          <Tab className="custom-tab">CIN</Tab>
          <Tab className="custom-tab">Carta</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <CINTab setMode={setMode} setSelectedCity={setSelectedCity} />
          </TabPanel>
          <TabPanel p={0}>
            <CartaTab setMode={setMode} setSelectedCity={setSelectedCity} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Slideshow;