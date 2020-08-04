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

- [Terraform infrastructure template](./terraform/)
- [Kubernetes manifests](./k8s/)

Graph Node:

- [README](https://github.com/graphprotocol/graph-node/)
- [Docker image](https://hub.docker.com/r/graphprotocol/graph-node)
- [Environment variables](https://github.com/graphprotocol/graph-node/tree/master/docs/environment-variables.md)

Configuration hints:

- Resource guidance:
  ![Resource Guidance](files/infrastructure-resources.png)
- Access to an Ethereum mainnet archive node is required. This will enable
  you to index most of the testnet subgraphs, but not all of them. Ideal is an
  Ethereum mainnet archive node with the OpenEthereum `trace` API enabled.
- The following IPFS node is to be used when setting up Graph Node:
  https://testnet.thegraph.com/ipfs/

### Successful Completion

The following criteria must be met in order to successfully complete this
phase or mission:

1. Share a Graph Node query endpoint with The Graph.
2. Share a Prometheus endpoint with The Graph.
3. Deploy the following subgraphs to the Graph Node. These subgraphs are
   representative for all currently existing subgraphs with regards to their
   indexing effort and features used:

   ```
   Subgraph:   Moloch
   Deployment: QmTXzATwNfgGVukV1fX2T6xw9f6LAYRVWpsdXyRWzUR2H9
   Explorer:   https://thegraph.com/explorer/subgraph/molochventures/moloch
   ```

   ```
   Subgraph:   Uniswap
   Deployment: QmXKwSEMirgWVn41nRzkT3hpUBw29cp619Gx58XW6mPhZP
   Explorer:   https://thegraph.com/explorer/subgraph/uniswap/uniswap-v2
   ```

   ```
   Subgraph:   Synthetix (bonus points, requires an Ethereum node with the `trace` API)
   Deployment: Qme2hDXrkBpuXAYEuwGPAjr6zwiMZV4FHLLBa3BHzatBWx
   Explorer:   https://thegraph.com/explorer/subgraph/synthetixio-team/synthetix
   ```

4. Serve queries for all of the above subgraphs over the shared Graph Node endpoint.
5. Serve Graph Node metrics through the shared Prometheus endpoint.
6. Serve 10 queries/second with less than 0.05% error rate for queries.

At the end of the phase, the Graph team will verify the above criteria for
all indexers participating in the testnet.
