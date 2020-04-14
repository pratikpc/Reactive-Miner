import React, { useState, useEffect, useRef } from 'react';
import MUIDataTable from "mui-datatables";
import {KNNVisualization} from './d3knn';
import LoadDataset from '../utils/LoadDataset';
import Description from '../utils/Description';
import TitleBar from '../utils/TitleBar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';

const KNN = () => {
    const [params, setParams] = useState({
        displayWidth: Math.min(350, window.innerWidth - 10),
        displayHeight: 450,
        types: ['A', 'B'],
        dataSetSize: 250,
        k: 10,
    })

    const knn = useRef();

    const [data, setData] = useState(null)
    useEffect(() => {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
          function createRandomEllipsoidCoordinates(width, height, cx, cy) {
            const rho = Math.sqrt(Math.random());
            const phi = Math.random() * Math.PI * 2;
            const rands = {
              x: getRandomInt(-width / 2, width / 2),
              y: getRandomInt(-height / 2, height / 2)
            };
            const x = (rho * Math.cos(phi) * width) / 2 + cx + rands.x;
            const y = (rho * Math.sin(phi) * height) / 2 + cy + rands.y;
            return { x, y };
        }

        function createRandomData(displayWidth, displayHeight, dataSetSize, types) {
            const ellipsoidOptions = {
                A: {
                    width: displayWidth / 3,
                    height: displayWidth / 3,
                    cx: displayWidth / 3,
                    cy: displayHeight / 3
                },
                B: {
                    width: displayWidth / 2.5,
                    height: displayWidth / 2.5,
                    cx: displayWidth * 0.663,
                    cy: displayHeight * 0.66
                }
            };
            return Array.apply(null, Array(dataSetSize)).map((d) => {
                const type = Math.random() > 0.5 ? types[0] : types[1];
                const { width, height, cx, cy } = ellipsoidOptions[type];
                const { x, y } = createRandomEllipsoidCoordinates(width, height, cx, cy);
                return { x, y, type };
            });
        }
        const options = {
            rootNode: '#knn',
            width: params.displayWidth,
            height: params.displayHeight,
            backgroundColor: 'black',
            circleFill: '#3fe4h2',
            circleStroke: 'white' 
        };
        knn.current.innerHTML = null;
        let vis
        if (!data) {
            let dataset = createRandomData(params.displayWidth, params.displayHeight, params.dataSetSize, params.types);
            setData(dataset)
            vis = new KNNVisualization(dataset, options, params.types, params.k);
        } else {
            vis = new KNNVisualization(data, options, params.types, params.k);
        }
        vis.draw();
    }, [params, data])


    useEffect(() => {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
          function createRandomEllipsoidCoordinates(width, height, cx, cy) {
            const rho = Math.sqrt(Math.random());
            const phi = Math.random() * Math.PI * 2;
            const rands = {
              x: getRandomInt(-width / 2, width / 2),
              y: getRandomInt(-height / 2, height / 2)
            };
            const x = (rho * Math.cos(phi) * width) / 2 + cx + rands.x;
            const y = (rho * Math.sin(phi) * height) / 2 + cy + rands.y;
            return { x, y };
        }

        function createRandomData(displayWidth, displayHeight, dataSetSize, types) {
            const ellipsoidOptions = {
                A: {
                    width: displayWidth / 3,
                    height: displayWidth / 3,
                    cx: displayWidth / 3,
                    cy: displayHeight / 3
                },
                B: {
                    width: displayWidth / 2.5,
                    height: displayWidth / 2.5,
                    cx: displayWidth * 0.663,
                    cy: displayHeight * 0.66
                }
            };
            return Array.apply(null, Array(dataSetSize)).map((d) => {
                const type = Math.random() > 0.5 ? types[0] : types[1];
                const { width, height, cx, cy } = ellipsoidOptions[type];
                const { x, y } = createRandomEllipsoidCoordinates(width, height, cx, cy);
                return { x, y, type };
            });
        }
        let dataset = createRandomData(params.displayWidth, params.displayHeight, params.dataSetSize, params.types);
        setData(dataset)
    }, [params.displayWidth, params.displayHeight, params.dataSetSize, params.types])

    const options = {
        filterType: "dropdown",
        responsive: "scroll"
    };

    function valuetext(value) {
        return `${value}`;
    }

    return (
        <div style={{ paddingBottom: '30px' }}>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <TitleBar name="K Nearest Neighbours" tags={['Nearest Neighbours', 'ScatterPlot']} />
                    <div className="csv-table">
                    {data ? (
                        <MUIDataTable
                            title={"Data Table"}
                            data={data}
                            columns={['x', 'y', 'type']}
                            options={options}
                        />
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <h3>No Data Found</h3>
                        </div>
                    )}
                    </div>
                </Grid>
                <Grid item md={6} xs={12}>
                    <LoadDataset />
                    <Description desc="knn" />
                    <div style={{ margin: '20px' }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography id="discrete-slider" gutterBottom>
                                    Dataset Size &nbsp;
                                    <span style={{ color: '#1692f7', fontWeight: '500', fontSize: '18px' }}>
                                        {params.dataSetSize}
                                    </span>
                                    &nbsp;rows
                                </Typography>
                                <Slider 
                                    style={{ color: '#1692f7', width: '90%' }} 
                                    value={params.dataSetSize}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={50}
                                    marks
                                    min={10}
                                    max={1000} 
                                    getAriaValueText={valuetext}
                                    onChange={(event, newValue) => {
                                        setParams({
                                            ...params,
                                            dataSetSize: newValue
                                        })
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography id="continuous-slider" gutterBottom>
                                    Number of Neighbours (K) &nbsp;
                                    <span style={{ color: 'red', fontWeight: '500', fontSize: '18px' }}>
                                        {params.k}
                                    </span>
                                </Typography>
                                <Slider 
                                    style={{ color: 'red', width: '90%' }} 
                                    value={params.k}
                                    aria-labelledby="continuous-slider"
                                    valueLabelDisplay="auto"
                                    step={25}
                                    marks
                                    min={10}
                                    max={params.dataSetSize} 
                                    getAriaValueText={valuetext}
                                    onChange={(event, newValue) => {
                                        setParams({
                                            ...params,
                                            k: newValue
                                        })
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div id="knn" ref={knn}></div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default KNN;