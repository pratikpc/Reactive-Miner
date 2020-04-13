import React, { useRef, useContext, useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import CsvReader from '../utils/CsvReader';
import CsvTable from '../utils/CsvTable';
import { Button } from '@material-ui/core';
import { drawCircle } from './utils';
import { csvContext } from '../context/csv-context';
import { ConvertCSVToRawArrays } from '../../ML/utils';
const svmjs = require("./libsvm");

const Overview = () => {
  const NPGcanvas = useRef();
  const { csv } = useContext(csvContext);
  const [labelColumn, setLabelColumn] = useState("");
  const [columnNames, setColumnNames] = useState([]);
  useEffect(() => {
    if (csv == null)
      return;
    console.log(csv);
    async function LoadColumnNames() {
      const columns = await csv.columnNames();
      setColumnNames(columns);
      setLabelColumn(columns[columns.length - 1]);
    }
    LoadColumnNames();
  }, [csv, setColumnNames]);

  const trainModel = async (csv, labelColumn, columnNames) => {
    let [data, labels] = await ConvertCSVToRawArrays(csv, labelColumn, columnNames);
    labels = labels.map(label => label[0]);
    console.log(labels);
    const svm = new svmjs.SVM();
    let wb = null
    let ss = 50.0
    let trainstats = null
    let dirty = true
    let kernelid = 1
    let rbfKernelSigma = 0.5
    let svmC = 1.0
    const ctx = NPGcanvas.current.getContext('2d');
    let WIDTH = ctx.canvas.width;
    let HEIGHT = ctx.canvas.height;

    trainstats = svm.train(data, labels, { kernel: 'rbf', rbfsigma: rbfKernelSigma, C: svmC });
    dirty = true;

    draw(ctx, WIDTH, HEIGHT, svm, data, labels, wb, ss, trainstats, dirty, kernelid, rbfKernelSigma, svmC);
  }

  const draw = (ctx, WIDTH, HEIGHT, svm, data, labels, wb, ss, trainstats, dirty, kernelid, rbfKernelSigma, svmC) => {
    if (!dirty) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // draw decisions in the grid
    let density = 4.0;
    for (let x = 0.0; x <= WIDTH; x += density) {
      for (let y = 0.0; y <= HEIGHT; y += density) {
        let dec = svm.marginOne([(x - WIDTH / 2) / ss, (y - HEIGHT / 2) / ss]);
        if (dec > 0) ctx.fillStyle = 'rgb(150,250,150)';
        else ctx.fillStyle = 'rgb(250,150,150)';
        ctx.fillRect(x - density / 2 - 1, y - density - 1, density + 2, density + 2);
      }
    }

    // draw axes
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(50,50,50)';
    ctx.lineWidth = 1;
    ctx.moveTo(0, HEIGHT / 2);
    ctx.lineTo(WIDTH, HEIGHT / 2);
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();

    // draw datapoints. Draw support vectors larger
    ctx.strokeStyle = 'rgb(0,0,0)';
    for (let i = 0; i < data.length; i++) {

      if (labels[i] === 1) ctx.fillStyle = 'rgb(100,200,100)';
      else ctx.fillStyle = 'rgb(200,100,100)';

      if (svm.alpha[i] > 1e-2) {
        ctx.lineWidth = 3
      }  // distinguish support vectors
      else {
        ctx.lineWidth = 1
      }
      drawCircle(ctx, data[i][0] * ss + WIDTH / 2, data[i][1] * ss + HEIGHT / 2, Math.floor(3 + svm.alpha[i] * 5.0 / svmC));
    }

    // if linear kernel, draw decision boundary and margin lines
    if (kernelid === 0) {

      let xs = [-5, 5];
      let ys = [0, 0];
      ys[0] = (-wb.b - wb.w[0] * xs[0]) / wb.w[1];
      ys[1] = (-wb.b - wb.w[0] * xs[1]) / wb.w[1];
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // wx+b=0 line
      ctx.moveTo(xs[0] * ss + WIDTH / 2, ys[0] * ss + HEIGHT / 2);
      ctx.lineTo(xs[1] * ss + WIDTH / 2, ys[1] * ss + HEIGHT / 2);
      // wx+b=1 line
      ctx.moveTo(xs[0] * ss + WIDTH / 2, (ys[0] - 1.0 / wb.w[1]) * ss + HEIGHT / 2);
      ctx.lineTo(xs[1] * ss + WIDTH / 2, (ys[1] - 1.0 / wb.w[1]) * ss + HEIGHT / 2);
      // wx+b=-1 line
      ctx.moveTo(xs[0] * ss + WIDTH / 2, (ys[0] + 1.0 / wb.w[1]) * ss + HEIGHT / 2);
      ctx.lineTo(xs[1] * ss + WIDTH / 2, (ys[1] + 1.0 / wb.w[1]) * ss + HEIGHT / 2);
      ctx.stroke();

      // draw margin lines for support vectors. The sum of the lengths of these
      // lines, scaled by C is essentially the total hinge loss.
      for (let i = 0; i < data.length; i++) {
        if (svm.alpha[i] < 1e-2) continue;
        if (labels[i] === 1) {
          ys[0] = (1 - wb.b - wb.w[0] * xs[0]) / wb.w[1];
          ys[1] = (1 - wb.b - wb.w[0] * xs[1]) / wb.w[1];
        } else {
          ys[0] = (-1 - wb.b - wb.w[0] * xs[0]) / wb.w[1];
          ys[1] = (-1 - wb.b - wb.w[0] * xs[1]) / wb.w[1];
        }
        let u = (data[i][0] - xs[0]) * (xs[1] - xs[0]) + (data[i][1] - ys[0]) * (ys[1] - ys[0]);
        u = u / ((xs[0] - xs[1]) * (xs[0] - xs[1]) + (ys[0] - ys[1]) * (ys[0] - ys[1]));
        let xi = xs[0] + u * (xs[1] - xs[0]);
        let yi = ys[0] + u * (ys[1] - ys[0]);
        ctx.moveTo(data[i][0] * ss + WIDTH / 2, data[i][1] * ss + HEIGHT / 2);
        ctx.lineTo(xi * ss + WIDTH / 2, yi * ss + HEIGHT / 2);
      }
      ctx.stroke();
    }
  }

  return (
    <div>
      <Grid container>
        <Grid item md={6} xs={12}>
          <CsvReader />
          <CsvTable />
        </Grid>
        <Grid item md={6} xs={12}>
          <div>
            SVM
           </div>
          <Button variant="contained" color="primary" onClick={async () => await trainModel(csv, labelColumn, columnNames)}>Train</Button>
          <div>
            <canvas width="500" height="500" ref={NPGcanvas} />
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Overview;