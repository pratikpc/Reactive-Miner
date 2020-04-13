const figue = require('./figue.js')

function parseData(data) {
    let labels = [];
    let vectors = [];
    for (var i = 0 ; i < data.length ; i++) {
        labels[i] = data[i]['company'] ;
        vectors[i] = [ data[i]['size'] , data[i]['revenue']] ;
    }
    return {'labels': labels , 'vectors': vectors} ;
}

function test() {
    let datast = [ 
        {'company': 'Microsoft' , 'size': 91259, 'revenue': 60420},
        {'company': 'IBM' , 'size': 400000, 'revenue': 98787},
        {'company': 'Skype' , 'size': 700, 'revenue': 716},
        {'company': 'SAP' , 'size': 48000, 'revenue': 11567},
        {'company': 'Yahoo!' , 'size': 14000 , 'revenue': 6426 },
        {'company': 'eBay' , 'size': 15000, 'revenue': 8700},
        {'company': 'Gay' , 'size': 21331, 'revenue': 32424}
    ] ;
    let data = parseData (datast) ;
    let res = figue.fcmeans(3, data['vectors'], 0.6, 2)
    console.log(res.centroids)
    console.log(res.membershipMatrix)
}

test()