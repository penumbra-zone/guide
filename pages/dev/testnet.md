# Testnet

There's a long-running testnet chain available, intended for developers
to test code and practice integrating their software with the Penumbra stack.

## Services available

The following public services are available:

| URL | Service |
| --- | --- |
| https://testnet.plinfra.net | primary `pd` gRPC endpoint, running most recently released stable tag from the [protocol repo] |
| https://testnet-preview.plinfra.net | secondary `pd` gRPC endpoint, running the most recent commit on the `main` branch in the [protocol repo] |
| https://dex-explorer.testnet.plinfra.net | a [DEX explorer](https://github.com/penumbra-zone/dex-explorer) instance, showing testnet market activity |
| https://cuiloa.testnet.plinfra.net | a block explorer, based on [cuiloa](https://github.com/penumbra-zone/cuiloa) |

## Joining the testnet

You can run a node on the public testnet like so:

```shell
# clean up any pre-existing network state
cargo run --release --bin pd -- network unsafe-reset-all
# generate network configs for the testnet chain
cargo run --release --bin pd -- network join http://testnet.plinfra.net:26657
```

That `network join` command will initialize node state directories locally.
Then fetch the most recent snapshot to backfill blocks from before the most
recent testnet chain upgrade:

```
curl -O https://artifacts.plinfra.net/penumbra-testnet-phobos-2/penumbra-node-archive-latest.tar.gz
tar -xzf penumbra-node-archive-latest.tar.gz -C ~/.penumbra/network_data/node0/
```

After that, if you've set up the [Penumbra developer environment](./dev-env.md),
you can run a fullnode locally via:

```shell
just dev
```

For a more persistent setup, consult the [tutorial on running a node](../node/pd/running-node.md).

## Running `pcli`

To interact with the chain, configure a wallet pointing at the testnet node:

```shell
cargo run --release --bin pcli -- --home ~/.local/share/pcli-testnet view reset
cargo run --release --bin pcli -- init --grpc-url https://testnet.plinfra.net soft-kms generate
# or, to reuse an existing seed phrase:
cargo run --release --bin pcli -- init --grpc-url https://testnet.plinfra.net soft-kms import-phrase
```

and then pass the `--home` flag to any commands you run to point `pcli` at your local node, e.g.,

```shell
cargo run --release --bin pcli -- --home ~/.local/share/pcli-testnet view balance
```

You'll be able to run queries like `pcli query validator list`, but by default you won't be able
to create transactions, as an empty wallet will lack funds to pay gas fees.


## Using the testnet faucet

There's currently no faucet running for the Penumbra testnet chain, but check back soon for details.

<!--
TODO:
There's no instance of Galileo running yet, but there could be.

To obtain funds for your testnet wallet, first gather the address:

```shell
cargo run --release --bin pcli -- --home ~/.local/share/pcli-testnet view address
```

Then visit the `#testnet-faucet` channel in the project Discord, and paste your address.
A bot will send a small amount of funds to your address, which should be visible within a few minutes, via:

```shell
cargo run --release --bin pcli -- --home ~/.local/share/pcli-testnet view balance
```
-->

[protocol repo]: https://github.com/penumbra-zone/penumbra
