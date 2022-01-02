import { RepeatIcon } from "@chakra-ui/icons";
import {
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
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

type AppHeaderProps = {
  title: string;
  handleRestart: () => void;
};

const AppHeader: React.FC<AppHeaderProps> = ({ title, handleRestart }) => {
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HStack px={2} pb={4} justify="space-between">
        <Heading>{title}</Heading>
        <IconButton
          icon={<RepeatIcon />}
          aria-label="restart"
          color="white"
          bg="var(--danger)"
          colorScheme="red"
          onClick={onOpen}
        />
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
