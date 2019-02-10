
import fs from 'fs';
import {PlayerConfig} from './models';
const readYaml = require('read-yaml');

const CONFIG_PLAYERS_FOLDER = './player-configs';

export const readPlayerConfig = (file: string): Promise<PlayerConfig> => {
    return new Promise((resolve, reject) => {
        readYaml(CONFIG_PLAYERS_FOLDER + '/' + file, (err: string, data: PlayerConfig) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};

export const readConfigsInFolder = async (): Promise<string[]> => {
    return new Promise ((resolve, reject) => {
        fs.readdir(CONFIG_PLAYERS_FOLDER, (err, files) => {
            const filtered = files.filter((file) => !file.includes('_template') && file.endsWith('.yml'))
            if (err == null) {
                resolve(filtered);
            } else {
                reject(err);
            }
            });
    });
};