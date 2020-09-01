# 2020-09-01 Indexer Agent and CLI Bugfix Releases

## What's in the releases?

The releases are part of this update:

- @graphprotocol/indexer-cli: 0.1.4
- @graphprotocol/indexer-agent: 0.2.5
- @graphprotocol/indexer-service: 0.2.5 (no changes)

These are primarily bugfix release and resolve the following problems:

- Indexer Agent

  - Avoid failed transactions; wait with settling allocations until one epoch has passed
  - Display and use correct token/allocation amounts
  - Throw useful errors when network subgraph and indexing status queries fail
  - Support HTTPS for `--graph-node-admin-endpoint`

- Indexer CLI
  - Validate deployment IDs to avoid broken indexing rules
  - Display and use correct token/allocation amounts
  - Simplify internal logic for parsing, fetching and displaying indexing rules

## How to update

1. Install updates:

   NPM:

   ```sh
   # Install the latest
   npm install -g @graphprotocol/indexer-cli
   npm install -g @graphprotocol/indexer-agent
   npm install -g @graphprotocol/indexer-service # optional

   # Install specific versions
   npm install -g @graphprotocol/indexer-cli@0.1.4
   npm install -g @graphprotocol/indexer-agent@0.2.5
   npm install -g @graphprotocol/indexer-service@0.2.5 # optional
   ```

   Docker:

   ```sh
   docker pull graphprotocol/indexer-agent:sha-573cee8

   # Optional, but can't hurt:
   docker pull graphprotocol/indexer-service:sha-573cee8
   ```

2. Restart indexer agent and, optionally, indexer service.
