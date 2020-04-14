import React from 'react';
import { useHistory } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GitHubIcon from "@material-ui/icons/GitHub";

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  button: {
    margin: theme.spacing(1),
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('lg')]: {
      paddingTop: "64px",
    },
  },
}));

const SideDrawer = props => {
  let history = useHistory();
  const classes = useStyles();
  const theme = useTheme();

  const pushLink = link => {
    history.push(link);
    props.handleDrawerToggle();
  }

  const drawer = (
    <div>
      <ListItem classes={{ root: classes.root }} button>
        <Typography style={{ fontSize: '20px', fontWeight: '500', color: 'white' }}>
          Algorithms
          </Typography>
      </ListItem>
      <Divider />
      <List>
        <ListItem button onClick={() => { pushLink('/dashboard') }}>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListSubheader component="div">
          REGRESSION
          </ListSubheader>
        <ListItem button onClick={() => { pushLink('/linreg') }}>
          <ListItemText primary="Linear Regression" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListSubheader component="div">
          CLASSIFICATION
          </ListSubheader>
        <ListItem button onClick={() => { pushLink('/decision-tree') }}>
          <ListItemText primary="Decision Tree" />
        </ListItem>
        <ListItem button onClick={() => { pushLink('/svm') }}>
          <ListItemText primary="Support Vector Machine" />
        </ListItem>
        <ListItem button onClick={() => { pushLink('/pca') }}>
          <ListItemText primary="PCA" />
        </ListItem>
        <ListItem button onClick={() => { pushLink('/knn') }}>
          <ListItemText primary="KNN Classifier" />
        </ListItem>
      </List>
      <Divider />
      <Divider />
      <List>
        <ListSubheader component="div">
          CLUSTERING
          </ListSubheader>
        <ListItem button onClick={() => { pushLink('/fcmeans') }}>
          < ListItemText primary="FC Means" />
        </ListItem>
        <ListItem button onClick={() => { pushLink('/kmeans') }}>
          <ListItemText primary="KMeans" />
        </ListItem>
        <ListItem button onClick={() => { pushLink('/hcluster') }}>
          <ListItemText primary="Hierarchical Clustering" />
        </ListItem>
      </List>
      <Divider />
      <Divider />
      <List>
        <ListSubheader component="div">
          GitHub
        </ListSubheader>
        <ListItem button onClick={() => { window.location.href = 'https://github.com/pratikpc/Reactive-Miner' }}>
          <GitHubIcon />
          < ListItemText style={{paddingLeft: 10}} primary="GitHub" />
        </ListItem>
      </List>
      <Divider />
      <Divider />
    </div >
  );

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden lgUp>
        <Drawer
          container={props.container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={props.mobileOpen}
          onClose={props.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default SideDrawer;