import {GOLD, PlayerConfig, SPECIAL} from '../src/models';

const players: PlayerConfig[] = [
    {
        name: 'Jeison Murillo',
        quality: GOLD,
        rating: 81,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 650,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 300,
        },
        sell: {price: 1600},
    },
    {
        name: 'Jorge Meré',
        quality: GOLD,
        rating: 77,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 400,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        sell: {price: 1100},
    },
    {
        name: 'Sébastien Corchia',
        quality: GOLD,
        rating: 75,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 400,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        sell: {price: 1000},
    },
    {
        name: 'Steven Defour',
        quality: GOLD,
        rating: 80,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 450,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        sell: {price: 1500},
    },
    {
        name: 'Alexey Miranchuk',
        quality: SPECIAL,
        rating: 78,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 500,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        sell: {price: 2100},
    },
    {
        name: 'Filip Krovinović',
        quality: SPECIAL,
        rating: 79,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 500,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        sell: {price: 2100},
    },
    {
        name: 'Alfa Semedo',
        quality: SPECIAL,
        rating: 77,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 650,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        sell: {price: 2100},
    },
    {
        name: 'Andriy Pyatov',
        quality: SPECIAL,
        rating: 79,
        bid: {
            minBidPrice: 0,
            maxBidPrice: 650,
            minBuyNowPrice: 0,
            maxBuyNowPrice: 0,
            maxExpirationTime: 3600,
        },
        sell: {price: 2100},
    },
];

export default players;
