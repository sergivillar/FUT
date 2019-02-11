export const BUY_NOW = 'Buy now';
export const BID = 'Bid';
export const SELL = 'Sell';

export type OPERATION = typeof BUY_NOW | typeof BID | typeof SELL;

const SPECIAL = 'Special';
const GOLD = 'Gold';
const SILVER = 'Silver';
const BRONZE = 'Bronze';

export type PLAYERS_QUALITY = typeof SPECIAL | typeof GOLD | typeof SILVER | typeof BRONZE;

export interface PlayerConfig {
    name: string
    rating?: number
    quality?: PLAYERS_QUALITY
    bid?: Bid
    buy_now?: BuyNow
    sell?: Sell
}

export interface Bid {
    min_bid_price: number
    max_bid_price: number
    min_buy_now_price: number
    max_buy_now_price: number
    max_expiration_time: number
}

export interface BuyNow {
    min_bid_price: number
    max_bid_price: number
    min_buy_now_price: number
    max_buy_now_price: number
    max_iterations: number
    players_to_buy: number
}

export interface Sell {
    price: number
}