import React, { useState, useEffect, useRef, useContext } from 'react';
import { Formik } from 'formik';
import { csvContext } from '../../context/csv-context';
import LoadDataset from '../../utils/LoadDataset';
import Description from '../../utils/Description';
import { makeStyles } from '@material-ui/core/styles';
import TitleBar from '../../utils/TitleBar';
import figue from './hc-hook';
import Grid from '@material-ui/core/Grid';
import CsvReader from '../../utils/CsvReader';
import CsvTable from '../../utils/CsvTable';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import './Dendogram.css';

const useStyles = makeStyles(theme => ({
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formControl: {
        margin: theme.spacing(1),
        width: '80%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    form: {
        width: '90%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        marginLeft: '20px',
    },
    submit: {
        width: '100px',
    },
}));

const HierarchicalClustering = () => {
    const classes = useStyles();
    const [error, setError] = useState('')
    const { csv } = useContext(csvContext);
    const [columnNames, setColumnNames] = useState([]);
    const [label, setLabel] = useState();
    const dendoGram = useRef();
    const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

    useEffect(() => {
        if (csv == null) 
            return;
        async function LoadColumnNames() {
            const columns = await csv.columnNames();
            setColumnNames(columns);
            setLabel(columns[0]);
        }
        LoadColumnNames();
    }, [csv, setColumnNames]);

    return (
        <div>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <TitleBar name="Hieararchical Clustering" tags={['Clustering', 'Dendogram']} />
                    <CsvReader />
                    <CsvTable />
                </Grid>
                <Grid item md={6} xs={12}>    
                    <LoadDataset />    
                    <Description desc="hc" />            
                    {csv && columnNames && label ? (
                        <div style={{ padding: '10px' }}>
                        {error && (
                            <Alert onClose={() => setError('')} severity="error">
                                {error}
                            </Alert>
                        )}
                        <Formik
                            enableReinitialize
                            initialValues={{
                                vectors: columnNames,
                                label: label,
                                linkage: 0,
                                distance: 0,
                                withLabel: true,
                                withCentroid: false,
                                withDistance: false,
                                balanced: true,
                                space: 5
                            }}
                            validate={values => {
                                const errors = {};
                                if (!values.label) {
                                    errors.label = 'Required';
                                }
                                if (values.linkage < 0 || values.linkage > 2) {
                                    console.log("haha")
                                    errors.linkage = 'Required';
                                }
                                if (values.distance < 0 || values.distance > 2) {
                                    errors.distance = 'Required';
                                }
                                if (values.space !== 3 && values.space !== 5 && values.space !== 7 && values.space !== 9) {
                                    errors.space = 'Invalid value'
                                }

                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                const submitFormHandler = async values => {
                                    try {                                        
                                        let params = [...values.vectors, values.label]
                                        params = [...new Set(params)]
                                        params = params.filter((param) => param !== values.label)
                                        let data = await csv.toArray()
                                        let labels = [];
                                        let vectors = [];
                                        for (let i = 0 ; i < data.length ; i++) {
                                            labels[i] = data[i][values.label] ;
                                            vectors[i] = []
                                            params.forEach((param) => {
                                                vectors[i].push(data[i][param])
                                            }) 
                                        }
                                        let train = {'labels': labels , 'vectors': vectors}
                                        let root = figue.agglomerate(train['labels'], train['vectors'] , values.distance, values.linkage)
                                        let text = root.buildDendogram(values.space, values.balanced, values.withLabel, values.withCentroid, values.withDistance)
                                        console.log(root)
                                        dendoGram.current.innerText = text
                                        scrollToRef(dendoGram)
                                    } catch (err) {
                                        console.error(err);
                                        setError('Please Recheck your Provided Parameters');
                                    }
                                }
                                submitFormHandler(values);
                                setSubmitting(false)
                            }}
                        >{({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                        }) => (
                                <form className={classes.form} onSubmit={handleSubmit}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Paper style={{ backgroundColor: 'black', padding: '20px' }}>
                                                Select the numerical attributes
                                            </Paper>
                                            <Grid container spacing={1}>
                                                {columnNames.map((column, index) =>
                                                    <Grid item xs={12} key={index}>
                                                        {column !== values.label && (
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    checked={values.vectors.includes(column)}
                                                                    color="default"
                                                                    name={column}
                                                                    onChange={(event) => {
                                                                        let array = values.vectors;
                                                                        if (array.includes(event.target.name)) {
                                                                            const newArray = array.filter((col) => col !== event.target.name);
                                                                            setFieldValue('vectors', newArray, false)
                                                                        } else {
                                                                            array.push(event.target.name)
                                                                            setFieldValue('vectors', array, false)
                                                                        }
                                                                    }}
                                                                />}
                                                                label={column}
                                                            />
                                                        )}
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                        <Grid style={{ padding: '10px' }} item xs={12}>
                                            <hr />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField id="select"
                                                label="Label" select
                                                fullWidth
                                                value={values.label}
                                                name="label"
                                                onChange={handleChange}
                                                variant="filled"
                                            >
                                                {columnNames.map((column, index) =>
                                                    <MenuItem key={index} value={column}>{column}</MenuItem>
                                                )}
                                            </TextField>
                                            <FormHelperText>Select a Label</FormHelperText>
                                        </Grid>
                                        <Grid style={{ padding: '10px' }} item xs={12}>
                                            <hr />
                                        </Grid>
                                        <Grid style={{ marginTop: '10px' }} item xs={6}>
                                            <FormControl component="fieldset">
                                            <FormLabel component="legend">Linkage</FormLabel>
                                            <RadioGroup aria-label="linkage" name="linkage" value={values.linkage} onChange={(event) => {
                                                setFieldValue('linkage', parseInt(event.target.value), false)
                                            }}>
                                                <FormControlLabel value={0} control={<Radio />} label="Single-Linkage" />
                                                <FormControlLabel value={1} control={<Radio />} label="Complete-Linkage" />
                                                <FormControlLabel value={2} control={<Radio />} label="Average-Linkage" />
                                            </RadioGroup>
                                            </FormControl>
                                            <div style={{ margin: "10px", color: "red" }}>
                                                {errors.linkage && touched.linkage && errors.linkage}
                                            </div>
                                        </Grid>
                                        <Grid style={{ marginTop: '10px' }} item xs={6}>
                                            <FormControl component="fieldset">
                                            <FormLabel component="legend">Distance</FormLabel>
                                            <RadioGroup aria-label="distance" name="distance" value={values.distance} onChange={(event) => {
                                                setFieldValue('distance', parseInt(event.target.value), false)
                                            }}>
                                                <FormControlLabel value={0} control={<Radio />} label="Euclidian" />
                                                <FormControlLabel value={1} control={<Radio />} label="Manhattan" />
                                                <FormControlLabel value={2} control={<Radio />} label="Maximum" />
                                            </RadioGroup>
                                            </FormControl>
                                            <div style={{ margin: "10px", color: "red" }}>
                                                {errors.distance && touched.distance && errors.distance}
                                            </div>
                                        </Grid>
                                        <Grid style={{ padding: '10px' }} item xs={12}>
                                            <hr />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                control={<Checkbox checked={values.withLabel} onChange={handleChange} name="withLabel" />}
                                                label="Show Labels"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                control={<Checkbox checked={values.withDistance} onChange={handleChange} name="withDistance" />}
                                                label="Show Distance"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                control={<Checkbox checked={values.withCentroid} onChange={handleChange} name="withCentroid" />}
                                                label="Show Centroid"
                                            />
                                        </Grid> 
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                control={<Checkbox checked={values.balanced} onChange={handleChange} name="balanced" />}
                                                label="Balance Dendogram"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField id="select"
                                                    style={{ width: '90%' }}
                                                    label="Space" select
                                                    fullWidth
                                                    value={values.space}
                                                    name="space"
                                                    onChange={(event) => {
                                                        setFieldValue('space', parseInt(event.target.value), true)
                                                    }}
                                                    variant="filled"
                                                >
                                                    <MenuItem value={3}>3</MenuItem>
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={7}>7</MenuItem>
                                                    <MenuItem value={9}>9</MenuItem>
                                                </TextField>
                                                <FormHelperText>Minimum spacing between nodes</FormHelperText>
                                                <div style={{ margin: "10px", color: "red" }}>
                                                    {errors.space && touched.space && errors.space}
                                                </div>
                                        </Grid>
                                        
                                    </Grid>
                                    <div style={{ margin: '10px', textAlign: 'center' }}>
                                        <Button
                                            style={{ width: '100%' }}
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            disabled={isSubmitting}
                                        >
                                            CLUSTER DATA AND DISPLAY DENDOGRAM
                                    </Button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                        </div>
                    ) : (
                        <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                            Please select a dataset
                        </div>
                    )}
                </Grid>
                {csv && label && (
                    <Paper style={{ width: '100%', margin: '20px', padding: '20px', textAlign: 'center', backgroundColor: '#000000' }}>
                        <Typography variant="h4" gutterBottom>
                            Dendogram
                        </Typography>
                    </Paper>
                )}
                <div className="ddg-wrapper">
                    <pre className="ddg" ref={dendoGram} />
                </div>
            </Grid>
        </div>
    )
}

export default HierarchicalClustering;