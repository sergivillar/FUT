import {GOLD, SPECIAL, PlayerConfig} from '../src/models';

const players: PlayerConfig[] = [
    {
        name: 'José María Giménez',
        quality: GOLD,
        rating: 84,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 4600,
        },
        buyNow: {
            maxBuyNowPrice: 3000,
            maxIterations: 150,
            playersToBuy: 5,
        },
        sell: {price: 100},
    },
    {
        name: 'Carvajal',
        quality: GOLD,
        rating: 84,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 4600,
        },
        buyNow: {
            maxBuyNowPrice: 3000,
            maxIterations: 150,
            playersToBuy: 5,
        },
        sell: {price: 100},
    },
    {
        name: 'Koke',
        quality: GOLD,
        rating: 85,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 4600,
        },
        buyNow: {
            maxBuyNowPrice: 10000,
            maxIterations: 150,
            playersToBuy: 5,
        },
        sell: {price: 100},
    },
    {
        name: 'Marco Asensio',
        quality: GOLD,
        rating: 85,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 4600,
        },
        buyNow: {
            maxBuyNowPrice: 10000,
            maxIterations: 150,
            playersToBuy: 5,
        },
        sell: {price: 100},
    },
    {
        name: 'Miranda',
        quality: GOLD,
        rating: 85,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 4600,
        },
        buyNow: {
            maxBuyNowPrice: 10000,
            maxIterations: 150,
            playersToBuy: 5,
        },
        sell: {price: 100},
    },
    {
        name: 'Saúl',
        quality: GOLD,
        rating: 85,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 4600,
        },
        buyNow: {
            maxBuyNowPrice: 10000,
            maxIterations: 150,
            playersToBuy: 5,
        },
        sell: {price: 100},
    },
    {
        name: 'Pizzi',
        quality: SPECIAL,
        rating: 85,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 4600,
        },
        buyNow: {
            maxBuyNowPrice: 24000,
            maxIterations: 150,
            playersToBuy: 5,
        },
        sell: {price: 100},
    },
];

export default players;
