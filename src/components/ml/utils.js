import * as tfdata from "@tensorflow/tfjs-data";
import * as tfcore from "@tensorflow/tfjs-core";
import * as tfvis from "@tensorflow/tfjs-vis";

export function ReadCSV(url, delimiter) {
    return tfcore.tidy(() => {
        const data = tfdata.csv(url, {
            hasHeader: true,
            delimiter: delimiter
        });
        return data;
    })
}
export function SetDifference(a, b) {
    return a.filter(x => !b.includes(x));
}

export function RemoveNode(node) {
    const nodeV = document.getElementById(node);
    if (nodeV != null)
        nodeV.remove();
}

export function CreateTensor(data, labels) {
    const arr = [];
    return tfcore.tidy(() => {
        for (const label of labels)
            arr.push(data[label]);
        return tfcore.tensor(arr);
    });
}

export function Zip(a, b) {
    const c = a.map(function (e, i) {
        return [e, b[i]];
    });
    return c;
}
export async function DrawChart(surface, x, y, preds) {
    const series_names = [];
    const series = [];
    for (let i = 0; i < x[0].length; ++i) {
        series_names.push("X " + i + " Y");
        series.push(Zip(x, y).map(([x, y]) => { return { x: x[i], y }; }));
        series_names.push("X " + i + " PRED");
        series.push(Zip(x, preds).map(([x, y]) => { return { x: x[i], y }; }));
    }
    const data = { values: series, series: series_names }
    await tfvis.render.scatterplot(surface, data);
}
