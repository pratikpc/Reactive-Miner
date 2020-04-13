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
import HierarchicalClustering from './components/clustering/HC/HierarchicalClustering';
import Kmeans from './components/clustering/kmeans/Kmeans';
import Svm from './components/svm/Svm';
import KNN from './components/knn/KNN';
import PCAnalysis from './components/pca/PCA';


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
        <Route path="/hcluster" exact>
          <HierarchicalClustering />
        </Route>
        <Route path="/kmeans" exact>
          <Kmeans />
        </Route>
        <Route path="/svm" exact>
          <Svm />
        </Route>
        <Route path="/knn" exact>
          <KNN />
        </Route>
        <Route path="/pca" exact>
          <PCAnalysis />
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
