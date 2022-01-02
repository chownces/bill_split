import { Box, Button, Flex, FormControl, HStack, Input, NumberInput, NumberInputField, Stack } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "src/components/alert/Alert";
import AppHeader from "src/components/appHeader/AppHeader";
import { Bill } from "../getBills/GetBills";

type IndividualAmount = {
  paid: number; // amount paid
  needsToPay: number; // amount that needs to be paid after splitting
}
export type IndividualAmounts = {[key: string]: IndividualAmount}

type AllocateBillsProps = {
  names: string[];
  bills: Bill[];
  individualAmounts: IndividualAmounts;
  setIndividualAmounts: React.Dispatch<React.SetStateAction<IndividualAmounts>>;
  handleRestart: () => void;
}

const AllocateBills: React.FC<AllocateBillsProps> = ({ names, bills, individualAmounts, setIndividualAmounts, handleRestart }) => {
  const navigate = useNavigate();

  const [billNumber, setBillNumber] = React.useState(0);
  const [selectedNames, setSelectedNames] = React.useState(new Array(names.length).fill(false));
  const [alertMessage, setAlertMessage] = React.useState('');

  const isLastBill = billNumber === bills.length - 1;

  const individualPaidAmountsOnly = React.useMemo(() => {
    const updatedIndividualAmounts: IndividualAmounts = {};
    bills.forEach(bill => {
      if (!updatedIndividualAmounts[bill.paidBy]) {
        updatedIndividualAmounts[bill.paidBy] = {
          paid: 0,
          needsToPay: 0
        }
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
      setAlertMessage('Please select at least 1 person!');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    const updatedIndividualAmounts = {
      ...individualAmounts
    };

    const hasToPay = names.filter((_, idx) => selectedNames[idx]);

    hasToPay.forEach((name) => {
      if (!updatedIndividualAmounts[name]) {
        updatedIndividualAmounts[name] = {
          paid: 0,
          needsToPay: 0
        }
      }

      // Prevent mutation of React state
      updatedIndividualAmounts[name] = {
        ...updatedIndividualAmounts[name],
        needsToPay: updatedIndividualAmounts[name].needsToPay + parseFloat(bills[billNumber].amount) / hasToPay.length
      }
    });

    setIndividualAmounts(updatedIndividualAmounts);

    if (isLastBill) {
      navigate('/summary');
      return;
    }

    setSelectedNames(new Array(names.length).fill(false))
    setBillNumber(billNumber + 1);
  }

  if (!bills.length) {
    return (
      <Box>
        <AppHeader title='Allocate' handleRestart={handleRestart} />
        <Alert message="There are no bills! Please restart by clicking the button above!" />
      </Box>
    )
  }

  return (
    <Flex flexDir='column' h='100%' justify='space-between'>
      <Box>
        <AppHeader title='Allocate' handleRestart={handleRestart} />
        <FormControl>
          <HStack color='black'>
            <Input
              value={bills[billNumber].description}
              isReadOnly
              bg='white'
            />
            <NumberInput
              value={`Amt: $` + bills[billNumber].amount}
              bg='white'
              isReadOnly
            >
              <NumberInputField />
            </NumberInput>
          </HStack>
        </FormControl>
        
        <Stack dir="column" mt={5}>
          {names.map((e: string, idx: number) => (
            <Button
              variant='solid'
              colorScheme='blue'
              isActive={selectedNames[idx]}
              onClick={() => {
                const temp = [...selectedNames];
                temp[idx] = !temp[idx];
                setSelectedNames(temp);
              }}
              _hover={{backgroundColor: '#3182ce'}}
              key={idx}
            >
              {e}
            </Button>
          ))}
        </Stack>
      </Box>

      <Box>
        {alertMessage && <Alert message={alertMessage} />}
        <Button onClick={handleNext} isFullWidth colorScheme={isLastBill ? 'cyan' : 'gray'}>
          {isLastBill ? 'Calculate' : 'Next Bill'}
        </Button>
      </Box>
    </Flex>
  )
}

export default AllocateBills;
