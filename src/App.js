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
import LinearRegression from './components/linreg/LinearRegression';
import DecisionTree from './components/decisiontree/DecisionTree';
import HierarchicalClustering from './components/clustering/HC/HierarchicalClustering';
import Kmeans from './components/clustering/kmeans/Kmeans';
import Svm from './components/svm/Svm';
import KNN from './components/knn/KNN';
import PCAnalysis from './components/pca/PCAnalysis';
import FCMeans from './components/clustering/fcmeans/FCMeans';
import Landing from './components/landing/Landing';


const theme = createMuiTheme(customTheme);

const App = () => {
  const [csv, setCsv] = useState();

  const fetchCsv = useCallback((csv) => {
    setCsv(csv);
  }, []);

  let routes = (
      <Switch>
          <Route path="/" exact>
            <Landing />
          </Route>
          <Route path="/dashboard" exact>
            <Header>              
              <Dashboard />
            </Header>
          </Route>
          <Route path="/linreg" exact>
            <Header>
              <LinearRegression/>
            </Header>
          </Route>
          <Route path="/decision-tree" exact>
            <Header>
              <DecisionTree />
            </Header>
          </Route>
          <Route path="/hcluster" exact>
            <Header>            
              <HierarchicalClustering />
            </Header>
          </Route>
          <Route path="/kmeans" exact>
            <Header>            
              <Kmeans />
            </Header>
          </Route>
          <Route path="/fcmeans" exact>
            <Header>
              <FCMeans />
            </Header>
          </Route>
          <Route path="/svm" exact>
            <Header>
              <Svm />
            </Header>
          </Route>
          <Route path="/knn" exact>
            <Header>
              <KNN />
            </Header>
          </Route>
          <Route path="/pca" exact>
            <Header>
              <PCAnalysis />
            </Header>
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
              {routes}
          </Router>
        </csvContext.Provider>
      </ThemeProvider>
  );
}

export default App;
