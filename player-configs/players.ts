import {GOLD, PlayerConfig} from '../src/models';

const players: PlayerConfig[] = [
    {
        name: 'Jorge Meré',
        quality: GOLD,
        rating: 77,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 4600,
        },
        buyNow: {
            maxBuyNowPrice: 350,
            maxIterations: 100,
            playersToBuy: 1,
        },
        sell: {price: 100},
    },
];

export default players;
