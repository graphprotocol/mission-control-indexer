# 2020-10-28 Indexer 0.3.3 Release with Bugfixes and `$DAI` variable improvements

## What's in this release?

The following new versions are part of this release:

- @graphprotocol/indexer-cli: 0.3.3
- @graphprotocol/indexer-agent: 0.3.3 (Docker image: `graphprotocol/indexer-agent:sha-be91ac4`)
- @graphprotocol/indexer-service: 0.3.3 (Docker image: `graphprotocol/indexer-service:sha-be91ac4`)

## Changes

### Indexer Agent

- Fix creating no allocations at all.
- `$DAI` injection improvements and fixes:
  - Rename `$DAI` injection feature flag and environment variable from
    `--inject-grt-per-dai-conversion-variable` /
    `INDEXER_AGENT_INJECT_GRT_PER_DAI_CONVERSION_VARIABLE` to `--inject-dai`
    and `INDEXER_AGENT_INJECT_DAI`.
  - Preserve `$DAI` on cost model updates.
  - Fix injecting `$DAI` into `null` variables.
  - Fix adding `$DAI` to `null` cost models.
  - Don't accidentally clear non-`$DAI` variables.
  - Inject `$DAI` into new models when they are created.
- Add database migrations and change cost model variables column to JSONB.

### Indexer Service

- Add `--metrics-port` / `INDEXER_SERVICE_METRICS_PORT` to configure the metrics port.

## How to update

1. Install updates:

   NPM:

   ```sh
   # Install the latest
   npm install -g @graphprotocol/indexer-cli
   npm install -g @graphprotocol/indexer-agent
   npm install -g @graphprotocol/indexer-service

   # Install specific versions
   npm install -g @graphprotocol/indexer-cli@0.3.3
   npm install -g @graphprotocol/indexer-agent@0.3.3
   npm install -g @graphprotocol/indexer-service@0.3.3
   ```

   Docker:

   ```sh
   docker pull graphprotocol/indexer-agent:sha-be91ac4
   docker pull graphprotocol/indexer-service:sha-be91ac4
   ```

2. Restart indexer agent and indexer service.
