import buyPlayer from './src/buy';
import sellPlayer from './src/sell';
import {getMenuAction, loadPlayersConfig, getConfigOperation} from './src/cli';
import puppeteer, {Page} from 'puppeteer';
import {getRandomAwaitTime} from './src/utils';
import {
    goToMarketSection,
    goToMarket,
    clickBackButton,
    clickNextPageButton,
    goToTransferTargets,
    goToTransferList,
} from './src/navigation';
import {
    setMinBuyNowPrice,
    setMaxBuyNowPrice,
    setMinBidPrice,
    setMaxBidPrice,
    changeQuality,
    typePlayerOnInput,
    selectPlayer,
    searchPlayer,
    deletePlayerInput,
} from './src/market-section';
import {isNoResultBanner, bidPlayer} from './src/market-players';
import {OPERATION, BID, BUY_NOW, PlayerConfig, Bid, SELL} from './src/models';

const massiveBid = async (page: Page, rating: number, operation: Bid) => {
    await page.waitFor(getRandomAwaitTime(300, 400));
    await searchPlayer(page);
    await massiveBidRecursion(page, rating, operation);
};

const massiveBidRecursion = async (page: Page, rating: number, operation: Bid) => {
    await page.waitFor(getRandomAwaitTime(300, 400));

    await Promise.race([
        page.waitFor('.listFUTItem'),
        page.waitForXPath('//h2[contains(text(), "No results found")]'),
    ]);

    const isPlayerNotFound = await isNoResultBanner(page);
    await page.waitFor(getRandomAwaitTime(250, 350));

    if (isPlayerNotFound) {
        await clickBackButton(page);
        await massiveBidRecursion(page, rating, operation);
    } else {
        const bidNextPage = await bidPlayer(page, operation.maxBidPrice, operation.maxExpirationTime, rating);

        if (bidNextPage) {
            await clickNextPageButton(page);
            await massiveBidRecursion(page, rating, operation);
        } else {
            await clickBackButton(page);
        }
    }
};

const executeOperation = async (operation: OPERATION, players: PlayerConfig[]) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--user-data-dir=tmp/chrome-data'],
    });

    const page = await browser.newPage();
    await page.goto('https://www.easports.com/fifa/ultimate-team/web-app/');

    try {
        await page.waitForXPath('//button[contains(text(), "Transfers")]', {
            timeout: 25000,
        });
    } catch (e) {
        console.log('You need to login manually and restart the script after that');
        return;
    }

    await goToMarketSection(page);

    if (operation === BID) {
        for (const {name, bid, quality, rating} of players) {
            await goToMarket(page);

            await deletePlayerInput(page);
            await typePlayerOnInput(page, name);
            await selectPlayer(page, name);

            if (!bid) {
                return;
            }

            if (quality) {
                await changeQuality(page, quality);
            }

            if (bid.minBuyNowPrice) {
                await setMinBuyNowPrice(page, bid.minBuyNowPrice);
            }
            if (bid.maxBuyNowPrice) {
                await setMaxBuyNowPrice(page, bid.maxBuyNowPrice);
            }

            if (bid.minBidPrice) {
                await setMinBidPrice(page, bid.minBidPrice);
            }

            if (bid.maxBidPrice) {
                await setMaxBidPrice(page, bid.maxBidPrice);
            }

            await massiveBid(page, rating, bid);
        }
    } else if (operation === BUY_NOW) {
        const {name, quality, rating, buyNow} = players[0];
        await goToMarket(page);

        await typePlayerOnInput(page, name);
        await selectPlayer(page, name);
        await deletePlayerInput(page);

        if (quality) {
            await changeQuality(page, quality);
        }
        if (!buyNow) {
            return;
        }

        if (buyNow.minBuyNowPrice) {
            await setMinBuyNowPrice(page, buyNow.minBuyNowPrice);
        }
        if (buyNow.maxBuyNowPrice) {
            await setMaxBuyNowPrice(page, buyNow.maxBuyNowPrice);
        }

        if (buyNow.minBidPrice) {
            await setMinBidPrice(page, buyNow.minBidPrice);
        }

        if (buyNow.maxBidPrice) {
            await setMaxBidPrice(page, buyNow.maxBidPrice);
        }

        await buyPlayer(page, rating, buyNow);
    } else if (operation === SELL) {
        const {rating, sell} = players[0];

        if (!sell) {
            return;
        }

        await goToTransferTargets(page);
        await page.waitFor(500);
        const putOnSaleFromTransferTargets = await sellPlayer(rating, name, sell, ['Won Items'], page);

        await clickBackButton(page);

        // From transfer list
        await goToTransferList(page);
        const putOnSaleFromTransferList = await sellPlayer(
            rating,
            name,
            sell,
            ['Unsold Items', 'Available Items'],
            page
        );
        console.log(`⏰ Put on sale ${putOnSaleFromTransferList + putOnSaleFromTransferTargets} players...`);

        await clickBackButton(page);
    } else {
        console.log('Unknown operation: ' + operation);
    }
};

(async () => {
    const menuAction = await getMenuAction();
    const playersConfig = await loadPlayersConfig(menuAction);
    const operation = await getConfigOperation(playersConfig);
    await executeOperation(operation, playersConfig);
})();
