import puppeteer, {Page} from 'puppeteer';
import chalk from 'chalk';
import inquirer from 'inquirer';
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

const SPECIAL = 'Special';
const GOLD = 'Gold';
const SILVER = 'Silver';
const BRONZE = 'Bronze';

export type PLAYERS_QUALITY = typeof SPECIAL | typeof GOLD | typeof SILVER | typeof BRONZE;

const MAX_NUMBER_ITERATIONS = 100;

let playersBought = 0;
let playerLost = 0;
let iteration = 0;

const playerName = 'Jorge Meré';
const playerQuality = 'Gold';
const playerMedia = 77;
const minBuyNowPrice = 0;
const minBidPrice = 0;
const maxBidPrice = 0;
const maxBuyNowPrice = 0;
const maxExpirationTime = 600; // Seconds
const maxActiveBids = 2;
const playersToBuy = 8;

const Bar = new ProgressBar();

const buyAllPlayer = async (page: Page, playersToBuy: number, maxIterations = MAX_NUMBER_ITERATIONS) => {
    Bar.update(iteration++);

    if (iteration > maxIterations) {
        console.log('\n\n');
        console.log(chalk.blue(`💸 Iterations end. Attempts: ${maxIterations}`));
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
        await buyAllPlayer(page, playersToBuy, maxIterations);
    } else {
        const isPlayerBought = await buyPlayer(page, playerMedia);

        if (isPlayerBought) {
            await playAudio(page);
            playersBought++;
        } else {
            playerLost++;
        }

        if (playersBought === playersToBuy) {
            console.log('\n\n');
            console.log(chalk.blue(`💸 All players neede bought in ${maxIterations} attempts: `));
            console.log(chalk.green(`🔥 Total players bought : ${playersBought}`));
            console.log(chalk.red(`🐀 Total players stolen by a rat kid : ${playerLost}`));
            return process.exit(0);
        }

        await clickBackButton(page);

        await buyAllPlayer(page, playersToBuy, maxIterations);
    }
};

const massiveBid = async (
    page: Page,
    maxBidPrice: number,
    maxExpirationTime: number,
    maxActiveBids: number
) => {
    await page.waitFor(getRandomAwaitTime(300, 400));
    await searchPlayer(page);
    await massiveBidRecursion(page, maxBidPrice, maxExpirationTime, maxActiveBids);
};

const massiveBidRecursion = async (
    page: Page,
    maxBidPrice: number,
    maxExpirationTime: number,
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
        await massiveBidRecursion(page, maxBidPrice, maxExpirationTime, maxActiveBids);
    } else {
        await bidPlayer(page, playerMedia, maxBidPrice, maxExpirationTime);

        // if (isPlayerBought) {
        //     playersBought++;
        // } else {
        //     playerLost++;
        // }

        // if (playersBought === playersToBuy) {
        //     console.log('\n\n');
        //     console.log(chalk.blue(`💸 All players neede bought in ${MAX_NUMBER_ITERATIONS} attempts: `));
        //     console.log(chalk.green(`🔥 Total players bought : ${playersBought}`));
        //     console.log(chalk.red(`🐀 Total players stolen by a rat kid : ${playerLost}`));
        //     return process.exit(0);
        // }

        await clickNextPageButton(page);

        await massiveBidRecursion(page, maxBidPrice, maxExpirationTime, maxActiveBids);
    }
};

const BUY_NOW = 'Buy now';
const BID = 'Bid';

(async () => {
    const {bidOrBuy} = await inquirer.prompt([
        {
            type: 'list',
            name: 'bidOrBuy',
            message: 'What do you want to do?',
            choices: [BUY_NOW, BID],
        },
    ]);

    const {maxIterations} = await inquirer.prompt([
        {
            type: 'input',
            name: 'maxIterations',
            message: 'How many iterations do you want?',
            default: MAX_NUMBER_ITERATIONS,
            when: () => bidOrBuy === BUY_NOW,
            validate: iterations => !!parseInt(iterations),
        },
    ]);

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

    console.log('🚀 Start hunting. Number of attempts: ', maxIterations || MAX_NUMBER_ITERATIONS);
    await goToMarketSection(page);
    await goToMarket(page);

    await typePlayerOnInput(page, playerName);
    await selectPlayer(page, playerName);

    if (playerQuality) {
        await changeQuality(page, playerQuality);
    }

    if (minBuyNowPrice) {
        await setMinBuyNowPrice(page, minBuyNowPrice);
    }
    if (maxBuyNowPrice) {
        await setMaxBuyNowPrice(page, maxBuyNowPrice);
    }

    if (minBidPrice) {
        await setMinBidPrice(page, minBidPrice);
    }

    if (maxBidPrice) {
        await setMaxBidPrice(page, maxBidPrice);
    }

    if (bidOrBuy === BUY_NOW) {
        Bar.init(maxIterations || MAX_NUMBER_ITERATIONS);
        await buyAllPlayer(page, playersToBuy, maxIterations);
    } else {
        await massiveBid(page, maxBidPrice, maxExpirationTime, maxActiveBids);
    }
})();
