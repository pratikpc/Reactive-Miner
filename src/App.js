import React, { useState, useCallback } from 'react';
import { 
  HashRouter as Router, 
  Route, 
  Redirect, 
  Switch 
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import customTheme from './components/theme/theme.json';
import { createMuiTheme } from '@material-ui/core/styles';
import { csvContext } from './components/context/csv-context';
import Header from './components/utils/Header';
import Dashboard from './components/utils/Dashboard';
import Overview from './components/utils/Overview';
import LinearRegression from './components/ml/LinearRegression';
import DecisionTree from './components/decisiontree/DecisionTree';
import { SVM } from 'libsvm-js/out/wasm/libsvm';

const theme = createMuiTheme(customTheme);

const App = () => {
  const [csv, setCsv] = useState();

  const fetchCsv = useCallback((csv) => {
    setCsv(csv);
  }, []);

  let routes = (
      <Switch>
        <Route path="/" exact>
            <Dashboard />
        </Route>
        <Route path="/overview" exact>
            <Overview />
        </Route>
        <Route path="/linreg" exact>
          <LinearRegression/>
        </Route>
        <Route path="/decision-tree" exact>
          <DecisionTree />
        </Route>
        <Route path="/SVM" exact>
          <SVM />
        </Route>
        <Redirect to="/" />
      </Switch>
    )

  return (
      <ThemeProvider theme={theme}>
        <csvContext.Provider
          value={{
            csv: csv,
            fetchCsv: fetchCsv
          }}
        >
          <Router>
            <Header>
              {routes}
            </Header>
          </Router>
        </csvContext.Provider>
      </ThemeProvider>
  );
}

export default App;
