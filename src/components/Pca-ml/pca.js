//User entered parameters a data array and a thres value see the function call at the bottom.
//this stuff user has to enter a 2-D Array "not a csv file directly".
var data = [[0,1,3,3,4,5,6],[1,34,5,6,7,1,2],[1,7,8,0,3,2,6],[2,4,4,5,6,7,7],[3,4,5,6,7,8,9]];
var thres = 0.8;

// accepts the dataset and threshold and the output is total variance of all rows = arr1[] "or" the outputs which are above the threshold given = arr2[]

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
