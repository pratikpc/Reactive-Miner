import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import logo from './logo.png'

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
});

const Dashboard = () => {
    // eslint-disable-next-line
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item md={6} xs={12}>
                <div style={{ textAlign: 'center' }}>
                    <img className="dashboard-img" src={logo} alt="dashboard-log" />
                </div>
            </Grid>
            <Grid item md={6} xs={12}>
            
            </Grid>
        </Grid>
    )
}

export default Dashboard;