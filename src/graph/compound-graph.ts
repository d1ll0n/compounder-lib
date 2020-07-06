import { CompoundGraphMarket } from "./types";

const { request } = require('graphql-request');

const compound_url = `https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2`;

const marketsQuery = `
{
  markets {
    borrowRate
    cash
    collateralFactor
    exchangeRate
    interestRateModelAddress
    name
    reserves
    supplyRate
    symbol
    id
    totalBorrows
    totalSupply
    underlyingAddress
    underlyingName
    underlyingPrice
    underlyingSymbol
    reserveFactor
    underlyingPriceUSD
  }
}
`;

/**
 * Gets the list of uniswap tokens with a trade volume
 * greater than $1000
 */
export async function getCompoundTokens(): Promise<CompoundGraphMarket[]> {
  const { markets } = await request(compound_url, marketsQuery);
  return markets.map(({ id, ...rest }) => ({ address: id, ...rest }));
}