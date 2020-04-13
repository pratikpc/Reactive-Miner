import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import SaveIcon from '@material-ui/icons/Save';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { blue } from '@material-ui/core/colors';

const DATASETS_URL = process.env.PUBLIC_URL + '/datasets.json';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        color: '#000000',
        backgroundColor: '#90caf9'
    },
    fileButton: {
        marginRight: theme.spacing(1),
    },
    title: {
        flexGrow: 1,
    },
}));

const LoadDatasetDialog = props => {
    const classes = useStyles();
    const { onClose, open, datasets } = props;

    return (
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
            <AppBar className={classes.appBar} position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.fileButton} color="inherit" aria-label="menu">
                        <FolderIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Datasets Available
                    </Typography>
                </Toolbar>
            </AppBar>
            <List>
                {datasets.map((dataset, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                        <Avatar>
                            <FolderIcon />
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={dataset.name}
                        />
                        <Avatar>
                            <IconButton style={{ color: 'black', marginRight: '0px' }} edge="end" aria-label="load">
                                <SaveIcon />
                            </IconButton>
                        </Avatar>

                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="download">
                                <SaveAltIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    )
}

LoadDatasetDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};


const LoadDataset = () => {
    const [open, setOpen] = useState(false);
    const [datasetFiles, setDatasetFiles] = useState();

    useEffect(() => {
        const fetchDatasets = async () => {
            const response = await fetch(DATASETS_URL);
            setDatasetFiles(await response.json());
        }
        fetchDatasets();
    }, [])

    const handleClickOpen = async () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    return (
        <div>
            {datasetFiles && (
                <div>
                    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                        Open simple dialog
                    </Button>
                    <LoadDatasetDialog open={open} onClose={handleClose} datasets={datasetFiles} />
                </div>
            )}
        </div>
    );
}

export default LoadDataset;