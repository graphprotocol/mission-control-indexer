# Mission Control: Indexer Material

Technical indexer documentation and infrastructure templates for the Mission Control testnet.

For support, please join the `#indexers` channel on [our
Discord](https://thegraph.com/discord). The Graph team will be happy to
assist you in getting set up.

## Phase 0: Run an Indexer

In this phase indexers are asked to set up basic indexer infrastructure. This
infrastructure will then be extended upon in phase 1. The infrastructure
required for phase 0 includes:

- Graph Node
- Postgres database
- Prometheus

### The Mission

The mission is to set up the above infrastructure and index a specific set of
subgraphs. The following documentation is provided to help with this mission:

Example infrastructure:

- [Terraform infrastructure template](./phase0/terraform/)
- [Kubernetes manifests](./phase0/k8s/)

Graph Node:

- [README](https://github.com/graphprotocol/graph-node/)
- [Docker image](https://hub.docker.com/r/graphprotocol/graph-node)
- [Environment variables](https://github.com/graphprotocol/graph-node/tree/master/docs/environment-variables.md)

Configuration hints:

- The following IPFS node is to be used when setting up Graph Node:
  https://api.thegraph.com/ipfs/
- Access to Ethereum nodes with the following capabilities is required:
    - Archive data for subgraph deployments that make `ethereum_call`
      requests against historic blocks.
    - The OpenEthereum `trace` API for subgraph deployments that use call
      handlers.

#### Successful Completion

The following criteria need to be met in order to successfully complete this
phase or mission:

1. Share a Graph Node query endpoint with The Graph.
2. Share a Prometheus endpoint with The Graph.
3. Deploy the following subgraphs to the Graph Node. These subgraphs are
   representative for all currently existing subgraphs with regards to their
   indexing effort and features used:
   ```
   Subgraph:   Everest
   Deployment: QmVsp1bC9rS3rf861cXgyvsqkpdsTXKSnS4729boXZvZyH
   Explorer:   https://thegraph.com/explorer/subgraph/graphprotocol/everest
   ```
   ```
   Subgraph:   Decentraland Marketplace
   Deployment: QmPTCpBUWvMjm8y22anuKnnAWySRDRUZwGYRxshj42NmeG
   Explorer:   https://thegraph.com/explorer/subgraph/decentraland/marketplace
   ```
   ```
   Subgraph:   Synthetix
   Deployment: Qme2hDXrkBpuXAYEuwGPAjr6zwiMZV4FHLLBa3BHzatBWx
   Explorer:   https://thegraph.com/explorer/subgraph/synthetixio-team/synthetix
   ```
4. Be able to serve queries for all of the above subgraphs over the shared
   Graph Node endpoint.
5. Be able to serve Graph Node metrics through the shared Prometheus
   endpoint.

At the end of the phase, the Graph team will verify the above criteria for
all indexers participating in the testnet.