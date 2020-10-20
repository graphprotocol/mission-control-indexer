# 2020-10-20 Graph Node v0.19.2 Allows to Disable EIP-1898

## What's in this release?

The following new versions are part of this release:

- @graphprotocol/graph-node: v0.19.2 (Docker image: `graphprotocol/graph-node:v0.19.2`)

This release adds a new `GRAPH_ETH_CALL_BY_NUMBER` environment variable that,
if set (e.g. to `"true"`), disables EIP-1898 (i.e. `eth_call` by block hash,
which some nodes and providers do not support).

## How to update

1. Install updates:

   Docker:

   ```sh
   docker pull graphprotocol/graph-node:v0.19.2
   ```

2. Restart your Graph node(s).