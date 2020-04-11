import React, { useState, useEffect, useRef, useContext } from 'react';
import dt from './utils';
import { csvContext } from '../context/csv-context';
import './DecisionTree.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CsvReader from '../utils/CsvReader';
import CsvTable from '../utils/CsvTable';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    descDiv: {
        background: '#505050', 
        width: '100%', 
        padding: '15px',
        fontSize: '14px',
    },
    borderDiv: {
        marginBottom: '20px', 
        padding: '10px', 
        borderBottom: '1px solid white',
    }
}));

const DecisionTree = () => {
    const classes = useStyles();
    const { csv } = useContext(csvContext);
    const [columns, setColumns] = useState([])
    const [data, setData] = useState([]);
    const [dTree, setDTree] = useState();
    const [config, setConfig] = useState({
        trainingSet: null, 
        categoryAttr: '', 
        ignoredAttributes: [] 
    })

    const [predictionForm, setPredictionForm] = useState({
        columns: [],
        details: {}
    });

    const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop) 

    useEffect( () => {
        if (csv) {
            async function Fetch() {
                setDTree(null);
                dT.current.innerHTML = null
                let cols = await csv.columnNames()
                let [lastItem] = cols.slice(-1)
                setColumns(cols);
                setData(await csv.toArray())
                setConfig({
                    trainingSet: await csv.toArray(),
                    categoryAttr: lastItem,
                    ignoredAttributes: [] 
                })
            }
            Fetch();
        }
    }, [csv]) 

    useEffect(() => {
        if (dTree) {
            let reqCols = columns.filter(n => !config.ignoredAttributes.includes(n))
            let details = {};
            reqCols.forEach(col => {
                details[col] = '';
            });
            setPredictionForm({
                columns: reqCols,
                details: details
            })
        }
    }, [columns, config, dTree])

    const tI = useRef();
    const dTP = useRef();
    const rFP = useRef();
    const dT = useRef();

    const ignoreColumn = (event) => {
        let array = config.ignoredAttributes;
        if (array.includes(event.target.name)) {
            const newArray = array.filter((col) => col !== event.target.name);
            setConfig({
                ...config,
                ignoredAttributes: newArray
            })
        } else {
            array.push(event.target.name)
            setConfig({
                ...config,
                ignoredAttributes: array
            })
        }
    }

    const chooseCategoryAttr = (event) => {
        setConfig({
            ...config,
            categoryAttr: event.target.value
        })
    }

    // Recursive (DFS) function for displaying inner structure of decision tree
    const treeToHtml = (tree) => {
        // only leafs containing category
        if (tree.category) {
            return  ['<ul>',
                        '<li>',
                            '<button>',
                                '<b>', tree.category, '</b>',
                            '</button>',
                        '</li>',
                    '</ul>'].join('');
        }
        
        return  ['<ul>',
                    '<li>',
                        '<button>',
                            '<b>', tree.attribute, ' ', tree.predicateName, ' ', tree.pivot, ' ?</b>',
                        '</button>',
                        '<ul>',
                            '<li>',
                                '<button>yes</button>',
                                treeToHtml(tree.match),
                            '</li>',
                            '<li>', 
                                '<button>no</button>',
                                treeToHtml(tree.notMatch),
                            '</li>',
                        '</ul>',
                    '</li>',
                '</ul>'].join('');
    }

    const generateTree = () => {
        // Building Decision Tree
        let decisionTree = new dt.DecisionTree(config);
        setDTree(decisionTree)
        // Displaying Decision Tree
        dT.current.innerHTML = treeToHtml(decisionTree.root);
        scrollToRef(dT)
    }

  const loadTree = () => {
    // Building Decision Tree
    let decisionTree = new dt.DecisionTree(config);
    setDTree(decisionTree)

    // Building Random Forest
    let numberOfTrees = 3;
    let randomForest = new dt.RandomForest(config, numberOfTrees);

    // Testing Decision Tree and Random Forest
    let comic = {person: 'Comic guy', hairLength: 8, weight: 290, age: 38};

    let decisionTreePrediction = decisionTree.predict(comic);
    let randomForestPrediction = randomForest.predict(comic);

    // Displaying predictions
    tI.current.innerHTML = JSON.stringify(comic, null, 0);
    dTP.current.innerHTML = JSON.stringify(decisionTreePrediction, null, 0);
    rFP.current.innerHTML = JSON.stringify(randomForestPrediction, null, 0);

    // Displaying Decision Tree
    dT.current.innerHTML = treeToHtml(decisionTree.root);
  }


  return (
      <Grid container>
          <Grid item md={6} xs={12}>
            <CsvReader />
            <CsvTable />
          </Grid>
          <Grid item md={6} xs={12}>
              {csv ? (
                    <div style={{ padding: '10px' }}>
                        {columns && (
                            <>  
                                <div className={classes.borderDiv}>
                                    <Paper className={classes.descDiv}>
                                        Select the column to be predicted
                                    </Paper>
                                    <FormControl className={classes.formControl}>
                                        <Select
                                            value={config.categoryAttr}
                                            onChange={chooseCategoryAttr}
                                            displayEmpty
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            {columns.map((column, index) => 
                                                <MenuItem key={index} value={column}>{column}</MenuItem>
                                            )}
                                        </Select>
                                        <FormHelperText>Select a column</FormHelperText>
                                    </FormControl>
                                </div>
                                <div className={classes.borderDiv}>
                                    <Paper className={classes.descDiv}>
                                        Check the columns to be ignored
                                    </Paper>
                                    {columns.map((column, index) => 
                                        <FormControlLabel
                                            key={index}
                                            control={<Checkbox 
                                                        checked={config.ignoredAttributes.includes(column)} 
                                                        color="default" 
                                                        name={column}
                                                        onChange={ignoreColumn} 
                                                    />}
                                            label={column}       
                                        />
                                    )}
                                </div>
                            </>
                        )}
                        <div style={{ textAlign: 'center' }}>
                            <Button variant="contained" color="primary" onClick={generateTree}>Generate Decision Tree</Button>
                        </div>
                        <button onClick={loadTree}>asd</button>
                        
                        <br/>
                        <b>Comic guy:</b>
                        <div ref={tI}></div>
                        <br/>
                        <b>Decision Tree prediction:</b>
                        <div ref={dTP}></div>
                        <br/>
                        <b>Random Forest prediction:</b>
                        <div ref={rFP}></div>
                        <br/>
                        <b>Decision Tree:</b>
                        <br/>
        
                        {/* <div className="tree" ref={dT}></div> */}
                    </div>
              ) : (
                    <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                        Please select a dataset 
                    </div>
              )}
            
          </Grid>
          <div className="tree-wrapper">
            <div className="tree" ref={dT} />
          </div>
      </Grid>
    
  );
}

export default DecisionTree;
