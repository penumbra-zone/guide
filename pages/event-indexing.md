# Indexing ABCI events

The [`pd`](./node/pd) software emits ABCI events while processing blocks.
By default, these blocks are stored in CometBFT's key-value database locally, but node operators
can opt-in to writing the events to an external PostgreSQL database.
Furthermore, the [`pindexer`](./event-indexing/pindexer.md) software can be used to take these raw ABCI events,
and produce Penumbra-specific "app views" with rich formatted data.

## Motivation for event indexer

Any application that requires detailed information about Penumbra chain state
needs access to an event database, in order to display information to a user.
This is because Penumbra is private by default, so the majority of chain state
is encrypted, and therefore not legible to naive external tooling.
Examples of applications that use a `pindexer` backend database include:

  * [Veil](https://dex.penumbra.zone), a DEX frontend for trading
  * [Noctis](https://explorer.penumbra.zone), a block explorer for viewing transaction details
  * [Insights](https://insights.penumbra.zone), a dashboard of IBC flows

In order to make sense of chain state, operators must configure a Penumbra node
to [record events in an external database](./event-indexing/configure.md).
