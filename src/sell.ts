import {Page} from 'puppeteer';
import {PlayerConfig, Sell} from './models';
export const sell = async (
    playerConfig: PlayerConfig,
    operation: Sell,
    transferTargetsPage: Page
): Promise<number> => {
    let ratingQuery = '';
    if (playerConfig.rating) {
        ratingQuery = ` and .//div[contains(text() , "${playerConfig.rating}")]`;
    }
    const orPreffix = 'or ';
    const nameTokens = playerConfig.name.split(' ').map(word => {
        return `${orPreffix}.//div[contains(text() , "${word}")]`;
    });
    const nameQuery = nameTokens.join(' ').substr(orPreffix.length);

    const xpath = `//li[contains(@class, "listFUTItem") and contains(@class, "has-auction-data") and contains(@class, "won") and (${nameQuery})${ratingQuery}]`;
    const players = await transferTargetsPage.$x(xpath);

    for (const player of players) {
        await player.click();

        await transferTargetsPage.waitFor(500);

        const listButton = await transferTargetsPage.$x(
            `//span[contains(text(), "List on Transfer Market")]`
        );
        await transferTargetsPage.waitFor(500);
        await listButton[0].click();
        await transferTargetsPage.waitFor(500);

        // Sibling input of "Start price"
        await typePriceInInput(transferTargetsPage, operation.price, 'Start Price');

        // Sibling input of "Buy now price"
        await typePriceInInput(transferTargetsPage, operation.price, 'Buy Now Price');

        const sellButton = await transferTargetsPage.$x(`//button[contains(text(),"List Item")]`);
        await transferTargetsPage.waitFor(500);
        await sellButton[0].click();
        await transferTargetsPage.waitFor(500);
    }

    return players.length;
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
