import React, { useEffect, useRef } from 'react'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const DESCRIPTION_URL = process.env.PUBLIC_URL + '/description.json'

const Description = props => {
    const contentRef = useRef()

    useEffect(() => {
        const fetchDescription = async () => {
            const response = await fetch(DESCRIPTION_URL)
            const data = await response.json()
            contentRef.current.innerHTML = data[props.desc]
        }
        fetchDescription()
    }, [props.desc])

    return (
        <Paper style={{ background: '#FFFFFF', color: '#000000', margin:'10px', padding: '10px' }}>
            <Typography style={{ fontSize: '15px', fontWeight: '500' }} variant="h5" ref={contentRef}>
                {props.name}
            </Typography>
        </Paper>
    )
}

export default Description;