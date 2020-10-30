# 2020-10-30 Indexer 0.3.5 Release with Dependency Fixes

## What's in this release?

The following new versions are part of this release:

- @graphprotocol/indexer-cli: 0.3.5
- @graphprotocol/indexer-agent: 0.3.5 (Docker image: `graphprotocol/indexer-agent:sha-1e21cc6`)
- @graphprotocol/indexer-service: 0.3.5 (Docker image: `graphprotocol/indexer-service:sha-1e21cc6`)

## Changes

The [0.3.3](./2020-10-28-indexer-release-v0.3.3.md) release introduced an
issue with conflicting dependencies. As a consequence, none of the components
were starting properly.

This release fixes the dependency issues.

## How to update

1. Install updates:

   NPM:

   ```sh
   # Install the latest
   npm install -g @graphprotocol/indexer-cli
   npm install -g @graphprotocol/indexer-agent
   npm install -g @graphprotocol/indexer-service

   # Install specific versions
   npm install -g @graphprotocol/indexer-cli@0.3.5
   npm install -g @graphprotocol/indexer-agent@0.3.5
   npm install -g @graphprotocol/indexer-service@0.3.5
   ```

   Docker:

   ```sh
   docker pull graphprotocol/indexer-agent:sha-1e21cc6
   docker pull graphprotocol/indexer-service:sha-1e21cc6
   ```

2. Restart indexer agent and indexer service.
