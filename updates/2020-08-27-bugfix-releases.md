# 2020-08-27 Indexer Agent and CLI Bugfix Releases

## What's in the releases?

These releases fix the following issues:

- Indexer Agent now correctly detects when it has registered the indexer on chain, instead of crashing and trying again on each start. In setups that automatically restart on exit, this was causing ETH to diminish quickly.

- Indexer CLI now correctly detects the registration status of the indexer as well as the endpoint health.

## How to update

NPM:

```sh
npm install -g @graphprotocol/indexer-agent
npm install -g @graphprotocol/indexer-cli
```

Docker:

```sh
docker pull graphprotocol/indexer-agent:sha-42653f4

# Optional, but can't hurt:
docker pull graphprotocol/indexer-service:sha-42653f4
```

After this, restart the indexer agent (and, optionally, the indexer service).