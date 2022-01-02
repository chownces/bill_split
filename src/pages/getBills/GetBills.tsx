import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  VStack
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from 'src/components/alert/Alert';
import AppHeader from 'src/components/appHeader/AppHeader';
import Entry from 'src/components/entry/Entry';

export type Bill = {
  description: string;
  amount: string; // amount needs to be string for Chakra-UI to handle floating points correctly
  paidBy: string;
};

type GetBillsProps = {
  names: string[];
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  handleRestart: () => void;
};

enum GstSvc {
  NONE = 1,
  GST_ONLY = 1.07,
  SVC_ONLY = 1.1,
  GST_AND_SVC = 1.07 * 1.1
}

const GetBills: React.FC<GetBillsProps> = ({ bills, setBills, names, handleRestart }) => {
  const navigate = useNavigate();

  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('0.00');
  const [paidBy, setPaidBy] = React.useState('');
  const [gstAndSvc, setGstAndSvc] = React.useState<number>(GstSvc.NONE);

  const [alertMessage, setAlertMessage] = React.useState('');

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const addNewBillHandler: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (!description || !amount || !paidBy) {
      showAlert('Please fill in all fields!');
      return;
    }

    if (names.includes(description)) {
      showAlert('This bill name already exists!');
      return;
    }

    const totalAmount = parseFloat(amount) * gstAndSvc;

    const updatedBills = [
      ...bills,
      {
        description,
        amount: String(totalAmount),
        paidBy
      }
    ];
    setBills(updatedBills);

    setDescription('');
    setAmount('0.00');
    setPaidBy('');
  };

  const onDeleteHandler = (idx: number) => () => {
    const updatedBills = [...bills];
    updatedBills.splice(idx, 1);
    setBills(updatedBills);
  };

  const handleNext = () => {
    if (!bills.length) {
      setAlertMessage('Please input at least 1 bill!');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }
    navigate('/allocate-bills');
  };

  const renderDescriptionInput = () => (
    <Input
      value={description}
      placeholder="Description..."
      bg="white"
      color="black"
      onChange={e => setDescription(e.target.value)}
    />
  );

  const renderAmountInput = () => (
    <NumberInput
      value={`$` + amount}
      pattern="^\$[0-9]*(.[0-9]+)?"
      placeholder="Amount..."
      precision={2}
      min={0}
      step={0.01}
      bg="white"
      onChange={val => setAmount(val)}
      onFocus={e => e.target.select()}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );

  const renderGstServiceChargeInput = () => (
    <Select
      bg="white"
      onChange={e => setGstAndSvc(parseFloat(e.target.value))}
      value={gstAndSvc}
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    >
      <option value={GstSvc.NONE}>No GST and Service Charge</option>
      <option value={GstSvc.GST_ONLY}>GST Only</option>
      <option value={GstSvc.SVC_ONLY}>Service Charge Only</option>
      <option value={GstSvc.GST_AND_SVC}>GST and Service Charge</option>
    </Select>
  );

  const renderAmountAfterGst = () => (
    <NumberInput isReadOnly color="green" value={`$` + parseFloat(amount) * gstAndSvc} bg="white">
      <NumberInputField />
    </NumberInput>
  );

  const renderPaidByInput = () => (
    <Select
      placeholder="Paid by..."
      bg="white"
      onChange={e => setPaidBy(e.target.value)}
      value={paidBy}
    >
      {names.map((name, idx) => (
        <option value={name} key={idx}>
          {name}
        </option>
      ))}
    </Select>
  );

  const renderSubmitButton = () => (
    <Button type="submit" colorScheme="orange" isFullWidth>
      Add
    </Button>
  );

  return (
    <>
      <Box>
        <AppHeader title="Bills" handleRestart={handleRestart} />
        <Stack dir="vertical">
          {bills.map((bill: Bill, idx: number) => (
            <Entry
              key={idx}
              content={[bill.description, '$' + bill.amount, bill.paidBy]}
              onDelete={onDeleteHandler(idx)}
            />
          ))}
        </Stack>
      </Box>

      <Box>
        {alertMessage && <Alert message={alertMessage} />}
        <form onSubmit={addNewBillHandler}>
          <VStack color="black">
            <FormControl>
              <HStack>
                {renderDescriptionInput()}
                {renderAmountInput()}
              </HStack>
            </FormControl>
            <FormControl>
              <HStack>
                {renderGstServiceChargeInput()}
                {renderAmountAfterGst()}
              </HStack>
            </FormControl>
            <FormControl>
              <HStack>
                {renderPaidByInput()}
                {renderSubmitButton()}
              </HStack>
            </FormControl>
            <Button
              onClick={handleNext}
              isFullWidth
              colorScheme="cyan"
              mt={2}
              rightIcon={<ArrowForwardIcon />}
            >
              Allocate Bills
            </Button>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default GetBills;
