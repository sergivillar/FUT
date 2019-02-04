const TIME_TO_SECONDS = {
    Seconds: 1,
    Minute: 60,
    Minutes: 60,
};

const getRandomAwaitTime = (min = 500, max = 1500) => Math.floor(Math.random() * (max - min) + min);

const getSecondsFromTime = expiredTimeText => {
    if (expiredTimeText.split(' ').length !== 2) {
        return null;
    }
    const [timeToExpireText, magnitudeTime] = expiredTimeText.split(' ');

    const expiredValueText = timeToExpireText.split('<');
    let expiredValue;
    if (expiredValueText.length > 1) {
        expiredValue = expiredValueText[1];
    } else {
        expiredValue = expiredValueText[0];
    }
    const multiplyBySeconds = TIME_TO_SECONDS[magnitudeTime];

    return expiredValue * multiplyBySeconds;
};

module.exports = {getRandomAwaitTime, getSecondsFromTime};
