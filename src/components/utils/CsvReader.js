import React, { useContext } from 'react';
import * as d3 from 'd3';
import MagicDropzone from 'react-magic-dropzone';
import { csvContext } from '../context/csv-context';
import Paper from '@material-ui/core/Paper';

const CsvReader = () => {
    const { fetchCsv } = useContext(csvContext);
    const onDrop = async (accepted, rejected, links) => {
        if (accepted && accepted.length > 0) {
            let data = await d3.csv(accepted[0].preview);
            fetchCsv(data);
        }
    }

    return (
        <Paper style={{ margin: '10px', padding: '10px' }}>
            <MagicDropzone className="dropzone" accept=".csv" multiple={false} onDrop={onDrop}>
                <div className="center-div-wrap">
                    <div style={{ display: 'block' }}>
                        <p>Drag/drop csv files over here</p>
                    </div>
                </div>
            </MagicDropzone>
        </Paper>
    )
}

export default CsvReader;