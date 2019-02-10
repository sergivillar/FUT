import {Page} from 'puppeteer';
import {getRandomAwaitTime} from './utils';

export const goToMarketSection = async (page: Page): Promise<any> => {
    await page.waitFor(getRandomAwaitTime());

    const transferMarketTabButton = await page.waitForXPath('//button[contains(text(), "Transfers")]');

    if (!transferMarketTabButton) {
        return await goToMarketSection(page);
    }

    await transferMarketTabButton.asElement().click();
    await page.waitFor(getRandomAwaitTime(250, 350));

    const checkTransferPageLoaded = await page.$x('//h1[contains(text(), "Search the Transfer Market")]');

    if (checkTransferPageLoaded.length === 0) {
        return await goToMarketSection(page);
    }
};

export const goToMarket = async (page: Page): Promise<any> => {
    await page.waitFor(getRandomAwaitTime());

    const goToMarketButton = await page.waitForXPath('//h1[contains(text(), "Search the Transfer Market")]');

    if (!goToMarketButton) {
        return await goToMarketSection(page);
    }

    await goToMarketButton.asElement().click();

    const checkMarketPageLoaded = await page.$('input[placeholder="Type Player Name"]');

    if (!checkMarketPageLoaded) {
        return await goToMarket(page);
    }
};

export const clickBackButton = async (page: Page) => {
    await page.waitFor(200);
    await page.$('.btn-navigation');
    await page.click('.btn-navigation');
};

export const clickNextPageButton = async (page: Page) => {
    await page.waitFor(200);
    await page.$('.next');
    await page.click('.next');
};