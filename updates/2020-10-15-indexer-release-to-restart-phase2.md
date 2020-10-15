# 2020-10-15 Indexer 0.3.1 Release to Restart Phase 2

## What's in this release?

The following new versions are part of this release:

- @graphprotocol/indexer-cli: 0.3.1
- @graphprotocol/indexer-agent: 0.3.1 (Docker image: `graphprotocol/indexer-agent:sha-c16642a`)
- @graphprotocol/indexer-service: 0.3.1 (Docker image: `graphprotocol/indexer-service:sha-c16642a`)

The only change in this release is that the `common-ts` dependency is updated
from `0.3.2` to `0.3.3` in order to use new contracts. This allows us to
cleanly restart phase 2, as announced earlier this week.

## How to update

1. Install updates:

   NPM:

   ```sh
   # Install the latest
   npm install -g @graphprotocol/indexer-cli
   npm install -g @graphprotocol/indexer-agent
   npm install -g @graphprotocol/indexer-service

   # Install specific versions
   npm install -g @graphprotocol/indexer-cli@0.3.1
   npm install -g @graphprotocol/indexer-agent@0.3.1
   npm install -g @graphprotocol/indexer-service@0.3.1
   ```

   Docker:

   ```sh
   docker pull graphprotocol/indexer-agent:sha-c16642a
   docker pull graphprotocol/indexer-service:sha-c16642a
   ```

2. Restart indexer agent and indexer service.