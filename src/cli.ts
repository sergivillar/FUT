import inquirer from 'inquirer';
import chalk from 'chalk';
import {PlayerConfig, OPERATION, BID, BUY_NOW, SELL} from './models';

export const LOAD_LIST = 'Load list';
export const LOAD_PLAYERS = 'Load player';
export type MENU_ACTION = typeof LOAD_LIST | typeof LOAD_PLAYERS;

export const getMenuAction = async (): Promise<MENU_ACTION> => {
    const {menuAction} = await inquirer.prompt([
        {
            type: 'list',
            name: 'menuAction',
            message: 'What do you want to do?',
            choices: [LOAD_LIST, LOAD_PLAYERS],
        },
    ]);

    return menuAction;
};

export const loadPlayersConfig = async (mode: MENU_ACTION): Promise<PlayerConfig[]> => {
    let playersConfig: PlayerConfig[] = [];

    if (mode === LOAD_LIST) {
        playersConfig = require('../player-configs/list').default;
    } else if (mode === LOAD_PLAYERS) {
        playersConfig = require('../player-configs/players').default;
    }

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

export const getConfigOperation = async (players: PlayerConfig[]): Promise<OPERATION> => {
    const operations = [];

    if (players.every(({bid}) => !!bid)) {
        operations.push(BID);
    }
    if (players.every(({buyNow}) => !!buyNow)) {
        operations.push(BUY_NOW);
    }
    if (players.every(({sell}) => !!sell)) {
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
