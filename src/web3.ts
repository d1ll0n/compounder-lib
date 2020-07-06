import Web3 from 'web3';
import { Eth } from 'web3x/eth';
import { LegacyProviderAdapter } from 'web3x/providers';
import { Pair as UniswapPair, Token as UniswapToken } from '@uniswap/sdk';
import { IERC20 } from './contracts/IERC20';
import { ICERC20 } from './contracts/ICERC20';
import { AddressLike, toAddress, toHex, isAddressLike } from './utils/to';
import { Compounder } from './contracts/Compounder';

const IERC20Abi = require('./abi/IERC20.json');
const ICERC20Abi = require('./abi/ICERC20.json');
const CompounderAbi = require('./abi/Compounder.json');

const infura_url = `wss://mainnet.infura.io/ws/v3/442bad44b92344b7b5294e4329190fea`;

const baseWeb3 = () => new Web3(new Web3.providers.WebsocketProvider(infura_url));

export type UniswapTokenLike = AddressLike | UniswapToken;

export class Web3Wrapper {
  public eth: Eth;
  constructor(
    public web3: Web3 = baseWeb3()
  ) {
    this.eth = new Eth(new LegacyProviderAdapter(<any> web3.currentProvider));
  }

  getToken(address: AddressLike): IERC20 {
    return new IERC20(this.eth, toAddress(address));
  }

  getWeb3Token(address: AddressLike) {
    return new this.web3.eth.Contract(IERC20Abi, toHex(address));
  }

  getCToken(address: AddressLike): ICERC20 {
    return new ICERC20(this.eth, toAddress(address));
  }

  getWeb3CToken(address: AddressLike) {
    return new this.web3.eth.Contract(ICERC20Abi, toHex(address));
  }

  getCompounder(address: AddressLike): Compounder {
    return new Compounder(this.eth, toAddress(address));
  }

  getWeb3Compounder(address: AddressLike) {
    return new this.web3.eth.Contract(CompounderAbi, toHex(address));
  }

  async getUniswapToken(address: AddressLike, symbol?: string, name?: string): Promise<UniswapToken> {
    return UniswapToken.fetchData(1, toHex(address), undefined, symbol, name);
  }

  async getUniswapPair(token1: UniswapTokenLike, token2: UniswapTokenLike): Promise<UniswapPair> {
    token1 = isAddressLike(token1) ? await this.getUniswapToken(token1) : token1;
    token2 = isAddressLike(token2) ? await this.getUniswapToken(token2) : token2;
    return UniswapPair.fetchData(token1, token2);
  }
}