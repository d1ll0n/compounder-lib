import BN from "bn.js";
import { Address } from "web3x/address";
import { EventLog, TransactionReceipt } from "web3x/formatters";
import { Contract, ContractOptions, TxCall, TxSend, EventSubscriptionFactory } from "web3x/contract";
import { Eth } from "web3x/eth";
import abi from "./IERC20Abi";
interface IERC20Events {
}
interface IERC20EventLogs {
}
interface IERC20TxEventLogs {
}
export interface IERC20TransactionReceipt extends TransactionReceipt<IERC20TxEventLogs> {
}
interface IERC20Methods {
    approve(spender: Address, value: number | string | BN): TxSend<IERC20TransactionReceipt>;
    balanceOf(account: Address): TxCall<string>;
    transferFrom(_from: Address, _to: Address, _value: number | string | BN): TxSend<IERC20TransactionReceipt>;
    transfer(_to: Address, _value: number | string | BN): TxSend<IERC20TransactionReceipt>;
    decimals(): TxSend<IERC20TransactionReceipt>;
}
export interface IERC20Definition {
    methods: IERC20Methods;
    events: IERC20Events;
    eventLogs: IERC20EventLogs;
}
export class IERC20 extends Contract<IERC20Definition> {
    constructor(eth: Eth, address?: Address, options?: ContractOptions) {
        super(eth, abi, address, options);
    }
    deploy(): TxSend<IERC20TransactionReceipt> {
        return super.deployBytecode("0x") as any;
    }
}
export var IERC20Abi = abi;
