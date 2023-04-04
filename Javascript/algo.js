// function mostWater(height, size) {
//     var maxWater = 0;

//     for (var i = 0; i < size; i++) {
//         for (var j = size - 1; j > i; j --) {
//             water = Math.min(height[i],height[j]) * (j - i);
//             maxWater = Math.max(maxWater, water);
//         }
//     }
//     return maxWater;
// }

// const height = [1, 5, 6, 3, 4, 2];
// var size = height.length;

// console.log("Most water: " + mostWater(height, size));

var sports = [
    {
        name: 'Bơi lội',
        gold: 11
    },
    {
        name: 'Boxing',
        gold: 3
    },
    {
        name: 'Đạp xe',
        gold: 4
    },
    {
        name: 'Đấu kiếm',
        gold: 5
    },
]

function getTotalGold(sports) {
    var totalGold = sports.reduce(function(myAccumulator, currentValue) {
        return myAccumulator + currentValue.gold; 
    }, 0);
    return totalGold;
}



// Expected results:
console.log(getTotalGold(sports)) // Output: 23