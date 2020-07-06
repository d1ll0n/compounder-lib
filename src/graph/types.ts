export type CompoundGraphMarket = {
  borrowRate: number;
  cash: number;
  collateralFactor: number;
  exchangeRate: number;
  interestRateModelAddress: string;
  name: string;
  reserves: number;
  supplyRate: number;
  symbol: string;
  address: string;
  totalBorrows: number;
  totalSupply: number;
  underlyingAddress: string;
  underlyingName: string;
  underlyingPrice: number;
  underlyingSymbol: string;
  reserveFactor: number;
  underlyingPriceUSD: number;
}

export type UniswapGraphToken = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  tradeVolumeUSD: number;
}