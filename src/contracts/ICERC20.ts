import BN from "bn.js";
import { Address } from "web3x/address";
import { EventLog, TransactionReceipt } from "web3x/formatters";
import { Contract, ContractOptions, TxCall, TxSend, EventSubscriptionFactory } from "web3x/contract";
import { Eth } from "web3x/eth";
import abi from "./ICERC20Abi";
interface ICERC20Events {
}
interface ICERC20EventLogs {
}
interface ICERC20TxEventLogs {
}
export interface ICERC20TransactionReceipt extends TransactionReceipt<ICERC20TxEventLogs> {
}
interface ICERC20Methods {
    approve(spender: Address, value: number | string | BN): TxSend<ICERC20TransactionReceipt>;
    balanceOf(account: Address): TxCall<string>;
    transferFrom(_from: Address, _to: Address, _value: number | string | BN): TxSend<ICERC20TransactionReceipt>;
    transfer(_to: Address, _value: number | string | BN): TxSend<ICERC20TransactionReceipt>;
    mint(a0: number | string | BN): TxSend<ICERC20TransactionReceipt>;
    redeem(redeemTokens: number | string | BN): TxSend<ICERC20TransactionReceipt>;
    repayBorrow(repayAmount: number | string | BN): TxSend<ICERC20TransactionReceipt>;
    exchangeRateCurrent(): TxCall<string>;
    borrowBalanceCurrent(account: Address): TxCall<string>;
}
export interface ICERC20Definition {
    methods: ICERC20Methods;
    events: ICERC20Events;
    eventLogs: ICERC20EventLogs;
}
export class ICERC20 extends Contract<ICERC20Definition> {
    constructor(eth: Eth, address?: Address, options?: ContractOptions) {
        super(eth, abi, address, options);
    }
    deploy(): TxSend<ICERC20TransactionReceipt> {
        return super.deployBytecode("0x") as any;
    }
}
export var ICERC20Abi = abi;
