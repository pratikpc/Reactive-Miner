import React from 'react';
import Grid from '@material-ui/core/Grid';
import CsvReader from './CsvReader';
import CsvTable from './CsvTable';
import LoadDataset from './LoadDataset';

const Overview = () => {
    return (
        <div>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <CsvReader />
                    <CsvTable />
                </Grid>
                <Grid item md={6} xs={12}>
                    <LoadDataset />
                </Grid>
            </Grid>
        </div>
    )
}

export default Overview;