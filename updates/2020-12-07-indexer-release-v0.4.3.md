# 2020-11-27 Indexer 0.4.3 Release

## What's in this release?

The following new versions are part of this release:

- @graphprotocol/indexer-cli: 0.4.3 (no changes)
- @graphprotocol/indexer-agent: 0.4.3 (Docker image: `graphprotocol/indexer-agent:sha-44fe0aa`)
- @graphprotocol/indexer-service: 0.4.3 (no changes, Docker image: `graphprotocol/indexer-service:sha-44fe0aa`)

## Changes

_Note: These are compared to 0.4.2, not 0.4.3-alpha.2._

### Indexer Agent

#### Fixed

- Fix incorrect error code used in database migrations.
- Decouple claiming rewards from updating allocations.
- Don't abort reconciling if removing a deployment fails.
- Never fail reconciling early.
- Fix zero allocation amount log messages.
- Catch more unauthorized transactions.
- Only queue transactions after checking paused and operator status.
- Do nothing if not an operator.
- Fix indexer === operator detection.
- Use `StaticJsonRpcProvider` to reduce Ethereum requests.

#### Changed

- Add `--log-level` / `INDEXER_AGENT_LOG_LEVEL` option.
- Add `--ethereum-polling-interval` / `INDEXER_AGENT_ETHEREUM_POLLING_INTERVAL` option.
- Lengthen network synchronization interval to 120s.
- Improve log message for already closed allocations.
- Add `eth_provider_requests` metric to track Ethereum requests.

### Indexer Service

#### Fixed

- Use `StaticJsonRpcProvider` to reduce Ethereum requests.

#### Changed

- Add `--log-level` / `INDEXER_SERVICE_LOG_LEVEL` option.
- Add `--ethereum-polling-interval` / `INDEXER_SERVICE_ETHEREUM_POLLING_INTERVAL` option.
- Add `eth_provider_requests` metric to track Ethereum requests.

## How to update

1. Install updates:

   NPM:

   ```sh
   # Install the latest
   npm install -g @graphprotocol/indexer-cli
   npm install -g @graphprotocol/indexer-agent
   npm install -g @graphprotocol/indexer-service

   # Install specific versions
   npm install -g @graphprotocol/indexer-cli@0.4.3
   npm install -g @graphprotocol/indexer-agent@0.4.3
   npm install -g @graphprotocol/indexer-service@0.4.3
   ```

   Docker:

   ```sh
   docker pull graphprotocol/indexer-agent:sha-44fe0aa
   docker pull graphprotocol/indexer-service:sha-44fe0aa
   ```

2. Restart indexer agent.
3. Restart indexer service.
