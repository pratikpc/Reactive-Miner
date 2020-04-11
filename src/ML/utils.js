import * as tf from "@tensorflow/tfjs";

export function Normalize(tensor) {
    return tf.tidy(() => {
        const max = tensor.max();
        const min = tensor.min();
        const normalized = NormalizeValRaw(max, min, tensor);
        return { max, min, value: normalized };
    });
}
export function NormalizeValRaw(max, min, value) {
    return tf.tidy(() => {
        const std = max.sub(min)
        const num = value.sub(min)
        const normalized = num.div(std)
        return normalized;
    });
}
export function NormalizeVar(val, pred) {
    return tf.tidy(() => { return NormalizeValRaw(val.max, val.min, pred); })
}
export function ScaleBackValRaw(max, min, pred) {
    return tf.tidy(() => {
        const std = max.sub(min)
        const num = pred.mul(std)
        const scaled = num.add(min)
        return scaled;
    });
}
export function ScaleBackValWithTensor(val, pred) {
    return tf.tidy(() => {
        return ScaleBackValRaw(val.max, val.min, tf.tensor(pred))
    });
}
export function ScaleBackVal(val, pred) {
    return tf.tidy(() => {
        return ScaleBackValRaw(val.max, val.min, pred);
    });
}

export function InputDimSize(tensor) {
    return tf.tidy(() => tensor.shape[1])
}
export function RootMeanSquareError(yTrue, yPred) {
    return tf.tidy(() => {
        // Scale the the first column (0-1 shape indicator) of `yTrue` in order
        // to ensure balanced contributions to the final loss value
        // from shape and bounding-box predictions.
        return tf.sqrt(tf.metrics.meanSquaredError(yTrue, yPred));
    });
}

export function DiposeValue(val) {
    val.value.dispose(); val.max.dispose(); val.min.dispose();;
}
function ExtractInformation(raw, data) {
    const value = {
        value: [],
        max: [],
        min: []
    };
    for (let i = 0; i < data.length; ++i)
        value.value.push([]);

    for (const colName in raw) {
        const max = raw[colName].max;
        const min = raw[colName].min;
        value.max.push(max);
        value.min.push(min);
        for (let i = 0; i < raw[colName].value.length; ++i) {
            raw[colName].value[i] = (raw[colName].value[i] - min) / (max - min)
            value.value[i].push(raw[colName].value[i]);
        }
    }
    value.max = tf.tensor(value.max);
    value.min = tf.tensor(value.min);
    value.value = tf.tensor(value.value);
    return value;
}

export async function SplitIntoInputAndLabel(data, labelCol) {
    let x_raw = {};
    let y_raw = {};

    for (const kv of data)
        for (const colName in kv) {
            const value = kv[colName];
            if (labelCol.includes(colName)) {
                if (y_raw[colName] == null)
                    y_raw[colName] = { value: [], min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }
                y_raw[colName].max = Math.max(y_raw[colName].max, value);
                y_raw[colName].min = Math.min(y_raw[colName].min, value);
                y_raw[colName].value.push(value);
            } else {
                if (x_raw[colName] == null)
                    x_raw[colName] = { value: [], min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }
                x_raw[colName].value.push(value);
                x_raw[colName].max = Math.max(x_raw[colName].max, value);
                x_raw[colName].min = Math.min(x_raw[colName].min, value);
            }
        }
    return tf.tidy(() => {
        const x = ExtractInformation(x_raw, data)
        const y = ExtractInformation(y_raw, data)
        return [x, y];
    });
}