# Phase 0 Test Harness

## Usage

### Create `indexers.csv` file

Create an `indexers.csv` file with the structure below. This is a simple CSV
file with your basic details and endpoints. Note that the `Organization` and
`Passed phase 0 tests` are boolean columns. To set them to `false`, leave
them empty. To set them to `true`, type in `checked`.

```
Name,Contact Full Name,Organization,Passed phase 0 tests,Contact Email,Graph node endpoint,Prometheus endpoint
Your name,Your contact name,checked,,foo@bar.com,http://graph.node/,http://prometheus.endpoint/
```

### Run tests

First of all, install dependencies with:

```sh
yarn
```

After that, run the test script as follows:

```sh
./cli test --output report.csv indexers.csv queries.csv | tee report.md
```

This will generate a Markdown and CSV report in `report.md` and `report.csv`.

The test script comes with a few options that you can use to run a shorter
test. For instance, you can pass in `--duration 10` to only run the query
test for 10 seconds:

```sh
./cli test <csv-file> <queries-file>

Test indexer endpoints

Positionals:
  csv-file      A CSV file generated from the indexers form  [string] [required]
  queries-file  A file with one query per line (each of the form
                <deployment>,<query>)                        [string] [required]

Options:
  --version                  Show version number                       [boolean]
  --help                     Show help                                 [boolean]
  --verbose                                           [boolean] [default: false]
  --max-error-rate                                    [number] [default: 0.0005]
  --min-request-rate                                      [number] [default: 10]
  --duration                 Duration of the test (default: 300s)
                                                         [number] [default: 300]
  --connections-per-indexer  Connections to open with each indexer (default: 10)
                                                          [number] [default: 10]
  --rate-per-indexer         Request rate (per second) to use per indexer
                             (default: undefined)                       [number]
  --all                      Whether to also test all indexers together
                             (default: false)                          [boolean]
  --output                   CSV file to write the full report to
                                                             [string] [required]
```

### What is being tested?

The test logic can be found in [src/cmds/test.ts](src/cmds/test.ts). You can
add your own debugging or simply look at what the script does.