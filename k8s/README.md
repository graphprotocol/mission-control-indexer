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