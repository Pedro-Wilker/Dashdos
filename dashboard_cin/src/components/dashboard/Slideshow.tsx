import { useState } from 'react';
import { Box, Button, Flex, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import CINTab from './CINTab';
import CartaTab from './CartaTab';

interface SlideshowProps {
  setMode: (mode: 'interativa' | 'slideshow' | null) => void;
  setSelectedCity: (city: string | null) => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ setMode, setSelectedCity }) => {
  return (
    <Box>
      <Flex justify="space-between" mb={4}>
        <Button
          onClick={() => {
            setMode('interativa');
            setSelectedCity(null);
          }}
          colorScheme="brand"
          variant="outline"
        >
          Voltar ao Modo Interativo
        </Button>
      </Flex>
      <Tabs variant="soft-rounded" colorScheme="brand">
        <TabList>
          <Tab>CIN</Tab>
          <Tab>Carta</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CINTab setMode={setMode} setSelectedCity={setSelectedCity} />
          </TabPanel>
          <TabPanel>
            <CartaTab setMode={setMode} setSelectedCity={setSelectedCity} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Slideshow;