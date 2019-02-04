const getRandomAwaitTime = (min = 500, max = 1500) => Math.floor(Math.random() * (max - min) + min);

module.exports = {getRandomAwaitTime};
