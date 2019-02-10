import { getMenuAction, loadPlayerConfig, LOAD_PLAYER_CONFIG, getConfigOperation } from './src/cli';
import puppeteer, {Page} from 'puppeteer';
import chalk from 'chalk';
import ProgressBar from './src/progress-bar';
import {getRandomAwaitTime, playAudio} from './src/utils';
import {goToMarketSection, goToMarket, clickBackButton, clickNextPageButton} from './src/navigaton';
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
import {isNoResultBanner, buyPlayer, bidPlayer} from './src/market-players';
import { OPERATION, BID, BUY_NOW, PlayerConfig, BuyNow, Bid } from './src/models';

let playersBought = 0;
let playerLost = 0;
let iteration = 0;

const maxActiveBids = 2;

const Bar = new ProgressBar();

const buyAllPlayer = async (page: Page, playerConfig: PlayerConfig, operation: BuyNow) => {
    Bar.update(iteration++);

    if (iteration > operation.max_iterations) {
        console.log('\n\n');
        console.log(chalk.blue(`💸 Iterations end. Attempts: ${operation.max_iterations}`));
        console.log(chalk.green(`🔥 Total players bought : ${playersBought}`));
        console.log(chalk.red(`🐀 Total players stolen by a rat kid : ${playerLost}`));
        return process.exit(0);
    }

    await page.waitFor(getRandomAwaitTime(300, 400));
    await searchPlayer(page);

    await Promise.race([
        page.waitFor('.listFUTItem'),
        page.waitForXPath('//h2[contains(text(), "No results found")]'),
    ]);

    const isPlayerNotFound = await isNoResultBanner(page);
    await page.waitFor(getRandomAwaitTime(250, 350));

    if (isPlayerNotFound) {
        await clickBackButton(page);
        await buyAllPlayer(page, playerConfig, operation);
    } else {
        const isPlayerBought = await buyPlayer(page, playerConfig.rating);

        if (isPlayerBought) {
            await playAudio(page);
            playersBought++;
        } else {
            playerLost++;
        }

        if (playersBought === operation.players_to_buy) {
            console.log('\n\n');
            console.log(chalk.blue(`💸 All players neede bought in ${operation.max_iterations} attempts: `));
            console.log(chalk.green(`🔥 Total players bought : ${playersBought}`));
            console.log(chalk.red(`🐀 Total players stolen by a rat kid : ${playerLost}`));
            return process.exit(0);
        }

        await clickBackButton(page);

        await buyAllPlayer(page, playerConfig, operation);
    }
};

const massiveBid = async (
    page: Page,
    playerConfig: PlayerConfig,
    operation: Bid,
    maxActiveBids: number
) => {
    await page.waitFor(getRandomAwaitTime(300, 400));
    await searchPlayer(page);
    await massiveBidRecursion(page, playerConfig, operation, maxActiveBids);
};

const massiveBidRecursion = async (
    page: Page,
    playerConfig: PlayerConfig,
    operation: Bid,
    maxActiveBids: number
) => {
    await page.waitFor(getRandomAwaitTime(300, 400));

    await Promise.race([
        page.waitFor('.listFUTItem'),
        page.waitForXPath('//h2[contains(text(), "No results found")]'),
    ]);

    const isPlayerNotFound = await isNoResultBanner(page);
    await page.waitFor(getRandomAwaitTime(250, 350));

    if (isPlayerNotFound) {
        await clickBackButton(page);
        await massiveBidRecursion(page, playerConfig, operation, maxActiveBids);
    } else {
        await bidPlayer(page, operation.max_bid_price, operation.max_expiration_time, playerConfig.rating);

        await clickNextPageButton(page);

        await massiveBidRecursion(page, playerConfig, operation, maxActiveBids);
    }
};

const executeOperation = async (operation: OPERATION, playerConfig: PlayerConfig) => {
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
    await goToMarket(page);

    await typePlayerOnInput(page, playerConfig.name);
    await selectPlayer(page, playerConfig.name);

    if (playerConfig.quality) {
        await changeQuality(page, playerConfig.quality);
    }

    if (operation === BID && playerConfig.bid) {
        const bid = playerConfig.bid
        if (bid.min_buy_now_price > 0) {
            await setMinBuyNowPrice(page, bid.min_buy_now_price);
        }
        if (bid.max_buy_now_price > 0) {
            await setMaxBuyNowPrice(page, bid.max_buy_now_price);
        }
    
        if (bid.min_bid_price > 0) {
            await setMinBidPrice(page, bid.min_bid_price);
        }
    
        if (bid.max_bid_price > 0) {
            await setMaxBidPrice(page, bid.max_bid_price);
        }
        await massiveBid(page, playerConfig, bid, maxActiveBids);
    }
    else if (operation === BUY_NOW && playerConfig.buy_now) {
        const buyNow = playerConfig.buy_now
        if (buyNow.min_buy_now_price > 0) {
            await setMinBuyNowPrice(page, buyNow.min_buy_now_price);
        }
        if (buyNow.max_buy_now_price > 0) {
            await setMaxBuyNowPrice(page, buyNow.max_buy_now_price);
        }
    
        if (buyNow.min_bid_price > 0) {
            await setMinBidPrice(page, buyNow.min_bid_price);
        }
    
        if (buyNow.max_bid_price > 0) {
            await setMaxBidPrice(page, buyNow.max_bid_price);
        }
        console.log('🚀 Start hunting. Number of attempts: ', buyNow.max_iterations);
        Bar.init(buyNow.max_iterations);
        await buyAllPlayer(page, playerConfig, buyNow);
    }
    else {
        console.log('Unknown operation: ' + operation)
    }
}

(async () => {
    const menuAction = await getMenuAction();
    if (menuAction === LOAD_PLAYER_CONFIG) {
        const playerConfig = await loadPlayerConfig()
        const operation = await getConfigOperation(playerConfig)
        executeOperation(operation, playerConfig)
    }
})();