import { extendTheme } from '@chakra-ui/react'; 

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F3FF',
      100: '#B3DFFF',
      200: '#80CCFF',
      300: '#B1FF00',
      400: '#4FC3F7',
      500: '#29C3FF',
      600: '#0097CC',
      700: '#006D99',
      800: '#004466',
      900: '#002233',
    },
    bg: {
      main: {
        _light: '#F5F5EF',
        _dark: '#1A202C',
      },
      card: {
        _light: '#FFFFFF',
        _dark: '#2D3748',
      },
      surface: {
        _light: '#FFFFFF',
        _dark: '#2D3748',
      },
    },
    text: {
      _light: '#1A202C',
      _dark: '#E2E8F0',
      muted: {
        _light: '#4A5568',
        _dark: '#A0AEC0',
      },
    },
    chart: {
      primary: {
        _light: '#29C3FF',
        _dark: '#B1FF00',
      },
      secondary: {
        _light: '#B1FF00',
        _dark: '#29C3FF',
      },
      tertiary: {
        _light: '#38A169',
        _dark: '#68D391',
      },
    },
    border: {
      _light: '#E2E8F0',
      _dark: '#4A5568',
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
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    'dark-sm': '0 1px 2px rgba(0, 0, 0, 0.2)',
  },
});

export default theme;