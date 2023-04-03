

// Expected results

const numbers = [];

console.log(numbers.every(function (number) {
    return number % 2 !== 0;
})); // Output: true

console.log(numbers.every(function (number, index) {
    return index % 2 === 0;
})); // Output: false

console.log(numbers.every(function (number, index, array) {
    return array.length % 2 === 0;
})); // Output: true
