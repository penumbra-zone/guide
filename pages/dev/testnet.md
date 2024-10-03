# Testnet

There's a long-running testnet chain available, intended for developers
to test code and practice integration their software with the Penumbra stack.

## Services available

The following public services are available:

* https://testnet.plinfra.net # primary `pd` gRPC endpoint, running most recent stable tag
* https://testnet-preview.plinfra.net # 
To generate a devnet genesis and run a Penumbra fullnode locally, run:

## Joining the testnet

You can join the public testnet like so:


```shell
# clean up any pre-existing network state
cargo run --release --bin pd -- network unsafe-reset-all
# generate network configs for the testnet chain
cargo run --release --bin pd -- network join http://testnet.plinfra.net:26657
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
<!--
TODO:
There's no instance of Galileo running yet, but there could be.
-->

To obtain funds for your testnet wallet, first gather the address:

```shell
cargo run --release --bin pcli -- --home ~/.local/share/pcli-testnet view address
```

Then visit the `#testnet-faucet` channel in the project Discord, and paste your address.
A bot will send a small amount of funds to your address, which should be visible within a few minutes, via:

```shell
cargo run --release --bin pcli -- --home ~/.local/share/pcli-testnet view balance
```
