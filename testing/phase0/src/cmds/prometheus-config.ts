import { Argv } from 'yargs'
import { parseIndexers, Indexer } from '../data/indexers'
import { assert } from 'console'
import * as YAML from 'yaml'

const buildScrapingJob = (indexer: Indexer): any => ({
  job_name: `${indexer.kind}:${indexer.normalizedName}`,
  honor_labels: true,
  metrics_path: indexer.prometheus.pathname,
  tls_config: { insecure_skip_verify: true },
  scheme: indexer.prometheus.protocol === 'https:' ? 'https' : 'http',
  params: {
    'match[]': [
      'subgraph_count',
      'subgraph_query_execution_time_bucket',
      'subgraph_query_execution_time_sum',
      'subgraph_query_execution_time_count',
    ],
  },
  static_configs: [
    {
      labels: {
        indexer_name: `${indexer.kind}:${indexer.normalizedName}`,
      },
      targets: [
        `${indexer.prometheus.hostname}:${
          indexer.prometheus.port ||
          (indexer.prometheus.protocol === 'https:' ? 443 : 80)
        }`,
      ],
    },
  ],
  basic_auth: indexer.prometheus.username
    ? {
        username: indexer.prometheus.username,
        password: decodeURIComponent(indexer.prometheus.password),
      }
    : undefined,
})

export default {
  command: 'prometheus-config <csv-file>',
  describe: 'Generates a Prometheus config for all indexers',
  builder: (yargs: Argv) => {
    yargs.positional('csv-file', {
      type: 'string',
      describe: 'A CSV file generated from the indexers form',
    })
  },
  handler: async (argv: any) => {
    const indexers = parseIndexers(argv.csvFile)

    const indexerJobs = indexers.map(buildScrapingJob)

    const config = {
      global: {
        scrape_interval: '15s',
        evaluation_interval: '15s',
      },
      scrape_configs: [
        {
          job_name: 'kubernetes-pods',
          kubernetes_sd_configs: [
            {
              role: 'pod',
            },
          ],
          relabel_configs: [
            {
              source_labels: [
                '__meta_kubernetes_pod_annotation_prometheus_io_scrape',
              ],
              action: 'keep',
              regex: true,
            },
            {
              source_labels: [
                '__meta_kubernetes_pod_annotation_prometheus_io_path',
              ],
              action: 'replace',
              target_label: '__metrics_path__',
              regex: '(.+)',
            },
            {
              source_labels: [
                '__address__',
                '__meta_kubernetes_pod_annotation_prometheus_io_port',
              ],
              action: 'replace',
              regex: '([^:]+)(?::d+)?;(d+)',
              replacement: '$1:$2',
              target_label: '__address__',
            },
            {
              source_labels: ['__meta_kubernetes_pod_name'],
              action: 'replace',
              target_label: 'kubernetes_pod_name',
            },
          ],
        },
        ...indexerJobs,
      ],
    }

    const configMap = {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: 'prometheus-conf',
        labels: { name: 'prometheus-conf' },
      },
      data: {
        'prometheus.yml': YAML.stringify(config),
      },
    }

    console.log(YAML.stringify(configMap))
  },
}
