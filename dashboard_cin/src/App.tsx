import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme  from './theme';
import Header from './components/dashboard/Header';
import CinDashboard from './components/screens/CinDashboardScreen';
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

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/cin" element={<CinDashboard />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="/diretoria" element={<DiretoriaScreen />} />
          <Route path="/sac" element={<SacScreen />} />
          <Route path="/carta" element={<CartaScreen />} />
          <Route path="/articulacao" element={<ArticulacaoScreen />} />
          <Route path="/nga" element={<NgaScreen />} />
          <Route path="/pontos" element={<PontosScreen />} />
          <Route path="/capital" element={<CapitalScreen />} />
          <Route path="/interior" element={<InteriorScreen />} />
          <Route path="/nud" element={<NudScreen />} />
          <Route path="/movel" element={<MovelScreen />} />
          <Route path="/" element={<CinDashboard />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;