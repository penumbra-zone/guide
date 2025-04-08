# Indexing ABCI events

The `pd` software emits ABCI events while processing blocks. By default,
these blocks are stored in CometBFT's key-value database locally, but node operators
can opt-in to writing the events to an external PostgreSQL database.
Furthermore, the [`pindexer`](#using-pindexer) software can be used to take these raw ABCI events,
and produce penumbra-specific "app views" with rich formatted data.

## Configuring a Penumbra node to write events to postgres

1. Create a Postgres database, username, and credentials.
2. Apply the [CometBFT schema] to the database: `psql -d $DATABASE_NAME -f <path/to/schema.sql>`
3. Edit the CometBFT config file, by default located at `~/.penumbra/network_data/node0/cometbft/config/config.toml`,
   specifically its `[tx_index]`, and set:
   1. `indexer = "psql"`
   2. `psql-conn = "<DATABASE_URL>"`
4. Run `pd` and `cometbft` as normal.

The format for `DATABASE_URL` is specified in the [Postgres docs](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING-URIS).
After the node is running, check the logs for errors. Query the database with `SELECT height FROM blocks ORDER BY height DESC LIMIT 10;` and confirm
you're seeing the latest blocks being added to the database.

## Using Pindexer

`pindexer` reads from a Postgres ABCI event database, as described in the section above,
and produces a derived database with rich tables for Penumbra-specific views.
This is useful because the raw events database isn't easily or efficiently queryable
for Penumbra-specific use cases, such as seeing the current status of the DEX,
or the total amount of fees paid so far on the life of the chain.

To run `pindexer`, you'll need to have configured the Penumbra node to index events into Postgres. Then:

1. Create a Postgres database for the output of `pindexer`, say `$PINDEXER_DB`.
2. Run `pindexer --chain-id <CHAIN_ID> --genesis-json <ORIGINAL_GENESIS_FILE> --src-database-url postgresql://localhost:5432/$DATABASE_NAME --dst-database-url postgresql://localhost:5432/$PINDEXER_DB`

This assumes that Postgres is running locally on port 5432; for another setup the URL should change.

The `<ORIGINAL_GENESIS_FILE>` must be the `genesis.json` file for the chain, **before any upgrades.**
Note, in particular, that after an upgrade, there will be a new genesis file containing only a checkpoint.
`pindexer` specifically needs the original genesis file, because it needs to read information
about the start of the chain, such as initial allocations, to track changes over time accurately.

### Example: Total Supply Indexing

For example, after running `pindexer`, here's a query to get the total amount of the native
staking token up to the current height:

```sql
SELECT (staked_um + unstaked_um + auction + dex)::NUMERIC / 10^6 as total
FROM (
  SELECT SUM(um) as staked_um
  FROM (
    SELECT * 
    FROM supply_validators
  ) validators
  LEFT JOIN LATERAL (
    SELECT um  
    FROM supply_total_staked
    WHERE validator_id = id 
    ORDER BY height DESC 
    LIMIT 1
  ) ON TRUE
) staked
LEFT JOIN LATERAL (
  SELECT um as unstaked_um, auction, dex 
  FROM supply_total_unstaked
  ORDER BY height DESC
  LIMIT 1
) on TRUE
```

## Running an archive node

If you are joining the network after a chain upgrade, the events behind the upgrade boundary
will not be available to your node for syncing while catching up to current height. To emit
historical events, you will need access to archives of CometBFT state created before (each)
planned upgrade. The process then becomes:

1. Restore node state from backup.
2. Ensure you're using the appropriate `pd` and `cometbft` versions for the associated state.
3. Run `pd migrate --ready-to-start` to permit `pd` to start up.
4. Move aside the the archive node's CometBFT addressbook, if present: `mv ~/.penumbra/network_data/node0/cometbft/config/addrbook.json{,.bak}`.
5. Run CometBFT with extra options: `--p2p.pex=false --p2p.seeds='' --p2p.persistent_peers='' --p2p.laddr="tcp://127.0.0.1:26656" --moniker archive-node-1`
6. Run `pd` and `cometbft` as normal, taking care to use the appropriate versions.

Then configure another node with indexing support, as described above, and join the second
node to the archive node. As it streams blocks, the ABCI events will be recorded in the database.

[CometBFT schema]: https://github.com/cometbft/cometbft/blob/main/state/indexer/sink/psql/schema.sql
