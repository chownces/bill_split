import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Application from './Application';
import { ChakraProvider } from '@chakra-ui/react';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Application />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
