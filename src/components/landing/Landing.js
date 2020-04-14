import React from 'react';
import Grid from '@material-ui/core/Grid';
import lr from './lr.png';
import LandingItem from './LandingItem';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div 
            style={{ 
                padding: '10px',
                minHeight: '100vh',
                backgroundColor: 'black',
                color: 'white', 
            }}>
            <Grid container>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                    ok
                </Grid>
                <LandingItem image={lr} url="/linreg" name="Linear Regression" />
                <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Link to="/dashboard">sdad</Link>
                </Grid>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                    ok
                </Grid>
            </Grid>
        </div>
    )
}

export default Landing;