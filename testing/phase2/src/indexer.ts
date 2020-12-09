const chalk = require('chalk')
const fetch = require('isomorphic-fetch')
const _ = require('lodash')

import { Argv } from 'yargs'
import {
  Address,
  formatGRT,
  parseGRT,
  SubgraphDeploymentID,
  toAddress,
} from '@graphprotocol/common-ts'
import { Client, createClient } from '@urql/core'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { BigNumber } from 'ethers'
import { id } from 'ethers/lib/utils'

interface Ctx {
  networkSubgraph: Client
}

interface Network {
  currentEpoch: number
  maxAllocationEpochs: number
}

export default {
  command: 'indexer <address>',
  describe: 'Report indexer health',
  builder: (yargs: Argv) => {
    yargs.positional('address', {
      type: 'string',
      describe: 'The indexer address',
    })
  },
  handler: async (argv: any): Promise<void> => {
    const address = toAddress(argv.address)

    const ctx = {
      networkSubgraph: createClient({
        url: 'https://gateway-testnet.thegraph.com/network',
        fetch,
      }),
    }

    const deployments = await queryDeployments(ctx)
    const network = await queryNetwork(ctx)
    const indexerAllocations = await queryActiveAllocations(ctx, address)

    await checkRegistration(ctx, address)
    await checkStake(ctx, address)
    await checkRewards(ctx, address)
    await checkActiveAllocations(ctx, address, network, indexerAllocations)
    await checkCostModels(ctx, address, indexerAllocations)
  },
}

function section(msg: string) {
  console.log(chalk.white.bold(msg))
}

function ok(...msg: any[]) {
  console.log(' ', chalk.green(`✔`), ...msg)
}

function neutral(...msg: any[]) {
  console.log(' ', chalk.yellow(`✔`), ...msg)
}

function failed(...msg: any[]) {
  console.log(' ', chalk.red(`✗`), ...msg)
}

function list(msgs: any[]) {
  for (const msg of msgs) {
    console.log('   ', msg)
  }
}

function displayGRT(grt: BigNumber): string {
  return `${parseFloat(formatGRT(grt)).toFixed(4)} GRT`
}

async function queryNetworkSubgraph(
  ctx: Ctx,
  query: DocumentNode,
  variables?: Record<string, unknown>,
): Promise<any> {
  try {
    const result = await ctx.networkSubgraph.query(query, variables).toPromise()
    if (result.error) {
      throw result.error
    }
    return result.data
  } catch (err) {
    throw new Error(`Cannot query the network subgraph at this time: ${err}`)
  }
}

async function queryDeployments(ctx: Ctx): Promise<SubgraphDeploymentID[]> {
  try {
    const data = await queryNetworkSubgraph(
      ctx,
      gql`
        {
          subgraphDeployments(first: 1000) {
            id
          }
        }
      `,
    )

    return data.subgraphDeployments.map(depl => new SubgraphDeploymentID(depl.id))
  } catch (err) {
    console.log(
      `Failed to query deployments via https://gateway-testnet.thegraph.com/network, try again later`,
    )
    process.exit(1)
  }
}

async function queryNetwork(ctx: Ctx): Promise<Network> {
  try {
    const data = await queryNetworkSubgraph(
      ctx,
      gql`
        {
          graphNetworks {
            currentEpoch
            maxAllocationEpochs
          }
        }
      `,
    )

    return data.graphNetworks[0]
  } catch (err) {
    console.log(
      `Failed to query network info via https://gateway-testnet.thegraph.com/network, try again later`,
    )
    process.exit(1)
  }
}

async function queryActiveAllocations(ctx: Ctx, address: Address): Promise<any[]> {
  try {
    const data = await queryNetworkSubgraph(
      ctx,
      gql`
        query indexer($id: String!) {
          graphNetworks {
            currentEpoch
            maxAllocationEpochs
          }

          indexer(id: $id) {
            allocations(where: { status: Active }, first: 1000) {
              id
              subgraphDeployment {
                id
              }
              allocatedTokens
              createdAtEpoch
            }
          }
        }
      `,
      {
        id: address.toLowerCase(),
      },
    )

    return data.indexer.allocations
  } catch (err) {
    console.log(
      `Failed to query active indexer allocations via https://gateway-testnet.thegraph.com/network, try again later`,
    )
    process.exit(1)
  }
}

async function checkRegistration(ctx: Ctx, address: Address): Promise<void> {
  section('Registration')

  try {
    const data = await queryNetworkSubgraph(
      ctx,
      gql`
        query indexer($id: String!) {
          indexer(id: $id) {
            id
            url
          }
        }
      `,
      { id: address.toLowerCase() },
    )
    ok('Address:', address)
    ok('ID:', data.indexer.id)

    try {
      const parsedURL = new URL(data.indexer.url)
      ok('URL:', parsedURL.toString())
    } catch (err) {
      failed('URL:', data.indexer.url, '(invalid)')
    }
  } catch (err) {
    failed(err.message)
  }
}

async function checkStake(ctx: Ctx, address: Address): Promise<void> {
  section('Stake')

  try {
    const data = await queryNetworkSubgraph(
      ctx,
      gql`
        query indexer($id: String!) {
          indexer(id: $id) {
            stakedTokens
          }
        }
      `,
      {
        id: address.toLowerCase(),
      },
    )

    const stake = BigNumber.from(data.indexer.stakedTokens)

    if (stake.gte(parseGRT('1000000'))) {
      ok(displayGRT(stake))
    } else if (stake.gt(parseGRT('0'))) {
      neutral(displayGRT(stake), '(low)')
    } else {
      failed('No GRT staked')
    }
  } catch (err) {
    failed(err.message)
  }
}

function uniqueDeploymentsForAllocations(allos: any[]): SubgraphDeploymentID[] {
  const ids = allos.reduce(
    (acc: Set<string>, allo: any) => acc.add(allo.subgraphDeployment.id),
    new Set<string>(),
  )
  return Array.from(ids).map((id: string) => new SubgraphDeploymentID(id))
}

async function checkActiveAllocations(
  ctx: Ctx,
  address: Address,
  network: Network,
  allos: any[],
): Promise<void> {
  section('Active Allocations')

  try {
    const deployments = uniqueDeploymentsForAllocations(allos)

    if (allos.length === 0) {
      failed('No active allocations')
    } else {
      ok(allos.length, 'active allocations on', deployments.length, 'deployments')

      list(
        _.reverse(
          _.sortBy(allos, (allo: any) =>
            parseFloat(formatGRT(BigNumber.from(allo.allocatedTokens))),
          ),
        ).map((allo: any) => {
          const tokens = BigNumber.from(allo.allocatedTokens)

          const age = network.currentEpoch - allo.createdAtEpoch
          const maxEpochs = network.maxAllocationEpochs
          const epochStatus = age >= maxEpochs ? 'bad' : 'good'

          const allocationStatus = tokens.gt(parseGRT('100000'))
            ? 'good'
            : tokens.gt(parseGRT('10000'))
            ? 'neutral'
            : 'bad'

          const color = [allocationStatus, epochStatus].includes('bad')
            ? chalk.red
            : [allocationStatus].includes('neutral')
            ? chalk.yellow
            : chalk.green

          return color(
            `${allo.id}, ${
              new SubgraphDeploymentID(allo.subgraphDeployment.id).ipfsHash
            }, amount: ${displayGRT(BigNumber.from(allo.allocatedTokens))} (${
              allocationStatus == 'bad'
                ? 'low'
                : allocationStatus === 'neutral'
                ? 'ok'
                : 'good'
            }), age: ${age} epochs (${epochStatus === 'good' ? 'good' : 'old'})`,
          )
        }),
      )
    }
  } catch (err) {
    failed(err.message)
  }
}

async function checkRewards(ctx: Ctx, address: Address): Promise<void> {
  section('Rewards')

  try {
    const data = await queryNetworkSubgraph(
      ctx,
      gql`
        query indexer($id: String!) {
          indexer(id: $id) {
            queryFeesCollected
            rewardsEarned
          }
        }
      `,
      { id: address.toLowerCase() },
    )

    const queryRewards = BigNumber.from(data.indexer.queryFeesCollected)
    const indexingRewards = BigNumber.from(data.indexer.rewardsEarned)

    if (queryRewards.gt('0')) {
      ok('Query rewards:', displayGRT(queryRewards))
    } else {
      failed('No query rewards received')
    }

    if (indexingRewards.gt('0')) {
      ok('Indexing rewards:', displayGRT(indexingRewards))
    } else {
      failed('No indexing rewards earned')
    }
  } catch (err) {
    failed(err)
  }
}

async function checkCostModels(ctx: Ctx, address: Address, allos: any[]): Promise<void> {
  section('Cost models')

  try {
    const indexerData = await queryNetworkSubgraph(
      ctx,
      gql`
        query indexer($id: String!) {
          indexer(id: $id) {
            url
          }
        }
      `,
      { id: address.toLowerCase() },
    )

    const url = indexerData.indexer.url
    const client = createClient({ url: new URL('/cost', url).toString(), fetch })
    const deployments = uniqueDeploymentsForAllocations(allos)

    const data = await client
      .query(
        gql`
          query costModels($deployments: [String!]!) {
            costModels(deployments: $deployments) {
              deployment
              model
              variables
            }
          }
        `,
        { deployments: deployments.map(id => id.ipfsHash) },
      )
      .toPromise()

    if (data.error) {
      throw data.error
    }

    const orderedDeployments = _.sortBy(
      deployments,
      (id: SubgraphDeploymentID) =>
        data.data.costModels.findIndex(
          (costModel: any) => costModel.deployment === id.ipfsHash,
        ) * -1,
    )

    for (const deployment of orderedDeployments) {
      const costModel = data.data.costModels.find(
        (costModel: any) => costModel.deployment === deployment.bytes32,
      )

      costModel.deployment = new SubgraphDeploymentID(costModel.deployment).ipfsHash

      if (!costModel) {
        failed(`No cost model defined for deployment`, deployment.ipfsHash)
      } else {
        ok(`Cost model defined for deployment`, deployment.ipfsHash)

        list([chalk.gray(JSON.stringify(costModel))])
      }
    }
  } catch (err) {
    failed(err.message)
  }
}
