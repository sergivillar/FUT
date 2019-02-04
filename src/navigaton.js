const {getRandomAwaitTime} = require('./utils');

const goToMarketSection = async page => {
    await page.waitFor(getRandomAwaitTime());

    const transferMarketTabButton = await page.waitForXPath('//button[contains(text(), "Transfers")]');
    await transferMarketTabButton.asElement().click();
    await page.waitFor(getRandomAwaitTime(250, 350));

    const checkTransferPageLoaded = await page.$x('//h1[contains(text(), "Search the Transfer Market")]');

    if (checkTransferPageLoaded.length === 0) {
        await goToMarketSection(page);
    }
};

const goToMarket = async page => {
    await page.waitFor(getRandomAwaitTime());

    const goToMarketButton = await page.waitForXPath('//h1[contains(text(), "Search the Transfer Market")]');
    await goToMarketButton.asElement().click();

    const checkMarketPageLoaded = await page.$('input[placeholder="Type Player Name"]');

    if (!checkMarketPageLoaded) {
        await goToMarket(page);
    }
};

const clickBackButton = async page => {
    await page.waitFor(200);
    await page.$('.btn-navigation');
    await page.click('.btn-navigation');
};

module.exports = {
    goToMarket,
    goToMarketSection,
    clickBackButton,
};
