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
    },
];

export default players;
