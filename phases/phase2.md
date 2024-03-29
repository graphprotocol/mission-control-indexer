# Phase 2/3

There is only one mission in phase 2: honest profit maximization. To compete
in phase 2, the indexer infrastructure needs to be updated to new releases.

Note: No new components were added aside from internal dependencies.

For NPM registry access, see the [NPM registry guide](guides/npm-registry.md).

## Important Updates

- **2020-10-15: [Indexer 0.3.1 release to restart phase 2](./updates/2020-10-15-indexer-release-to-restart-phase2.md) — updates
  indexer components to new contracts so that we can cleanly restart phase 2, as announced earlier this week.**
- **2020-10-16: [GDAI to GRT conversation utility for cost models](./utils/gdai-to-grt/).**
- **2020-10-20: [Graph Node v0.19.0 release allows to disable EIP-1898](./updates/2020-10-20-graph-node-v0.19.2.md).**
- **2020-10-21: [Subgraph Deployment ID conversion utility](./utils/subgraph-deployment-id-conversions).**
- **2020-10-27: [Updated Agora tool to use decimal GRT rather then wei](https://github.com/graphprotocol/agora).**
- **2020-10-27: [Updated GDAI to GRT conversion utility to output conversion rate in decimal format](./utils/gdai-to-grt).**
- **2020-10-27: [Indexer 0.3.2 release](./updates/2020-10-27-indexer-release-phase2-improvements.md).**
- **2020-10-28: [Indexer 0.3.3 release](./updates/2020-10-28-indexer-release-v0.3.3.md).**
- **2020-10-30: [Indexer 0.3.5 release](./updates/2020-10-30-indexer-release-v0.3.5.md).**
- **2020-11-11: [Indexer 0.3.6 "preTRAFFIC 🚦" release](./updates/2020-11-11-indexer-release-v0.3.6.md).**
- **2020-11-27: [Indexer 0.4.1 "TRAFFIC 🚦" release](./updates/2020-11-27-indexer-release-v0.4.1.md).**
- **2020-11-27: [Indexer 0.4.2 "TRAFFIC NOW! 🚦" release](./updates/2020-11-30-indexer-release-v0.4.2.md).**

## Main Changes

- Graph Node now makes contracts calls by block hash instead of block number.
  This may affect Ethereum providers that are missing this feature. For
  reference, this feature was added to Ethereum via
  [EIP-1989](https://eips.ethereum.org/EIPS/eip-1898).

- The Indexer Agent no longer automatically stakes on your behalf. This is
  because we've split up the indexer into two roles: indexer and operator.

  This feature allows indexers to decouple their root keys from lower-risk
  operator keys that have limited capabilities. Only the indexer root key can
  stake (via the UI). Multiple operators can be defined, but only one can
  register a URL for the indexer at a time. Indexer and operator _can_ use
  the same Ethereum address and key.

  In order to set things up correctly, indexers need to:

  1. stake using the UI (Indexer Agent will automatically allocate using this stake),
  2. (if you want to use different indexer and operator keys) set one or more operators.

- Indexer components now run as "operators" of indexers. This means that, in
  addition to `--mnemonic` or `INDEXER_AGENT_MNEMONIC` /
  `INDEXER_SERVICE_MNEMONIC`, an `--indexer-address` or
  `INDEXER_AGENT_INDEXER_ADDRESS` / `INDEXER_SERVICE_INDEXER_ADDRESS` value
  needs to be passed to Indexer Agent and Service, with the Ethereum address of
  the indexer.

- Cost management and a `/cost` API have been added to the Indexer Service for
  price definition and discovery. It's a market now!

- The Indexer Service can now be scaled horizontally, and can also
  use worker threads for its state channel wallet.

  A single wallet thread can only process a limited amount of payments per
  second, so it's worth doing this by setting the `AMOUNT_OF_WORKER_THREADS`
  environment variable for the Indexer Service.

  Assuming your Indexer Service runs on its own machine or in its own VM,
  we recommend using one thread per real CPU thread or vCPU. Also, leave
  one CPU thread or vCPU for the main thread of the indexer, and more
  threads/vCPUs for other processes if there are any.

  If you scale the Indexer Service horizontally, make sure that the
  sum of main threads and worker threads does not exceed the CPU threads
  or vCPUs.

* There is a new network subgraph version. Make sure to update the `--network-subgraph-endpoint` or `INDEXER_AGENT_NETWORK_SUBGRAPH_ENDPOINT` / `INDEXER_SERVICE_NETWORK_SUBGRAPH_ENDPOINT` values to `https://api.thegraph.com/subgraphs/name/graphprotocol/graph-network-testnet-phase2`.

## Contract Addresses

- [GRT](https://rinkeby.etherscan.io/address/0x31958e219073d60FDCeb1d608c293754331dd352): `0x31958e219073d60FDCeb1d608c293754331dd352`
- [GDAI](https://rinkeby.etherscan.io/address/0xaCf3F4093B9851292181BEE2F80D2A450dB25D7a): `0xaCf3F4093B9851292181BEE2F80D2A450dB25D7a`
- [Uniswap Pair](https://rinkeby.etherscan.io/address/0x9228373a1d330d502ed05c013b5989a71e1f5f8e): `0x9228373a1d330d502ed05c013b5989a71e1f5f8e`

## Indexer Agent

- [Source code](https://github.com/graphprotocol/indexer/)
- [NPM
  package](https://testnet.thegraph.com/npm-registry/-/web/detail/@graphprotocol/indexer-agent/v/0.4.3)
  (release: `@graphprotocol/indexer-agent@0.4.3`)
- [Docker image](https://hub.docker.com/repository/docker/graphprotocol/indexer-agent) (tag: `sha-44fe0aa`)
- [Changes since the last phase 1 release](https://github.com/graphprotocol/indexer/blob/master/packages/indexer-agent/CHANGELOG.md#043---2020-12-07)

Notable changes that require changes in the indexer-agent configuration:

- The `INDEXER_AGENT_INDEXER_GEO_COORDINATES` environment variable is now space-separated (`"<lat> <long>`).

## Indexer Service

- [Source code](https://github.com/graphprotocol/indexer/)
- [NPM package](https://testnet.thegraph.com/npm-registry/-/web/detail/@graphprotocol/indexer-service/v/0.4.3)
  (release: `@graphprotocol/indexer-service@0.4.3`)
- [Docker image](https://hub.docker.com/repository/docker/graphprotocol/indexer-service) (tag: `sha-44fe0aa`)
- [Changes since the last phase 2 release](https://github.com/graphprotocol/indexer/blob/master/packages/indexer-cli/CHANGELOG.md#043---2020-12-07)

## Indexer CLI

- [Source code](https://github.com/graphprotocol/indexer/)
- [NPM package](https://testnet.thegraph.com/npm-registry/-/web/detail/@graphprotocol/indexer-cli/v/0.4.3)
  (release: `@graphprotocol/indexer-cli@0.4.3`)
- [Changes since phase 2 release](https://github.com/graphprotocol/indexer/blob/master/packages/indexer-cli/CHANGELOG.md#040---2020-11-27)

## Graph Node

- [Source code](https://github.com/graphprotocol/graph-node/)
- [Release
  tag](https://github.com/graphprotocol/graph-node/releases/tag/v0.19.2) (`v0.19.2`)
- [Docker image](https://hub.docker.com/layers/graphprotocol/graph-node/) (tag: `v0.19.2`)
- [Changes between 0.18.0 and 0.19.0](https://github.com/graphprotocol/graph-node/releases/tag/v0.19.0)
- [Changes between 0.19.0 and 0.19.1](https://github.com/graphprotocol/graph-node/releases/tag/v0.19.1)
- [Changes between 0.19.1 and 0.19.2](https://github.com/graphprotocol/graph-node/releases/tag/v0.19.2)

## Agora

- [Source code](https://github.com/graphprotocol/agora)
- [Guide](./guides/agora/language)
- [Workshop](https://www.youtube.com/watch?v=F88iqiCxj-s)
