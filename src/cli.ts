import inquirer from 'inquirer';
import chalk from 'chalk';
import {PlayerConfig, OPERATION, BID, BUY_NOW} from './models';
import playersConfig from '../player-configs/prueba';

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

export const loadPlayerConfig = async (): Promise<PlayerConfig> => {
    const playersNames = playersConfig.map(({name}) => name);
    const selectedPlayerName = await selectPlayerName(playersNames);
    const selectedPlayer = playersConfig.find(({name}) => name === selectedPlayerName) as PlayerConfig;
    printPlayerConfig(selectedPlayer);
    return selectedPlayer;
};

const selectPlayerName = async (names: string[]): Promise<string> => {
    const {configFile} = await inquirer.prompt([
        {
            type: 'list',
            name: 'configFile',
            message: 'Which file config do you want to execute?',
            choices: names,
        },
    ]);

    return configFile;
};

const printPlayerConfig = (playerConfig: PlayerConfig) => {
    console.log('\n');

    console.log(chalk.bold(`Player name: ${playerConfig.name}`));

    if (playerConfig.rating) {
        console.log(`Rating: ${playerConfig.rating}`);
    }

    if (playerConfig.quality) {
        console.log(`Player quality: ${playerConfig.quality}`);
    }

    if (playerConfig.bid) {
        const bid = playerConfig.bid;
        console.log(chalk.underline('Bids config') + ':');
        console.log(`  - Min bid price: ${bid.minBidPrice}`);
        console.log(`  - Max bid price: ${bid.maxBidPrice}`);
        console.log(`  - Min buy now price: ${bid.minBuyNowPrice}`);
        console.log(`  - Max buy now price: ${bid.maxBuyNowPrice}`);
        console.log(`  - Max expiration time (seconds): ${bid.maxExpirationTime}`);
    }
    if (playerConfig.buyNow) {
        const buyNow = playerConfig.buyNow;
        console.log(chalk.underline('Buy now config') + ':');
        console.log(`  - Min bid price: ${buyNow.minBidPrice}`);
        console.log(`  - Max bid price: ${buyNow.maxBidPrice}`);
        console.log(`  - Min buy now price: ${buyNow.minBuyNowPrice}`);
        console.log(`  - Max buy now price: ${buyNow.maxBuyNowPrice}`);
        console.log(`  - Max iterations: ${buyNow.maxIterations}`);
        console.log(`  - Players to buy: ${buyNow.playersTuBuy}`);
    }
    console.log('\n');
};

export const getConfigOperation = async ({buyNow, bid}: PlayerConfig): Promise<OPERATION | null> => {
    let operationToExecute: OPERATION | null = null;
    if (buyNow && bid) {
        const {operation} = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'Which operation do you want to execute?',
                choices: [BID, BUY_NOW],
            },
        ]);

        operationToExecute = operation;
    } else if (buyNow) {
        operationToExecute = await confirmOperation('Do you want to execute the BUY NOW process?', BUY_NOW);
    } else if (bid) {
        operationToExecute = await confirmOperation('Do you want to execute the BID process?', BID);
    }

    return operationToExecute;
};

const confirmOperation = async (message: string, operation: OPERATION): Promise<OPERATION | null> => {
    const {result} = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'result',
            default: true,
            message,
        },
    ]);

    return result ? operation : null;
};
