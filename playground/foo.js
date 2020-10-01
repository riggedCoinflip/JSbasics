const stringToParse = 'Hello my name is "rigged Coinflip" and I like coding';
let insideQuotes = false;
let temp = '';
const result = [];
for (char of stringToParse) {
    if (char === '"') {
        insideQuotes = !insideQuotes;
        if (!insideQuotes) {
            result.push(temp);
            temp = '';
        }
    } else if (char === ' ' && !insideQuotes) {
        result.push(temp);
        temp = '';
    } else temp += char;
}
result.push(temp);
console.log(result);
