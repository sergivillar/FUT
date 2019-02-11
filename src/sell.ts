import {Page} from 'puppeteer';
import {PlayerConfig, Sell} from './models';
import {ElementHandle} from 'puppeteer';

export const sell = async (playerConfig: PlayerConfig, operation: Sell, sections: string[], page: Page) => {
    const containsSections = sections.map(section => `contains(text(), "${section}")`);
    const sectionsQuery = concatenate(containsSections, 'or');

    const containsNames = playerConfig.name.split(' ').map(word => `contains(text(), "${word}")`);
    const namesQuery = concatenate(containsNames, 'or');

    const ratingQueryIfNeeded = playerConfig.rating
        ? ` and .//div[contains(text(), "${playerConfig.rating}")`
        : ``;

    const xpath = `//h2[(${sectionsQuery})]/parent::header/parent::section//li[contains(@class, "listFUTItem") and .//div[${namesQuery}]${ratingQueryIfNeeded}]]`;

    const players = await page.$x(xpath);

    await sellPlayers(players, operation.price, page);

    return players.length;
};

const concatenate = (elements: string[], operator: string): string => {
    const preffix = operator + ' ';
    return elements
        .map(element => {
            return `${preffix}${element}`;
        })
        .join(' ')
        .substr(preffix.length);
};

const sellPlayers = async (players: ElementHandle[], price: number, page: Page) => {
    for (const player of players) {
        await player.click();

        await page.waitFor(500);

        const listButton = await page.$x(
            `//span[contains(text(), "List on Transfer Market") or contains(text(), "Re-list Item")]`
        );
        await page.waitFor(500);
        await listButton[0].click();
        await page.waitFor(500);

        // Sibling input of "Start price"
        await typePriceInInput(page, price, 'Start Price');

        // Sibling input of "Buy now price"
        await typePriceInInput(page, price, 'Buy Now Price');

        // const sellButton = await page.$x(`//button[contains(text(),"List Item")]`);
        await page.waitFor(500);
        // await sellButton[0].click();
        console.log('Sell!');
        await page.waitFor(500);
    }
};

const typePriceInInput = async (
    transferTargetsPage: Page,
    price: number,
    titleFilter: string
): Promise<void> => {
    const startPriceInput = await transferTargetsPage.$x(
        `.//span[contains(text(), "${titleFilter}")]/parent::div/parent::div//input[contains(@class, "numericInput")]`
    );
    await startPriceInput[0].click();
    await transferTargetsPage.waitFor(500);
    const startPrice = String(price);
    return startPriceInput[0].type(startPrice, {
        delay: 80,
    });
};
