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
export function VisorStop() {
    return RemoveNode("tfjs-visor-container");
}
export function GemerateChartForLinearRegression(name, tab, x, y, preds) {
    const chart = {
        name: name,
        tab: tab,
        values: []
    };
    for (let i = 0; i < x[0].length; ++i) {
        // Chart the Inputs with Label
        chart.values.push({
            name: "X " + (i + 1) + " Y",
            // Values to Chart
            values: Zip(x, y).map(([x, y]) => { return { x: x[i], y }; })
        });
        // Chart the Inputs with Predictions
        chart.values.push({
            name: "X " + i + " PREDs",
            // Values to Chart
            values: Zip(x, preds).map(([x, y]) => { return { x: x[i], y }; })
        });
    }
    return chart;
}
export function GenerateChartForCluster(centroids, clusters, xIdx, yIdx) {
    const chart = { name: "Cluster", tab: "Cluster Vis", values: [] };
    for (let i = 0; i < clusters.length; ++i)
        chart.values.push({
            name: 'Cluster ' + i,
            values: clusters[i].map(cluster => { return { x: cluster[xIdx], y: cluster[yIdx] } })
        });
    for (let i = 0; i < centroids.length; ++i) {
        chart.values.push({
            name: 'Centroid ' + i,
            values: [{ x: centroids[i][xIdx], y: centroids[i][yIdx] }]
        });
    }
    return chart;
}
export async function DrawBarChart(name, tab, values) {
    const data = values.map((value, index) => { return { index, value } });
    // Render to visor
    const surface = { name: name, tab: tab };
    tfvis.render.barchart(surface, data);
}
export async function DrawScatterPlot(chart) {
    const series = chart.values.map(value => value.values);
    const series_names = chart.values.map(value => value.name);
    const data = { values: series, series: series_names }
    await tfvis.render.scatterplot({ name: chart.name, tab: chart.tab }, data);
}
