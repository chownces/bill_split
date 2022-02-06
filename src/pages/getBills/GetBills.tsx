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
import AppHeader from 'src/components/appHeader/AppHeader';
import Entry from 'src/components/entry/Entry';
import { useErrorToast } from 'src/hooks';

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
  const showErrorToast = useErrorToast();

  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('0.00');
  const [paidBy, setPaidBy] = React.useState('');
  const [gstAndSvc, setGstAndSvc] = React.useState<number>(GstSvc.NONE);

  const addNewBillHandler: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (!description || parseFloat(amount) === 0 || !paidBy) {
      showErrorToast('Please fill in all fields!');
      return;
    }
    if (bills.filter(b => b.description === description).length) {
      showErrorToast('This bill name already exists!');
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
      showErrorToast('Please input at least 1 bill!');
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
      <AppHeader title="Bills" handleRestart={handleRestart} />
      <Stack dir="vertical" flexGrow={100} overflow="auto" mb={4}>
        {bills.map((bill: Bill, idx: number) => (
          <Entry
            key={idx}
            content={[bill.description, '$' + bill.amount, bill.paidBy]}
            onDelete={onDeleteHandler(idx)}
          />
        ))}
      </Stack>

      <Box>
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
