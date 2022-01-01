import { Center, Flex } from "@chakra-ui/react";
import React from "react";
import './Application.css';
import { useLocalStorageState } from "./hooks";
import AllocateBills, { IndividualAmounts } from "./pages/allocateBills/AllocateBills";
import GetBills, { Bill } from "./pages/getBills/GetBills";
import GetNames from "./pages/getNames/GetNames";
import Summary from "./pages/summary/Summary";

export enum State {
  GET_NAMES,
  GET_BILLS,
  ALLOCATE_BILLS,
  SUMMARY
}

const Application: React.FC = () => {
  const [names, setNames] = useLocalStorageState<string[]>('names', []);
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [individualAmounts, setIndividualAmounts] = React.useState<IndividualAmounts>({});
  const [currentState, setCurrentState] = React.useState<number>(State.GET_NAMES);

  // Prevent mobile browser search bars from hiding and messing up the UI
  // Does not currently account for orientation changes
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      '--application-height',
      window.innerHeight + 'px'
    )
  }, []);

  return (
    <Center bg='var(--main-bg-color)' className="Application" maxH={1000}>
      <Flex w='100vw' maxW={600} h='100%' p={3} py={6} direction='column' justifyContent='space-between'>
        {currentState === State.GET_NAMES && (
          <GetNames
            names={names}
            setNames={setNames}
            setCurrentState={setCurrentState}
          />
        )}
        {currentState === State.GET_BILLS && (
          <GetBills
            names={names}
            bills={bills}
            setBills={setBills}
            setCurrentState={setCurrentState}
          />
        )}
        {currentState === State.ALLOCATE_BILLS && (
          <AllocateBills 
            names={names}
            bills={bills}
            individualAmounts={individualAmounts}
            setIndividualAmounts={setIndividualAmounts}
            setCurrentState={setCurrentState}
          />
        )}
        {currentState === State.SUMMARY && (
          <Summary
            names={names}
            individualAmounts={individualAmounts}
            setCurrentState={setCurrentState}
          />
        )}
      </Flex>
    </Center>
  );
}

export default Application;
