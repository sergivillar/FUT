const puppeteer = require('puppeteer');
const chalk = require('chalk');
const ProgressBar = require('./src/progress-bar');
const {getRandomAwaitTime} = require('./src/utils');
const {goToMarketSection, goToMarket, clickBackButton} = require('./src/navigaton');
const {
    setMinBuyNowPrice,
    setMaxBuyNowPrice,
    changeQuality,
    typePlayerOnInput,
    selectPlayer,
    searchPlayer,
} = require('./src/market-section');
const {isNoResultBanner, buyPlayer} = require('./src/market-players');

const MAX_NUMBER_ITERATIONS = 200;

let playersBuyed = 0;
let playerLost = 0;
let iteration = 0;

const playerName = 'Jasper Cillessen';
const playerQuality = 'Special';
const playerMedia = 84;
const minBuyNowPrice = 11000;
const maxBuyNowPrice = 15500;
const playersToBuy = 1;

const Bar = new ProgressBar();

const buyAllPlayer = async (page, playersToBuy) => {
    Bar.update(iteration++);

    if (iteration > MAX_NUMBER_ITERATIONS) {
        console.log('\n\n');
        console.log(chalk.blue('💸 Iterations end. Attempts: ', MAX_NUMBER_ITERATIONS));
        console.log(chalk.green('🔥 Total players buyed :', playersBuyed));
        console.log(chalk.red('🐀 Total players stolen by a rat kid :', playerLost));
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
        await buyAllPlayer(page, playersToBuy);
    } else {
        const isPlayerBuyed = await buyPlayer(page, playerMedia);

        if (isPlayerBuyed) {
            playersBuyed++;
        } else {
            playerLost++;
        }

        if (playersBuyed === playersToBuy) {
            console.log('\n\n');
            console.log(chalk.blue(`💸 All players neede buyed in ${MAX_NUMBER_ITERATIONS} attempts: `));
            console.log(chalk.green('🔥 Total players buyed :', playersBuyed));
            console.log(chalk.red('🐀 Total players stolen by a rat kid :', playerLost));
            return process.exit(0);
        }

        await clickBackButton(page);

        await buyAllPlayer(page, playersToBuy);
    }
};

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--user-data-dir=tmp/chrome-data'],
    });

    const page = await browser.newPage();
    await page.goto('https://www.easports.com/fifa/ultimate-team/web-app/');

    try {
        await page.waitForXPath('//button[contains(text(), "Transfers")]', {
            timeout: 20000,
        });
    } catch (e) {
        console.log('You need to login manually and restart the script after that');
        return;
    }

    console.log('🚀 Start hunting. Number of attempts: ', MAX_NUMBER_ITERATIONS);
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

    Bar.init(MAX_NUMBER_ITERATIONS);
    await buyAllPlayer(page, playersToBuy);
})();
