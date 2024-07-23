Penumbra's web tooling is designed to support a decentralized ecosystem of
frontends.  This allows different frontend codebases to focus on different user
profiles and ensures that no single frontend deployment or codebase has control
over users' access to the protocol.

Penumbra wallets like [Prax] sync, scan, decrypt, and locally index user data. When users connect to a frontend, the wallet acts as a "personal RPC", granting that frontend access to the user's private data.

This chapter has information about deploying a Penumbra frontend, for users who do not wish to rely on existing third-party frontends:

- [**Minifront**](./frontend/minifront.md): the minimal, embeddable static-site
  frontend that runs entirely on the end-user device. A (possibly outdated) copy of Minifront is embedded in every single Penumbra fullnode and served on the RPC endpoint, but it can also be hosted standalone.

[Prax]: https://chromewebstore.google.com/detail/prax-wallet/lkpmkhpnhknhmibgnmmhdhgdilepfghe