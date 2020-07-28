# Creating the Kubernetes resources for the indexer

* Update the directory `overlays` to override settings from the `base`
* configuration.
* Read through all the files in `overlays` and adjust any values as indicated
  in the comments.
* Deploy all resources with `kubectl apply -k overlays`

# Using the shell container

The kubernetes setup starts a container meant for interacting with the
cluster 'from the inside'

## Managing subgraphs

```bash
kubectl exec shell -- create me/mysubgraph
kubectl exec shell -- deploy me/mysubgraph Qmmysubgraph index_node_0
```