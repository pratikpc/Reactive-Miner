import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import logo from './logo.png'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
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
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                        className={classes.media}
                        image="./tensorflow.png"
                        title="Tensorflow JS"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            TensorFlow.JS
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            TensorFlow.js is a library for machine learning in JavaScript
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                            <Link to="https://www.tensorflow.org/js" > See More </Link> 
                        </Button>
                    </CardActions>
                </Card>
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                        className={classes.media}
                        image="./ml5.png"
                        title="Ml5.JS"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Ml5.JS
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            The library provides access to machine learning algorithms and models in the browser, building on top of TensorFlow.js with no other external dependencies.
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                            <Link to="https://ml5js.org/" > See More </Link> 
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Dashboard;