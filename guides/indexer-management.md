# Indexer Management using Indexer Agent and CLI

The Indexer Agent monitors the network and the indexer's own infrastructure
and manages which subgraph deployments are indexed and allocated towards on chain. These deployments become the ones that the indexer official serves and can receive paid queries for.

The decisions made by the Indexer Agent are based on indexing rules that can
either be applied as global defaults or for specific subgraph deployments
using their IDs.

The Indexer CLI can be used to manage the these indexing rules by connecting
to the Indexer Agent. Ideally, this happens through port-forwarding, so the
CLI does not need to run on the same server or cluster.

## Installing the Indexer CLI

1. Login to the [testnet NPM registry](`https://testnet.thegraph.com/npm-registry/`) using a web browser.
2. Setup npm to access the registry.
   ```sh
   npm set registry https://testnet.thegraph.com/npm-registry
   ```
3. Ensure Graph CLI and Indexer CLI are installed.
   ```sh
   npm install -g @graphprotocol/graph-cli
   npm install -g @graphprotocol/indexer-cli 
   ``` 
4. Allow accessing the indexer management API of the `indexer-agent`
   from your current machine.
   ```sh
   kubectl port-forward pod/<indexer-agent-pod> 8000:18000
   ```
5. Connect the Indexer CLI to the indexer management API.
    ```yaml
    graph indexer connect http://localhost:18000/
    ```

## Using the Indexer CLI

### Commands

To help you get started, and to provide some context, CLI will briefly be describe here. 

* `graph indexer connect <url>` — Connect to the indexer management API.

* `graph indexer rules get [options] <deployment-id> [<key1> ...]` — Get one or
  more indexing rules using `all` as the `<deployment-id>` to get all rules,
  and `global` to get the global defaults. An additional argument `--merged`
  can be used to specify that deployment specific rules are merged with the
  global rule. This is how they are applied in the Indexer Agent.

* `graph indexer rules set [options] <deployment-id> <key1> <value1> ...` — Set
  one or more indexing rules.

* `graph indexer rules start [options] <deployment-id>` — Start indexing a
  subgraph deployment if available and set its `decisionBasis` to `always`, so
  the Indexer Agent will always choose to index it. If the global rule is set
  to `always` then all available subgraphs on the network will be indexed.

* `graph indexer rules stop [options] <deployment-id>` — Stop indexing a
  deployment and set its `decisionBasis` to `never`, so it will skip this
  deployment when deciding on deployments to index.

* `graph indexer rules maybe [options] <deployment-id>` — Set the
  `decisionBasis` for a deployment to `rules`, so that the Indexer Agent will
  use indexing rules to decide whether to index this deployment.

All commands which display rules in the output can choose between the
supported output formats (`table`, `yaml`, and `json`) using the `--output`
argument.
 
### Indexing Rules

The structure of an indexing rule is detailed below.

The `deployment` and `decisionBasis` fields are mandatory, while all other
fields are nullable. When an indexing rule has `rules` as the
`decisionBasis`, then the Indexer Agent will compare non-null threshold
values on that rule with values fetched from Network Subgraph / contracts for
the corresponding deployment. If the subgraph deployment has values above (or
below) any of the thresholds it will be chosen for indexing.

For example, if the global rule has a `minStake` of `5` (GRT), any subgraph
deployment which has more that `5` (GRT) of stake allocated to it will be
indexed. Threshold rules include `maxAllocationPercentage`, `minSignal`,
`maxSignal`, `minStake`, and `minAverageQueryFees`.

Data model:

```
type IndexingRule {
  deployment: string
  allocationAmount: string | null
  parallelAllocations: number | null
  decisionBasis: IndexingDecisionBasis
  maxAllocationPercentage: number | null
  minSignal: string | null
  maxSignal: string | null
  minStake: string | null
  minAverageQueryFees: string | null
  custom: string | null  
}

IndexingDecisionBasis {
  rules
  never
  always
}
```
