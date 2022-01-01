import { IndividualAmounts } from "../allocateBills/AllocateBills";
import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

type SummaryProps = {
  names: string[];
  individualAmounts: IndividualAmounts;
  setCurrentState: React.Dispatch<React.SetStateAction<number>>;
};

const Summary: React.FC<SummaryProps> = ({
  names,
  individualAmounts,
  setCurrentState,
}) => {
  return (
    <Box>
      <Heading>Summary</Heading>
      <Box overflow="auto">
        <Table bg="white" color="black" mt={3}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Amount Paid</Th>
              <Th>Amount Owed</Th>
              <Th>Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {names.map((name, idx) => {
              const paid = individualAmounts[name]?.paid;
              const owed = individualAmounts[name]?.needsToPay;
              return (
                <Tr key={idx}>
                  <Td>{name}</Td>
                  <Td>{paid?.toFixed(2) || 0}</Td>
                  <Td>{owed?.toFixed(2) || 0}</Td>
                  {/* owed and paid are either both undefined or both numbers due to initialization of the individual amount object */}
                  <Td>{owed !== undefined ? (owed - paid).toFixed(2) : 0}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Text mt={3} align='right' fontStyle='italic' >* Everyone to have $0 balance after splitting</Text>
    </Box>
  );
};

export default Summary;
