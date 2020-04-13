// var data = [[0,1],[1,3],[2,6]];
// var thres = 0.8;


function algo(dataset, threshold) {

  var arr1 = [];
  var arr2 = [];

  const { PCA } = require('ml-pca');
  // dataset is a two-dimensional array where rows represent the samples and columns the features
  const pca = new PCA(dataset);

  arr1 = pca.getExplainedVariance();

// If new points needs to be added in the dataset then we need this
  // const newPoints = [[2,1],[5,3],[6,6]];
  // console.log(pca.predict(newPoints));

  for (index = 0; index < arr1.length; index++) {
    if (arr1[index] > threshold) {
      arr2.push(arr1[index]);
    }
   }
   console.log('The total variance is '+arr1,'\nThe total variance above threshold is '+arr2);
  }

// algo(data, thres)
