# 2020-10-27 Indexer 0.3.2 Release with Phase 2 Improvements

## What's in this release?

The following new versions are part of this release:

- @graphprotocol/indexer-cli: 0.3.2
- @graphprotocol/indexer-agent: 0.3.2 (Docker image: `graphprotocol/indexer-agent:sha-960b586`)
- @graphprotocol/indexer-service: 0.3.2 (Docker image: `graphprotocol/indexer-service:sha-960b586`)

Important usage updates: 
- The indexer agent now exposes a metrics port (default: `7300`) that can be changed 
with `INDEXER_AGENT_METRICS_PORT`/`--metrics-port`.
- When started with `--inject-grt-per-dai-conversion-variable` or `INDEXER_AGENT_INJECT_GRT_PER_DAI_CONVERSION_VARIABLE`, the indexer 
agent automatically injects a `$DAI` variable to allow expressing cost models in GDAI by multiplying with `$DAI`. 

### Changelog

#### Indexer Agent

##### Added
- Don't try to allocate zero or negative GRT amounts
- Submit random POI, if cannot create one, to allow testing of indexer rewards distribution on testnet
- Add optional GDAI/GRT variable automation
- Include metrics for the GRT<->DAI conversion rate in both directions

##### Fixed
- Reduce failed allocate transactions by improving allocation ID collision resistance
- Increase effective allocations limit (100 -> 1000)
- Validate allocation ID with contract before sending an allocation transaction

#### Indexer Service

##### Fixed
- Avoid GraphQL caching

#### Indexer CLI

##### Added
- Add `graph indexer rules delete <all | global | deployment-id>` command

## How to update

1. Install updates:

   NPM:

   ```sh
   # Install the latest
   npm install -g @graphprotocol/indexer-cli
   npm install -g @graphprotocol/indexer-agent
   npm install -g @graphprotocol/indexer-service

   # Install specific versions
   npm install -g @graphprotocol/indexer-cli@0.3.2
   npm install -g @graphprotocol/indexer-agent@0.3.2
   npm install -g @graphprotocol/indexer-service@0.3.2
   ```

   Docker:

   ```sh
   docker pull graphprotocol/indexer-agent:sha-960b586
   docker pull graphprotocol/indexer-service:sha-960b586
   ```

2. Restart indexer agent and indexer service.
