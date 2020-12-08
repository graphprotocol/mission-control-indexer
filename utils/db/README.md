# Tools for scary database maintenance tasks

_BEFORE USING ANY OF THESE TOOLS TAKE A BACKUP OF YOUR DATABASE AND MAKE
SURE YOU CAN SUCCESSFULLY RESTORE THE BACKUP_

These tools generally assume that you have your environment set up in such
a way that running just `psql` will connect you to the `graph-node`
database. There are a number of ways to do that: `psql` accepts a number of
[environment
variables](https://www.postgresql.org/docs/13/libpq-envars.html) that let
you define your connection. The recommended way though is to use a [service
file](https://www.postgresql.org/docs/13/libpq-pgservice.html) so that you
can run a maintenance script as `PGSERVICE=mydatabase some_script`. If you
are using Google CloudSQL [this file](./gcloud-connect.md) explains how you
can use `cloud_sql_proxy` to connect from your workstation to your CloudSQL
database.

## Removing unused deployments

When a subgraph deployment is not used by any subgraph any longer, its data
still stays in the database. To remove that data, run the script
`bin/remove-unused-deployments`.

A deployment is considered unused if it is not currently assigned for
indexing, and is neither the current nor pending version of any subgraph.

To use this script, you have to set hings up so that you can log into the
desired graph databases without supplying details on the psql command line,
i.e., running just `psql` should connect you to the database from which you
want to remove deployments/subgraph versions

The recommended way to configure your environment to do the above if to use
a [pg_service.conf
file](https://www.postgresql.org/docs/9.6/libpq-pgservice.html) In a
nutshell, put the following into `~/.pg_service.conf`, filling in the
relevant values for your environment:

    [mygraph]
    host=<database host>
    hostaddr=<database ip address> # can be omitted if DNS to 'host' works
    port=<database port>
    dbname=<database name>
    user=<database user>
    password=<database password>

Check that you set things up properly by running

    PGSERVICE=mygraph psql -c 'select count(*) from subgraphs.subgraph'

That should return the number of named subgraphs in your
installation. Once that works, you can now run

    PGSERVICE=mygraph ./remove-unused-deployments

All output will be sent to `/var/tmp/remove-unused-deployments.txt` - you
will not see any output from this script in your terminal.


## Rewinding a database

We have several reports that buggy Ethereum nodes produce invalid data
where the head of the chain jumps far into the future. If that happens, it
is necessary to rewind subgraphs to a safe block and resume indexing from
there.

Before you do that, shut down any process that could be writing to your
database, in particular your index nodes.

Determine what the 'safe' block is that you want to rewind to and check
that it is in the `ethereum_blocks` table in the database. We'll call the
block number `$block` and the hash `$hash`. You can find the hash for a
given block number with this query (it is fine if that query returns more
than one block, `graph-node` knows how to handle that situation):
```sql
select number, hash
  from ethereum_blocks
 where number = $block
   and network_name = 'mainnet';
```

Execute the following commands in `psql`, replacing `$block` and `$hash`
with the values you determined in the last step. The `$hash` should be a
string with no leading `0x` or `\x`, i.e. just `deadbeef` and not
`0xdeadbeef`.

```sql
\i sql/rewind-subgraph.sql

select rewind_all('mainnet', $block, '$hash');

drop function rewind_all(varchar, integer, varchar);
drop function rewind_subgraph(varchar, integer, varchar);
```

Once these steps have finished successfully, start your index node again. It
will resume indexing from block `$block`.

## Recovering from Uniswap failure at block 11014326

This is a very particular fix for a very particular problem with the
Uniswap subgraph with ID
`QmWTrJJ9W8h3JE19FhCzzPYsJ2tgXZCdUqnbyuo64ToTBN`. Since it is so
particular, you can find the instructions for fixing it in [this
gist](https://gist.github.com/lutter/1b04645fecb06b036b3fedfcdaf7c264)
