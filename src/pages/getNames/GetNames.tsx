import React from "react";
import { Box, Button, HStack, Input, Stack } from "@chakra-ui/react";
import Entry from "../../components/entry/Entry";
import Alert from "../../components/alert/Alert";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import AppHeader from "src/components/appHeader/AppHeader";

type GetNamesProps = {
  names: string[];
  setNames: React.Dispatch<React.SetStateAction<string[]>>;
  handleRestart: () => void;
}

const GetNames: React.FC<GetNamesProps> = ({ names, setNames, handleRestart }) => {
  const navigate = useNavigate();

  const [nameInputValue, setNameInputValue] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');

  const addNewNameHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!nameInputValue) {
      return;
    }

    if (names.includes(nameInputValue)) {
      setAlertMessage('This name already exists!');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    const updatedNames = [...names, nameInputValue];
    setNames(updatedNames);
    setNameInputValue('');
  }

  const onDeleteHandler = (idx: number) => () => {
    const updatedNames = [...names];
    updatedNames.splice(idx, 1);
    setNames(updatedNames);
  }

  const renderNameInput = () => (
    <Input
      value={nameInputValue}
      placeholder="Name..."
      bg='white'
      color='black'
      onChange={(e) => setNameInputValue(e.target.value)}
    />
  );

  const renderSubmitButton = () => (
    <Button
      type="submit"
      colorScheme="orange"
    >
      Add
    </Button>
  )

  return (
    <>
      <Box>
        <AppHeader title="Names" handleRestart={handleRestart} />
        <Stack dir="vertical">
          {names.map((name: string, idx: number) => (
            <Entry
              key={idx}
              content={name}
              onDelete={onDeleteHandler(idx)}
            />
          ))}
        </Stack>
      </Box>
      
      <Box>
        {alertMessage && <Alert message={alertMessage} />}
        <form onSubmit={addNewNameHandler}>
          <HStack>
            {renderNameInput()}
            {renderSubmitButton()}
          </HStack>
        </form>
        <Button
          onClick={() => navigate('/get-bills')}
          isFullWidth
          colorScheme='cyan'
          mt={2}
          rightIcon={<ArrowForwardIcon />}
        >
          Input Bills
        </Button>
      </Box>
    </>
  )
}

export default GetNames;
