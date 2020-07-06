import { Address } from 'web3x/address';
import { Token as UniswapToken, TokenAmount } from '@uniswap/sdk';
import BN from 'bn.js'
import { Web3Wrapper } from './web3';
import Web3 from 'web3';
import { AddressLike, toHex, toBn } from './utils/to';
import { getUniswapTokenInfo, getCompoundTokens } from './graph';
import { getTokenIconUrl } from './utils/token-icon';
import { swapTokenForCToken_Input, swapCTokenForToken_Input, swapCTokenForCToken_Input } from './inputs';

export type TokenInfo = {
  address: string;
  name: string;
  symbol: string;
  decimals?: number;
  tradeVolumeUSD?: number;
  iconUrl?: string;
  balance?: number;
}

export type BaseTokenQueryOptions = {
  requireBalance?: boolean,
  minimumVolumeUSD?: number
}

export type UniswapTokenInfo = TokenInfo & { cTokenAddress?: string; }

export type CTokenInfo = TokenInfo & {
  underlyingAddress: string;
  borrowBalance?: number;
  underlyingName: string;
  underlyingSymbol: string;
  exchangeRate?: string;
}

export type SwapTokenForCToken_Data = {
  sellToken: string;
  buyToken: string;
  buyCToken: string;
  sellAmount: string;
  minBuyToken: string;
  minBuyCToken: string;
}

export class QueryEngine extends Web3Wrapper {
  uniswapTokens: { [key: string]: UniswapTokenInfo } = {};
  compoundTokens: { [key: string]: CTokenInfo } = {};
  myAddress: Address;

  constructor(
    myAddress: string,
    web3?: Web3
  ) {
    super(web3);
    this.myAddress = Address.fromString(myAddress);
  }

  async init(includeBaseTokens?: boolean, opts?: BaseTokenQueryOptions) {
    if (includeBaseTokens) await this.setTokenInfo(opts);
    await this.setCTokenInfo();
  }

  async setCTokenInfo() {
    const cTokensData = await getCompoundTokens();
    const proms = [];
    for (let tokenInfo of cTokensData) {
      const {
        address, underlyingAddress,
        name, underlyingName,
        symbol, underlyingSymbol,
      } = tokenInfo;
      const token: CTokenInfo = {
        address, underlyingAddress,
        name, underlyingName,
        symbol, underlyingSymbol,
      }
      const cToken = this.getCToken(tokenInfo.address);
      let cProms = [
        cToken.methods.borrowBalanceCurrent(this.myAddress).call().then((borrow) => {
          token.borrowBalance = +borrow;
        }),
        cToken.methods.exchangeRateCurrent().call().then((rate) => {
          token.exchangeRate = rate;
        })
      ];
      this.compoundTokens[address] = token;
      if (this.uniswapTokens[underlyingAddress]) {
        this.uniswapTokens[underlyingAddress].cTokenAddress = address;
      }
      proms.push(Promise.all(cProms));
    }
    await Promise.all(proms);
  }

  async setTokenInfo(opts?: BaseTokenQueryOptions) {
    let tokens: UniswapTokenInfo[] = await getUniswapTokenInfo();
    for (let token of tokens) token.iconUrl = getTokenIconUrl(token.address);
    if (opts!.minimumVolumeUSD) {
      tokens = tokens.filter(({ tradeVolumeUSD }) => tradeVolumeUSD >= opts.minimumVolumeUSD)
    }
    if (opts.requireBalance) {
      const proms = [];
      for (let i = 0; i < tokens.length; i++) {
        const token = this.getToken(tokens[i].address);
        proms.push(
          token.methods.balanceOf(this.myAddress).call()
            .then((balance) => (tokens[i].balance = +balance))
        );
      }
      await Promise.all(proms);
      tokens = tokens.filter(({ balance }) => balance > 0);
    }
    for (let token of tokens) this.uniswapTokens[token.address] = token;
    
  }

  async getTokenBalance(address: AddressLike): Promise<string> {
    const token = await this.getToken(address);
    return token.methods.balanceOf(this.myAddress).call();
  }

  /**
   * Queries the amount of `outputToken` that can be obtained for `inputAmount` of `inputToken`
   * @param inputToken input token object
   * @param outputToken output token object
   * @param inputAmount hex encoded input amount (must be raw value)
   * @returns hex encoded output value
   */
  async getOutputAmount(
    inputToken: UniswapToken,
    outputToken: UniswapToken,
    inputAmount: string
  ): Promise<string> {
    const pair = await this.getUniswapPair(inputToken, outputToken);
    const [tokenAmount] = pair.getOutputAmount(new TokenAmount(inputToken, inputAmount));
    return `0x${tokenAmount.raw.toString(16)}`;
  }

  /**
   * Queries the amount of `inputToken` that need to be sent to purchase `outputAmount` of `outputToken`
   * @param inputToken input token object
   * @param outputToken output token object
   * @param outputAmount hex encoded output amount (must be raw value)
   * @returns hex encoded output value
   */
  async getInputAmount(
    inputToken: UniswapToken,
    outputToken: UniswapToken,
    outputAmount: string | number | BN
  ): Promise<string> {
    const pair = await this.getUniswapPair(inputToken, outputToken);
    const [tokenAmount] = pair.getInputAmount(new TokenAmount(outputToken, toHex(outputAmount)));
    return tokenAmount.raw.toString(16);
  }

  getCTokenForToken(token: AddressLike): string {
    const address = toHex(token);
    const keys = Object.keys(this.compoundTokens);
    for (let key of keys) {
      const cToken = this.compoundTokens[key];
      if (cToken.underlyingAddress == address) return cToken.address;
    }
    return undefined;
  }

  /**
   * Get the input values for a call to swapTokenForCToken
   * 
   * @param sellToken The address of the base token to sell
   * @param buyToken The address of the base token for the desired cToken to buy
   * @param sellAmount The amount of `sellToken` to sell
   */
  async getInputs_swapTokenForCToken(
    sellToken: AddressLike,
    buyToken: AddressLike,
    sellAmount: string | number | BN
  ): Promise<
    swapTokenForCToken_Input & { expectedCTokens: string }
  > {
    const tokenA = await this.getUniswapToken(sellToken);
    const tokenB = await this.getUniswapToken(buyToken);
    const buyValue = await this.getOutputAmount(tokenA, tokenB, toHex(sellAmount));
    const cTokenAddress = this.getCTokenForToken(buyToken);
    const exchangeRate = new BN(
      this.compoundTokens[cTokenAddress].exchangeRate
    ).div(new BN('de0b6b3a7640000', 'hex'));
    const expectedCTokens = toHex(toBn(buyValue).div(exchangeRate));
    return {
      sellToken: toHex(sellToken),
      buyToken: toHex(buyToken),
      buyCToken: cTokenAddress,
      minBuyToken: buyValue,
      sellAmount: toHex(sellAmount),
      expectedCTokens
    };
  }

  /**
   * Get the input values for a call to swapCTokenForToken
   * 
   * @param sellCToken The address of the cToken to sell
   * @param buyToken The address of the base token to buy
   * @param redeemAmount The amount of `sellCToken` to sell
   */
  async getInputs_swapCTokenForToken(
    sellCToken: AddressLike,
    buyToken: AddressLike,
    redeemAmount: BN | string | number
  ): Promise<swapCTokenForToken_Input> {
    const {
      underlyingAddress: sellToken,
      exchangeRate: sellExchangeRate
    } = this.compoundTokens[toHex(sellCToken)];
    const exchangeRate = new BN(sellExchangeRate).div(new BN('de0b6b3a7640000', 'hex'));
    const expectedSellTokens = toBn(redeemAmount).mul(exchangeRate);
    const tokenA = await this.getUniswapToken(sellToken);
    const tokenB = await this.getUniswapToken(buyToken);
    const buyValue = await this.getOutputAmount(tokenA, tokenB, toHex(expectedSellTokens));
    return {
      sellCToken: toHex(sellCToken),
      sellToken,
      buyToken: toHex(buyToken),
      redeemAmount: toHex(redeemAmount),
      minBuyToken: buyValue
    }
  }

  /**
   * Get the input values for a call to swapTokenForCToken
   * 
   * @param sellCToken The address of the cToken to sell
   * @param buyCToken The address of the cToken to buy
   * @param redeemAmount The amount of `sellCToken` to sell
   */
  async getInputs_swapCTokenforCToken(
    sellCToken: AddressLike,
    buyCToken: AddressLike,
    redeemAmount: BN | string | number
  ): Promise<swapCTokenForCToken_Input & { expectedCTokens: string }> {
    const {
      underlyingAddress: sellToken,
      exchangeRate: _sellExchangeRate
    } = this.compoundTokens[toHex(sellCToken)];
    const {
      underlyingAddress: buyToken,
      exchangeRate: _buyExchangeRate
    } = this.compoundTokens[toHex(buyCToken)];
    const sellExchangeRate = new BN(_sellExchangeRate).div(new BN('de0b6b3a7640000', 'hex'));
    const buyExchangeRate = new BN(_buyExchangeRate).div(new BN('de0b6b3a7640000', 'hex'));
    const expectedSellTokens = sellExchangeRate.mul(toBn(redeemAmount));
    const tokenA = await this.getUniswapToken(sellToken);
    const tokenB = await this.getUniswapToken(buyToken);
    const buyValue = await this.getOutputAmount(tokenA, tokenB, toHex(expectedSellTokens));
    const expectedCTokens = toBn(buyValue).div(buyExchangeRate);
    return {
      sellToken,
      sellCToken: toHex(sellCToken),
      buyToken: buyToken,
      buyCToken: toHex(buyCToken),
      minBuyToken: buyValue,
      expectedCTokens: toHex(expectedCTokens),
      redeemAmount: toHex(redeemAmount)
    }
  }
}