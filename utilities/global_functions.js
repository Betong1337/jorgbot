function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];

    return item;
}
function getRandomInt(n) {
    var randomINT = Math.floor(Math.random() * n);
    while (randomINT < 1) {
        randomINT = Math.floor(Math.random() * n);
    }
    return randomINT;
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function getIDFromMention(user_mention) {
    const chars = ['<', '@', '>'];
    let a = user_mention.replace(chars[0], '');
    let b = a.replace(chars[1], '');
    let result = b.replace(chars[2], '');

    return result;
}

function isValidUserId(input) {
    // Check if the input is a numeric string and is within the typical length for a Discord ID
    return /^\d{17,19}$/.test(input);
  }
module.exports = {getRandomItem, getRandomInt, shuffleArray, getIDFromMention, isValidUserId};