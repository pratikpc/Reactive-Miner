import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import github from './github.png';
import db from './db.svg';
import lr from './lr.png';
import fuzzyc from './fuzzyc.png';
import svm from './svm.png';
import hc from './hc.png';
import knn from './knn.svg';
import pca from './pca.svg';
import dt from './dt.svg';
import kmeans from './kmeans.svg';
import logo from '../utils/logo.png';
import LandingItem from './LandingItem';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
      color: '#FFFFFF',
      paddingTop: '15px',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const Landing = () => {
    const classes = useStyles();
    let history = useHistory();
    
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
                    <div onClick={() => {history.push('/dashboard')}} style={{ paddingTop: '40px', textAlign: 'center' }}>
                        <img width="70" height="70" src={logo} alt="logo" />
                        <Typography style={{ paddingTop: '20px' }} variant="h5">
                            Reactive Miner
                        </Typography>
                        </div>
                </Grid>
                <LandingItem image={db} url="/dashboard" name="Dashboard" />
                <LandingItem image={lr} url="/linreg" name="Linear Regression" />
                <LandingItem image={svm} url="/svm" name="Support Vector Machine" />
                <LandingItem image={pca} url="/pca" name="Principal Component Analysis" />
                <LandingItem image={dt} url="/decision-tree" name="Decision Tree" />
                <LandingItem image={knn} url="/knn" name="K Nearest Neighbours" />
                <LandingItem image={hc} url="/hcluster" name="Hierarchical Clustering" />
                <LandingItem image={kmeans} url="/kmeans" name="KMeans Clustering" />
                <LandingItem image={fuzzyc} url="/fcmeans" name="Fuzzy Cmeans Clustering" />
                <Grid item lg={3} md={4} sm={6} xs={12}>
                    <div style={{ paddingTop: '80px', textAlign: 'center' }}>
                        <img src={github} width="90" height="90" alt="github" />
                        <Typography className={classes.root}>
                            <Link color="inherit" href="https://github.com/pratikpc/Reactive-Miner">
                                Github
                            </Link>
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Landing;
