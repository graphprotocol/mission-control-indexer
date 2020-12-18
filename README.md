# Mission Control: Indexer Material

Technical indexer documentation and infrastructure templates for the Mission Control testnet.

For support, please join the `#indexers` channel on [our
Discord](https://thegraph.com/discord). The Graph team will be happy to
assist you in getting set up.

## Workshops

- Indexer Workshop (August 4th) [[Slides](./files/indexer-workshop.pdf), [Video](https://www.youtube.com/watch?v=zRiJ_Q3EPH8)]

## Resources

- [FAQ](./faq.md)
- [Community Wiki](https://github.com/graphprotocol/mission-control-indexer/wiki) (please edit responsibly!)
- [Guides](./guides/README.md)

# Past Phases

- [Phase 0](phases/phase0.md)
- [Phase 1](phases/phase1.md)
- [Phase 2/3](phases/phase2.md)

# Graph Network

We have all been eagerly waiting for this moment. It is here now: The Graph
Network has launched!

In order to upgrade from the testnet to mainnet, please follow the guide
below. Let us know on [Discord](https://thegraph.com/discord) in the
`#indexers` channel if you have any problems or questions.

**Note: We will be open sourcing the indexer repository and its dependencies in the coming days. At that point there will be a new release. From then on, we will implement a more rigorous release process.**

## tl;dr

The following releases are required for mainnet:

- graph-node 0.20.0
- indexer-service 0.9.0-alpha.0
- indexer-agent 0.9.0-alpha.0
- indexer-cli 0.9.0-alpha.0

There is a new canonical IPFS node for The Graph Network:

* https://ipfs.network.thegraph.com

## Using the Token Lock Contract

Before you can upgrade, you need to stake and add an operator using the tokken lock contract. This is described [in this guide](https://www.notion.so/Graph-Network-Token-Lock-Contract-Guide-30992eea5f4b47c8b4c6ff7a9bc56a41).

## Graph Node

### Release Details

- Docker image: [`graphprotocol/graph-node:v0.20.0`](https://hub.docker.com/layers/graphprotocol/graph-node/v0.20.0/images/sha256-7684c4076e5ea91578bd2ff8bad659071e0f6923065632ae4a1166bff4ff8ee5?context=explore)
- Git tag: [v0.20.0](https://github.com/graphprotocol/graph-node/releases/tag/v0.20.0)
- Release notes: [v0.20.0](https://github.com/graphprotocol/graph-node/blob/master/NEWS.md#020)

### Release Notes

- This release disables support for IPFS and fulltext search, two
  non-deterministic features that could lead to inconsistent indexing results
  (proof of indexing) and, consequently, slashing.

- Configure your nodes to point to the new canonical IPFS node for The Graph
  Network: https://ipfs.network.thegraph.com. NOTE: No trailing slash!

- An Ethereum node that supports
  [EIP-1898](https://eips.ethereum.org/EIPS/eip-1898) is required to avoid
  unpredictable subgraph failures, inconsistent indexing results (proof of
  indexing) and, consequently, slashing.

## Indexer Service

### Release Details

- Docker image: [`graphprotocol/indexer-service:sha-18175dc`](https://hub.docker.com/layers/graphprotocol/indexer-service/sha-18175dc/images/sha256-74661782cb829e8d0dd5bb9cd1d8a383d11eefa85bd0d28c7657968b91ea0b34?context=explore)
- NPM package: [`@graphprotocol/indexer-service@0.9.0-alpha.0`](https://testnet.thegraph.com/npm-registry/-/web/detail/@graphprotocol/indexer-service/v/0.9.0-alpha.0)
- Git tag: [v0.9.0-alpha.0](https://github.com/graphprotocol/indexer/releases/tag/v0.9.0-alpha.0)

### Release Notes

- This is primarily an upgrade to add support for the mainnet contracts.

- Start from a fresh database, don't mix testnet and mainnet infrastructure.

- In order to run against mainnet, either
  - Pass `--ethereum-network mainnet` to `graph-indexer-service`, or
  - Set the `INDEXER_SERVICE_ETHEREUM_NETWORK=mainnet` in the environment.

- Also, set `--network-subgraph-endpoint` or
  `INDEXER_SERVICE_NETWORK_SUBGRAPH_ENDPOINT` to
  `https://gateway.network.thegraph.com/network`.

- As before, make sure to secure your indexer by using different indexer and
  operator keys in the protocol:

  - The _indexer_ is the account that _stakes_ and sets the operator.
  - The _operator_ is the account that runs the indexer infrastructure.

  When setting up your indexer, make sure to:

  - Pass the **token lock contract address** (note: _not_ the indexer address) in
    via `--indexer-address` or `INDEXER_SERVICE_INDEXER_ADDRESS`.
  - Pass the _operator_ mnemonic in via `--mnemonic` or `INDEXER_SERVICE_MNEMONIC`.

## Indexer Agent

### Release Details

- Docker image: [`graphprotocol/indexer-agent:sha-18175dc`](https://hub.docker.com/layers/130593309/graphprotocol/indexer-agent/sha-18175dc/images/sha256-3aa5f96454ebfc879fe4188a3ee05fef3813475cae2e455ff37c4b98fa770de6?context=explore)
- NPM package: [`@graphprotocol/indexer-agent@0.9.0-alpha.0`](https://testnet.thegraph.com/npm-registry/-/web/detail/@graphprotocol/indexer-agent/v/0.9.0-alpha.0)
- Git tag: [v0.9.0-alpha.0](https://github.com/graphprotocol/indexer/releases/tag/v0.9.0-alpha.0)

### Release Notes

- This is primarily an upgrade to add support for the mainnet contracts.

- Start from a fresh database, don't mix testnet and mainnet infrastructure.

- In order to run against mainnet, either
  - Pass `--ethereum-network mainnet` to `graph-indexer-agent`, or
  - Set the `INDEXER_AGENT_ETHEREUM_NETWORK=mainnet` in the environment.

- Also, set `--network-subgraph-endpoint` or
  `INDEXER_AGENT_NETWORK_SUBGRAPH_ENDPOINT` to
  `https://gateway.network.thegraph.com/network`.

- As before, make sure to secure your indexer by using different indexer and
  operator keys in the protocol:

  - The _indexer_ is the account that _stakes_ and sets the operator.
  - The _operator_ is the account that runs the indexer infrastructure.

  When setting up your indexer, make sure to:

  - Pass the **token lock contract address** (note: _not_ the indexer
    address) in via `--indexer-address` or `INDEXER_AGENT_INDEXER_ADDRESS`.
  - Pass the _operator_ mnemonic in via `--mnemonic` or `INDEXER_AGENT_MNEMONIC`.

- The agent does not support a configurable ETH "rate" limit yet, so
  make sure not to fund your _operator_ account with _too_ much ETH.

## Indexer CLI

### Release Details

- NPM package: [`@graphprotocol/indexer-cli@0.9.0-alpha.0`](https://testnet.thegraph.com/npm-registry/-/web/detail/@graphprotocol/indexer-cli/v/0.9.0-alpha.0)
- Git tag: [v0.9.0-alpha.0](https://github.com/graphprotocol/indexer/releases/tag/v0.9.0-alpha.0)

### Release Notes

- There are no changes in the indexer CLI, other than dependency updates.

## What to expect next?

- Open sourcing of the indexer repository and dependencies in the coming days.
- A gradual increase in mainnet subgraphs.
- A new, freshly set up testnet early next year.