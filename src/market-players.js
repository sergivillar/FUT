const isNoResultBanner = async page => {
    const noResultBanner = await page.$x('//h2[contains(text(), "No results found")]');

    return !!noResultBanner.length;
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

    await page.click('.buyButton');

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

module.exports = {
    isNoResultBanner,
    buyPlayer,
};
