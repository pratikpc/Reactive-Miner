import React from 'react';
import Button from '@material-ui/core/Button';
import { csvContext } from '../context/csv-context';
import { Redirect } from 'react-router-dom';
import * as Utils from "./utils";
import { SplitIntoInputAndLabel, NormalizeVal, ScaleBackVal } from '../../ML/utils';
import * as LinearRegressionApply from "../../ML/linreg";
import { tensor } from '@tensorflow/tfjs';
import * as tfvis from "@tensorflow/tfjs-vis";

const lossContainer = { name: 'show.loss', tab: 'Loss' };
const accContainer = { name: 'show.accContainer', tab: 'accContainer' };

async function Perform(csv, labelCol, columnNames) {
    const data = await csv.toArray();
    const [x, y] = await SplitIntoInputAndLabel(data, labelCol);
    const model = await LinearRegressionApply.Fit(x.value, y.value, async (logs) => {
        await tfvis.show.history(lossContainer, logs, ["rmse", "val_rmse"]);
        await tfvis.show.history(accContainer, logs, ["mae", "val_mae"]);
    });
    {
        const xCols = Utils.SetDifference(columnNames, labelCol);
        const val_pred = Utils.CreateTensor(data[0], xCols);
        console.log(x.max.shape, y.max.shape, x.min.shape);
        const val_pred_norm = await NormalizeVal(x.max, x.min, val_pred).array();
        const prediction = LinearRegressionApply.Predict(model, val_pred_norm);
        console.log("Prediction for", val_pred.dataSync()[0], "is", ScaleBackVal(y, prediction).arraySync()[0], ((prediction.dataSync()[0]) * (y.max.dataSync()[0] - y.min.dataSync()[0])) + y.min.dataSync()[0]);
    }
    model.summary();
    await tfvis.show.modelSummary({ name: 'Model', tab: 'Model' }, model);
    {
        let preds = [];
        const val_pred_norms = await x.value.array();
        for (const val_pred_norm of val_pred_norms) {
            const pred = LinearRegressionApply.Predict(model, val_pred_norm).array();
            preds.push(pred);
        }
        preds = await Promise.all(preds);
        preds = preds.map(pred => pred[0]);
        preds = await ScaleBackVal(y, tensor(preds)).array();
        const y_vals = await ScaleBackVal(y, y.value).array();
        const x_vals = (await ScaleBackVal(x, x.value).array());
        console.log(preds, x_vals, y_vals);
        await Utils.DrawChart(x_vals, y_vals, preds);
    }
    return { x, y };
}
export default function LinearRegression() {
    const { csv } = React.useContext(csvContext);
    const [columnNames, setColumnNames] = React.useState([]);
    const [selectedColumn, setSelectedColumns] = React.useState([]);
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

    if (csv == null)
        return <Redirect to="/overview" />

    return <>
        hello
        <Button onClick={async () => await Perform(csv, selectedColumn, columnNames)} >
            Perform
            </Button>
    </>
}

