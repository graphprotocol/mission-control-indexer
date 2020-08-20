# Creating the Kubernetes resources for the indexer

* Update the directory `custom` to override settings from the `base`
 configuration.
* Read through all the files in `custom` and adjust any values as indicated
  in the comments.
* Deploy all resources with `kubectl apply -k custom`

##  Understanding your indexer infrastructure

Use the various dashboards and user interfaces that the [Google Cloud
Console](https://console.cloud.google.com/) provides to inspect the
infrastructure that the Terraform and Kubernetes manifests have created. In
particular, you will want to look at [your
database](https://console.cloud.google.com/sql/instances) and your
[Kubernetes
workloads](https://console.cloud.google.com/kubernetes/workload). The
Kubernetes manifests set up a number of
[services](https://console.cloud.google.com/kubernetes/discovery), two of
which have an external IP: The `grafana` service Runs an instance of
Grafana, and has a few useful dashboards preinstalled. The `query-node`
service exposes an endpoint for querying subgraphs.

### Preinstalled Grafana dashboards

The Kubernetes cluster contains a Grafana instance that is configured to
query the Prometheus instance in the cluster and the Postgres
database. Note that Grafana runs in a container and stores its dashboards
in non-persistent storage - any changes you make to the dashboards will be
lost when the Grafana container is restarted unless you use the Grafana UI
to back them up outside the cluster. Upon creation, the container uses the
default Grafana username and password, `admin` for both.

By default, the Grafana container has the following dashboards:

* _Indexing Status_ provides an overview of all the deployed subgraphs,
  fatal errors that subgraphs might have encountered, and the current head
  block for each network that is being indexed
* _Load statistics_ shows how long query nodes need to wait for database
  connections (and indicator of whether the database is overloaded), how
  much time they spend responding to queries, and how many database
  connections are in use at any point in time
* The _Postgres statistics_ dashboard shows details on database activity,
  in particular currently running queries, active looks, and how many
  tables need to be autovacuumed
* _Subgraph Indexing Metrics_ displays details about where particular
  subgraphs spend the most time when they are ingesting blocks

### Querying subgraphs

The `query-node` service accepts GraphQL queries for subgraphs deployed in
the infrastructure at its `ip`. The URLs `http://<ip>/subgraphs/name/<subgraph
name>/graphql` and `http://<ip>/subgraphs/id/<subgraph id>/graphql` provide
a GraphiQL playground that allows inspecting the GraphQL schema and running
queries against the subgraph. GraphQL clients should submit queries to
the URLs `http://<ip>/subgraphs/name/<subgraph name>` and
`http://<ip>/subgraphs/id/<subgraph id>`

# Using the shell container

The kubernetes setup starts a container meant for interacting with the
cluster 'from the inside'. Run `kubectl exec shell -ti -- /bin/bash` to get
to a shell in that container. The container has `curl` preinstalled which
you can use to check on the query and index nodes.

## Managing subgraphs directly

The shell container contains a number of scripts to perform simple tasks
for managing subgraphs. You can run each of them with
```bash
kubectl exec shell -- <script> <arguments>
```

The scripts will only be necessary for Phase 0 until we introduce
automated deployment of subgraphs through our smart contracts. In Phase 0,
you will use them to do the following:

* `create <subgraph name>`: creates a subgraph name, like
  `uniswap/uniswap-v2`. This only makes the name known to the system,
  but does not deploy any data yet.
* `deploy <subgraph name> <subgraph id> <node>`: deploys a specific
  subgraph and associates it with a name. The subgraph will be indexed by
  the index node `node`. For example, `deploy uniswap/uniswap-v2
  QmXKwSEMirgWVn41nRzkT3hpUBw29cp619Gx58XW6mPhZP index_node_0` will deploy
  Uniswap V2 and start indexing it on `index-node-0`
* `reassign <subgraph name> <subgraph id> <node>` will move indexing of the
  given subgraph version to a different node `node`. It is possible to use
  a node name that does not exist in the infrastructure, say `unused`, to
  stop indexing the subgraph. Indexing can be started again by assigning
  the subgraph to an existing node, such as `index_node_0`
* `remove <subgraph name>` removes a subgraph name. Note that any
  deployments that might have been associated with that name will not be
  removed.

## Core dumps

When things go very wrong and a query or index node crashes, the node
produces a core dump that can be found at `/var/lib/graph/cores` in the
shell container. In rare cases, when there is no other way to understand a
specific problem, we might ask you to provide us with a tarball of such a
crash dump.

# Managing subgraphs using the Indexer Agent

The Indexer Agent polls the network and the indexer infrastructure and manages 
subgraph deployments and allocations. The decisions made by the indexer-agent
use indexer rules which can either be applied globally (deployment = 'global') or to a 
specific subgraph deployment using its ID. 

Indexer rules are hosted on the `indexer-agent`'s indexer management Server. 
The `indexer-cli` can be used to manage the indexer rules and does so via
GraphQL queries and mutations.  

## Installing `indexer-cli`

1. Login to the [registry](`https://testnet.thegraph.com/npm-registry/`) using a web browser.
2. Setup npm to access the registry.
    ```
    npm set registry https://testnet.thegraph.com/npm-registry
    ```
3. Ensure both CLI's are installed.
    ```
    npm install -g graph-cli
    npm install -g indexer-cli 
    ``` 
4. Allow access to your `indexer-agent` from your current machine.
    
    ```
    kubectl port-forward pod/<indexer-agent-pod> 9700:<indexer-management-server-port>
    ```
5. Connect the `indexer-cli` to the indexer management server.
    
    ```yaml
    graph indexer connect http://localhost:9700
    ```
## Using `indexer-cli` 

### Commands

The `cli` [repository](https://github.com/graphprotocol/clis) contains usage info and examples, but to 
help get started and provide some context the command will also briefly be describe here. 

* `graph indexer connect <url>`: connect to the indexer management API.
* `graph indexer rules get [options] <deployment-id> [<key1> ...]`: Get one or more indexing rules using 
  <deployment-id> = all to get every rule. An additional argument `--merged` can be used to specify that deployment
  specific rules are merged with the global rule. 
  specific  
* `graph indexer rules maybe [options] <deployment-id>`: Set the `decisionBasis` for a deployment to `rules`, so that
  the `indexer-agent` will use indexer rules to decide whether to index this deployment. 
* `graph indexer rules set [options] <deployment-id> <key1> <value1> ...`: Set one or more indexing rules
* `graph indexer rules start  [options] <deployment-id>`: Start indexing a subgraph deployment if available and set 
  its `decisionBasis` to `always`, so the indexer-agent will always choose to index it. If the global rule is set to 
  `always` then all available subgraphs on the network will be indexed.
* `graph indexer rules stop [options] <deployment-id>`: Stop indexing a deployment and set its `decisionBasis` to `never`,
  so it will skip this deployment when deciding on deployments to index. 

All commands which display rules in the output can choose between the supported output formats (table, YAML, and JSON) 
using the `--output` argument.
 
### Rules

The structure of an indexer rule is detailed below. The `deployment` and `decisionBasis` fields
are mandatory while all other fields are nullable. When an `IndexerRule` has `decisionBasis` = 'rule' the `indexer-agent` 
will compare non-null threshold values on that rule with values fetched from the `network-subgraph` for the corresponding 
deployment. If the subgraph deployment has values above any of the thresholds it will be chosen for indexing.  
For example: if the global rule has a `minStake` of `5 GRT`, any subgraph deployment which has more that `5 GRT` of stake 
allocated to it will be indexed. Threshold rules include `maxAllocationPercentage`, `minSignal`, `maxSignal`, `minStake`, 
and `minAverageQueryFees`.

```
IndexerRule {
  deployment: string
  allocation: string | null
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
