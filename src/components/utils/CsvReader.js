import React, { useContext, useState } from 'react';
import MagicDropzone from 'react-magic-dropzone';
import { csvContext } from '../context/csv-context';
import Paper from '@material-ui/core/Paper';
import { ReadCSV } from '../linreg/utils';

const CsvReader = () => {
    const { fetchCsv } = useContext(csvContext);
    // eslint-disable-next-line
    const [delimiter, setDelimiter] = useState(',');
    const onDrop = async (accepted, rejected, links) => {
        if (accepted && accepted.length > 0) {
            const url = accepted[0].preview;
            const data = ReadCSV(url, delimiter);
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