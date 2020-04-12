import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { csvContext } from '../context/csv-context';
import { makeStyles } from '@material-ui/core/styles';
import * as Utils from "./utils";
import { SplitIntoInputAndLabel, NormalizeVar, DisposeValues } from '../../ML/utils';
import * as LinearRegressionApply from "../../ML/linreg";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "@tensorflow/tfjs-core";
import Grid from '@material-ui/core/Grid';
import CsvReader from '../utils/CsvReader';
import CsvTable from '../utils/CsvTable';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';

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

let model = null;
const vals = { x: null, y: null };
const lossContainer = { name: 'show.loss', tab: 'Loss' };

// async function PredictSingleValue(model, data, xCols, x, y) {
//     const val_pred = Utils.CreateTensor(data, xCols);
//     const pred = await val_pred.data();
//     const val_pred_norm = NormalizeVar(x, val_pred);
//     const prediction = LinearRegressionApply.Predict(model, await val_pred_norm.array());
//     const resT = ScaleBackVal(y, prediction);
//     const res = (await resT.array())[0];
//     val_pred.dispose();
//     val_pred_norm.dispose();
//     resT.dispose();
//     prediction.dispose();
//     return [pred, res];
// }

async function GetDataFromCSV(csv, rowIdx, columns, predCol) {
    const data = (await csv.toArray())[rowIdx];
    const columnNames = Utils.SetDifference(columns, [predCol]);
    console.log(columnNames, predCol);
    const values = Object.keys(data).filter(key => columnNames.includes(key)).map(val => data[val]);
    return values.join(',');
}

async function PredictValues(values) {
    const valuesT = tf.tensor(values);
    const valuesNormT = NormalizeVar(vals.x, valuesT)
    valuesT.dispose();
    const valuesNorm = await valuesNormT.array();
    valuesNormT.dispose();
    const pred = await LinearRegressionApply.PredictWithScaling(model, valuesNorm, vals.y);
    console.log(pred);
    return pred;
}

async function Perform(csv, labelCol, columnNames, l1, l2, epochs, batchSize, validationSplit, learningRate) {
    if (vals.x != null && vals.y != null && model != null) {
        DisposeValues(vals.x, vals.y);
        console.log("33");
        model.dispose();
        model = null;
    }
    const data = await csv.toArray();
    console.log(labelCol);
    Utils.RemoveNode("tfjs-visor-container");
    tfvis.visor().open();
    const [x, y] = SplitIntoInputAndLabel(data, labelCol, columnNames);
    model = await LinearRegressionApply.Fit(x.value, y.value, async (logs) => {
        await tfvis.show.history(lossContainer, logs, ["rms_loss", "val_rms_loss"]);
    }, l1, l2, epochs, batchSize, validationSplit, learningRate);
    model.summary();
    await tfvis.show.modelSummary({ name: 'Model', tab: 'Model' }, model);

    const [preds, x_vals, y_vals] = await LinearRegressionApply.PredictDataset(model, x, y);
    await Utils.DrawChart({ name: 'Line chart', tab: 'Plot' }, x_vals, y_vals, preds);
    vals.x = x;
    vals.y = y;

    console.log("Final Memory Usage", tf.memory());
}

export default function LinearRegression() {
    const classes = useStyles();
    const [error, setError] = useState('')
    const { csv } = useContext(csvContext);
    const [columnNames, setColumnNames] = useState([]);
    const [ycolumn, setYcolumn] = useState();
    const [predInput, setPredInput] = useState("9,7.5,3.5");
    const [prediction, setPrediction] = useState("");
    const [performPred, setPerformedPred] = useState(false);
    useEffect(() => {
        if (csv == null)
            return;
        async function LoadColumnNames() {
            const columns = await csv.columnNames();
            setColumnNames(columns);
            setYcolumn(columns[columns.length - 1]);
        }
        LoadColumnNames();
    }, [csv, setColumnNames]);

    return (
        <Grid container>
            <Grid item md={6} xs={12}>
                <CsvReader />
                <CsvTable />
            </Grid>
            <Grid item md={6} xs={12}>
                {csv && ycolumn ? (
                    <div style={{ padding: '10px' }}>
                        {error && (
                            <Alert onClose={() => setError('')} severity="error">
                                {error}
                            </Alert>
                        )}
                        <Formik
                            enableReinitialize
                            initialValues={{
                                xColumns: columnNames,
                                selectedColumn: ycolumn,
                                l1: 0.0,
                                l2: 0.0,
                                batchSize: 16,
                                validationSplit: 10,
                                learningRate: 0.01,
                                epochs: 10,
                            }}
                            validate={values => {
                                const errors = {};
                                if (!values.selectedColumn) {
                                    errors.selectedColumn = 'Required';
                                }
                                if (values.l1 == null) {
                                    errors.l1 = 'Required';
                                }
                                if (values.l1 < 0) {
                                    errors.l1 = 'Invalid L1 value';
                                }
                                if (values.l2 == null) {
                                    errors.l2 = 'Required';
                                }
                                if (values.l2 < 0) {
                                    errors.l2 = 'Invalid L2 value';
                                }
                                if (!values.batchSize) {
                                    errors.batchSize = 'Required';
                                }
                                if (!values.validationSplit) {
                                    errors.validationSplit = 'Required';
                                }
                                if (values.validationSplit < 5) {
                                    errors.validationSplit = 'Invalid Validation Split';
                                }
                                if (!values.learningRate) {
                                    errors.learningRate = 'Required';
                                }
                                if (values.learningRate < 0 || values.learningRate > 1) {
                                    errors.learningRate = 'Invalid Learning Rate';
                                }
                                if (!values.epochs) {
                                    errors.epochs = 'Required';
                                }
                                if (values.epochs < 1) {
                                    errors.epochs = 'Invalid Number of Epochs';
                                }

                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                const submitFormHandler = async values => {
                                    let xCols = [...values.xColumns, values.selectedColumn]
                                    xCols = [...new Set(xCols)]
                                    console.log(xCols)
                                    try {
                                        setPerformedPred(false);
                                        await Perform(
                                            csv,
                                            [values.selectedColumn],
                                            xCols,
                                            values.l1,
                                            values.l2,
                                            values.epochs,
                                            values.batchSize,
                                            values.validationSplit,
                                            values.learningRate)
                                        setPerformedPred(true);
                                        setPredInput(await GetDataFromCSV(csv, 0, xCols, ycolumn));
                                    } catch (err) {
                                        console.error(err);
                                        setError('Error occored in Training');
                                        setPerformedPred(false);
                                    }
                                }
                                submitFormHandler(values);
                                setSubmitting(false)
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
                                                Select the attributes for training the model
                                        </Paper>
                                            <Grid container spacing={1}>
                                                {columnNames.map((column, index) =>
                                                    <Grid item xs={4} key={index}>
                                                        {column !== values.selectedColumn && (
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    checked={values.xColumns.includes(column)}
                                                                    color="default"
                                                                    name={column}
                                                                    onChange={(event) => {
                                                                        let array = values.xColumns;
                                                                        if (array.includes(event.target.name)) {
                                                                            const newArray = array.filter((col) => col !== event.target.name);
                                                                            setFieldValue('xColumns', newArray, false)
                                                                        } else {
                                                                            array.push(event.target.name)
                                                                            setFieldValue('xColumns', array, false)
                                                                        }
                                                                    }}
                                                                />}
                                                                label={column}
                                                            />
                                                        )}
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField id="select"
                                                label="Y Attribute" select
                                                fullWidth
                                                value={values.selectedColumn}
                                                name="selectedColumn"
                                                onChange={handleChange}
                                                variant="filled"
                                            >
                                                {columnNames.map((column, index) =>
                                                    <MenuItem key={index} value={column}>{column}</MenuItem>
                                                )}
                                            </TextField>
                                            <FormHelperText>Select a column</FormHelperText>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                variant="filled"
                                                label="L1"
                                                name="l1"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.l1}

                                            />
                                            <div style={{ margin: "10px", color: "red" }}>
                                                {errors.l1 && touched.l1 && errors.l1}
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                variant="filled"
                                                label="L2"
                                                name="l2"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.l2}
                                            />
                                            <div style={{ margin: "10px", color: "red" }}>
                                                {errors.l2 && touched.l2 && errors.l2}
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                variant="filled"
                                                label="Batch Size"
                                                name="batchSize"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.batchSize}
                                            />
                                            <div style={{ margin: "10px", color: "red" }}>
                                                {errors.batchSize && touched.batchSize && errors.batchSize}
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                variant="filled"
                                                label="Validation Split"
                                                name="validationSplit"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.validationSplit}
                                            />
                                            <div style={{ margin: "10px", color: "red" }}>
                                                {errors.validationSplit && touched.validationSplit && errors.validationSplit}
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                variant="filled"
                                                label="Learning Rate"
                                                name="learningRate"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.learningRate}
                                            />
                                            <div style={{ margin: "10px", color: "red" }}>
                                                {errors.learningRate && touched.learningRate && errors.learningRate}
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                variant="filled"
                                                label="Epochs"
                                                name="epochs"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.epochs}
                                            />
                                            <div style={{ margin: "10px", color: "red" }}>
                                                {errors.epochs && touched.epochs && errors.epochs}
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <div style={{ margin: '20px', textAlign: 'center' }}>
                                        <Button
                                            style={{ width: '100%' }}
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            disabled={isSubmitting}
                                        >
                                            Perform
                                    </Button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                        {
                            performPred &&
                            <>
                                <TextField
                                    variant="filled"
                                    label="Predictor"
                                    name="Predictor"
                                    value={predInput}
                                    onChange={(_) => setPredInput(_.target.value)}
                                />
                                <Button onClick={() => tfvis.visor().open()}>Show Charts</Button>
                                <Button onClick={async () => { setPrediction(''); setPrediction(await PredictValues(String(predInput).split(',').map(value => Number(value)))); }}>PREDICT</Button>
                            </>
                        }
                        {
                            performPred && prediction !== "" &&
                            <Alert onClose={() => { setPrediction('') }} severity="success">
                                The predicted value is {prediction}
                            </Alert>
                        }
                    </div>
                ) : (
                        <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                            Please select a dataset
                        </div>
                    )}
            </Grid>

        </Grid >
    )
}

