function* recMatcher(arr, currentSum, targetNumber, usedNumbers) {
    arr.forEach((number, index) => {
        if (number + currentSum === targetNumber) {
            console.log([...usedNumbers, number]);
        }
    });
}

const arr = [1, 2, 3, 4, 5];
const iterator = recMatcher(arr, 0, 5, []);
