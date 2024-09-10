# Migrating wallets

In order to transfer all assets in your wallet to a new wallet,
first [generate a new wallet](wallet.md). After doing so, inspect the generated `config.toml`
file for the `full_viewing_key` (FVK) field. You'll need this value to designate
the new wallet, to which funds will be transferred.

Then, run the migrate balance command from the first wallet, the one you want to empty of funds:

```bash
pcli migrate balance
```

That command will prompt for the FVK of the destination wallet.
Paste in the FVK, and hit enter to build and submit the transaction.
After sending, the source wallet should be completely empty, and the destination wallet
should have all assets, minus any gas fees that were paid for the transaction.
Assets will be preserved in their numbered accounts across source and destination wallets.
