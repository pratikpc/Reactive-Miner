import React from 'react'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const TitleBar = props => {
    return (
        <Paper style={{ background: '#000000', color: 'white', margin:' 10px', padding: '20px' }}>
            {props.logo && (
                <div style={{ padding: '20px'}}>
                    <img src={props.logo} width="100" height="100" alt="logo" />
                </div>
            )}
            <Typography style={{ marginBottom: '10px' }} variant="h5">
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