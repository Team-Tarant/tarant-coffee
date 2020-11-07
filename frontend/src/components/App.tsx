import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { ThemeProvider } from 'styled-components';

import { Theme, GlobalStyle } from '../styles';
import Feedback from './Feedback'
import Main from './Main';

// This comes from babel.config.js and can be declared anywhere
// declare const API_KEY

const App: React.FC<{}> = ({}) => {
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route path="/feedback">
            <Feedback />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;
