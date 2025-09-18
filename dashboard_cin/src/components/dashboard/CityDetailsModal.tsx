import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import CityDetails from '../common/CityDetails';

const MotionModalContent = motion(ModalContent);

interface CityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
}

const CityDetailsModal: React.FC<CityDetailsModalProps> = ({ isOpen, onClose, cityName }) => {
  const textColor = useColorModeValue('text._light', 'text._dark');
  const bgSurface = useColorModeValue('white', 'gray.800');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <MotionModalContent
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        bg={bgSurface}
        borderRadius="lg"
        boxShadow="lg"
        color={textColor}
      >
        <ModalHeader fontSize="xl" fontWeight="bold" aria-label={`Detalhes de ${cityName}`}>
          Detalhes de {cityName}
        </ModalHeader>
        <ModalCloseButton aria-label="Fechar modal" />
        <CityDetails cityName={cityName} />
      </MotionModalContent>
    </Modal>
  );
};

export default CityDetailsModal;