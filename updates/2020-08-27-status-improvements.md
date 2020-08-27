# 2020-08-27 Indexer CLI Status Improvements

## What's in this release?

There is a new `@graphprotocol/indexer-cli` release that provides detailed
status reports for indexer endpoints, with possible actions to take to
resolve the problems:

![Indexer Status](../files/indexer-status-report.png)

## How to update

1. Install the latest version of `@graphprotocol/indexer-cli` with NPM:
   ```sh
   # Make sure you are logged in to https://testnet.thegraph.com/npm-registry/
   # and that this is your default registry
   npm install -g @graphprotocol/indexer-cli
   ```

2. Run `graph indexer status` to get a more detailed report for your
   endpoints.