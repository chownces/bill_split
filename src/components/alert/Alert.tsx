import { Alert as ChakraAlert, AlertIcon } from '@chakra-ui/react';

type AlertProps = {
  message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => (
  <ChakraAlert status='error' my={2} borderRadius={5} color='black'>
    <AlertIcon />
    {message}
  </ChakraAlert>
)

export default Alert;
