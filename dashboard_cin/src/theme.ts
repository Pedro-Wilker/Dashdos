import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    bg: {
      main: {
        _light: '#F5F5EF',
        _dark: 'gray.900',
      },
      surface: {
        _light: '#F5F5EF',
        _dark: 'gray.800',
      },
    },
    text: {
      _light: 'gray.800',
      _dark: 'white',
      muted: {
        _light: 'gray.600',
        _dark: 'gray.300',
      },
    },
    brand: {
      100: '#E6F7FF',
      200: '#B3E5FC',
      300: '#B1FF00',
      400: '#4FC3F7',
      500: '#29C3FF',
      600: '#039BE5',
    },
    chart: {
      primary: {
        _light: '#3182CE',
        _dark: '#63B3ED',
      },
      secondary: {
        _light: '#E53E3E',
        _dark: '#FC8181',
      },
      tertiary: {
        _light: '#38A169',
        _dark: '#68D391',
      },
      quaternary: {
        _light: '#D69E2E',
        _dark: '#F6E05E',
      },
    },
    map: {
      highlight: {
        _light: '#29C3FF',
        _dark: '#B1FF00',
      },
      active: {
        _light: '#0288D1',
        _dark: '#8BC34A',
      },
    },
    button: {
      primary: {
        _light: '#29C3FF',
        _dark: '#B1FF00',
      },
    },
    border: {
      _light: 'gray.200',
      _dark: 'gray.600',
    },
  },
  space: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    dark: {
      sm: '0 2px 4px rgba(0,0,0,0.3)',
      md: '0 4px 6px rgba(0,0,0,0.3)',
    },
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
        transition: 'all 0.3s ease',
      },
      variants: {
        primary: {
          bg: 'button.primary',
          color: 'text._light',
          _hover: {
            bg: 'brand.600',
            transform: 'scale(1.02)',
          },
        },
      },
    },
  },
});

export default theme;