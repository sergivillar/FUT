import {Page, ElementHandle} from 'puppeteer';
import {Sell} from './models';

export default async (
    rating: number,
    name: string,
    operation: Sell,
    sections: string[],
    page: Page
): Promise<number> => {
    const containsSections = sections.map(section => `contains(text(), "${section}")`);
    const sectionsQuery = concatenate(containsSections, 'or');

    const containsNames = name.split(' ').map(word => `contains(text(), "${word}")`);
    const namesQuery = concatenate(containsNames, 'or');

    const ratingQueryIfNeeded = rating ? ` and .//div[contains(text(), "${rating}")]` : ``;

    let playersOnSale = 0;
    while (true) {
        // The page is reloaded every time we put on sale a player,
        // so we need to get the player rows again

        const xpath = `//h2[(${sectionsQuery})]/parent::header/parent::section//li[contains(@class, "listFUTItem") and .//div[${namesQuery}]${ratingQueryIfNeeded}]`;
        const players = await page.$x(xpath);

        if (players.length > 0) {
            const onSale = await sellPlayer(players[0], operation.price, page);
            playersOnSale += onSale ? 1 : 0;
        } else {
            break;
        }
    }
    return playersOnSale;
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

const sellPlayer = async (player: ElementHandle, price: number, page: Page): Promise<boolean> => {
    await player.click();

    const listButton = await page.waitForXPath(
        `//span[contains(text(), "List on Transfer Market") or contains(text(), "Re-list Item")]`
    );

    if (listButton) {
        await listButton.click();

        // Sibling input of "Start price"
        await typePriceInInput(page, price, 'Start Price');

        // Sibling input of "Buy now price"
        await typePriceInInput(page, price, 'Buy Now Price');

        const sellButton = await page.waitForXPath(`//button[contains(text(),"List Item")]`);
        if (sellButton) {
            // console.log(sellButton);
            await sellButton.click();
            console.log('On sale!');
            await page.waitFor(1000);
            return true;
        } else {
            console.log('sellButton cannot be found');
        }
    } else {
        console.log('listButton cannot be found');
    }

    return false;
};

const typePriceInInput = async (
    transferTargetsPage: Page,
    price: number,
    titleFilter: string
): Promise<void> => {
    await transferTargetsPage.waitFor(1000);
    const startPriceInput = await transferTargetsPage.$x(
        `.//span[contains(text(), "${titleFilter}")]/parent::div/parent::div//input[contains(@class, "numericInput")]`
    );
    await startPriceInput[0].click();
    await transferTargetsPage.waitFor(500);

    return startPriceInput[0].type(String(price), {
        delay: 80,
    });
};
