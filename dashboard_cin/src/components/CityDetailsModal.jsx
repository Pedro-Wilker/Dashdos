import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getCityDetails } from '../services/api';

const MotionModalContent = motion(ModalContent);

const CityDetailsModal = ({ isOpen, onClose, cityName }) => {
  const textColor = useColorModeValue('text._light', 'text._dark');

  const { data: cityDetails, isLoading } = useQuery({
    queryKey: ['cityDetails', cityName],
    queryFn: () => getCityDetails(cityName),
    enabled: !!cityName,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <MotionModalContent
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        bg="bg.surface"
        borderRadius="lg"
        boxShadow="lg"
        color={textColor}
      >
        <ModalHeader fontSize="xl" fontWeight="bold" aria-label={`Detalhes de ${cityName}`}>
          Detalhes de {cityName}
        </ModalHeader>
        <ModalCloseButton aria-label="Fechar modal" />
        <ModalBody pb={6}>
          {isLoading ? (
            <Spinner />
          ) : (
            <VStack spacing={4} align="stretch">
              {cityDetails?.data[0] ? (
                <>
                  <Text><strong>Nome:</strong> {cityDetails.data[0].nome_municipio}</Text>
                  {/* Adicione mais campos conforme a resposta da API, ex: */}
                  <Text><strong>Status Visita:</strong> {cityDetails.data[0].status_visita || 'N/A'}</Text>
                  <Text><strong>Status Publicação:</strong> {cityDetails.data[0].status_publicacao || 'N/A'}</Text>
                  <Text><strong>Status Instalação:</strong> {cityDetails.data[0].status_instalacao || 'N/A'}</Text>
                  {/* Expanda com mais detalhes da API */}
                </>
              ) : (
                <Text>Nenhum detalhe disponível para esta cidade.</Text>
              )}
            </VStack>
          )}
        </ModalBody>
      </MotionModalContent>
    </Modal>
  );
};

export default CityDetailsModal;