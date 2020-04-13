import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
// import logo from './logo.png'
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});

const Dashboard = () => {
  // eslint-disable-next-line
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <br />
          <Card className={classes.root} spacing={4}>
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
                  TensorFlow.js is a library for machine learning in JavaScript.
                  It is maintained by Google.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {/* <Link to="https://www.tensorflow.org/js" > */}
              <Button size="small" color="primary">
                <a href="https://www.tensorflow.org/js">See More</a>
              </Button>
              {/* </Link>  */}
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <br />
          <Card className={classes.root} spacing={4}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="./react.png"
                title="React JS"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  React
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  React is a JavaScript library for building user interfaces. It
                  is maintained by Facebook and a large Community.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {/* <Link to="https://www.tensorflow.org/js" > */}
              <Button size="small" color="primary">
                <a href="https://reactjs.org/">See More</a>
              </Button>
              {/* </Link>  */}
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <br />
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="./ml5.png"
                title="Ml5.JS"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  D3.JS
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  D3.js is a JavaScript library for producing dynamic,
                  interactive data visualizations in web browsers.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                <a href="https://d3js.org/">See More</a>
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <br />
          <Card className={classes.root} spacing={4}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="./material.png"
                title="Material UI"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  React
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Material UI provides React components for faster web
                  development , implementing Google's Material Design
                  specification
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              {/* <Link to="https://www.tensorflow.org/js" > */}
              <Button size="small" color="primary">
                <a href="https://material-ui.com/">See More</a>
              </Button>
              {/* </Link>  */}
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <br />
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="./vega.png"
                title="Vega.JS"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Vega
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  With Vega, you can describe the visual appearance and
                  interactive behavior of a visualization in a JSON format
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                <a href="https://vega.github.io/vega/">See More</a>
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
