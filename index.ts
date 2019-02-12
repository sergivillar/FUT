import {sell} from './src/sell';
import {getMenuAction, loadPlayerConfig, LOAD_PLAYER_CONFIG, getConfigOperation} from './src/cli';
import puppeteer, {Page} from 'puppeteer';
import chalk from 'chalk';
import ProgressBar from './src/progress-bar';
import {getRandomAwaitTime, playCashAudio, playRatAudio} from './src/utils';
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
import {isNoResultBanner, buyPlayer, bidPlayer} from './src/market-players';
import {OPERATION, BID, BUY_NOW, PlayerConfig, BuyNow, Bid, SELL} from './src/models';

let playersBought = 0;
let playerLost = 0;
let iteration = 0;

const Bar = new ProgressBar();

const buyAllPlayer = async (page: Page, playerConfig: PlayerConfig, operation: BuyNow) => {
    Bar.update(iteration++);

    if (iteration > operation.maxIterations) {
        console.log('\n\n');
        console.log(chalk.blue(`💸 Iterations end. Attempts: ${operation.maxIterations}`));
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
            await playCashAudio(page);
            playersBought++;
        } else {
            await playRatAudio(page);
            playerLost++;
        }

        if (playersBought === operation.playersToBuy) {
            console.log('\n\n');
            console.log(chalk.blue(`💸 All players neede bought in ${operation.maxIterations} attempts: `));
            console.log(chalk.green(`🔥 Total players bought : ${playersBought}`));
            console.log(chalk.red(`🐀 Total players stolen by a rat kid : ${playerLost}`));
            return process.exit(0);
        }

        await clickBackButton(page);

        await buyAllPlayer(page, playerConfig, operation);
    }
};

const massiveBid = async (page: Page, playerConfig: PlayerConfig, operation: Bid) => {
    await page.waitFor(getRandomAwaitTime(300, 400));
    await searchPlayer(page);
    await massiveBidRecursion(page, playerConfig, operation);
};

const massiveBidRecursion = async (page: Page, playerConfig: PlayerConfig, operation: Bid) => {
    await page.waitFor(getRandomAwaitTime(300, 400));

    await Promise.race([
        page.waitFor('.listFUTItem'),
        page.waitForXPath('//h2[contains(text(), "No results found")]'),
    ]);

    const isPlayerNotFound = await isNoResultBanner(page);
    await page.waitFor(getRandomAwaitTime(250, 350));

    if (isPlayerNotFound) {
        await clickBackButton(page);
        await massiveBidRecursion(page, playerConfig, operation);
    } else {
        await bidPlayer(page, operation.maxBidPrice, operation.maxExpirationTime, playerConfig.rating);

        await clickNextPageButton(page);

        await massiveBidRecursion(page, playerConfig, operation);
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

    if (operation === BID && playerConfig.bid) {
        const bid = playerConfig.bid;
        await goToMarket(page);

        await typePlayerOnInput(page, playerConfig.name);
        await selectPlayer(page, playerConfig.name);

        if (playerConfig.quality) {
            await changeQuality(page, playerConfig.quality);
        }
        if (bid.minBuyNowPrice > 0) {
            await setMinBuyNowPrice(page, bid.minBuyNowPrice);
        }
        if (bid.maxBuyNowPrice > 0) {
            await setMaxBuyNowPrice(page, bid.maxBuyNowPrice);
        }

        if (bid.minBidPrice > 0) {
            await setMinBidPrice(page, bid.minBidPrice);
        }

        if (bid.maxBidPrice > 0) {
            await setMaxBidPrice(page, bid.maxBidPrice);
        }
        await massiveBid(page, playerConfig, bid);
    } else if (operation === BUY_NOW && playerConfig.buyNow) {
        const buyNow = playerConfig.buyNow;
        await goToMarket(page);

        await typePlayerOnInput(page, playerConfig.name);
        await selectPlayer(page, playerConfig.name);

        if (playerConfig.quality) {
            await changeQuality(page, playerConfig.quality);
        }
        if (buyNow.minBuyNowPrice > 0) {
            await setMinBuyNowPrice(page, buyNow.minBuyNowPrice);
        }
        if (buyNow.maxBuyNowPrice > 0) {
            await setMaxBuyNowPrice(page, buyNow.maxBuyNowPrice);
        }

        if (buyNow.minBidPrice > 0) {
            await setMinBidPrice(page, buyNow.minBidPrice);
        }

        if (buyNow.maxBidPrice > 0) {
            await setMaxBidPrice(page, buyNow.maxBidPrice);
        }
        console.log('🚀 Start hunting. Number of attempts: ', buyNow.maxIterations);
        Bar.init(buyNow.maxIterations);
        await buyAllPlayer(page, playerConfig, buyNow);
    } else if (operation === SELL && playerConfig.sell) {
        await goToTransferTargets(page);
        const sold = await sell(playerConfig, playerConfig.sell, page);
        console.log(`⏰ ${sold} players moved to active transfers...`);
    } else {
        console.log('Unknown operation: ' + operation);
    }
};

(async () => {
    const menuAction = await getMenuAction();
    if (menuAction === LOAD_PLAYER_CONFIG) {
        const playerConfig = await loadPlayerConfig();
        const operation = await getConfigOperation(playerConfig);

        if (!operation) {
            console.log(chalk.red('No operation selected'));
            return process.exit(0);
        }

        await executeOperation(operation, playerConfig);
    }
})();
