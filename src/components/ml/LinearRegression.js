import React from 'react';
import Button from '@material-ui/core/Button';
import { csvContext } from '../context/csv-context';
import * as Utils from "./utils";
import { SplitIntoInputAndLabel, ScaleBackVal, NormalizeVar, DiposeValue } from '../../ML/utils';
import * as LinearRegressionApply from "../../ML/linreg";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "@tensorflow/tfjs-core";
import Grid from '@material-ui/core/Grid';
import CsvReader from '../utils/CsvReader';
import CsvTable from '../utils/CsvTable';

let model = null;
const lossContainer = { name: 'show.loss', tab: 'Loss' };
const accContainer = { name: 'show.accContainer', tab: 'accContainer' };

async function PredictSingleValue(model, data, xCols, x, y) {
    const val_pred = Utils.CreateTensor(data, xCols);
    const pred = await val_pred.data();
    const val_pred_norm = NormalizeVar(x, val_pred);
    const prediction = LinearRegressionApply.Predict(model, await val_pred_norm.array());
    const resT = ScaleBackVal(y, prediction);
    const res = (await resT.array())[0];
    val_pred.dispose();
    val_pred_norm.dispose();
    resT.dispose();
    prediction.dispose();
    return [pred, res];
}

async function Perform(csv, labelCol, columnNames, l1, l2, epochs, batchSize, validationSplit, learningRate) {
    const data = await csv.toArray();
    console.log(labelCol);
    const [x, y] = await SplitIntoInputAndLabel(data, labelCol);
    model = await LinearRegressionApply.Fit(x.value, y.value, async (logs) => {
        await tfvis.show.history(lossContainer, logs, ["rms_loss", "val_rms_loss"]);
        await tfvis.show.history(accContainer, logs, ["rmse", "val_rmse"]);
    }, l1, l2, epochs, batchSize, validationSplit, learningRate);
    model.summary();
    await tfvis.show.modelSummary({ name: 'Model', tab: 'Model' }, model);
    {
        const xCols = Utils.SetDifference(columnNames, labelCol);
        const [val_pred, prediction] = await PredictSingleValue(model, data[0], xCols, x, y);
        console.log("Prediction for", val_pred, "is", prediction);
    }

    const [preds, x_vals, y_vals] = await LinearRegressionApply.PredictDataset(model, x, y);
    await Utils.DrawChart(x_vals, y_vals, preds);
    DiposeValue(x);
    DiposeValue(y);
    // model.dispose();
    console.log("Final Memory Usage", tf.memory());
    return model;
}

export default function LinearRegression() {
    const { csv } = React.useContext(csvContext);
    const [columnNames, setColumnNames] = React.useState([]);
    const [selectedColumn, setSelectedColumns] = React.useState("");
    const [l1, setL1] = React.useState(0);
    const [l2, setL2] = React.useState(0);
    const [batchSize, setBatchSize] = React.useState(16);
    const [validationSplit, setValidationSplit] = React.useState(10);
    const [learningRate, setLearningRate] = React.useState(0.01);
    const [epochs, setEpochs] = React.useState(50);

    React.useEffect(() => {
        if (csv == null)
            return;
        async function LoadColumnNames() {
            const columns = await csv.columnNames();
            setColumnNames(columns);
            setSelectedColumns(columns[columns.length - 1]);
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
                <Button variant="contained" color="primary" onClick={async () => await Perform(csv, [selectedColumn], columnNames, l1, l2, epochs, batchSize, validationSplit, learningRate)} >
                    Perform
                </Button>
            </Grid>
        </Grid>
    )
}

