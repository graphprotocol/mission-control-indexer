#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'
import * as yargs from 'yargs'
import {BigNumber, ethers, providers, utils } from 'ethers'
import { parseGRT, formatGRT } from '@graphprotocol/common-ts'
import {formatUnits, parseUnits, formatEther} from "ethers/lib/utils";

const UNISWAP_PAIR_ADDRESS = '0x9228373a1d330d502ed05c013b5989a71e1f5f8e'
const UNISWAP_PAIR_ABI = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      'node_modules',
      '@uniswap',
      'v2-core',
      'build',
      'UniswapV2Pair.json'
    ),
    'utf-8'
  )
).abi

async function main() {
  const argv = yargs.option('agora', {
    type: 'boolean',
    required: false,
    description: 'Output the conversion rate as an Agora variable',
  }).argv
  const provider = providers.getDefaultProvider('rinkeby')
  const contract = new ethers.Contract(
    UNISWAP_PAIR_ADDRESS,
    UNISWAP_PAIR_ABI,
    provider
  )
  const reserves = await contract.getReserves()
  const gdai2grt = reserves._reserve0.div(reserves._reserve1)
  const gdai2grtwei = parseUnits(gdai2grt.toString(), 18)
  const gdai2grtdecimal = formatUnits(gdai2grt,0)

  if (argv['agora']) {
    console.log(JSON.stringify({
      "GDAI": `${gdai2grtdecimal}`,
    }))
  } else {
    console.log("GRT/GDAI:", gdai2grtdecimal.toString())
    console.log("GRT/GDAI (gwei):", gdai2grtwei.toString())
  }
}

main()
