# How to connect to a Postgres database in Google Cloud

These instructions explain how to set things up so that you can connect
from your workstation to Postgres databases running in Google Cloud. In particular,
this setup makes it possible to use `psql` to connect to the database, but you can
also use this setup for tools like [DBeaver](https://dbeaver.io/)

You must have [`gcloud`](https://cloud.google.com/sdk/gcloud) installed and
configured. To check that everything works, you should be able to list your
Postgres database(s) by running `gcloud sql instances list`.

Start by installing [Cloud SQL
   Proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy)

Then save the following script as `start-cloud-sql` somewhere on your
`PATH` and run it with `start-cloud-sql &`. You only need to do this once
after booting your machine, the proxy will run persistently.

```shell
# Port assignments
# If you have multiple databases, it is useful to list which ports
# you are mapping to here
# production          8765
# staging             8766

exec >& /var/tmp/cloud-sql-proxy.log

proxy=/usr/local/bin/cloud_sql_proxy

export CLOUDSDK_CORE_ACCOUNT=< your email address for gcloud >
export CLOUDSDK_CORE_PROJECT=< your gcloud project >

read -r -d '' databases <<EOF
my-project:us-east1:prod-db=tcp:8765
my-project:us-east1:staging-db=tcp:8766
EOF

databases=$(echo "$databases" | tr '\n' ',' | sed -e 's/,$//')

exec ${proxy} -instances=$databases
```

Also make yourself a file `~/.pg_service.conf`. Make sure that the port
numbers match what you have in the above script.

```
[production]
host=production
hostaddr=127.0.0.1
port=8765
dbname=<the database name within Postgres>
user=postgres
password=<the staging database password>

[staging]
host=staging
hostaddr=127.0.0.1
port=8766
dbname=<the database name within Postgres>
user=postgres
password=<the staging database password>
```

You should now be able to connect to the `staging` database with
`PGSERVICE=staging psql`

And finally, here's my `~/.pgsqlrc`; I find it useful, but opinions vary:
```
\timing on
\set PROMPT1 '%[%033[1m%]%m%@%[%033[0;32m%]%~%[%033[0m%]%x%R%# '
\pset null 'ø'
\set COMP_KEYWORD_CASE lower
\set ECHO queries
\set ON_ERROR_ROLLBACK interactive
\x auto
```
