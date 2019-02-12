export const BUY_NOW = 'Buy now';
export const BID = 'Bid';
export const SELL = 'Sell';

export type OPERATION = typeof BUY_NOW | typeof BID | typeof SELL;

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
    sell?: Sell;
}

interface PlayerMarketPrices {
    minBidPrice?: number;
    maxBidPrice?: number;
    minBuyNowPrice?: number;
    maxBuyNowPrice?: number;
}

export interface Bid extends PlayerMarketPrices {
    maxBidPrice: number;
    maxExpirationTime: number;
}

export interface BuyNow extends PlayerMarketPrices {
    maxIterations: number;
    playersToBuy: number;
}

export interface Sell {
    price: number;
}
