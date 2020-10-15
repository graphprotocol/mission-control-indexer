#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'
import * as yargs from 'yargs'
import { ethers, providers } from 'ethers'
import { parseGRT } from '@graphprotocol/common-ts'

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
  const gdai2grtwei = parseGRT(
    reserves._reserve0.div(reserves._reserve1).toString()
  )

  if (argv['agora']) {
    console.log(JSON.stringify({ GDAI: `${gdai2grtwei}` }))
  } else {
    console.log(gdai2grtwei.toString())
  }
}

main()
