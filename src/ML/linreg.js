import * as tf from "@tensorflow/tfjs";
import { InputDimSize as TensorDimSize, RootMeanSquareError, ScaleBackVal, ScaleBackValWithTensor } from "./utils";

export function CreateModel(outs, inputs, l1, l2, learningRate) {
    return tf.tidy(() => {
        const regularizer = tf.regularizers.l1l2({
            l1: l1,
            l2: l2
        });
        const model = tf.sequential();
        model.add(
            tf.layers.dense({
                units: outs, // Simple Linear Regression
                inputShape: [inputs],
                kernelRegularizer: regularizer
            })
        );
        model.compile({
            loss: RootMeanSquareError,
            optimizer: tf.train.sgd(learningRate),
            metrics: [RootMeanSquareError]
        });
        return model;
    });
}
export async function Fit(
    xTrain, yTrain,
    OnEpochEndCallBack = async (_) => { },
    l1 = 0.0, l2 = 0.0,
    epochs = 100, batchSize = 16, validationSplit = 10,
    learningRate = 0.01) {

    const model = CreateModel(TensorDimSize(yTrain), TensorDimSize(xTrain), l1, l2, learningRate);
    const logs = [];

    await model.fit(xTrain, yTrain, {
        batchSize: batchSize,
        epochs: epochs,
        shuffle: true,
        validationSplit: (validationSplit / 100), // In Percentage
        callbacks: {
            onEpochEnd: async (epoch, log) => {
                logs.push({
                    rms_loss: log.loss,
                    val_rms_loss: log.val_loss,
                    epoch: epoch
                });
                // Perform Action with All Train Logs
                await OnEpochEndCallBack(logs);
            }
        }
    });
    return model;
}

export function Predict(model, value, args = () => { }) {
    return tf.tidy(() => {
        return model.predict(tf.tensor([value]), args);
    });
}
export function Evaluate(model, x, y, args = () => { }) {
    return tf.tidy(() => {
        return model.evaluate(x, y, args);
    });
}
export async function PredictWithScaling(model, x, y) {
    const predT = Predict(model, x);
    const scaledT = ScaleBackVal(y, predT);
    predT.dispose();
    const prediction = (await scaledT.array())[0];
    scaledT.dispose();
    return prediction;
}
export async function PredictDataset(model, x, y) {
    let preds_list = [];
    for (const val of await x.value.array()) {
        const pred = Predict(model, val);
        preds_list.push(pred);
    }
    let preds_raw = preds_list.map(pred => pred.array());
    preds_raw = await Promise.all(preds_raw);
    preds_raw = preds_raw.map(pred => pred[0]);

    for (const pred_dispose of preds_list)
        pred_dispose.dispose();
    const predsT = ScaleBackValWithTensor(y, preds_raw);
    const preds = await predsT.array();

    const x_valsT = ScaleBackVal(x, x.value);
    const x_vals = await x_valsT.array();

    const y_valsT = ScaleBackVal(y, y.value);
    const y_vals = await y_valsT.array();

    predsT.dispose();
    x_valsT.dispose();
    y_valsT.dispose();
    console.log(preds, x_vals, y_vals);
    return [preds, x_vals, y_vals]
}
