import React, { useState, useEffect, useContext } from 'react';
import CsvReader from '../../utils/CsvReader';
import CsvTable from '../../utils/CsvTable';
import './kmeans.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { csvContext } from '../../context/csv-context';
import { ConvertCSVToRawArrays } from '../../../ML/utils';
import Plot from 'react-plotly.js';
import {KMeans} from 'shaman';

async function kmeansFunction(csv, selectedCols, plotData, setplotData, k = 3) {
    const [data, _] = await ConvertCSVToRawArrays(csv, [], selectedCols);
    console.log(selectedCols);
    console.log('Function called', data);

    const kmeans = new KMeans(k);

    // execute clustering using dataset
    kmeans.cluster(data, function (err, clusters, centroids) {
        // show any errors
        console.log(err);

        // dictionary for aux the indexes read
        const indexes = {
            X: 0,
            Y: 1,
        }

        // build centroids graph model
        const centroidTrace = {
            x: centroids.map(function (c) {
                return c[indexes["X"]]; 
            }),
            y: centroids.map(function (c) {
                return c[indexes["Y"]]; 
            }),
            mode: 'markers',
            type: 'scatter',
            name: 'Centroids',
            marker: {
                color: '#000000',
                symbol: 'cross',
                size: 10
            }
        };

        // adding centroids data on the plotData array
        setplotData(plotData = [centroidTrace]);
        // build clusters graph model
        clusters.forEach(function (cluster, index) {
            const trace = {
                x: cluster.map(function (c) {
                    return c[indexes["X"]];
                }),
                y: cluster.map(function (c) {
                    return c[indexes["Y"]];
                }),
                jitter: 0.3,
                mode: 'markers',
                type: 'scatter',
                name: 'Cluster ' + index
            }
            // add cluster graph data on plotData
            setplotData(plotData => [...plotData, trace]);
        });
    })
}

const Kmeans = () => {

    const [plotData, setplotData] = useState();
    const { csv } = useContext(csvContext);
    const [columnNames, setColumnNames] = useState([]);
    useEffect(() => {
        if (csv == null)
            return;
        async function LoadColumnNames() {
            const columns = await csv.columnNames();
            setColumnNames(columns);
            // setYcolumn(columns[columns.length - 1]);
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
                <Button onClick={async () => await kmeansFunction(csv, columnNames, plotData, setplotData)}>Click</Button>
                <Plot {...console.log(plotData)} data={plotData}/>
            </Grid>
        </Grid>
    );
}

export default Kmeans;