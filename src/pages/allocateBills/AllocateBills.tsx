import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Stack
} from '@chakra-ui/react';
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from 'src/components/alert/Alert';
import AppHeader from 'src/components/appHeader/AppHeader';
import { useErrorToast } from 'src/hooks';
import { Bill } from '../getBills/GetBills';

type IndividualAmount = {
  paid: number; // amount paid
  needsToPay: number; // amount that needs to be paid after splitting
};
export type IndividualAmounts = { [key: string]: IndividualAmount };

type AllocateBillsProps = {
  names: string[];
  bills: Bill[];
  individualAmounts: IndividualAmounts;
  setIndividualAmounts: React.Dispatch<React.SetStateAction<IndividualAmounts>>;
  handleRestart: () => void;
};

const AllocateBills: React.FC<AllocateBillsProps> = ({
  names,
  bills,
  individualAmounts,
  setIndividualAmounts,
  handleRestart
}) => {
  const navigate = useNavigate();
  const showErrorToast = useErrorToast();

  const [billNumber, setBillNumber] = React.useState(0);
  const [selectedNames, setSelectedNames] = React.useState(new Array(names.length).fill(false));

  const isLastBill = billNumber === bills.length - 1;

  const individualPaidAmountsOnly = React.useMemo(() => {
    const updatedIndividualAmounts: IndividualAmounts = {};
    bills.forEach(bill => {
      if (!updatedIndividualAmounts[bill.paidBy]) {
        updatedIndividualAmounts[bill.paidBy] = {
          paid: 0,
          needsToPay: 0
        };
      }
      updatedIndividualAmounts[bill.paidBy].paid += parseFloat(bill.amount);
    });

    return updatedIndividualAmounts;
  }, [bills]);

  useEffect(() => {
    setIndividualAmounts(individualPaidAmountsOnly);
    // eslint-disable-next-line
  }, []);

  const handleNext = () => {
    if (selectedNames.reduce((acc, x) => !x && acc, true)) {
      showErrorToast('Please select at least 1 person!');
      return;
    }

    const updatedIndividualAmounts = {
      ...individualAmounts
    };

    const hasToPay = names.filter((_, idx) => selectedNames[idx]);

    hasToPay.forEach(name => {
      if (!updatedIndividualAmounts[name]) {
        updatedIndividualAmounts[name] = {
          paid: 0,
          needsToPay: 0
        };
      }

      // Prevent mutation of React state
      updatedIndividualAmounts[name] = {
        ...updatedIndividualAmounts[name],
        needsToPay:
          updatedIndividualAmounts[name].needsToPay +
          parseFloat(bills[billNumber].amount) / hasToPay.length
      };
    });

    setIndividualAmounts(updatedIndividualAmounts);

    if (isLastBill) {
      navigate('/summary');
      return;
    }

    setSelectedNames(new Array(names.length).fill(false));
    setBillNumber(billNumber + 1);
  };

  if (!bills.length) {
    return (
      <Box>
        <AppHeader title="Allocate" handleRestart={handleRestart} />
        <Alert message="There are no bills! Please restart by clicking the button above!" />
      </Box>
    );
  }

  return (
    <>
      <AppHeader title="Allocate" handleRestart={handleRestart} />
      <FormControl>
        <HStack color="black">
          <Input value={bills[billNumber].description} isReadOnly bg="white" />
          <NumberInput value={`Amt: $` + bills[billNumber].amount} bg="white" isReadOnly>
            <NumberInputField />
          </NumberInput>
        </HStack>
      </FormControl>

      <Stack dir="column" mt={4} mb={4} overflow="auto" flexGrow={100}>
        {names.map((e: string, idx: number) => (
          <Box>
            <Button
              variant="solid"
              colorScheme="blue"
              isActive={selectedNames[idx]}
              onClick={() => {
                const temp = [...selectedNames];
                temp[idx] = !temp[idx];
                setSelectedNames(temp);
              }}
              _hover={{ backgroundColor: '#3182ce' }}
              key={idx}
              isFullWidth
            >
              {e}
            </Button>
          </Box>
        ))}
      </Stack>

      <Box>
        <Button
          onClick={handleNext}
          isFullWidth
          colorScheme={isLastBill ? 'cyan' : 'gray'}
          color="black"
        >
          {isLastBill ? 'Calculate' : 'Next Bill'}
        </Button>
      </Box>
    </>
  );
};

export default AllocateBills;
