import { ContractAbi} from 'web3x/contract';
export default new ContractAbi([
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "sellToken",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "buyToken",
        "type": "address"
      },
      {
        "internalType": "contract ICERC20",
        "name": "buyCToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "sellAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minBuyToken",
        "type": "uint256"
      }
    ],
    "name": "swapTokenForCToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "sellToken",
        "type": "address"
      },
      {
        "internalType": "contract ICERC20",
        "name": "sellCToken",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "buyToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "redeemAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minBuyToken",
        "type": "uint256"
      }
    ],
    "name": "swapCTokenForToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "sellToken",
        "type": "address"
      },
      {
        "internalType": "contract ICERC20",
        "name": "sellCToken",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "buyToken",
        "type": "address"
      },
      {
        "internalType": "contract ICERC20",
        "name": "buyCToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "redeemAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minBuyToken",
        "type": "uint256"
      }
    ],
    "name": "swapCTokenForCToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]);