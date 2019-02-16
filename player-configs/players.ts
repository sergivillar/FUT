import {GOLD, SPECIAL, PlayerConfig} from '../src/models';

const players: PlayerConfig[] = [
    {
        name: 'José María Giménez',
        quality: GOLD,
        rating: 84,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 2900,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 240,
        },
        buyNow: {
            maxBuyNowPrice: 3000,
            maxIterations: 150,
            playersToBuy: 5,
        },
    },
    {
        name: 'Carvajal',
        quality: GOLD,
        rating: 84,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 3000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 120,
        },
        buyNow: {
            maxBuyNowPrice: 3000,
            maxIterations: 150,
            playersToBuy: 5,
        },
    },
    {
        name: 'Koke',
        quality: GOLD,
        rating: 85,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 3000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 10000,
            maxIterations: 150,
            playersToBuy: 5,
        },
    },
    {
        name: 'Marco Asensio',
        quality: GOLD,
        rating: 85,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 9800,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 10000,
            maxIterations: 150,
            playersToBuy: 5,
        },
    },
    {
        name: 'Miranda',
        quality: GOLD,
        rating: 85,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 10000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 10000,
            maxIterations: 150,
            playersToBuy: 5,
        },
    },
    {
        name: 'Saúl',
        quality: GOLD,
        rating: 85,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 10000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 10000,
            maxIterations: 150,
            playersToBuy: 5,
        },
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
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 24000,
            maxIterations: 150,
            playersToBuy: 5,
        },
    },
    {
        name: 'Lucas Hernández',
        quality: GOLD,
        rating: 82,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 3500,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 3500,
            maxIterations: 350,
            playersToBuy: 4,
        },
        sell: {price: 6000},
    },
    {
        name: 'Rodrigo',
        quality: GOLD,
        rating: 84,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 3000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 3000,
            maxIterations: 150,
            playersToBuy: 5,
        },
    },
    {
        name: 'Marco Verratti',
        quality: GOLD,
        rating: 86,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 12000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 16000,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 16000,
            maxIterations: 150,
            playersToBuy: 2,
        },
    },
    {
        name: 'Keylor Navas',
        quality: GOLD,
        rating: 87,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 12000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 22000,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 22000,
            maxIterations: 150,
            playersToBuy: 2,
        },
    },
    {
        name: 'Ciro Immobile',
        quality: GOLD,
        rating: 87,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 12000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 22000,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 22000,
            maxIterations: 150,
            playersToBuy: 2,
        },
    },
    {
        name: 'Nicolás Otamendi',
        quality: GOLD,
        rating: 86,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 12000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 22000,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 16500,
            maxIterations: 150,
            playersToBuy: 2,
        },
    },
    {
        name: 'Isco',
        quality: GOLD,
        rating: 89,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 12000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 22000,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 42500,
            maxIterations: 150,
            playersToBuy: 1,
        },
    },
    {
        name: 'Felipe Anderson',
        quality: GOLD,
        rating: 84,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 12000,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 22000,
            maxExpirationTime: 3600,
        },
        buyNow: {
            maxBuyNowPrice: 4000,
            maxIterations: 150,
            playersToBuy: 1,
        },
    },
    {
        name: 'Takashi Inui',
        quality: SPECIAL,
        rating: 80,
        buyNow: {
            maxBuyNowPrice: 13750,
            maxIterations: 175,
            playersToBuy: 2,
        },
    },
];

export default players;
