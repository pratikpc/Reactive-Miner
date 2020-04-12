import React, { useState, useEffect, useContext } from 'react';
import CsvReader from '../../utils/CsvReader';
import CsvTable from '../../utils/CsvTable';
import './kmeans.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { csvContext } from '../../context/csv-context';
import { ExtractSelectedLabelsFromCSV } from '../../../ML/utils';

async function kmeansFunction(csv, selectedCols) {
    const data = await ExtractSelectedLabelsFromCSV(csv, selectedCols);
    console.log(selectedCols);
    console.log('Function called', data);
}

const Kmeans = () => {

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
                <Button onClick={kmeansFunction(csv, columnNames)}>Click</Button>
            </Grid>
        </Grid>
    );
}

export default Kmeans;