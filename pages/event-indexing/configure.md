# Configuring a Penumbra node to write events to postgres

In order to store ABCI events in Postgres, an operator must configure
CometBFT to use an external database:

1. Create a Postgres database, username, and credentials, and document the `DATABASE_URL`
  used to authenticate as that user.
2. Apply the [CometBFT schema] to the database: `psql -d <DATABASE_URL> -f <path/to/schema.sql>`.
3. Edit the CometBFT config file, by default located at `~/.penumbra/network_data/node0/cometbft/config/config.toml`,
   specifically its `[tx_index]`, and set:
   1. `indexer = "psql"`
   2. `psql-conn = "<DATABASE_URL>"`
4. Run `pd` and `cometbft` as normal.

The format for `DATABASE_URL` is specified in the [Postgres docs](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING-URIS).
After the node is running, check the logs for errors. Query the database with `SELECT height FROM blocks ORDER BY height DESC LIMIT 10;`
and confirm you're seeing the latest blocks being added to the database.

Typically an operator sets up PostgreSQL event ingestion as a precursor to the more dev-friendly
`pindexer`; read on to learn how to [configure pindexer](./pindexer.md).

[CometBFT schema]: https://github.com/cometbft/cometbft/blob/main/state/indexer/sink/psql/schema.sql
