import React from 'react';
import { Box, Button, HStack, Input, Stack } from '@chakra-ui/react';
import Entry from '../../components/entry/Entry';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import AppHeader from 'src/components/appHeader/AppHeader';
import { useErrorToast } from 'src/hooks';

type GetNamesProps = {
  names: string[];
  setNames: React.Dispatch<React.SetStateAction<string[]>>;
  handleRestart: () => void;
};

const GetNames: React.FC<GetNamesProps> = ({ names, setNames, handleRestart }) => {
  const navigate = useNavigate();
  const showErrorToast = useErrorToast();

  const [nameInputValue, setNameInputValue] = React.useState('');

  const addNewNameHandler: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (!nameInputValue) {
      return;
    }

    if (names.includes(nameInputValue)) {
      showErrorToast('This name already exists!');
      return;
    }

    const updatedNames = [...names, nameInputValue];
    setNames(updatedNames);
    setNameInputValue('');
  };

  const onDeleteHandler = (idx: number) => () => {
    const updatedNames = [...names];
    updatedNames.splice(idx, 1);
    setNames(updatedNames);
  };

  const handleNext = () => {
    if (!names.length) {
      showErrorToast('Please input at least 1 name!');
      return;
    }
    navigate('/get-bills');
  };

  const renderNameInput = () => (
    <Input
      value={nameInputValue}
      placeholder="Name..."
      bg="white"
      color="black"
      onChange={e => setNameInputValue(e.target.value)}
    />
  );

  const renderSubmitButton = () => (
    <Button type="submit" colorScheme="orange">
      Add
    </Button>
  );

  return (
    <>
      <AppHeader title="Names" handleRestart={handleRestart} />
      <Stack dir="vertical" flexGrow={100} overflow="auto" mb={4}>
        {names.map((name: string, idx: number) => (
          <Entry key={idx} content={name} onDelete={onDeleteHandler(idx)} />
        ))}
      </Stack>

      <Box>
        <form onSubmit={addNewNameHandler}>
          <HStack>
            {renderNameInput()}
            {renderSubmitButton()}
          </HStack>
        </form>
        <Button
          onClick={handleNext}
          isFullWidth
          colorScheme="cyan"
          mt={2}
          rightIcon={<ArrowForwardIcon />}
        >
          Input Bills
        </Button>
      </Box>
    </>
  );
};

export default GetNames;
