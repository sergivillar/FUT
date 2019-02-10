import {Page} from 'puppeteer';
import {getRandomAwaitTime, getSecondsFromTime} from './utils';

export const isNoResultBanner = async (page: Page) => {
    const noResultBanner = await page.$x('//h2[contains(text(), "No results found")]');

    return !!noResultBanner.length;
};

export const buyButtonClick = async (page: Page) => {
    await page.click('.buyButton');
};

export const bidButtonClick = async (page: Page): Promise<any> => {
    const bitButton = (await page.waitFor('.bidButton')).asElement();

    if (!bitButton) {
        return await bidButtonClick(page);
    }

    await bitButton.click();
};

export const buyPlayer = async (page: Page, rating?: number) => {
    let players;
    try {
        if (rating) {
            players = await page.$x(
                  `//li[contains(@class, "listFUTItem") and .//div[contains(text() , ${rating})]]`
              );
        }
        else {
            players = await page.$$('.listFUTItem')    
        }

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
        if (rating) {
           console.log(rating);
        }
        console.log(`//li[contains(@class, "listFUTItem") and .//div[contains(text() , ${rating})]]`);
        console.log(players);
    }
};

export const bidPlayer = async (
    page: Page,
    maxBidPrice: number,
    maxExpirationTime: number,
    rating?: number,
) => {
    let players;
    if (rating) {
        players = await page.$x(
            `//li[contains(@class, "listFUTItem") and not(contains(@class, "highest-bid")) and not(contains(@class, "expired")) and .//div[contains(text() , "${rating}")]]`
        );
    }
    else {
        players = await page.$$('.listFUTItem:not(.expired):not(.highest-bid)')
    }

    for (const player of players) {
        await player.click();

        const nextBidInput = await page.waitFor('.numericInput');

        const nextBid = (await (await nextBidInput.getProperty('value')).jsonValue()) as string;
        const nextBidNumber = parseFloat(nextBid.replace(/,/g, ''));

        const expiredTimeSpan = await page.$x(
            '//span[contains(text(), "Time Remaining")]/following-sibling::span'
        );

        if (expiredTimeSpan.length > 1) {
            console.log('Error reading player expired time');
            continue;
        }
        const expiredTimeText = (await (await expiredTimeSpan[0].getProperty(
            'textContent'
        )).jsonValue()) as string;
        const expireTimeInSeconds = getSecondsFromTime(expiredTimeText);

        if (!expireTimeInSeconds || expireTimeInSeconds > maxExpirationTime || nextBidNumber > maxBidPrice) {
            await page.waitFor(getRandomAwaitTime(350, 550));
            continue;
        }

        await page.waitFor(400);

        await bidButtonClick(page);

        await page.waitFor(600);

        // const playerBid = await page.$('.won .player');
    }
};
