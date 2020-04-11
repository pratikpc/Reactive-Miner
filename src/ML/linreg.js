import * as tf from "@tensorflow/tfjs";
import { InputDimSize, RootMeanSquareError } from "./utils";

export async function Fit(
    xTrain, yTrain,
    OnEpochEndCallBack = async (_) => { },
    l1 = 0.0, l2 = 0.0,
    epochs = 100, batchSize = 16, validationSplit = 10) {

    const regularizer = tf.regularizers.l1l2({
        l1: l1,
        l2: l2
    })
    const units = InputDimSize(xTrain);
    console.log(xTrain.shape, yTrain.shape);
    const model = tf.sequential();
    model.add(
        tf.layers.dense({
            units: units, // Simple Linear Regression
            inputShape: [units],
            kernelRegularizer: regularizer
        })
    );
    model.add(tf.layers.dense({ units: yTrain.shape[1] }));
    model.compile({
        loss: RootMeanSquareError,
        optimizer: tf.train.sgd(0.01),
        metrics: [tf.metrics.meanAbsoluteError]
    });
    const logs = [];

    await model.fit(xTrain, yTrain, {
        batchSize: batchSize,
        epochs: epochs,
        shuffle: true,
        validationSplit: (validationSplit / 100), // In Percentage
        callbacks: {
            onEpochEnd: async (epoch, log) => {
                logs.push({
                    rmse: log.loss,
                    val_rmse: log.val_loss,
                    mae: log.meanAbsoluteError$1,
                    val_mae: log.val_meanAbsoluteError$1,
                    epoch: epoch
                });
                // Perform Action with All Train Logs
                await OnEpochEndCallBack(logs);
            }
        }
    }
    );
    for (const weight of model.weights) {
        console.log(weight.name, weight.val.dataSync());
    }
    return model;
}

export function Predict(model, value, args = () => { }) {
    return model.predict(tf.tensor([value]), args);
}
export function Evaluate(model, x, y, args = () => { }) {
    return model.evaluate(x, y);
}