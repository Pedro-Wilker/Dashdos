import { Spinner, Center } from '@chakra-ui/react';

const LoadingSpinner = () => (
  <Center py={10}>
    <Spinner size="xl" color="blue.500" />
  </Center>
);

export default LoadingSpinner;