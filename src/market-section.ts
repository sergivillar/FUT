import {Page} from 'puppeteer';
import {getRandomAwaitTime} from './utils';
import {PLAYERS_QUALITY} from './models';

export const typePlayerOnInput = async (page: Page, playerName: string) => {
    await page.waitFor(getRandomAwaitTime());

    await page.click('input[placeholder="Type Player Name"]');

    await page.waitFor(250);

    await page.type('input[placeholder="Type Player Name"]', playerName, {
        delay: 80,
    });
};

export const deletePlayerInput = async (page: Page) => {
    // @ts-ignore
    await page.evaluate(() => (document.querySelector("input[placeholder='Type Player Name']").value = ''));

    await page.waitFor(250);
};

export const selectPlayer = async (page: Page, playerName: string, rating: number): Promise<any> => {
    await page.waitFor(getRandomAwaitTime() * 1.5);

    const selectPlayerButton = await page.waitForXPath(
        `//span[contains(text(), "${playerName}")]/following-sibling::span[contains(text(),"${rating}")]`
    );

    if (!selectPlayerButton) {
        return await selectPlayer(page, playerName, rating);
    }

    await selectPlayerButton.asElement().click();
};

export const checkQuality = async (page: Page, quality: PLAYERS_QUALITY) => {
    const qualitySelected = await page.$x(
        '//span[contains(text(), "Bronze") or contains(text(), "Silver") or contains(text(), "Gold") or contains(text(), "Special")]'
    );

    if (qualitySelected.length === 1) {
        qualitySelected[0].click();
    } else {
        const qualityButton = await page.waitForXPath('//span[contains(text(), "Quality")]');

        if (!qualityButton) {
            return await changeQuality(page, quality);
        }

        await qualityButton.asElement().click();

        await page.waitFor(500);
    }
};

export const changeQuality = async (page: Page, quality: PLAYERS_QUALITY): Promise<any> => {
    await page.waitFor(getRandomAwaitTime());

    await checkQuality(page, quality);

    const qualityOptionButton = await page.waitForXPath(`//li[contains(text(), '${quality}')]`);

    if (!qualityOptionButton) {
        return await changeQuality(page, quality);
    }

    await qualityOptionButton.asElement().click();
};

export const setMaxBuyNowPrice = async (page: Page, maxPrice = 0) => {
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

export const setMinBuyNowPrice = async (page: Page, minPrice = 0) => {
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

export const setMaxBidPrice = async (page: Page, maxPrice = 0) => {
    await page.waitFor(getRandomAwaitTime());

    const valueInputs = await page.$$('.numericInput');

    if (valueInputs.length !== 4) {
        console.log('There is no money inputs. Somthing went wrong');
        return;
    }

    const maxBidPriceButton = valueInputs[1];

    maxBidPriceButton.click();

    await page.waitFor(200);

    await maxBidPriceButton.type(String(maxPrice), {
        delay: 80,
    });
};

export const setMinBidPrice = async (page: Page, minPrice = 0) => {
    await page.waitFor(getRandomAwaitTime());

    const valueInputs = await page.$$('.numericInput');

    if (valueInputs.length !== 4) {
        console.log('There is no money inputs. Somthing went wrong');
        return;
    }

    const minBidPriceButton = valueInputs[0];

    minBidPriceButton.click();

    await page.waitFor(200);

    await minBidPriceButton.type(String(minPrice), {
        delay: 80,
    });
};

export const searchPlayer = async (page: Page): Promise<any> => {
    const searchButton = await page.waitForXPath('//button[contains(text(), "Search")]');

    if (!searchButton) {
        return await searchPlayer(page);
    }

    await searchButton.asElement().click();
};
