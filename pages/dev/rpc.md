# Working with gRPC for Penumbra

The Penumbra [`pd`](../node/pd.md) application exposes a [gRPC] service for integration
with other tools, such as [`pcli`](../pcli.md) or the [web extension](../web.md).
A solid understanding of how the gRPC methods work is helpful when
building software that interoperates with Penumbra.

## Using gRPC UI

You can use the [gRPC UI] interface to perform queries against a node's gRPC endpoint.
It's also possible to run gRPC UI locally on your machine, to connect
to a local devnet.

## Using Buf Studio

The [Buf Studio](https://studio.buf.build) webapp provides a polished GUI
and [comprehensive documentation](https://buf.build/docs/bsr/studio). However,
a significant limitation for use with Penumbra is that it lacks
support for streaming requests, such as [`penumbra.core.component.compact_block.v1.CompactBlockRangeRequest`](https://buf.build/penumbra-zone/penumbra/docs/main:penumbra.core.component.compact_block.v1#penumbra.core.component.compact_block.v1.CompactBlockRangeRequest).

Set the request type to **gRPC-web** at the bottom of the screen.
You can then select a **Method** and explore the associated services.
Click **Send** to submit the request and view response data in the right-hand pane.

## Interacting with local devnets

Regardless of which interface you choose, you can connect to an instance of `pd` running
on your machine, which can be useful while adding new features.
First, make sure you've [joined a network](../node/pd/join-network.md)
by setting up a node on your local machine. Once it's running, you can connect directly
to the pd port via `http://localhost:8080`.

Alternatively, you can use `pclientd`. First, make sure you've [configured pclientd locally](../node/pclientd/configure.md)
with your full viewing key. Once it's running, you can connect directly
to the pclient port via `http://localhost:8081`.

[gRPC]: https://grpc.io/docs/what-is-grpc/introduction/
[gRPC UI]: https://github.com/fullstorydev/grpcui
