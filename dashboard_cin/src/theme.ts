import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    bg: {
      surface: {
        _light: 'white',
        _dark: 'gray.800',
      },
    },
    text: {
      _light: 'gray.800',
      _dark: 'white',
    },
    brand: {
      500: '#29C3FF',
      300: '#B1FF00',
    },
  },
});

export default theme;