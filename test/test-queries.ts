import { QueryEngine } from '../src/queries';

const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const DAI_ADDRESS = `0x6b175474e89094c44da98b954eedeac495271d0f`

async function doTests() {
  const query = new QueryEngine('0x7e388444731C38189C0685F6D98605107fF59282');
  await query.init();
  console.log(`getInputs_swapTokenForCToken`)
  const result = await query.getInputs_swapTokenForCToken(
    USDC_ADDRESS,
    DAI_ADDRESS,
    '0x989680' // $10
  );
  console.log(result)
}

doTests();