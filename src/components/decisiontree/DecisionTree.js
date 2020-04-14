import React, { useState, useEffect, useRef, useContext } from 'react';
import dt from './utils';
import { csvContext } from '../context/csv-context';
import LoadDataset from '../utils/LoadDataset';
import Description from '../utils/Description';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CsvReader from '../utils/CsvReader';
import CsvTable from '../utils/CsvTable';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import FunctionsIcon from '@material-ui/icons/Functions';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import TitleBar from '../utils/TitleBar';

import './DecisionTree.css';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
          margin: theme.spacing(1),
          width: '25ch',
        },
    },
    button: {
        margin: theme.spacing(1),
        width: '100%',
    },
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
    const [columns, setColumns] = useState([]);
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
    const [error, setError] = useState('');
    const [prediction, setPrediction] = useState('')

    useEffect( () => {
        if (csv) {
            async function Fetch() {
                setDTree(null);
                dT.current.innerHTML = null
                let cols = await csv.columnNames()
                let [lastItem] = cols.slice(-1)
                setColumns(cols);
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
            reqCols = reqCols.filter(n => n !== config.categoryAttr)
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

    const changeDetails = (event) => {
        let details = predictionForm.details
        details[event.target.name] = event.target.value
        setPredictionForm({
            ...predictionForm,
            details: details
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
        try {
            // Building Decision Tree
            let decisionTree = new dt.DecisionTree(config);
            setDTree(decisionTree)
            // Displaying Decision Tree
            dT.current.innerHTML = treeToHtml(decisionTree.root);
        } catch (err) {
            setError(err)
        }
    }

    const predictTree = () => {
        // Building Decision Tree
        let decisionTree = new dt.DecisionTree(config);

        // Testing Decision Tree and Random Forest
        let details = predictionForm.details;

        let decisionTreePrediction = decisionTree.predict(details);
        setPrediction(decisionTreePrediction)
        // Displaying Decision Tree
        dT.current.innerHTML = treeToHtml(decisionTree.root);
    }
    
    return (
        <Grid container>
            <Grid item md={6} xs={12}>
                <TitleBar name="Decision Tree" tags={['Classification', 'Tree']} />
                <CsvReader />
                <CsvTable />
            </Grid>
            <Grid item md={6} xs={12}>
                <LoadDataset />
                <Description desc="dt" />
                {csv ? (
                        <div style={{ padding: '10px' }}>
                            {error && (
                                <Alert onClose={() => setError('')} severity="error">
                                    {error}
                                </Alert>
                            )}
                            {columns && (
                                <React.Fragment>  
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
                                            <div key={index}>
                                                {column !== config.categoryAttr && (
                                                    <FormControlLabel
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
                                        )}
                                    </div>
                                </React.Fragment>
                            )}


                            <div style={{ textAlign: 'center' }}>
                                <Button variant="contained" color="primary" onClick={generateTree}>Generate Decision Tree</Button>
                            </div>
                            {dTree && (
                                <div style={{ marginTop: '20px', padding: '10px' }}>
                                    <Paper className={classes.descDiv}>
                                        Make a Prediction
                                    </Paper>
                                    <form className={classes.root} noValidate autoComplete="off">
                                        {predictionForm.columns.map((column, index) => 
                                            <TextField 
                                                key={index}  
                                                label={column} 
                                                name={column}
                                                value={predictionForm.details.column}
                                                onChange={changeDetails}
                                            />
                                        )}
                                    </form>
                                    <Grid style={{ marginBottom: '20px' }} container spacing={4}>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                startIcon={<FunctionsIcon />}
                                                onClick={predictTree}
                                            >
                                                Predict
                                            </Button>      
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                startIcon={<AccountTreeIcon />}
                                                onClick={() => {scrollToRef(dT)}}
                                            >
                                                View Tree
                                            </Button>       
                                        </Grid>
                                    </Grid>
                                </div>
                            )}
                            {prediction && (
                                <Alert onClose={() => {setPrediction('')}} severity="success">
                                    The predicted value is {prediction}
                                </Alert>
                            )}
                        </div>
                ) : (
                        <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                            Please select a dataset 
                        </div>
                )}
                
            </Grid>
            {dTree && (
                <Paper style={{ width: '100%', margin: '20px', padding: '20px', textAlign: 'center', backgroundColor: '#000000' }}>
                    <Typography variant="h4" gutterBottom>
                        Decision Tree
                    </Typography>
                </Paper>
            )}
            <div className="tree-wrapper">
                <div className="tree" ref={dT} />
            </div>
        </Grid>
        
    );
}

export default DecisionTree;
