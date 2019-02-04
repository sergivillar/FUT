const {getRandomAwaitTime} = require('./utils');

const typePlayerOnInput = async (page, playerName) => {
    await page.waitFor(getRandomAwaitTime());

    await page.click('input[placeholder="Type Player Name"]');

    await page.waitFor(500);

    await page.type('input[placeholder="Type Player Name"]', playerName, {
        delay: 80,
    });
};

const selectPlayer = async (page, playerName) => {
    await page.waitFor(getRandomAwaitTime() * 1.5);

    const selectPlayerButton = await page.waitForXPath(`//span[contains(text(), "${playerName}")]`);
    await selectPlayerButton.asElement().click();
};

const changeQuality = async (page, quality) => {
    await page.waitFor(getRandomAwaitTime());

    const qualityButton = await page.waitForXPath('//span[contains(text(), "Quality")]');
    await qualityButton.asElement().click();

    await page.waitFor(500);

    const qualityOptionButton = await page.waitForXPath(`//li[contains(text(), '${quality}')]`);
    await qualityOptionButton.asElement().click();
};

const setMaxBuyNowPrice = async (page, maxPrice = 0) => {
    await page.waitFor(getRandomAwaitTime());

    const valueInputs = await page.$$('.numericInput');

    if (valueInputs.length !== 4) {
        console.log('There is no money inputs. Somthing went wrong');
        return;
    }

    const maxBuyNowPriceButton = valueInputs[3];

    maxBuyNowPriceButton.click();

    await page.waitFor(200);

    await maxBuyNowPriceButton.type(String(maxPrice), {
        delay: 80,
    });
};

const setMinBuyNowPrice = async (page, minPrice = 0) => {
    await page.waitFor(getRandomAwaitTime());

    const valueInputs = await page.$$('.numericInput');

    if (valueInputs.length !== 4) {
        console.log('There is no money inputs. Somthing went wrong');
        return;
    }

    const minBuyNowPriceButton = valueInputs[2];

    minBuyNowPriceButton.click();

    await page.waitFor(200);

    await minBuyNowPriceButton.type(String(minPrice), {
        delay: 80,
    });
};

const searchPlayer = async page => {
    const searchButton = await page.waitForXPath('//button[contains(text(), "Search")]');
    await searchButton.asElement().click();
};

module.exports = {
    typePlayerOnInput,
    selectPlayer,
    setMinBuyNowPrice,
    setMaxBuyNowPrice,
    changeQuality,
    searchPlayer,
};
