import React, { useRef } from 'react';
import dt from './utils';
import './DecisionTree.css';

const DecisionTree = () => {
    const tI = useRef();
    const dTP = useRef();
    const rFP = useRef();
    const dT = useRef();


    // Recursive (DFS) function for displaying inner structure of decision tree
    function treeToHtml(tree) {
        // only leafs containing category
        if (tree.category) {
            return  ['<ul>',
                        '<li>',
                            '<button>',
                                '<b>', tree.category, '</b>',
                            '</button>',
                        '</li>',
                    '</ul>'].join('');
        }
        
        return  ['<ul>',
                    '<li>',
                        '<button>',
                            '<b>', tree.attribute, ' ', tree.predicateName, ' ', tree.pivot, ' ?</b>',
                        '</button>',
                        '<ul>',
                            '<li>',
                                '<button>yes</button>',
                                treeToHtml(tree.match),
                            '</li>',
                            '<li>', 
                                '<button>no</button>',
                                treeToHtml(tree.notMatch),
                            '</li>',
                        '</ul>',
                    '</li>',
                '</ul>'].join('');
    }

  const loadTree = () => {
    // Training set
    var data = 
        [{person: 'Homer', hairLength: 0, weight: 250, age: 36, sex: 'male'},
        {person: 'Marge', hairLength: 10, weight: 150, age: 34, sex: 'female'},
        {person: 'Bart', hairLength: 2, weight: 90, age: 10, sex: 'male'},
        {person: 'Lisa', hairLength: 6, weight: 78, age: 8, sex: 'female'},
        {person: 'Maggie', hairLength: 4, weight: 20, age: 1, sex: 'female'},
        {person: 'Abe', hairLength: 1, weight: 170, age: 70, sex: 'male'},
        {person: 'Selma', hairLength: 8, weight: 160, age: 41, sex: 'female'},
        {person: 'Otto', hairLength: 10, weight: 180, age: 38, sex: 'male'},
        {person: 'Krusty', hairLength: 6, weight: 200, age: 45, sex: 'male'}];

    // Configuration
    var config = {
        trainingSet: data, 
        categoryAttr: 'sex', 
        ignoredAttributes: ['person']
    };

    // Building Decision Tree
    var decisionTree = new dt.DecisionTree(config);

    // Building Random Forest
    var numberOfTrees = 3;
    var randomForest = new dt.RandomForest(config, numberOfTrees);

    // Testing Decision Tree and Random Forest
    var comic = {person: 'Comic guy', hairLength: 8, weight: 290, age: 38};

    var decisionTreePrediction = decisionTree.predict(comic);
    var randomForestPrediction = randomForest.predict(comic);

    // Displaying predictions
    tI.current.innerHTML = JSON.stringify(comic, null, 0);
    dTP.current.innerHTML = JSON.stringify(decisionTreePrediction, null, 0);
    rFP.current.innerHTML = JSON.stringify(randomForestPrediction, null, 0);

    // Displaying Decision Tree
    dT.current.innerHTML = treeToHtml(decisionTree.root);
  }


  return (
    <div>
      <button onClick={loadTree}>Click</button>
      <b>Comic guy:</b>
      <div ref={tI}></div>
      <br/>
      <b>Decision Tree prediction:</b>
      <div ref={dTP}></div>
      <br/>
      <b>Random Forest prediction:</b>
      <div ref={rFP}></div>
      <br/>
      <b>Decision Tree:</b>
      <br/>

      <div className="tree" ref={dT}></div>
    </div>
  );
}

export default DecisionTree;
