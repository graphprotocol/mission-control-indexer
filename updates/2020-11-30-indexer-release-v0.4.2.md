# 2020-11-27 Indexer 0.4.2 "TRAFFIC NOW! 🚦" Release

## What's in this release?

The following new versions are part of this release:

- @graphprotocol/indexer-cli: 0.4.2 (no changes)
- @graphprotocol/indexer-agent: 0.4.2 (Docker image: `graphprotocol/indexer-agent:sha-b7019b9`)
- @graphprotocol/indexer-service: 0.4.2 (no changes, Docker image: `graphprotocol/indexer-service:sha-b7019b9`)

## Changes

### Indexer Agent

- Fix signing allocation ID proofs using the corresponding private key,
  instead of the operator key.

## How to update

1. Install updates:

   NPM:

   ```sh
   # Install the latest
   npm install -g @graphprotocol/indexer-cli
   npm install -g @graphprotocol/indexer-agent
   npm install -g @graphprotocol/indexer-service

   # Install specific versions
   npm install -g @graphprotocol/indexer-cli@0.4.2
   npm install -g @graphprotocol/indexer-agent@0.4.2
   npm install -g @graphprotocol/indexer-service@0.4.2
   ```

   Docker:

   ```sh
   docker pull graphprotocol/indexer-agent:sha-b7019b9
   docker pull graphprotocol/indexer-service:sha-b7019b9
   ```

2. Restart indexer agent.
3. Restart indexer service.
