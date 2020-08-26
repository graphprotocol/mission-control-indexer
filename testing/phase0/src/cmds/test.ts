import * as fs from 'fs'
import * as path from 'path'
import { Argv } from 'yargs'
import { parseIndexers, Indexer } from '../data/indexers'
import { parseQueries, Query } from '../data/queries'
import { table } from 'table'
import axios from 'axios'
import PQueue from 'p-queue'
import { Writable } from 'stream'

const chalk = require('chalk')
const autocannon = require('autocannon')
const parseMetrics = require('parse-prometheus-text-format')

const PASS = '✅ PASS'
const FAIL = '❌ FAIL'
const SKIPPED = '❎ SKIPPED'

const delay = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000))

interface TestQueriesOptions {
  indexers: Indexer[]
  queries: Query[]
  verbose: boolean
  duration: number
  connectionsPerIndexer: number
  ratePerIndexer: number
  minRequestRate: number
  maxErrorRate: number
}

const runQueries = async ({
  indexers,
  queries,
  verbose,
  duration,
  connectionsPerIndexer,
  ratePerIndexer,
}: TestQueriesOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    const bodies = []
    const instance = autocannon(
      {
        url: indexers.map((indexer) => indexer.graphNode.toString()),
        servername: indexers.length > 1 ? undefined : indexers[0].graphNode.host,
        duration,
        connections: connectionsPerIndexer * indexers.length,
        connectionRate: ratePerIndexer
          ? Math.max(ratePerIndexer / connectionsPerIndexer, 1)
          : undefined,
        timeout: 30,
        requests: [
          {
            setupRequest: (request) => {
              const query = queries[Math.floor(Math.random() * queries.length)]
              const route = path.join('subgraphs', 'id', query.deployment)
              request.pathname = path.join(
                request.pathname,
                'subgraphs',
                'id',
                query.deployment
              )
              request.path = request.pathname
              request.href = request.href.replace(/\/?$/, `/${route}`)
              request.headers['content-type'] = 'application/json'
              request.method = 'POST'
              request.body = JSON.stringify({ query: query.query })
              return request
            },
            expectResponse: ({ status, body }) => {
              try {
                let result = JSON.parse(body)
                return (
                  status === 200 &&
                  (!result.errors || result.errors.length === 0)
                )
              } catch (e) {
                return false
              }
            },
          },
        ],
      },
      (err: any, results: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      }
    )
    if (verbose) {
      autocannon.track(instance, {
        renderProgressBar: false,
        renderResultsTable: true,
        renderLatencyTable: true,
      })
    }
  })
}

const testQueries = async (
  options: TestQueriesOptions
): Promise<string[][]> => {
  const result = await runQueries(options)

  const errorRate = (1.0 * result.errors) / result.requests.total

  return [
    ['Request rate (max)', result.requests.max],
    ['Request rate (max)', result.requests.max],
    ['Request rate (min)', result.requests.min],
    ['Request rate (avg)', result.requests.average],
    ['Total requests', result.requests.total],
    ['Failed requests', result.errors],
    ['Error rate', `${(errorRate * 100).toFixed(2)}%`],
    [
      'Test: Request rate',
      result.requests.average >= options.minRequestRate ? PASS : FAIL,
    ],
    ['Test: Error rate', errorRate < options.maxErrorRate ? PASS : FAIL],
  ]
}

const testPrometheus = async ({
  indexer,
  requiredDeployments,
  verbose,
  log,
}: {
  indexer: Indexer
  requiredDeployments: string[]
  verbose: boolean
  log: (msg: string) => void
}): Promise<string[][]> => {
  // Query node metrics
  const queryNodeMetrics = ['subgraph_query_execution_time_count']

  // Index node metrics
  const indexNodeMetrics = [
    'subgraph_count',
    'QmXKwSEMirgWVn41nRzkT3hpUBw29cp619Gx58XW6mPhZP_sync_total_secs',
    'QmTXzATwNfgGVukV1fX2T6xw9f6LAYRVWpsdXyRWzUR2H9_sync_total_secs',
  ]

  let available = false
  let queryNodeMetricsOk = false
  let indexNodeMetricsOk = false

  try {
    const result = await axios.get(indexer.prometheus.toString(), {
      timeout: 30 * 1000,
      params: {
        match: queryNodeMetrics,
      },
    })

    // The endpoint is available
    available = true

    const metrics = parseMetrics(result.data)
    if (metrics.length >= queryNodeMetrics.length) {
      queryNodeMetricsOk = true
    }
  } catch (e) {
    log(`Failed to fetch query node metrics: ${e.message}`)
  }

  try {
    const result = await axios.get(indexer.prometheus.toString(), {
      timeout: 30 * 1000,
      params: {
        match: indexNodeMetrics,
      },
    })

    // The endpoint is available
    available = true

    const metrics = parseMetrics(result.data)
    if (metrics.length >= indexNodeMetrics.length) {
      indexNodeMetricsOk = true
    }
  } catch (e) {
    log(`Failed to fetch index node metrics: ${e.message}`)
  }

  return [
    ['Prometheus available', available ? PASS : FAIL],
    ['Query node metrics', queryNodeMetricsOk ? PASS : FAIL],
    ['Index node metrics', indexNodeMetricsOk ? PASS : FAIL],
  ]
}

const testGraphNode = async ({
  indexer,
  requiredDeployments,
  verbose,
  log,
}: {
  indexer: Indexer
  requiredDeployments: string[]
  verbose: boolean
  log: (msg: string) => void
}): Promise<string[][]> => {
  let available = false
  let graphqlOk = false

  try {
    const url = new URL(indexer.graphNode.toString())
    url.pathname = '/subgraphs'

    const result = await axios.post(
      url.toString(),
      {
        query: `{ subgraphDeployments { id } }`,
      },
      {
        timeout: 30 * 1000,
      }
    )

    // The endpoint is available
    available = true

    const data = result.data
    if (data.data && (!data.errors || data.errors.length === 0)) {
      graphqlOk = true
    }
  } catch (e) {
    log(`Failed to query subgraph metadata: ${e.message}`)
  }

  return [
    ['Graph node available', available ? PASS : FAIL],
    ['GraphQL API', graphqlOk ? PASS : FAIL],
  ]
}

const testSubgraphDeployment = async ({
  indexer,
  deployment,
  verbose,
  log,
}: {
  indexer: Indexer
  deployment: string
  verbose: boolean
  log: (msg: string) => void
}): Promise<string[][]> => {
  const client = axios.create({
    baseURL: indexer.graphNode.toString(),
    timeout: 30 * 1000,
  })

  let deployed = false
  let indexedBlocks = false
  let makingProgress = false

  try {
    let query = {
      query: `
        query subgraphDeployment($id: ID!) {
          subgraphDeployment(id: $id) {
            latestEthereumBlockNumber
          }
        }
        `,
      variables: { id: deployment },
    }

    // 1. Test that the subgraph is deployed and indexed something
    const initialResult = await client.post('/subgraphs', query)
    if (initialResult.data.data.subgraphDeployment !== null) {
      deployed = true
    }

    let initialBlock = parseInt(
      initialResult.data.data.subgraphDeployment.latestEthereumBlockNumber
    )

    // Check if we have indexed any blocks at all
    indexedBlocks = initialBlock > 0

    // 2. Wait 60s
    await delay(60)

    // 3. Check that subgraph has made progress
    const result = await client.post('/subgraphs', query)
    const latestBlock = parseInt(
      result.data.data.subgraphDeployment.latestEthereumBlockNumber
    )

    makingProgress = latestBlock > initialBlock
  } catch (e) {
    log(`Failed to query metadata for deployment ${deployment}: ${e.message}`)
  }

  return [
    [`${deployment}: Deployed`, deployed ? PASS : FAIL],
    [`${deployment}: Indexed anything`, indexedBlocks ? PASS : FAIL],
    [`${deployment}: Making progress`, SKIPPED],
    // [`${deployment}: Making progress`, makingProgress ? PASS : FAIL],
  ]
}

const testSubgraphs = async ({
  indexer,
  requiredDeployments,
  verbose,
  log,
}: {
  indexer: Indexer
  requiredDeployments: string[]
  verbose: boolean
  log: (msg: string) => void
}): Promise<string[][]> => {
  const results = await Promise.all(
    requiredDeployments.map(
      async (deployment) =>
        await testSubgraphDeployment({ indexer, deployment, verbose, log })
    )
  )
  return results.reduce(
    (acc, subgraphResults) => [...acc, ...subgraphResults],
    []
  )
}

export default {
  command: 'test <csv-file> <queries-file>',
  describe: 'Test indexer endpoints',
  builder: (yargs: Argv) => {
    yargs
      .positional('csv-file', {
        type: 'string',
        describe: 'A CSV file generated from the indexers form',
      })
      .positional('queries-file', {
        type: 'string',
        describe:
          'A file with one query per line (each of the form <deployment>,<query>)',
      })
      .option('verbose', {
        required: false,
        default: false,
        type: 'boolean',
      })
      .option('max-error-rate', {
        required: false,
        default: 0.0005,
        type: 'number',
      })
      .option('min-request-rate', {
        required: false,
        default: 10.0,
        type: 'number',
      })
      .option('duration', {
        description: 'Duration of the test (default: 300s)',
        required: false,
        default: 300,
        type: 'number',
      })
      .option('connections-per-indexer', {
        description: 'Connections to open with each indexer (default: 10)',
        required: false,
        default: 10,
        type: 'number',
      })
      .option('rate-per-indexer', {
        description:
          'Request rate (per second) to use per indexer (default: undefined)',
        required: false,
        type: 'number',
      })
      .option('all', {
        description:
          'Whether to also test all indexers together (default: false)',
        required: false,
        type: 'boolean',
      })
      .option('output', {
        description: 'CSV file to write the full report to',
        required: true,
        type: 'string',
      })
  },
  handler: async (argv: any): Promise<void> => {
    const indexers = parseIndexers(argv.csvFile).filter(
      (indexer) => !indexer.passedPhase0Tests
    )
    const queries = parseQueries(argv.queriesFile)
    const requiredDeployments = Array.from(
      new Set(queries.map((query) => query.deployment))
    )

    if (
      argv.ratePerIndexer !== undefined &&
      argv.ratePerIndexer < argv.connectionsPerIndexer
    ) {
      console.error(
        `--rate-per-indexer (${argv.ratePerIndexer}) must be >= --connections-per-indexer (${argv.connectionsPerIndexer})`
      )
      process.exitCode = 1
      return
    }

    let outputStream = fs.createWriteStream(argv.output, { encoding: 'utf-8' })
    let outputHeaderWritten = false

    console.log('# Test Configuration')

    console.log('## Parameters')
    console.log()
    console.log('```')
    console.log(
      table([
        [
          'Time',
          `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
        ],
        ['Duration', `${argv.duration}s`],
        ['Target query rate (queries/s)', argv.ratePerIndexer],
        ['Minimum request rate (queries/s)', argv.minRequestRate],
        [
          'Maximum error rate (%)',
          (parseFloat(argv.maxErrorRate) * 100).toFixed(2),
        ],
        ['Connections per indexer', argv.connectionsPerIndexer],
      ]).trim()
    )
    console.log('```')

    console.log('## Queries')
    console.log()
    console.log('```')
    console.log(
      table(queries.map((query) => [query.deployment, query.query])).trim()
    )
    console.log('```')

    if (argv.all) {
      console.log()
      console.log('# Test Network')
      console.log()
      console.log('```')
      console.log(
        table(
          await testQueries({
            indexers,
            queries,
            verbose: argv.verbose,
            duration: argv.duration,
            connectionsPerIndexer: argv.connectionsPerIndexer,
            ratePerIndexer: argv.ratePerIndexer,
            minRequestRate: argv.minRequestRate,
            maxErrorRate: argv.maxErrorRate,
          })
        ).trim()
      )
      console.log('```')
    }

    let testQueue = new PQueue({ concurrency: 20 })

    // Test indexers one by one
    for (let indexer of indexers) {
      testQueue.add(async () => {
        let outputData = []
        let output = Buffer.from('')

        const log = (msg?: string) => {
          if (msg) {
            output.write(msg)
          }
          output.write('\n')
        }

        log(`# Test Indexer: ${indexer.name} (${indexer.kind})`)
        log()
        const indexerInfo = [
          ['Name', indexer.name],
          ['Contact name', indexer.contactName],
          ['Email', indexer.contactEmail],
          ['Graph Node', indexer.graphNode.toString()],
          ['Prometheus', indexer.prometheus.toString()],
        ]
        outputData.push(...indexerInfo)
        log('```')
        log(table(indexerInfo).trim())
        log('```')
        log()
        log('## Prometheus Test')
        log()
        const prometheusResult = await testPrometheus({
          indexer,
          requiredDeployments,
          verbose: argv.verbose,
          log,
        })
        outputData.push(...prometheusResult)
        log('```')
        log(table(prometheusResult).trim())
        log('```')
        log()
        log('## Graph Node Test')
        log()
        const graphNodeResult = await testGraphNode({
          indexer,
          requiredDeployments,
          verbose: argv.verbose,
          log,
        })
        outputData.push(...graphNodeResult)
        log('```')
        log(table(graphNodeResult).trim())
        log('```')
        log()
        log('## Subgraphs Test')
        log()
        const subgraphsResult = await testSubgraphs({
          indexer,
          requiredDeployments,
          verbose: argv.verbose,
          log,
        })
        outputData.push(...subgraphsResult)
        log('```')
        log(table(subgraphsResult).trim())
        log('```')
        log()
        log('## Query Test')
        log()
        const queriesResult = await testQueries({
          indexers: [indexer],
          queries,
          verbose: argv.verbose,
          duration: argv.duration,
          connectionsPerIndexer: argv.connectionsPerIndexer,
          ratePerIndexer: argv.ratePerIndexer,
          minRequestRate: argv.minRequestRate,
          maxErrorRate: argv.maxErrorRate,
        })
        outputData.push(...queriesResult)
        log('```')
        log(table(queriesResult).trim())
        log('```')

        // Write output to console
        console.log(output.toString())

        // Write output data to CSV
        if (!outputHeaderWritten) {
          outputStream.write(`${outputData.map((row) => row[0]).join(',')}\n`)
          outputHeaderWritten = true
        }
        outputStream.write(
          `${outputData.map((row) => row.slice(1)).join(',')}\n`
        )
      })
    }

    await testQueue.onIdle()

    outputStream.end()
    outputStream.close()
  },
}
