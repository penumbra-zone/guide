# Running relayers

In order for Penumbra to interact with the broader [Cosmos] ecosystem, the community must
run [IBC] relaying software, to transmit packets between chains. Relaying is by design
permissionless. Some examples of relayer software are:

  * [hermes], maintained by [Informal Systems][Informal]
  * the Go [relayer], maintained by [Strangelove]

This guide provides a tutorial for setting up Hermes for use with Penumbra.

## Prerequisites

In order to run a Hermes instance for Penumbra, you'll need to prepare the following:

* The chain ID of the Penumbra network
* The chain ID of the counterparty network
* A funded Penumbra wallet, to pay fees on Penumbra (the host chain)
* A funded counterparty wallet, to pay fees on the counterparty chain
* Two (2) API endpoints for [Penumbra node](./node/pd.md), `pd` gRPC and CometBFT JSON-RPC
* Two (2) API endpoints for counterparty node, app gRPC and CometBFT JSON-RPC
* A compatible version of `hermes`, built as described above.

Crucially, the wallets should be unique, dedicated solely to this instance of Hermes,
and not used by any other clients. When you have the above information, you're ready to proceed.

## Configuring Hermes

For the most part, you can follow the [official Hermes docs on configuration](https://hermes.informal.systems/documentation/configuration/configure-hermes.html).
There are two Penumbra-specific exceptions: 1) key support; and 2) on-disk view database support.

### Penumbra spend keys
The Penumbra integration does not support the [`hermes keys add`](https://hermes.informal.systems/documentation/commands/keys/index.html)
flow for Penumbra chains. Instead, you should add the Penumbra wallet spendkey directly to the generated `config.toml` file, like so:

```toml
# Replace "XXXXXXXX" with the spend key for the Penumbra wallet.
kms_config = { spend_key = "XXXXXXXX" }
```

To find the wallet's spend key, you can view `~/.local/share/pcli/config.toml`. 

### Penumbra view database
Then, to configure on-disk persistence of the Penumbra view database, add this line to your config:

```toml
# Update the path below as appropriate for your system,
# and make sure to create the directory before starting Hermes.
view_service_storage_dir = "/home/hermes/.local/share/pcli-hermes-1"
```

Consider naming the directory `pcli-hermes-<counterparty>`, where counterparty is the name of the counterparty chain.
If you do not set this option, `hermes` will still work, but it will need to resync with the chain on startup,
which can take a long time, depending on how many blocks exist.

## Path setup

Again, see the [official Hermes docs on path setup](https://hermes.informal.systems/documentation/commands/path-setup/index.html).
In order to validate that the channels are visible on host chain, use `pcli query ibc channels` and confirm they match
what was output from the `hermes create` commands.

## Best practices

Consult the official Hermes docs for [running in production](https://hermes.informal.systems/tutorials/production/index.html),
as well as the [telemetry guide](https://hermes.informal.systems/documentation/telemetry/index.html).
You'll need to communicate the channels that you maintain to the community. How you do so is up to you.

## Performing upgrades

When a [Penumbra chain upgrade](./node/pd/chain-upgrade.mdx) is performed, relayer operators must [configure an archive node](#running-an-archive-node)
on the pre-upgrade version of `pd`, and use that archive node, as well as an upgraded Penumbra node, to bridge the upgrade boundary via the relayer.
See the [genesis-restart](https://hermes.informal.systems/advanced/troubleshooting/genesis-restart.html?highlight=genesis%20restart#updating-a-client-after-a-genesis-restart-without-ibc-upgrade-proposal) functionality in the Hermes docs.
In order to perform this step, you'll need the following information:

* The chain id of counterparty chain, for `--host-chain`.
* The halt height of penumbra chain for `--restart-height`, visible in the governance proposal for the chain upgrade.
* The IBC client id for the relayer on the counterparty chain, for `--client`.
* The [archive node](#running-an-archive-node) URL for `--archive-address`.

1. Set up an archive node on the pre-upgrade chain, with the pre-upgrade version of pd, [as described here](#running-an-archive-node).
2. Stop the `hermes` service, so that the relayer is not running.
3. Run a one-off invocation to bridge the upgrade boundary, pointing at the archive node: `hermes --config /etc/hermes/config-penumbra-noble.toml update client --archive-address http://localhost:26657/ --restart-height 222200 --host-chain grand-1 --client 07-tendermint-257` (as described here https://hermes.informal.systems/advanced/troubleshooting/genesis-restart.html)
4. Then restart the hermes service.

After that, the relayer instance should be running properly on the post-upgrade chain, and the archive node can be shut down.

## Running an archive node

If you are joining the network after a chain upgrade, the events behind the upgrade boundary
will not be available to your node for syncing while catching up to current height. To emit
historical events, you will need access to archives of CometBFT state created before (each)
planned upgrade. The process then becomes:

1. Restore node state from backup.
2. Ensure you're using the appropriate `pd` and `cometbft` versions for the associated state.
3. Run `pd migrate --ready-to-start` to permit `pd` to start up.
4. Move aside the the archive node's CometBFT addressbook, if present: `mv ~/.penumbra/network_data/node0/cometbft/config/addrbook.json{,.bak}`
5. Run CometBFT with extra options: `--p2p.pex=false --p2p.seeds='' --p2p.persistent_peers='' --p2p.laddr="tcp://127.0.0.1:26656" --moniker archive-node-1`
6. Run `pd` and `cometbft` as normal, taking care to use the appropriate versions.

The node can now be used as an `--archive-address` for performing a [genesis restart via Hermes](#performing-upgrades).
If you need additional historical events, consult the [reindexer docs](./event-indexing/reindexer.md)
Then [configure another node with indexing support](./event-indexing/configure.md), as described above, and join the second
node to the archive node. As it streams blocks, the ABCI events will be recorded in the database.

[Cosmos]: https://cosmos.network
[IBC]: https://ibc.cosmos.network
[hermes]: https://hermes.informal.systems
[relayer]: https://github.com/cosmos/relayer
[Informal]: https://informal.systems
[Strangelove]: https://strange.love
