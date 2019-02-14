import {Page} from 'puppeteer';
import chalk from 'chalk';
import ProgressBar from './progress-bar';
import {getRandomAwaitTime, playCashAudio, playRatAudio} from './utils';
import {clickBackButton} from './navigation';
import {searchPlayer} from './market-section';
import {isNoResultBanner, buyPlayer} from './market-players';
import {BuyNow} from './models';

let playersBought = 0;
let playerLost = 0;
let iteration = 0;

const Bar = new ProgressBar();

const buyAllPlayer = async (page: Page, rating: number, operation: BuyNow) => {
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
        await buyAllPlayer(page, rating, operation);
    } else {
        const isPlayerBought = await buyPlayer(page, rating);

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

        await buyAllPlayer(page, rating, operation);
    }
};

export default async (page: Page, rating: number, operation: BuyNow) => {
    iteration = 0;
    playersBought = 0;
    playerLost = 0;

    console.log('🚀 Start hunting. Number of attempts: ', operation.maxIterations);

    Bar.init(operation.maxIterations);

    await buyAllPlayer(page, rating, operation);
};
