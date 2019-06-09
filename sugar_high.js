
let candies = [33, 20, 12, 19, 29];
let threshold = 33;

console.log(`sugarHigh(${candies}, ${threshold}) = ` + sugarHigh(candies, threshold));


function sugarHigh(candies, threshold) {

    let newArr = [];
    let sum = 0;
    let idx = 0;
    let resultArr = [];

    for (let i = 0; i < candies.length; i++) {
        if (candies[i] <= threshold) {
            newArr.push(candies[i]);
        }
    }

    if (newArr.length == 0) {
        return JSON.stringify(newArr);
    }

    newArr = radixSort(newArr);

    for (let i = 0; i < newArr.length; i++) {
        sum += newArr[i];
        idx = i;
        if ((i < newArr.length) && (sum + newArr[i + 1] > threshold)) {
            break;
        }
    }

    for (let j = 0; j <= idx; j++) {
        resultArr.push(candies.indexOf(newArr[j]));
        candies[candies.indexOf(newArr[j])] = '-';
    }

    return JSON.stringify(radixSort(resultArr));

}

function radixSort(arr) {
    const maxNum = Math.max(...arr) * 10;
    let divisor = 10;

    while (divisor < maxNum) {
        let buckets = [...Array(10)].map(() => []);

        for (let num of arr) {
            buckets[Math.floor((num % divisor) / (divisor / 10))].push(num);
        }

        arr = [].concat.apply([], buckets);
        divisor *= 10;
    }
    return arr;
};
