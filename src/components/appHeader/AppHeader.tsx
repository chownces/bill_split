import { ArrowBackIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type AppHeaderProps = {
  title: string;
  handleRestart: () => void;
};

const AppHeader: React.FC<AppHeaderProps> = ({ title, handleRestart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO: Abstract routes and backwards navigation into a new class
  const handleBackwardsNavigation = useMemo(
    () => () => {
      switch (location.pathname) {
        case '/':
          break;
        case '/get-names':
          break;
        case '/get-bills':
          navigate('/');
          break;
        case '/allocate-bills':
          navigate('/get-bills');
          break;
        case '/summary':
          navigate('/allocate-bills');
          break;
        default:
          break;
      }
    },
    [location.pathname, navigate]
  );

  return (
    <>
      <HStack px={2} pb={4} justify="space-between">
        <Heading>{title}</Heading>
        <Box>
          <Tooltip label="Back" placement="top">
            <IconButton
              icon={<ArrowBackIcon />}
              aria-label="back"
              colorScheme="whiteAlpha"
              onClick={handleBackwardsNavigation}
              mr={2}
            />
          </Tooltip>
          <Tooltip label="Restart" placement="top">
            <IconButton
              icon={<RepeatIcon />}
              aria-label="restart"
              color="white"
              bg="var(--danger)"
              colorScheme="red"
              onClick={onOpen}
            />
          </Tooltip>
        </Box>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to restart?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Restarting will lose all your current bills!</ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleRestart();
                navigate('/');
              }}
            >
              Ok
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppHeader;
