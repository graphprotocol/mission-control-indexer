# 2020-11-27 Indexer 0.4.1 "TRAFFIC 🚦" Release

## What's in this release?

The following new versions are part of this release:

- @graphprotocol/indexer-cli: 0.4.0 (no changes compared to 0.3.6)
- @graphprotocol/indexer-agent: 0.4.1 (Docker image: `graphprotocol/indexer-agent:sha-76dfd03`)
- @graphprotocol/indexer-service: 0.4.0 (Docker image: `graphprotocol/indexer-service:sha-76dfd03`)

## Changes

### Indexer Agent

- Add `--restake-rewards` (default: `true`) option for choosing on whether to
  collect indexing rewards or restake them immediately.
- Introduce standard indexer error codes and `indexer_error` metric.
- Increase network synchronization intervals.
- Add migration to reset state channels in preparation of ledger channels.

  **VERY IMPORTANT: PLEASE START THE INDEXER AGENT BEFORE THE NEW INDEXER
  SERVICE, SO THIS MIGRATION RUNS BEFORE THE SERVICE STARTS UP.**

### Indexer Service

- Fix caching of only a few attestation signers, leading to a lot of `Unable
  to sign the query response` errors.
- Fix how queries/payments are declined in case of errors.
- Add a `/version` endpoint for gateways to check compatibility.
- Introduce standard indexer error codes and `indexer_error` metric.
- Increase network synchronization intervals.
- Remove unnecessary (and duplicate) server wallet db migration.
- Fix typo in `indexer_service_channel_messages_ok` metric.
- Use IPFS (base 58) deployment IDs in all metrics.

#### Configuration changes

**Please update the following configuration options:**

- Change `--network-subgraph-endpoint` in indexer-agent and indexer-service
  to the following URL: https://gateway-testnet.thegraph.com/network.

- Add `--wallet-worker-threads` / `INDEXER_SERVICE_WALLET_WORKER_THREADS` to
  replace `AMOUNT_OF_WORKER_THREADS`. The default value is 8.

- Add `--wallet-skip-evm-validation` /
  `INDEXER_SERVICE_WALLET_SKIP_EVM_VALIDATION` to replace
  `SKIP_EVM_VALIDATION`. The default is `true` and doesn't need to be changed.
  You can remove `SKIP_EVM_VALIDATION` though.

## How to update

1. Install updates:

   NPM:

   ```sh
   # Install the latest
   npm install -g @graphprotocol/indexer-cli
   npm install -g @graphprotocol/indexer-agent
   npm install -g @graphprotocol/indexer-service

   # Install specific versions
   npm install -g @graphprotocol/indexer-cli@0.4.0
   npm install -g @graphprotocol/indexer-agent@0.4.1
   npm install -g @graphprotocol/indexer-service@0.4.0
   ```

   Docker:

   ```sh
   docker pull graphprotocol/indexer-agent:sha-76dfd03
   docker pull graphprotocol/indexer-service:sha-76dfd03
   ```

2. Restart indexer agent.
   **VERY IMPORTANT: PLEASE START THE INDEXER AGENT BEFORE THE NEW INDEXER
   SERVICE, SO THE DATABASE MIGRATIONS RUN BEFORE THE SERVICE STARTS UP.**
3. Restart indexer service.
