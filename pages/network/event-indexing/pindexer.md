# Using Pindexer

`pindexer` reads from a Postgres ABCI event database, as described in the section above,
and produces a derived database with rich tables for Penumbra-specific views.
This is useful because the raw events database isn't easily or efficiently queryable
for Penumbra-specific use cases, such as seeing the current status of the DEX,
or the total amount of fees paid so far on the life of the chain.

To run `pindexer`, you'll need to have [configured the Penumbra node to index events into Postgres](./configure.md). Then:

1. Create a Postgres database for the output of `pindexer`, say `$PINDEXER_DB`.
2. Run `pindexer --genesis-json <ORIGINAL_GENESIS_FILE> --src-database-url postgresql://localhost:5432/$DATABASE_NAME --dst-database-url postgresql://localhost:5432/$PINDEXER_DB`

This assumes that Postgres is running locally on port 5432; for another setup the URL should change.
The `pindexer` user must have write access to its own database, as well as the ability to create schemas.
It needs only read access to the CometBFT database.

The `<ORIGINAL_GENESIS_FILE>` must be the `genesis.json` file for the chain, **before any coordinated upgrades.**
Note that after an upgrade, there will be a new genesis file containing only a checkpoint.
`pindexer` specifically needs the original genesis file, because it needs to read information
about the start of the chain, such as initial allocations, to track changes over time accurately.

You can download the original genesis files for popular chains here:

* [`penumbra-1` mainnet](https://artifacts.plinfra.net/penumbra-1/genesis-0.json)
* [`penumbra-testnet-phobos-3` testnet](https://artifacts.plinfra.net/penumbra-testnet-phobos-3/genesis-0.json)

Given that `pindexer` requires knowledge of all historical blocks in order to work, you'll need
to backfill historical events if your node joined the network after genesis. For that, see the [reindexer](./reindexer.md) docs.
