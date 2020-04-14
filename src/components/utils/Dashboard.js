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
import logo from "./logo.png";
import "./Dashboard.css";

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    height: 370
  },
  divcon: {
    paddingLeft: 20,
    paddingRight: 20
  },
  media: {
    height: 180
  }
});

const Dashboard = () => {
  // eslint-disable-next-line
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();

  return (
    <div>
    <div className={classes.divcon}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <br />
          <Card className={classes.root} spacing={4}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={require("./images/tensorflow.png")}
                title="Tensorflow JS"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  TensorFlow.JS
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  TensorFlow.js is an hardware-accelerated JavaScript library
                  for training and deploying ML models.
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
                image={require("./images/react.png")}
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
                image={require("./images/d3.png")}
                title="D3.JS"
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
                image={require("./images/materialui.png")}
                title="Material UI"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Material UI
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
      </Grid>
    </div>
    <div >
      <br />
    <img class="center" src={logo} alt="cannot find" />
    </div>
    </div>
  );
};

export default Dashboard;
