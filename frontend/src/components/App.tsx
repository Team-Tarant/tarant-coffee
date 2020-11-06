import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Theme, GlobalStyle } from '../styles';
import Main from './Main';

// This comes from babel.config.js and can be declared anywhere
// declare const API_KEY

const App: React.FC<{}> = ({}) => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <Main></Main>
    </ThemeProvider>
  );
};

export default App;
