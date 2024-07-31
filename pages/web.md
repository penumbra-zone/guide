# Using Penumbra on the web

Penumbra's web tooling is designed to support a decentralized ecosystem of
frontends.  This allows different frontends to focus on different user
profiles and ensures that no single frontend deployment or codebase has control
over users' access to the protocol.

Penumbra wallets like [Prax] sync, scan, decrypt, and locally index user data.
When users connect to a frontend, the wallet acts as a "personal RPC", granting
that frontend access to the user's private data.  Prax is the first browser
wallet for Penumbra, and is open-source software that runs entirely on your
computer.

This chapter has guides on using Prax together with a Penumbra frontend to
perform various actions:

- [Prax Wallet](./web/prax.md) describes how to use Prax to generate a wallet.
- [Viewing Balances](./web/balances.md) describes how to view balances.
- [Shielding Funds](./web/ibc-transfers.md) describes how to shield transactions via IBC transfers.
- [Sending Funds](./web/send.md) describes how to send funds.
- [Swapping Tokens](./web/swap.md) describes how to perform token swaps.
- [Staking](./web/stake.md) describes how to stake tokens.
- [Governance](./web/vote.md) describes how to participate in governance.

[Prax]: https://chromewebstore.google.com/detail/prax-wallet/lkpmkhpnhknhmibgnmmhdhgdilepfghe