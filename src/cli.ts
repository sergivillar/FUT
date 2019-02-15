import inquirer from 'inquirer';
import chalk from 'chalk';
import playersConfig from '../player-configs/players';
import {PlayerConfig, OPERATION, BID, BUY_NOW, SELL} from './models';

export const LOAD_PLAYER_CONFIG = 'Load player config';
export const EXIT = 'Exit';
export type MENU_ACTION = typeof EXIT | typeof LOAD_PLAYER_CONFIG;

export const getMenuAction = async (): Promise<MENU_ACTION> => {
    const {menuAction} = await inquirer.prompt([
        {
            type: 'list',
            name: 'menuAction',
            message: 'What do you want to do?',
            choices: [LOAD_PLAYER_CONFIG, EXIT],
        },
    ]);

    return menuAction;
};

export const loadPlayerConfig = async (): Promise<PlayerConfig[]> => {
    const playersNames = playersConfig.map(({name}) => name).sort((lhs, rhs) => lhs.localeCompare(rhs));
    const selectedPlayersName = await selectPlayersName(playersNames);
    const selectedPlayers = playersConfig.filter(({name}) => selectedPlayersName.includes(name));
    printPlayersConfig(selectedPlayers);
    return selectedPlayers;
};

const selectPlayersName = async (names: string[]): Promise<string[]> => {
    const {playersName} = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'playersName',
            message: 'Select at least one player',
            choices: names,
        },
    ]);

    return playersName;
};

const printPlayersConfig = (players: PlayerConfig[]) => {
    for (const {name, rating, quality, bid, buyNow, sell} of players) {
        console.log('\n');
        console.log(chalk.bold(`Player name: ${name}`));

        if (rating) {
            console.log(`Rating: ${rating}`);
        }

        if (quality) {
            console.log(`Player quality: ${quality}`);
        }

        if (bid) {
            console.log(chalk.underline('Bids config') + ':');
            console.log(`  - Min bid price: ${bid.minBidPrice}`);
            console.log(`  - Max bid price: ${bid.maxBidPrice}`);
            console.log(`  - Min buy now price: ${bid.minBuyNowPrice}`);
            console.log(`  - Max buy now price: ${bid.maxBuyNowPrice}`);
            console.log(`  - Max expiration time (seconds): ${bid.maxExpirationTime}`);
        }

        if (buyNow) {
            console.log(chalk.underline('Buy now config') + ':');
            console.log(`  - Min bid price: ${buyNow.minBidPrice}`);
            console.log(`  - Max bid price: ${buyNow.maxBidPrice}`);
            console.log(`  - Min buy now price: ${buyNow.minBuyNowPrice}`);
            console.log(`  - Max buy now price: ${buyNow.maxBuyNowPrice}`);
            console.log(`  - Max iterations: ${buyNow.maxIterations}`);
            console.log(`  - Players to buy: ${buyNow.playersToBuy}`);
        }

        if (sell) {
            console.log(chalk.underline('Sell config') + ':');
            console.log(`  - Price: ${sell.price}`);
        }
    }
};

export const getConfigOperation = async ({bid, buyNow, sell, name}: PlayerConfig): Promise<OPERATION> => {
    const operations = [];

    if (bid) {
        operations.push(BID);
    }
    if (buyNow) {
        operations.push(BUY_NOW);
    }
    if (sell) {
        operations.push(SELL);
    }

    if (operations.length === 0) {
        return Promise.reject('No operations for the player config: ' + name);
    }

    const {operation} = await inquirer.prompt([
        {
            type: 'list',
            name: 'operation',
            message: 'Which operation do you want to execute?',
            choices: operations,
        },
    ]);

    return operation;
};
