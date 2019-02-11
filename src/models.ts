export const BUY_NOW = 'Buy now';
export const BID = 'Bid';

export type OPERATION = typeof BUY_NOW | typeof BID;

export const SPECIAL = 'Special';
export const GOLD = 'Gold';
export const SILVER = 'Silver';
export const BRONZE = 'Bronze';

export type PLAYERS_QUALITY = typeof SPECIAL | typeof GOLD | typeof SILVER | typeof BRONZE;

export interface PlayerConfig {
    name: string;
    rating: number;
    quality: PLAYERS_QUALITY;
    bid?: Bid;
    buyNow?: BuyNow;
}

interface PlayerMarketPrices {
    minBidPrice: number;
    maxBidPrice: number;
    minBuyNowPrice: number;
    maxBuyNowPrice: number;
}

export interface Bid extends PlayerMarketPrices {
    maxExpirationTime: number;
}

export interface BuyNow extends PlayerMarketPrices {
    maxIterations: number;
    playersTuBuy: number;
}
