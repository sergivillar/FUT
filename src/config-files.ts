import fs from 'fs';
import {PlayerConfig} from './models';
// @ts-ignore
import readYaml from 'read-yaml';

const CONFIG_PLAYERS_FOLDER = './player-configs';

export const readPlayerConfig = (file: string): Promise<PlayerConfig> =>
    new Promise((resolve, reject) => {
        readYaml(CONFIG_PLAYERS_FOLDER + '/' + file, (err: string, data: PlayerConfig) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

export const readConfigsInFolder = async (): Promise<string[]> =>
    new Promise((resolve, reject) => {
        fs.readdir(CONFIG_PLAYERS_FOLDER, (err, files) => {
            const filtered = files.filter(file => !file.includes('_template') && file.endsWith('.yml'));
            if (err == null) {
                resolve(filtered);
            } else {
                reject(err);
            }
        });
    });
