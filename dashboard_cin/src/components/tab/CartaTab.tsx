import { VStack, Image, Spinner, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import construcaoImg from "../../assets/construcao.png";


interface CartaTabProps {
  setMode: (mode: any) => void;
  setSelectedCity: (city: any) => void;
}

const CartaTab = ({ setMode, setSelectedCity }: CartaTabProps) => {
  return (
    <VStack h="100vh" justifyContent="center" alignItems="center" spacing={6}>
      <Image src={construcaoImg} alt="Em construção" maxW="50%" />
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.500"
        size="xl"
        aria-label="Carregando conteúdo da aba Carta"
      />
      <Button
        leftIcon={<ArrowBackIcon />}
        colorScheme="brand"
        variant="outline"
        onClick={() => {
          setMode(null);
          setSelectedCity(null);
        }}
        aria-label="Voltar para tela de escolha"
      >
        Voltar
      </Button>
    </VStack>
  );
};

export default CartaTab;