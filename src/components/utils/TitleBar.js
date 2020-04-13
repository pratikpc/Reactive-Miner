import React from 'react'
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const TitleBar = props => {
    return (
        <Paper style={{ background: '#000000', color: 'white', margin:' 10px', padding: '20px' }}>
            <Typography style={{ marginBottom: '5px' }} variant="h5">
                {props.name}
            </Typography>
            {props.tags.map((tag, index) => 
            <span className="tag" key={index}>
                {tag}
            </span>
            )}
        </Paper>
    )
}

export default TitleBar;