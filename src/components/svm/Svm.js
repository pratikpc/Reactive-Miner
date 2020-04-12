import React from 'react';
import Grid from '@material-ui/core/Grid';
import CsvReader from '../utils/CsvReader';
import CsvTable from '../utils/CsvTable';

const Overview = () => {
    return (
        <div>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <CsvReader />
                    <CsvTable />
                </Grid>
                <Grid item md={6} xs={12}>
                    SVM
                </Grid>
            </Grid>
        </div>
    )
}

export default Overview;