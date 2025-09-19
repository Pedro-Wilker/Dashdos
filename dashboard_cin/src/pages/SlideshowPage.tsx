import { Box } from '@chakra-ui/react';
import Slideshow from '../components/dashboard/Slideshow';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export function SlideshowPage() {
  const { setSelectedCity } = useAppContext();
  const navigate = useNavigate();

  return (
    <Box minH="100vh" pt="96px" px="space.lg">
      <Slideshow setMode={(mode) => navigate(mode === 'interativa' ? '/interactive' : '/')} setSelectedCity={setSelectedCity} />
    </Box>
  );
}