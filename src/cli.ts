import inquirer from 'inquirer';
import chalk from 'chalk';
import {PlayerConfig, OPERATION, BID, BUY_NOW} from './models';
import {readConfigsInFolder, readPlayerConfig} from './config-files';

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
    const playerConfigs = await readConfigsInFolder();
    const playerConfigFileName = await getPlayerConfigFileName(playerConfigs);
    const playerConfig = await readPlayerConfig(playerConfigFileName);
    printPlayerConfig(playerConfig);
    return playerConfig;
};

const getPlayerConfigFileName = async (files: string[]): Promise<string> => {
    const {configFile} = await inquirer.prompt([
        {
            type: 'list',
            name: 'configFile',
            message: 'Which file config do you want to execute?',
            choices: files,
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
        console.log(`  - Min bid price: ${bid.min_bid_price}`);
        console.log(`  - Max bid price: ${bid.max_bid_price}`);
        console.log(`  - Min buy now price: ${bid.min_buy_now_price}`);
        console.log(`  - Max buy now price: ${bid.max_buy_now_price}`);
        console.log(`  - Max expiration time (seconds): ${bid.max_expiration_time}`);
    }
    if (playerConfig.buy_now) {
        const buyNow = playerConfig.buy_now;
        console.log(chalk.underline('Buy now config') + ':');
        console.log(`  - Min bid price: ${buyNow.min_bid_price}`);
        console.log(`  - Max bid price: ${buyNow.max_bid_price}`);
        console.log(`  - Min buy now price: ${buyNow.min_buy_now_price}`);
        console.log(`  - Max buy now price: ${buyNow.max_buy_now_price}`);
        console.log(`  - Max iterations: ${buyNow.max_iterations}`);
        console.log(`  - Players to buy: ${buyNow.players_to_buy}`);
    }
    console.log('\n');
};

export const getConfigOperation = async (playerConfig: PlayerConfig): Promise<OPERATION> => {
    const hasBuyNow = playerConfig.buy_now != null;
    const hasBid = playerConfig.bid != null;
    if (hasBuyNow && hasBid) {
        const {operation} = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'Which operation do you want to execute?',
                choices: [BID, BUY_NOW],
            },
        ]);

        return operation;
    } else if (hasBuyNow) {
        return confirmOperation('Do you want to execute the BUY NOW process?', BUY_NOW);
    } else if (hasBid) {
        return confirmOperation('Do you want to execute the BID process?', BID);
    }

    return Promise.reject('N/A Operation');
};

const confirmOperation = async (message: string, operation: OPERATION): Promise<OPERATION> => {
    const {result} = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'result',
            message: message,
            default: true,
        },
    ]);

    if (result) {
        return operation;
    } else {
        return Promise.reject('Operation cancelled!');
    }
};
