//User entered parameters a data array and a thres value see the function call at the bottom.
//this stuff user has to enter a 2-D Array "not a csv file directly".
var data = [
  [ 5.7, 3.8, 1.7, 0.3,0], [0, 5.1, 3.8, 1.5, 0.3 ], [0, 5.4, 3.4, 1.7, 0.2 ],
  [ 5.1, 3.7, 1.5, 0.4,0 ], [ 0,4.6, 3.6, 1, 0.2 ],   [0, 5.1, 3.3, 1.7, 0.5 ],
  [ 4.8, 3.4, 1.9, 0.2 ,0], [ 0,5, 3, 1.6, 0.2 ],     [ 0,5, 3.4, 1.6, 0.4 ],
  [ 5.2, 3.5, 1.5, 0.2 ,0], [ 0,5.2, 3.4, 1.4, 0.2 ], [ 0,4.7, 3.2, 1.6, 0.2 ],
  [ 4.8, 3.1, 1.6, 0.2,0 ], [ 0,5.4, 3.4, 1.5, 0.4 ]
];

var thres = 0.8;

// accepts the dataset and threshold and the output is total variance of all features in order = arr1[] "or" the outputs which are above the threshold given = arr2[]

function algo(dataset, threshold) {

  var arr1 = [];
  var arr2 = [];

  const { PCA } = require('ml-pca');
  // dataset is a two-dimensional array where rows represent the samples and columns the features
  const pca = new PCA(dataset);

  arr1 = pca.getExplainedVariance();

  for (index = 0; index < arr1.length; index++) {
    if (arr1[index] > threshold) {
      arr2.push(arr1[index]);
    }
   }
   console.log('The total variance is '+arr1,'\nThe total variance above threshold is '+arr2);
  }

//*********** so arr1 and arr2 should be displayed to user*************.

algo(data, thres)
