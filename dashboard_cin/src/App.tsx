import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import Header from './components/dashboard/Header';
import { HomePage } from './pages/HomePage';
import { InteractivePage } from './pages/InteractivePage';
import { SlideshowPage } from './pages/SlideshowPage';
import AdminScreen from './components/screens/AdminScreen';
import DiretoriaScreen from './components/screens/DiretoriaScreen';
import SacScreen from './components/screens/SacScreen';
import CartaScreen from './components/screens/CartaScreen';
import ArticulacaoScreen from './components/screens/ArticulacaoScreen';
import NgaScreen from './components/screens/NgaScreen';
import PontosScreen from './components/screens/PontosScreen';
import CapitalScreen from './components/screens/CapitalScreen';
import InteriorScreen from './components/screens/InteriorScreen';
import NudScreen from './components/screens/NudScreen';
import MovelScreen from './components/screens/MovelScreen';
import { routes } from './routes';

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;