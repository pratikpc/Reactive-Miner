import React, { useEffect } from 'react';
import {KNNVisualization} from './d3knn';

const KNN = () => {
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

        const displayWidth = window.innerWidth - 25;
        const displayHeight = 450;
        const dataSetSize = 250;
        const options = {
            rootNode: '#knn',
            width: displayWidth,
            height: displayHeight,
            backgroundColor: 'black',
            circleFill: '#3fe4h2',
            circleStroke: 'white' 
        };
        const types = ['A', 'B'];
        const data = createRandomData(displayWidth, displayHeight, dataSetSize, types);
        const k = 10;
        const vis = new KNNVisualization(data, options, types, k);
        vis.draw();
    }, [])

    return (
        <div>
            <div id="knn"></div>
        </div>
    )
}

export default KNN;