const figue = require('./hc-hook')

function runHC() {
    let datast = [ 
      {'company': 'Microsoft' , 'size': 91259, 'revenue': 60420},
      {'company': 'IBM' , 'size': 400000, 'revenue': 98787},
      {'company': 'Skype' , 'size': 700, 'revenue': 716},
      {'company': 'SAP' , 'size': 48000, 'revenue': 11567},
      {'company': 'Yahoo!' , 'size': 14000 , 'revenue': 6426 },
      {'company': 'eBay' , 'size': 15000, 'revenue': 8700},
   ] ;
    let data = parseData (datast) ;
    let space = 5 ;
    let balanced = true ;
    let withLabel = true ;
    let withCentroid = true ;
    let withDistance = false ;
    let linkage = 0 ;
    let distance = 1 ;
    let root = figue.agglomerate(data['labels'], data['vectors'] , distance, linkage) ;
    let text = root.buildDendogram(space, balanced, withLabel,withCentroid,withDistance);
    console.log(text)
}

function parseData(data) {
    let labels = [];
    let vectors = [];
    for (var i = 0 ; i < data.length ; i++) {
        labels[i] = data[i]['company'] ;
        vectors[i] = [ data[i]['size'] , data[i]['revenue']] ;
    }
    return {'labels': labels , 'vectors': vectors} ;
}

runHC();
