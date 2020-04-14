import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import './LandingItem.css';

const LandingItem = props => {
    let history = useHistory();
    const [bgcolor, setBgcolor] = useState('#000000')
    const [show, setShow] = useState(false)
    const mouseEnter = () => {
        setBgcolor('#424140')
        setShow(true)
    }

    const mouseLeave = () => {
        setBgcolor('#000000')
        setShow(false)
    }


    return (
        <Grid item lg={3} md={4} sm={6} xs={12} 
            style={{ backgroundColor: `${bgcolor}`}}
            onMouseEnter={mouseEnter} 
            onMouseLeave={mouseLeave}
        >
            <div className="container">
                <img width="300" height="200" src={props.image} alt="Linear Regression" />
                <div className="buttondiv">
                    {show && <button onClick={() => {history.push(props.url)}} className="btn">{props.name}</button>}
                </div>             
            </div>
        </Grid>
    )
}

export default LandingItem