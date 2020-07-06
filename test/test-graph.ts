import { Web3Wrapper } from '../src/web3';
import { getUniswapTokenInfo } from '../src/graph/uniswap-graph'
import { toAddress } from '../src/utils/to';

async function test() {
  const web3 = new Web3Wrapper();
  const myAddress = '0x7e388444731C38189C0685F6D98605107fF59282';
  const proms = [];
  const balances = {};
  const t1 = Date.now();
  const tokens = await getUniswapTokenInfo(150000);
  for (let {address} of tokens) {
    const token = web3.getToken(address);
    proms.push(
      token.methods.balanceOf(toAddress(myAddress)).call()
        .then((balance) => {
          if (+balance > 0) balances[address] = balance;
        })
    );
  }
  await Promise.all(proms);
  const t2 = Date.now();
  console.log(`Found ${tokens.length} tokens with volume >= $150k`)
  console.log(`Reduced to ${Object.keys(balances).length} when filtering tokens with no balance.`)
  console.log(`Query took ${t2 - t1}ms`)
  console.log(balances)
  console.log('done! :D')
}

test()