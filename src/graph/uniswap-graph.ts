const { request } = require('graphql-request');
import { UniswapGraphToken } from './types';

const uniswap_url = `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`;

const tokensQuery = (skip = 0) => `
{
  tokens(skip: ${skip} first: 1000) {
    id
    symbol
    name
    decimals
    tradeVolumeUSD
  }
}
`;

/**
 * Gets the list of uniswap tokens with a trade volume
 * greater than $1000
 */
export async function getUniswapTokenInfo(minimumVolumeUSD: number = 1000): Promise<UniswapGraphToken[]> {
  let skip = 0;
  let tokens = [];
  while (true) {
    const { tokens: newTokens } = await request(uniswap_url, tokensQuery(skip));
    if (newTokens.length) {
      tokens.push(...newTokens);
      skip += 1000;
    } else break;
  }
  return tokens
    .filter(({ tradeVolumeUSD }) => tradeVolumeUSD >= minimumVolumeUSD)
    .map(({ id, ...rest }) => ({ address: id, ...rest }));
}