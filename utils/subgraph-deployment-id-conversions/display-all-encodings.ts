#!/usr/bin/env ts-node

import { SubgraphDeploymentID } from '@graphprotocol/common-ts'

async function main() {
  const args = process.argv.slice(2)
  let id = new SubgraphDeploymentID(args[0])
  console.log(id.display)
}

main().catch(e => console.log('Error: ', e.message))
