import React, { useState, useEffect, useRef, useContext } from 'react';
import './kmeans.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';;

const Kmeans = () => {

    const kmeansFunction = () => {
        console.log('Function called');
    }

    return (
        <Grid container>
            <Grid item md={6} xs={12}>
                <Button onClick={kmeansFunction}>Click</Button>
            </Grid>
        </Grid>
    );
}

export default Kmeans;