import React from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Redirect, 
  Switch 
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import customTheme from './components/theme/theme.json';
import { createMuiTheme } from '@material-ui/core/styles';
import Header from './components/utils/Header';
import Dashboard from './components/utils/Dashboard';

const theme = createMuiTheme(customTheme);

const App = () => {
  let routes = (
      <Switch>
        <Route path="/" exact>
            <Dashboard />
        </Route>
        <Redirect to="/" />
      </Switch>
    )

  return (
      <ThemeProvider theme={theme}>
        <Router>
          <Header>
            {routes}
          </Header>
        </Router>
      </ThemeProvider>
  );
}

export default App;
