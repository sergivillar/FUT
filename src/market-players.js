const TIME_TO_SECONDS = {
    Seconds: 1,
    Minute: 60,
    Minutes: 60,
};

const isNoResultBanner = async page => {
    const noResultBanner = await page.$x('//h2[contains(text(), "No results found")]');

    return !!noResultBanner.length;
};

const buyButtonClick = async page => {
    await page.click('.buyButton');
};

const bidButtonClick = async page => {
    await page.click('.bidButton');
};

const buyPlayer = async (page, playerAverage) => {
    const players = !playerAverage
        ? await page.$$('.listFUTItem')
        : await page.$x(
              `//li[contains(@class, "listFUTItem") and .//div[contains(text() , "${playerAverage}")]]`
          );

    const lastPlayer = players[Math.floor(Math.random() * (players.length - 0) + 0)];

    await lastPlayer.click();

    await page.waitFor(200);

    await buyButtonClick();

    await page.waitFor(180);

    const confirmBuyButtom = await page.$x('//button[contains(text(), "Ok")]');

    if (confirmBuyButtom.length > 0) {
        await confirmBuyButtom[0].click();

        await Promise.race([page.waitFor('.expired'), page.waitFor('.won')]);

        const errorStatus = await page.$x(
            '//p[contains(text(), "Bid status changed, auction data will be updated.")]'
        );

        if (errorStatus.length > 0) {
            await page.waitFor(150);
            return false;
        }

        const playerWon = await page.$('.won');

        return !!playerWon;
    } else {
        console.log('Confirm buy button nor found', confirmBuyButtom);
        return false;
    }
};

const bidPlayer = async (page, playerAverage) => {
    const players = !playerAverage
        ? await page.$$('.listFUTItem')
        : await page.$x(
              `//li[contains(@class, "listFUTItem") and .//div[contains(text() , "${playerAverage}")]]`
          );

    for (const player of players) {
        await player.click();

        const currentBidInput = await page.waitFor('.numericInput');

        const currentBid = await (await currentBidInput.getProperty('value')).jsonValue();
        const currentBidNumber = parseFloat(currentBid.replace(/,/g, ''));

        const expiredTimeSpan = await page.$x(
            '//span[contains(text(), "Time Remaining")]/following-sibling::span'
        );

        if (expiredTimeSpan.length > 1) {
            console.log('Error reading player expired time');
            continue;
        }
        const expiredTimeText = await (await expiredTimeSpan[0].getProperty('textContent')).jsonValue();
        if (expiredTimeText.split(' ').length !== 2) {
            console.log('Item expired');
            continue;
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

        const expireTimeInSeconds = expiredValue * multiplyBySeconds;

        console.log({currentBidNumber, expireTimeInSeconds});

        await page.waitFor(200);

        // await bidButtonClick();

        // await page.waitFor(180);

        // const confirmBuyButtom = await page.$x('//button[contains(text(), "Ok")]');

        // if (confirmBuyButtom.length > 0) {
        //     await confirmBuyButtom[0].click();

        //     await Promise.race([page.waitFor('.expired'), page.waitFor('.won')]);

        //     const errorStatus = await page.$x(
        //         '//p[contains(text(), "Bid status changed, auction data will be updated.")]'
        //     );

        //     if (errorStatus.length > 0) {
        //         await page.waitFor(150);
        //         return false;
        //     }

        //     const playerWon = await page.$('.won');

        //     return !!playerWon;
        // } else {
        //     console.log('Confirm buy button nor found', confirmBuyButtom);
        //     return false;
        // }
    }
};

module.exports = {
    isNoResultBanner,
    buyPlayer,
    bidPlayer,
};
