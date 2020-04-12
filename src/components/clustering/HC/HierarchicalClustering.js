import React, { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import figue from './hc-hook';
import CsvReader from '../../utils/CsvReader';
import CsvTable from '../../utils/CsvTable';

const HierarchicalClustering = () => {
    return (
        <div>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <CsvReader />
                    <CsvTable />
                </Grid>
                <Grid item md={6} xs={12}>                    
                    <div>
            
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default HierarchicalClustering;