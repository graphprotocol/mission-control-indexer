# Indexer Infrastructure Ports

## Ports Overview

The following ports are being used by all components by default. Also listed are
the CLI flags and environment variables that can be used to change the ports.

### Graphical Overview

![Ports](../files/ports.png)

### Graph Node

| Port | Purpose                                    | CLI argument        | Environment variable |
| ---- | ------------------------------------------ | ------------------- | -------------------- |
| 8000 | GraphQL HTTP server (for subgraph queries) | `--http-port`       | -                    |
| 8001 | GraphQL WS (for subgraph subscriptions)    | `--ws-port`         | -                    |
| 8020 | JSON-RPC (for managing deployments)        | `--admin-port`      | -                    |
| 8030 | Subgraph indexing status API               | `--index-node-port` | -                    |
| 8040 | Prometheus metrics                         | `--metrics-port`    | -                    |

### Indexer Service

| Port | Purpose                                         | CLI argument | Environment variable   |
| ---- | ----------------------------------------------- | ------------ | ---------------------- |
| 7600 | GraphQL HTTP server (for paid subgraph queries) | `--port`     | `INDEXER_SERVICE_PORT` |
| 7300 | Prometheus metrics                              | -            | -                      |

### Indexer Agent

| Port | Purpose                                      | CLI argument                | Environment variable                    |
| ---- | -------------------------------------------- | --------------------------- | --------------------------------------- |
| 8000 | Indexer management API (for `graph indexer`) | `--indexer-management-port` | `INDEXER_AGENT_INDEXER_MANAGEMENT_PORT` |