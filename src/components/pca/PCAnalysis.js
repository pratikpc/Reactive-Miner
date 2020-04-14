import React, { useState, useEffect, useContext } from 'react';
import { csvContext } from '../context/csv-context';
import LoadDataset from '../utils/LoadDataset';
import Description from '../utils/Description';
import { makeStyles } from '@material-ui/core/styles';
import CsvReader from '../utils/CsvReader';
import CsvTable from '../utils/CsvTable';
import TitleBar from '../utils/TitleBar';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { Button } from '@material-ui/core';
import { VisorStop, DrawBarChart } from '../linreg/utils';
import { ConvertCSVToSingleArray } from '../../ML/utils';
const { PCA } = require('ml-pca');

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
    descDiv: {
        marginTop: '20px',
        background: '#505050',
        width: '100%',
        padding: '15px',
        fontSize: '14px',
    },
}));

const PCAnalysis = () => {
    const classes = useStyles();
    const { csv } = useContext(csvContext);
    const [columns, setColumns] = useState([]);
    const [threshold, setThreshold] = useState(0.5)
    const [pcaColumns, setPcaColumns] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (csv) {
            async function Fetch() {
                let cols = await csv.columnNames()
                setColumns(cols);
                setPcaColumns([]);
            }
            Fetch();
        }
    }, [csv])

    const toggleColumn = (event) => {
        if (event.target.checked) {
            let array = [event.target.name]
            setPcaColumns([...pcaColumns, ...array])
        } else {
            let newArray = pcaColumns.filter((col) => col !== event.target.name);
            setPcaColumns([...newArray])
        }
    }

    function valuetext(value) {
        return `${value}`;
    }

    const trainPca = async () => {
        if (pcaColumns && pcaColumns.length > 0) {
            try {
                // accepts the dataset and threshold and the output is total letiance of all features in order = arr1[] "or" the outputs which are above the threshold given = arr2[]

                const data = await ConvertCSVToSingleArray(csv, pcaColumns);
                // dataset is a two-dimensional array where rows represent the samples and columns the features
                const pca = new PCA(data);
                const arr1 = pca.getExplainedVariance();

                VisorStop();
                console.log(arr1);
                await DrawBarChart("PCA", "PCA", arr1)
                console.log('The total variance is ' + arr1);
            } catch (err) {
                console.log(err)
                setError('Please select only numerical Attributes')
            }
        } else {
            setError('Please provide proper parameters')
        }
    }

    return (
        <div>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <TitleBar name="Principal Component Analysis" tags={['Classification', 'Analysis', 'Variance']} />
                    <CsvReader />
                    <CsvTable />
                </Grid>
                <Grid item md={6} xs={12}>
                    <div style={{ padding: '10px' }}>
                        <LoadDataset />
                        <Description desc="pca" />
                        {error && (
                            <Alert style={{ margin: '10px' }} onClose={() => setError('')} severity="error">
                                {error}
                            </Alert>
                        )}
                        {csv ? (
                            <Grid container>
                                <Grid item xs={12}>
                                    <Alert style={{ color: 'rgb(255, 213, 153)', background: 'rgb(25, 15, 0)' }} severity="warning">
                                        Please choose only numerical Attributes!
                                    </Alert>
                                    <Paper className={classes.descDiv}>
                                        Select the Attributes for Analysis
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    {columns.map((column, index) =>
                                        <FormControlLabel
                                            key={index}
                                            control={<Checkbox
                                                checked={pcaColumns.includes(column)}
                                                color="default"
                                                name={column}
                                                onChange={toggleColumn}
                                            />}
                                            label={column}
                                        />
                                    )}
                                </Grid>
                                <Grid style={{ textAlign: 'center' }} item xs={12}>
                                    <Paper className={classes.descDiv}>
                                        Select Threshold
                                    </Paper>
                                    <Typography style={{ marginTop: '5px' }} id="range-slider" gutterBottom>
                                        <span style={{ color: '#1692f7', fontWeight: '500', fontSize: '18px' }}>
                                            {threshold}
                                        </span>
                                    </Typography>
                                    <Slider
                                        style={{ color: '#1692f7', width: '90%' }}
                                        value={threshold}
                                        aria-labelledby="range-slider"
                                        valueLabelDisplay="auto"
                                        marks
                                        min={0.1}
                                        max={1.0}
                                        step={0.01}
                                        getAriaValueText={valuetext}
                                        onChange={(event, newValue) => {
                                            setThreshold(newValue)
                                        }}
                                    />
                                </Grid>
                                <Grid style={{ textAlign: 'center' }} item xs={12}>
                                    <Button variant="contained" color="primary" style={{ width: '90%' }} onClick={trainPca}>Train</Button>
                                </Grid>
                            </Grid>
                        ) : (
                                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                                    Please select a dataset
                                </div>
                            )}
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default PCAnalysis;