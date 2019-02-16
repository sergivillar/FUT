import {GOLD, PlayerConfig} from '../src/models';

const players: PlayerConfig[] = [
    {
        name: 'Emmanuel Adebayor',
        quality: GOLD,
        rating: 79,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 0,
            maxIterations: 350,
            playersToBuy: 1,
        },
        sell: {price: 1100},
    },
    {
        name: 'Sébastien Corchia',
        quality: GOLD,
        rating: 75,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 0,
            maxIterations: 350,
            playersToBuy: 1,
        },
        sell: {price: 850},
    },
    {
        name: 'Samuel Gigot',
        quality: GOLD,
        rating: 76,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 0,
            maxIterations: 350,
            playersToBuy: 1,
        },
        sell: {price: 500000},
    },
    {
        name: 'Soares',
        quality: GOLD,
        rating: 79,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 700,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 0,
            maxIterations: 700,
            playersToBuy: 1,
        },
        sell: {price: 500000},
    },
    {
        name: 'Jorge Meré',
        quality: GOLD,
        rating: 77,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 350,
            maxIterations: 350,
            playersToBuy: 15,
        },
        sell: {price: 500000},
    },
    {
        name: 'Omar Mascarell',
        quality: GOLD,
        rating: 79,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 350,
            maxIterations: 350,
            playersToBuy: 15,
        },
        sell: {price: 500000},
    },
    {
        name: 'Morgan Sanson',
        quality: GOLD,
        rating: 80,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 350,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 8600,
        },
        buyNow: {
            maxBuyNowPrice: 350,
            maxIterations: 150,
            playersToBuy: 1,
        },
    },
];

export default players;
