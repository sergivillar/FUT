const {getRandomAwaitTime, getSecondsFromTime} = require('./utils');

const isNoResultBanner = async page => {
    const noResultBanner = await page.$x('//h2[contains(text(), "No results found")]');

    return !!noResultBanner.length;
};

const buyButtonClick = async page => {
    await page.click('.buyButton');
};

const bidButtonClick = async page => {
    const bitButton = await page.waitFor('.bidButton');
    await bitButton.asElement().click();
};

const buyPlayer = async (page, playerAverage) => {
    let players;
    try {
        players = !playerAverage
            ? await page.$$('.listFUTItem')
            : await page.$x(
                  `//li[contains(@class, "listFUTItem") and .//div[contains(text() , ${playerAverage})]]`
              );

        if (players.length === 0) {
            return;
        }

        const lastPlayer = players[Math.floor(Math.random() * (players.length - 0) + 0)];

        await lastPlayer.click();

        await buyButtonClick(page);

        await page.waitFor(120);

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
    } catch (e) {
        console.log('Woops. Something went wrong');
        console.log(e);
        console.log({playerAverage});
        console.log(`//li[contains(@class, "listFUTItem") and .//div[contains(text() , ${playerAverage})]]`);
        console.log(players);
    }
};

const bidPlayer = async (page, playerAverage, maxBidPrice, maxExpirationTime, maxActiveBids) => {
    const players = !playerAverage
        ? await page.$$('.listFUTItem')
        : await page.$x(
              `//li[contains(@class, "listFUTItem") and .//div[contains(text() , "${playerAverage}")]]`
          );

    for (const player of players) {
        await player.click();

        const nextBidInput = await page.waitFor('.numericInput');

        const nextBid = await (await nextBidInput.getProperty('value')).jsonValue();
        const nextBidNumber = parseFloat(nextBid.replace(/,/g, ''));

        const expiredTimeSpan = await page.$x(
            '//span[contains(text(), "Time Remaining")]/following-sibling::span'
        );

        if (expiredTimeSpan.length > 1) {
            console.log('Error reading player expired time');
            continue;
        }
        const expiredTimeText = await (await expiredTimeSpan[0].getProperty('textContent')).jsonValue();
        const expireTimeInSeconds = getSecondsFromTime(expiredTimeText);

        if (!expireTimeInSeconds || expireTimeInSeconds > maxExpirationTime || nextBidNumber > maxBidPrice) {
            await page.waitFor(getRandomAwaitTime(350, 550));
            continue;
        }

        await page.waitFor(200);

        await bidButtonClick(page);

        await page.waitFor(300);

        // const playerBid = await page.$('.won .player');
    }
};

module.exports = {
    isNoResultBanner,
    buyPlayer,
    bidPlayer,
};
