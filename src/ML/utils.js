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
export async function FindArgMax(values, axis = 1) {
    const valuesT = tf.tensor(values);
    const argMaxT = valuesT.argMax(axis);
    const argMax = await argMaxT.array();
    valuesT.dispose();
    argMaxT.dispose();
    return argMax;
}
export function DisposeValue(val) {
    val.value.dispose();
    val.max.dispose();
    val.min.dispose();
}
export function DisposeValues(...vals) {
    for (const val of vals)
        DisposeValue(val);
}
export function ConvertClusterIconsToData(clusterIds, k, data) {
    let clusters = [];
    for (let i = 0; i < k; ++i)
        clusters.push([]);
    for (let i = 0; i < clusterIds.length; ++i) {
        const cluster = clusterIds[i];
        const value = data[i];
        clusters[cluster].push(value);
    }
    return clusters;
}
export async function ExtractSelectedLabelsFromCSV(csv, selectedCols = []) {
    const data = await csv.toArray();
    return ExtractSelectedLabels(data, selectedCols);
}
export function ExtractSelectedLabels(data, selectedCols = []) {
    if (selectedCols.length === 0)
        return data;
    const results = [];
    for (const kv of data) {
        const result = {};
        for (const colName in kv) {
            if (!selectedCols.includes(colName))
                continue;
            const value = kv[colName];
            result[colName] = value;
        }
        results.push(result);
    }
    return results;
}



export async function ConvertCSVToRawArrays(csv, labelCol, allCols = [], normalize = false) {
    const data = await csv.toArray();
    // const data = nm(dat)
    // console.log(data)
    const [xT, yT] = SplitIntoInputAndLabel(data, labelCol, allCols, normalize);

    const x = await xT.value.array();
    const y = await yT.value.array();
    // console.log(x);

    DisposeValues(xT, yT);
    return [x, y];
}
export async function ConvertCSVToSingleArray(csv, selectedCols = [], normalize = false) {
    const data = await csv.toArray();
    const raw = await ExtractSelectedLabels(data, selectedCols);
    const values = [];
    for (const rawV of raw) {
        const value = [];
        for (const key in rawV)
            value.push(rawV[key]);
        values.push(value);
    }
    return values;
}
function ExtractInformation(raw, data, normalize = true) {
    return tf.tidy(() => {
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
                if (normalize)
                    raw[colName].value[i] = (raw[colName].value[i] - min) / (max - min)
                value.value[i].push(raw[colName].value[i]);
            }
        }
        value.max = tf.tensor(value.max);
        value.min = tf.tensor(value.min);
        value.value = tf.tensor(value.value);
        return value;
    });
}
export function ArrayRemoveColumn(array, remIdx = []) {
    return array.map((arr) => {
        return arr.filter((_, idx) => !remIdx.includes(idx));
    });
};
export function SplitIntoInputAndLabel(data, labelCol, allCols = [], normalize = true) {
    return tf.tidy(() => {
        let x_raw = {};
        let y_raw = {};

        for (const kv of data)
            for (const colName in kv) {
                if (allCols.length !== 0 && !allCols.includes(colName)) {
                    continue;
                }
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
        const x = ExtractInformation(x_raw, data, normalize)
        const y = ExtractInformation(y_raw, data, normalize)
        return [x, y];
    });
}