// async function xor() {
//     const SVM = await
//     require('libsvm-js');
//     const svm = new SVM({
//         kernel: SVM.KERNEL_TYPES.RBF, // The type of kernel I want to use
//         type: SVM.SVM_TYPES.C_SVC,    // The type of SVM I want to run
//         gamma: 1,                     // RBF kernel gamma parameter
//         cost: 1                       // C_SVC cost parameter
//     });
 
//     // This is the xor problem
//     //
//     //  1  0
//     //  0  1
//     const features = [[0, 0], [1, 1], [1, 0], [0, 1]];
//     const labels = [0, 0, 1, 1];
//     var value = svm.train(features, labels);  // train the model
//     const predictedLabel = svm.predictOne([0.7, 0.8]);
//     console.log(value) // 0
// }
 
// xor().then(() => console.log('done!'));


svmjs = require("./lib/svm");
npg = require("./utils");


var N= 10; //number of data points
var data = new Array(N);
var labels= new Array(N);
var wb; // weights and offset structure
var ss= 50.0; // scaling factor for drawing
var svm= new svmjs.SVM();
var trainstats;
var dirty= true;
var kernelid= 1;
var rbfKernelSigma = 0.5;
var svmC = 1.0;

// function myinit(data_pts, labels_pts){
//     data = data_pts;
//     labels = labels_pts;

function myinit(){

  data = [[-0.4326  ,  1.1909 ],
          [3.0, 4.0],
          [0.1253 , -0.0376   ],
          [0.2877 ,   0.3273  ],
          [-1.1465 ,   0.1746 ],
          [1.8133 ,   2.1139  ],
          [2.7258 ,   3.0668  ],
          [1.4117 ,   2.0593  ],
          [4.1832 ,   1.9044  ],
          [1.8636 ,   1.1677  ]
        ];
  
  labels = [1,1,1,1,1,-1,-1,-1,-1,-1];
  
  console.log(data,labels)

  trainstats= svm.train(data, labels, { kernel: 'rbf', rbfsigma: rbfKernelSigma, C: svmC});

  console.log(trainstats);

  canvas = document.getElementById('NPGcanvas');
  ctx = canvas.getContext('2d');
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  dirty= true; // to redraw screen

  draw();
}


function draw(){
    if(!dirty) return;
    
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    
    // draw decisions in the grid
    var density= 4.0;
    for(var x=0.0; x<=WIDTH; x+= density) {
      for(var y=0.0; y<=HEIGHT; y+= density) {
        var dec= svm.marginOne([(x-WIDTH/2)/ss, (y-HEIGHT/2)/ss]);
        if(dec>0) ctx.fillStyle = 'rgb(150,250,150)';
        else ctx.fillStyle = 'rgb(250,150,150)';
        ctx.fillRect(x-density/2-1, y-density-1, density+2, density+2);
      }
    }
    
    // draw axes
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(50,50,50)';
    ctx.lineWidth = 1;
    ctx.moveTo(0, HEIGHT/2);
    ctx.lineTo(WIDTH, HEIGHT/2);
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();

    // draw datapoints. Draw support vectors larger
    ctx.strokeStyle = 'rgb(0,0,0)';
    for(var i=0;i<N;i++) {
      
      if(labels[i]==1) ctx.fillStyle = 'rgb(100,200,100)';
      else ctx.fillStyle = 'rgb(200,100,100)';
      
      if(svm.alpha[i]>1e-2) ctx.lineWidth = 3; // distinguish support vectors
      else ctx.lineWidth = 1;
      
      drawCircle(data[i][0]*ss+WIDTH/2, data[i][1]*ss+HEIGHT/2, Math.floor(3+svm.alpha[i]*5.0/svmC));
    }
    
    // if linear kernel, draw decision boundary and margin lines
    if(kernelid == 0) {
    
      var xs= [-5, 5];
      var ys= [0, 0];
      ys[0]= (-wb.b - wb.w[0]*xs[0])/wb.w[1];
      ys[1]= (-wb.b - wb.w[0]*xs[1])/wb.w[1];
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // wx+b=0 line
      ctx.moveTo(xs[0]*ss+WIDTH/2, ys[0]*ss+HEIGHT/2);
      ctx.lineTo(xs[1]*ss+WIDTH/2, ys[1]*ss+HEIGHT/2);
      // wx+b=1 line
      ctx.moveTo(xs[0]*ss+WIDTH/2, (ys[0]-1.0/wb.w[1])*ss+HEIGHT/2);
      ctx.lineTo(xs[1]*ss+WIDTH/2, (ys[1]-1.0/wb.w[1])*ss+HEIGHT/2);
      // wx+b=-1 line
      ctx.moveTo(xs[0]*ss+WIDTH/2, (ys[0]+1.0/wb.w[1])*ss+HEIGHT/2);
      ctx.lineTo(xs[1]*ss+WIDTH/2, (ys[1]+1.0/wb.w[1])*ss+HEIGHT/2);
      ctx.stroke();
      
      // draw margin lines for support vectors. The sum of the lengths of these
      // lines, scaled by C is essentially the total hinge loss.
      for(var i=0;i<N;i++) {
        if(svm.alpha[i]<1e-2) continue;
        if(labels[i]==1) {
          ys[0]= (1 -wb.b - wb.w[0]*xs[0])/wb.w[1];
          ys[1]= (1 -wb.b - wb.w[0]*xs[1])/wb.w[1];
        } else {
          ys[0]= (-1 -wb.b - wb.w[0]*xs[0])/wb.w[1];
          ys[1]= (-1 -wb.b - wb.w[0]*xs[1])/wb.w[1];
        }
        var u= (data[i][0]-xs[0])*(xs[1]-xs[0])+(data[i][1]-ys[0])*(ys[1]-ys[0]);
        u = u/((xs[0]-xs[1])*(xs[0]-xs[1])+(ys[0]-ys[1])*(ys[0]-ys[1]));
        var xi= xs[0]+u*(xs[1]-xs[0]);
        var yi= ys[0]+u*(ys[1]-ys[0]);
        ctx.moveTo(data[i][0]*ss+WIDTH/2, data[i][1]*ss+HEIGHT/2);
        ctx.lineTo(xi*ss+WIDTH/2, yi*ss+HEIGHT/2);
      }
      ctx.stroke();
    }
}


myinit();

{/* <canvas id="NPGcanvas" width="500" height="500"></canvas> */}