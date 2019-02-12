import sellPlayer from './src/sell';
import buyPlayer from './src/buy';
import {getMenuAction, loadPlayerConfig, LOAD_PLAYER_CONFIG, getConfigOperation} from './src/cli';
import puppeteer, {Page} from 'puppeteer';
import {getRandomAwaitTime} from './src/utils';
import {
    goToMarketSection,
    goToMarket,
    clickBackButton,
    clickNextPageButton,
    goToTransferTargets,
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
        await bidPlayer(page, operation.maxBidPrice, operation.maxExpirationTime, rating);

        await clickNextPageButton(page);

        await massiveBidRecursion(page, rating, operation);
    }
};

const executeOperation = async (
    operation: OPERATION,
    {name, quality, rating, bid, buyNow, sell}: PlayerConfig
) => {
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

    if (operation === BID || operation === BUY_NOW) {
        await goToMarket(page);

        await typePlayerOnInput(page, name);
        await selectPlayer(page, name);

        if (quality) {
            await changeQuality(page, quality);
        }

        if (operation === BID && bid) {
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
        } else if (operation === BUY_NOW && buyNow) {
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
        }
    } else if (operation === SELL && sell) {
        await goToTransferTargets(page);
        const sold = await sellPlayer(rating, name, sell, page);
        console.log(`⏰ ${sold} players moved to active transfers...`);
    }
};

(async () => {
    const menuAction = await getMenuAction();
    if (menuAction === LOAD_PLAYER_CONFIG) {
        const playerConfig = await loadPlayerConfig();
        const operation = await getConfigOperation(playerConfig);
        await executeOperation(operation, playerConfig);
    }
})();
