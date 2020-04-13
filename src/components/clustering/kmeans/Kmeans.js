import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import { csvContext } from '../../context/csv-context';
import { makeStyles } from '@material-ui/core/styles';
import TitleBar from '../../utils/TitleBar';
import CsvReader from '../../utils/CsvReader';
import CsvTable from '../../utils/CsvTable';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from '@material-ui/core/Paper';
import { kmeans } from '../fcmeans/figue';
import { ConvertCSVToSingleArray, ConvertClusterIconsToData } from '../../../ML/utils.js';
import { VisorStop, DrawScatterPlot, GenerateChartForCluster } from '../../linreg/utils';
import { Link } from '@material-ui/core';

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
    descDiv: {
        background: '#505050', 
        width: '100%', 
        padding: '15px',
        fontSize: '14px',
        margin: '10px',
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

async function PerformKMeans(csv, k, labels, xIdx, yIdx) {
    const data = await ConvertCSVToSingleArray(csv, labels);
    const res = kmeans(k, data/*, epsilon, fuzziness*/)
    console.log(res);
    const clusters = ConvertClusterIconsToData(res.assignments, k, data);
    VisorStop();
    const chart = GenerateChartForCluster(res.centroids,clusters, xIdx, yIdx);
    await DrawScatterPlot(chart);
}
export default function Kmeans() {
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

    return (
        <div>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <TitleBar name="K Means Clustering" tags={['Clustering', 'K-Means', 'ScatterPlot']} />
                <p>
                    <Link href={`${process.env.PUBLIC_URL}/Linear Regression.csv`}>Sample CSV</Link>
                </p>
                    <CsvReader />
                    <CsvTable />
                </Grid>
                <Grid item md={6} xs={12}>
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
                                    label: label,
                                    linkage: 0,
                                    k: 3,
                                    distance: 0,
                                    withLabel: true,
                                    withCentroid: false,
                                    withDistance: false,
                                    balanced: true,
                                    space: 5
                                }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.label) {
                                        errors.label = 'Required';
                                    }
                                    if (values.linkage < 0 || values.linkage > 2) {
                                        console.log("haha")
                                        errors.linkage = 'Required';
                                    }
                                    if (values.distance < 0 || values.distance > 2) {
                                        errors.distance = 'Required';
                                    }
                                    if (values.space !== 3 && values.space !== 5 && values.space !== 7 && values.space !== 9) {
                                        errors.space = 'Invalid value'
                                    }

                                    return errors;
                                }}
                                onSubmit={async (values) => {
                                    setError("");
                                    try {
                                        // TODO: KMeans    
                                        const labels = [...(new Set([values.label, ...values.vectors]))];
                                        const k = values.k;
                                        const xIdx = 0;
                                        const yIdx = 1;
                                        await PerformKMeans(csv, k, labels, xIdx, yIdx);
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
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                    <form className={classes.form} onSubmit={handleSubmit}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <Paper className={classes.descDiv}>
                                                    Select the number of clusters
                                                </Paper>
                                                <TextField id="standard-basic"
                                                    style={{ marginLeft: '10px', width: '90%' }}
                                                    label="k" 
                                                    fullWidth
                                                    onChange={handleChange}
                                                    value={values.k}
                                                    name="k"
                                                >
                                                </TextField>
                                                <FormHelperText>Minimum spacing between nodes</FormHelperText>
                                                <div style={{ margin: "10px", color: "red" }}>
                                                    {errors.space && touched.space && errors.space}
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
                                                disabled={isSubmitting}
                                            >
                                                RUN AND DISPLAY SCATTERPLOT
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
