# Indexing ABCI events

The [`pd`](./node/pd) software emits [ABCI events](https://docs.cosmos.network/v0.45/core/events.html) while processing blocks.
By default, these blocks are stored in CometBFT's key-value database locally, but node operators
can opt-in to writing the events to an external PostgreSQL database.
Furthermore, the [`pindexer`](./event-indexing/pindexer.md) software can be used to take these raw ABCI events,
and produce Penumbra-specific "app views" with rich formatted data.

## Motivation for maintaining an event database

Any application that requires detailed information about Penumbra chain state
needs access to an event database, in order to display information to a user.
Penumbra nodes are designed to record only information that is relevant to processing new blocks.
Therefore Penumbra uses ABCI events as a means for external software to track historical happenings on the chain, and maintain heavier indices of non-consensus-critical state.

Examples of applications that use a `pindexer` backend database include:

  * [Veil](https://dex.penumbra.zone), a DEX frontend for trading
  * [Noctis](https://explorer.penumbra.zone), a block explorer for viewing transaction details
  * [Insights](https://insights.penumbra.zone), a dashboard of IBC flows

In order to make sense of chain state, operators must configure a Penumbra node
to [record events in an external database](./event-indexing/configure.md).
Most likely, they will then also want to configure a [pindexer database](./event-indexing/pindexer.md), as well.
