import React, { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import figue from './hc-hook';
import CsvReader from '../../utils/CsvReader';
import CsvTable from '../../utils/CsvTable';

const HierarchicalClustering = () => {
    const dataDiv = useRef();
    const datasetDiv = useRef();
    const algoDiv = useRef();
    const inputPanel = useRef();
    const outputPanel = useRef();
    const paramPanel = useRef();


    function updateDS() {
        let domobj = document.getElementById('datasets') ;
        let ds = domobj.options[domobj.selectedIndex].value ;
        if (ds in datasets)
            document.getElementById('data').value = datasets[ds] ;
        else
            document.getElementById('data').value = "" ;
    }

    function parseData(data) {
        let labels = [];
        let vectors = [];
        let lines = data.split("\n") ;
        for (let i = 0 ; i < lines.length ; i++) {
            if (lines[i].length === 0)
                continue ;
            let elements = lines[i].split(",") ;
            let label = elements.shift() ;
            let vector = [];
            for (let j = 0 ; j < elements.length ; j++)
                vector.push(parseFloat(elements[j])) ;
            vectors.push(vector) ;
            labels.push(label) ;
        }
        return {'labels': labels , 'vectors': vectors} ;
    }

    function runAlgo() {
        let domobj = document.getElementById('algo') ;
        let algo = domobj.options[domobj.selectedIndex].value ;
        switch (algo) {
            case 'hierarchical': { runHC() ; break ; }
            default: { runHC() ; break; }
        }
        document.getElementById('output_panel').style.display = 'block' ;
    }

    function showParamPanel (visiblePanel) {
        let panelNames = ['km_panel', 'fcm_panel', 'hc_panel'] ;
        for (let i = 0 ; i < panelNames.length ; i++)
            document.getElementById(panelNames[i]).style.display = 'none' ; 
        document.getElementById(visiblePanel).style.display = 'block' ;
    }

    function updateAlgo() {
        let domobj = document.getElementById('algo') ;
        let algo = domobj.options[domobj.selectedIndex].value ;
        switch (algo) {
            case 'hierarchical': { showParamPanel('hc_panel') ; break ;  }
            default: { showParamPanel('hc_panel') ; break ; }
        }
        document.getElementById('text').innerHTML = ""; 
        document.getElementById('output_panel').style.display = 'none' ;
    } 

    function runHC() {
        let data = parseData (document.getElementById('data').value) ;
        let domobj = document.getElementById('space') ;
        let space = parseInt (domobj.options[domobj.selectedIndex].value) ;
        let balanced = (radioValue('balanced') === 'true') ;
        let withLabel = (radioValue('withLabel') === 'true') ;
        let withCentroid = (radioValue('withCentroid') === 'true') ;
        let withDistance = (radioValue('withDistance') === 'true') ;
        let linkage = parseInt (radioValue('linkage')) ;
        let distance = parseInt (radioValue('distance')) ;
        let root = figue.agglomerate(data['labels'], data['vectors'] , distance, linkage) ;
        let pre = document.getElementById('text') ;
        let text = root.buildDendogram(space, balanced, withLabel,withCentroid,withDistance);
        if( document.all ) { pre.innerText = text ; } else { pre.innerHTML = text ; }
    }

    function radioValue(name) {
        let radios = document.getElementsByName(name) ;
        for (let i = 0 ; i < radios.length ; i++) 
            if (radios[i].checked) 
                return radios[i].value ;
    }

    let datasets = {
        'people': "anna,37,2\nkarin,65,3\njohn,34,2\ntom,38,5\nmarc,38,6\nstephany,38,3\n" ,
        'firms': "Microsoft,91259,60420\nIBM,400000,98787\nSkype,700,716\nSAP,48000,11567\nYahoo,14000,6426\neBay,15000,8700\n" 
    };

    return (
        <div>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <CsvReader />
                    <CsvTable />
                </Grid>
                <Grid item md={6} xs={12}>                    
                    <div>
                        <div id="input_panel">
                            <div id="data_panel">
                                <fieldset>
                                    <legend>Data</legend>
                                    Enter your data:
                                    <textarea id="data">
                                    </textarea>
                                    <div style={{ marginTop: '10px'}} >
                                        Or use an existing dataset:
                                    <select id="datasets" onChange={updateDS}>
                                        <option value="none">-</option>
                                        <option value="people" selected>People (age, children)</option>
                                        <option value="firms">Firms (size, revenue)</option>
                                    </select>
                                    </div>
                                </fieldset>
                            </div>
                            <div id="algo_panel">
                                <fieldset id="algorithms">
                                    <legend>Clustering algorithm</legend>
                                    <select id="algo" onChange={updateAlgo}>
                                    <option value="hierarchical" selected>Hierarchical clustering</option>
                                    <option value="kmeans">K-means</option>
                                    <option value="fcmeans">Fuzzy C-means (Experimental)</option>
                                    </select>
                                </fieldset>
                            </div>
                            <div id="param_panel">
                                <div id="hc_panel">
                                    <fieldset id="hc_params">
                                    <legend>Control panel</legend>
                                    Linkage method: 
                                        <input type="radio" name="linkage" value="0" />Single-linkage
                                        <input type="radio" name="linkage" value="1" />Complete-linkage
                                        <input type="radio" name="linkage" value="2" />Average-linkage<br/>
                                    <br/>
                                    Distance: 
                                    <input type="radio" name="distance" value="0" checked/>Euclidian
                                    <input type="radio" name="distance" value="1" />Manhattan
                                    <input type="radio" name="distance" value="2" />Maximum<br/>
                                    <br/>
                                    Show labels:
                                    <input type="radio" name="withLabel" value="true" checked/>Yes
                                    <input type="radio" name="withLabel" value="false" />No <br/>
                                    <br/>
                                    Show centroids:
                                    <input type="radio" name="withCentroid" value="true"/>Yes
                                    <input type="radio" name="withCentroid" value="false"  checked/>No<br/>
                                    <br/>
                                    Show distance:
                                    <input type="radio" name="withDistance" value="true"/>Yes
                                    <input type="radio" name="withDistance" value="false"  checked/>No<br/>
                                    <br/>
                                    Balance dendogram:
                                    <input type="radio" name="balanced" value="true" checked/>Yes
                                    <input type="radio" name="balanced" value="false" />No <br/>
                                    <br/>
                                    Minimum spacing between nodes:
                                    <select id="space">
                                    <option value="3">3</option>
                                    <option value="5">5</option>
                                    <option value="7" selected="selected">7</option>
                                    <option value="9">9</option>
                                    </select>
                                    </fieldset>
                                </div>
                                <div id="cluster_button">
                                    <div style={{ display: 'table-row', width: '100%', textAlign: 'center' }}>
                                        <div style={{ verticalAlign: 'middle', display:'table-cell' }}>
                                            <button onClick={runAlgo}>Cluster data and display assignments</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="output_panel">
                            <fieldset>
                            <legend>Output</legend>
                            <pre id="text"> </pre>
                            </fieldset>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default HierarchicalClustering;