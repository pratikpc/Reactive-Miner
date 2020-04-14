import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import { csvContext } from '../../context/csv-context';
import { makeStyles } from '@material-ui/core/styles';
import TitleBar from '../../utils/TitleBar';
import Grid from '@material-ui/core/Grid';
import CsvReader from '../../utils/CsvReader';
import CsvTable from '../../utils/CsvTable';
import LoadDataset from '../../utils/LoadDataset';
import Description from '../../utils/Description';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Slider from '@material-ui/core/Slider';

import { fcmeans } from './figue.js';
import { FindArgMax, ConvertCSVToSingleArray, ConvertClusterIconsToData } from '../../../ML/utils';
import { VisorStop, DrawScatterPlot, GenerateChartForCluster } from '../../linreg/utils';

const useStyles = makeStyles(theme => ({
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formControl: {
        margin: theme.spacing(1),
        width: '80%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    form: {
        width: '90%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        marginLeft: '20px',
    },
    submit: {
        width: '100px',
    },
}));

async function PerformFCMeans(csv, k, epsilon, fuzziness, labels, xIdx, yIdx) {
    const data = await ConvertCSVToSingleArray(csv, labels);
    const res = fcmeans(k, data, epsilon, fuzziness)
    const assignedClusters = await FindArgMax(res.membershipMatrix.mtx);
    const clusters = ConvertClusterIconsToData(assignedClusters, k, data);
    VisorStop();
    const chart = GenerateChartForCluster(res.centroids, clusters, xIdx, yIdx);
    await DrawScatterPlot(chart);
}
export default function FCMeans() {
    const classes = useStyles();
    const [error, setError] = useState('')
    const { csv } = useContext(csvContext);
    const [columnNames, setColumnNames] = useState([]);
    const [label, setLabel] = useState();

    useEffect(() => {
        if (csv == null)
            return;
        async function LoadColumnNames() {
            const columns = await csv.columnNames();
            setColumnNames(columns);
            setLabel(columns[0]);
        }
        LoadColumnNames();
    }, [csv, setColumnNames]);

    function valuetext(value) {
        return `${value}`;
    }

    return (
        <div>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <TitleBar name="Fuzzy C-Means" tags={['Clustering', 'C-Means', 'Matrix']} />
                    <CsvReader />
                    <CsvTable />
                </Grid>
                <Grid item md={6} xs={12}>
                    <LoadDataset />
                    <Description desc="fcmeans" />
                    {csv && columnNames && label ? (
                        <div style={{ padding: '10px' }}>
                            {error && (
                                <Alert onClose={() => setError('')} severity="error">
                                    {error}
                                </Alert>
                            )}
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    vectors: columnNames,
                                    k: 4,
                                    epsilon: 0.3,
                                    fuzziness: 2
                                }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.epsilon) {
                                        errors.epsilon = 'Required';
                                    }
                                    if (!values.fuzziness) {
                                        errors.fuzziness = 'Required';
                                    }
                                    if (values.k < 2 && values.k > 9) {
                                        errors.k = 'Invalid number of clusters'
                                    }
                                    return errors;
                                }}
                                onSubmit={async (values) => {
                                    console.log(values);
                                    setError("");
                                    try {
                                        const labels = [...(new Set([...values.vectors]))];
                                        const xIdx = 0;
                                        const yIdx = 1;
                                        await PerformFCMeans(csv, values.k, values.epsilon, values.fuzziness, labels, xIdx, yIdx);
                                    } catch (err) {
                                        console.error(err);
                                        setError('Please Recheck your Provided Parameters');
                                    }
                                }}
                            >{({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue,
                            }) => (
                                    <form className={classes.form} onSubmit={handleSubmit}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <Paper style={{ backgroundColor: 'black', padding: '20px' }}>
                                                    Select the numerical attributes
                                                </Paper>
                                                {columnNames.map((column, index) =>
                                                    <FormControlLabel
                                                        key={index}
                                                        control={<Checkbox
                                                            checked={values.vectors.includes(column)}
                                                            color="default"
                                                            name={column}
                                                            onChange={(event) => {
                                                                let array = values.vectors;
                                                                if (array.includes(event.target.name)) {
                                                                    const newArray = array.filter((col) => col !== event.target.name);
                                                                    setFieldValue('vectors', newArray, false)
                                                                } else {
                                                                    array.push(event.target.name)
                                                                    setFieldValue('vectors', array, false)
                                                                }
                                                            }}
                                                        />}
                                                        label={column}
                                                    />
                                                )}
                                            </Grid>
                                            <Grid style={{ marginTop: '10px' }} item xs={12}>
                                                <TextField id="select"
                                                    style={{ width: '90%' }}
                                                    label="Number of clusters" select
                                                    fullWidth
                                                    value={values.k}
                                                    name="k"
                                                    onChange={(event) => {
                                                        setFieldValue('k', parseInt(event.target.value), true)
                                                    }}
                                                    variant="filled"
                                                >
                                                    <MenuItem value={2}>2</MenuItem>
                                                    <MenuItem value={3}>3</MenuItem>
                                                    <MenuItem value={4}>4</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={6}>6</MenuItem>
                                                    <MenuItem value={7}>7</MenuItem>
                                                    <MenuItem value={8}>8</MenuItem>
                                                    <MenuItem value={9}>9</MenuItem>
                                                </TextField>
                                                <FormHelperText>Total number of clusters for FCMeans</FormHelperText>
                                                <div style={{ margin: "10px", color: "red" }}>
                                                    {errors.k && touched.k && errors.k}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography style={{ marginTop: '5px' }} id="epsilon-slider" gutterBottom>
                                                    Epsilon
                                                    <span style={{ color: '#1692f7', marginLeft: '10px', fontWeight: '500', fontSize: '18px' }}>
                                                        {values.epsilon}
                                                    </span>
                                                </Typography>
                                                <Slider
                                                    style={{ color: '#1692f7', width: '90%' }}
                                                    value={values.epsilon}
                                                    aria-labelledby="epsilon-slider"
                                                    valueLabelDisplay="auto"
                                                    marks
                                                    min={0.1}
                                                    max={0.9}
                                                    step={0.1}
                                                    getAriaValueText={valuetext}
                                                    onChange={(event, newValue) => {
                                                        setFieldValue('epsilon', parseFloat(newValue), false)
                                                    }}
                                                />
                                                <div style={{ margin: "10px", color: "red" }}>
                                                    {errors.epsilon && touched.epsilon && errors.epsilon}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography style={{ marginTop: '5px' }} id="fuzziness-slider" gutterBottom>
                                                    Fuzziness
                                                    <span style={{ color: 'red', marginLeft: '10px', fontWeight: '500', fontSize: '18px' }}>
                                                        {values.fuzziness}
                                                    </span>
                                                </Typography>
                                                <Slider
                                                    style={{ color: 'red', width: '90%' }}
                                                    value={values.fuzziness}
                                                    aria-labelledby="fuzziness-slider"
                                                    valueLabelDisplay="auto"
                                                    marks
                                                    min={2}
                                                    max={100}
                                                    step={1}
                                                    getAriaValueText={valuetext}
                                                    onChange={(event, newValue) => {
                                                        setFieldValue('fuzziness', parseInt(newValue), false)
                                                    }}
                                                />
                                                <div style={{ margin: "10px", color: "red" }}>
                                                    {errors.fuzziness && touched.fuzziness && errors.fuzziness}
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <div style={{ margin: '10px', textAlign: 'center' }}>
                                            <Button
                                                style={{ width: '100%' }}
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                            // disabled={isSubmitting}
                                            >
                                                CLUSTER DATA
                                    </Button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    ) : (
                            <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                                Please select a dataset
                            </div>
                        )}
                </Grid>
            </Grid>
        </div >
    )
}
