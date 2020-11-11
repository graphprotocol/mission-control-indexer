# 2020-11-11 Indexer 0.3.6 "preTRAFFIC 🚦" Release

## What's in this release?

The following new versions are part of this release:

- @graphprotocol/indexer-cli: 0.3.6 (no changes compared to 0.3.5)
- @graphprotocol/indexer-agent: 0.3.6 (Docker image: `graphprotocol/indexer-agent:sha-f305b2d`)
- @graphprotocol/indexer-service: 0.3.6 (Docker image: `graphprotocol/indexer-service:sha-f305b2d`)

## Changes

### Indexer Agent

- **Fix only collecting indexing rewards when forcibly closing allocations.**
  - Indexing rewards were not collected when closing allocations automatically.
- Fix caching of subgraph indexing statuses.
- Update network subgraph deployment.
- Document (in help text) that `--index-node-ids` is comma-separated.

### Indexer Service

**Please delete/recreate your indexer-service/-agent database as part of this
upgrade. This is necessary to remove any state channel data that may already
have been created. When you do this, remember to back up your indexing rules
and cost models first — `pg_dump` and `pg_restore` are your friends!**

- **New environment variable: `SKIP_EVM_VALIDATION=true`. Make sure to set this!**
- Fix caching of network subgraph data.
- Fix free query auth token (only relevant if you want to query your own indexer service for free).
- Update receipt manager to improve state channels integration.

## How to update

1. Install updates:

   NPM:

   ```sh
   # Install the latest
   npm install -g @graphprotocol/indexer-cli
   npm install -g @graphprotocol/indexer-agent
   npm install -g @graphprotocol/indexer-service

   # Install specific versions
   npm install -g @graphprotocol/indexer-cli@0.3.6
   npm install -g @graphprotocol/indexer-agent@0.3.6
   npm install -g @graphprotocol/indexer-service@0.3.6
   ```

   Docker:

   ```sh
   docker pull graphprotocol/indexer-agent:sha-f305b2d
   docker pull graphprotocol/indexer-service:sha-f305b2d
   ```

2. Restart indexer agent and indexer service.
