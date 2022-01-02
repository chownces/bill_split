import { Center, Flex } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./Application.css";
import { useLocalStorageState } from "./hooks";
import AllocateBills, {
  IndividualAmounts,
} from "./pages/allocateBills/AllocateBills";
import GetBills, { Bill } from "./pages/getBills/GetBills";
import GetNames from "./pages/getNames/GetNames";
import Summary from "./pages/summary/Summary";

export enum State {
  GET_NAMES,
  GET_BILLS,
  ALLOCATE_BILLS,
  SUMMARY,
}

const Application: React.FC = () => {

  const [names, setNames] = useLocalStorageState<string[]>("names", []);
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [individualAmounts, setIndividualAmounts] =
    React.useState<IndividualAmounts>({});

  // Prevent mobile browser search bars from hiding and messing up the UI
  // Does not currently account for orientation changes
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--application-height",
      window.innerHeight + "px"
    );
  }, []);

  const handleRestart = () => {
    setBills([]);
    setIndividualAmounts({});
  }

  return (
    <BrowserRouter>
      <Center bg="var(--main-bg-color)" className="Application" maxH={1000}>
        <Flex
          w="100vw"
          maxW={600}
          h="100%"
          p={3}
          py={6}
          direction="column"
          justifyContent="space-between"
        >
          <Routes>
            {["/", "get-names"].map((p, idx) => (
              <Route
                key={idx}
                path={p}
                element={<GetNames names={names} setNames={setNames} handleRestart={handleRestart} />}
              />
            ))}
            <Route
              path="/get-bills"
              element={
                <GetBills names={names} bills={bills} setBills={setBills} handleRestart={handleRestart} />
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
                <Summary names={names} individualAmounts={individualAmounts} handleRestart={handleRestart} />
              }
            />
          </Routes>
        </Flex>
      </Center>
    </BrowserRouter>
  );
};

export default Application;
