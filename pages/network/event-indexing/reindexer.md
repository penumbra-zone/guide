# Acquiring historical event data

When running an [ABCI events database for Penumbra](../event-indexing.md), node operators face a bootstrapping problem:
applications will require access to _all_ historical events, but a given node can only emit
events for blocks greater than _`h`_, where _`h`_ is the height at which the node joined the network.

The [`penumbra-reindexer`](https://github.com/penumbra-zone/reindexer) tool exists to support node operators
who require historical event data. Please see the README in that repository for details on using the tool.

## Finding node state archives

In order to use the `penumbra-reindexer`, node operators must obtain historical archives for node state,
so that the reindexer can replay those blocks and emit the relevant ABCI events. Node operators are
invited to rifle through archive available via:

* https://www.polkachu.com/tendermint_snapshots/penumbra
* https://artifacts.plinfra.net/penumbra-1/

If your team maintains Penumbra archives, please submit a pull request to add it to [this guide](https://github.com/penumbra-zone/guide).

<!--
TODO: Let's add explicit mention about maintaining the sqlite3 archives
to this page, to aid operators in understanding the day-to-day mechanics
of administering a Penumbra events pipeline.
-->
