import { Center, Flex } from '@chakra-ui/react';
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './Application.css';
import { useLocalStorageState } from './hooks';
import AllocateBills, { IndividualAmounts } from './pages/allocateBills/AllocateBills';
import GetBills, { Bill } from './pages/getBills/GetBills';
import GetNames from './pages/getNames/GetNames';
import Summary from './pages/summary/Summary';

export enum State {
  GET_NAMES,
  GET_BILLS,
  ALLOCATE_BILLS,
  SUMMARY
}

const Application: React.FC = () => {
  const [names, setNames] = useLocalStorageState<string[]>('names', []);
  const [bills, setBills] = useLocalStorageState<Bill[]>('bills', []);
  const [individualAmounts, setIndividualAmounts] = React.useState<IndividualAmounts>({});

  const handleRestart = () => {
    setBills([]);
    setIndividualAmounts({});
  };

  const ENV = process.env.REACT_APP_NODE_ENV;

  return (
    <Router basename={ENV === 'production' ? '/bill_split' : undefined}>
      <Center bg="var(--main-bg-color)" className="Application">
        <Flex
          w="100vw"
          maxW={600}
          h="100%"
          maxH={1000}
          p={3}
          py={6}
          direction="column"
          justifyContent="space-between"
        >
          <Routes>
            {['/', 'get-names'].map((p, idx) => (
              <Route
                key={idx}
                path={p}
                element={
                  <GetNames names={names} setNames={setNames} handleRestart={handleRestart} />
                }
              />
            ))}
            <Route
              path="/get-bills"
              element={
                <GetBills
                  names={names}
                  bills={bills}
                  setBills={setBills}
                  handleRestart={handleRestart}
                />
              }
            />
            <Route
              path="/allocate-bills"
              element={
                <AllocateBills
                  names={names}
                  bills={bills}
                  individualAmounts={individualAmounts}
                  setIndividualAmounts={setIndividualAmounts}
                  handleRestart={handleRestart}
                />
              }
            />
            <Route
              path="/summary"
              element={
                <Summary
                  names={names}
                  individualAmounts={individualAmounts}
                  handleRestart={handleRestart}
                />
              }
            />
          </Routes>
        </Flex>
      </Center>
    </Router>
  );
};

export default Application;
