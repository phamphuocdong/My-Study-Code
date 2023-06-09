courses = [
    {
        name: 'Js',
        price: 100
    },
    {
        name: 'Java',
        price: 250
    }
]


var i = 0;
function coinHandler(acc, cur, curIndex, ogArr) {
    i++;
    var total = acc + cur.price;
    console.table({
        'index: ': i,
        'accumulator: ': acc,
        'course price: ': cur.price,
        'obtained coin: ': total
    });
    return total;
}

var totalCoin = courses.reduce(coinHandler, 0);