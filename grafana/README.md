This directory contains Grafana dashboards, the same dashboards that the
kubernetes setup deploys by default in the
[../k8s/base/grafana.yaml](Grafana container) It should be possible to load
these dashboards manually into a Grafana instance. They expect two
datasources: a `postgres` datasource connected to the `graph` database, and
a `prometheus` data source connected to the Prometheus instance running in
the indexing cluster.
