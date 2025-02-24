# Privacy Features

This document describes the privacy features of the Penumbra protocol for typical user actions.

## Transfers within Penumbra

Transfers within Penumbra's shielded pool do not reveal:
* the asset type
* the amount
* the sender or recipient identity

Transfers are also unlinkable to each other.

## Submitting swap intents

Initiating a swap does not reveal:
* the identity of the swapper
* the pre-paid claim fee

A swap does reveal:
* the input assets and amounts in the swap
* the output assets and amounts in the swap

## Claiming swap outputs

Claiming a swap does not reveal:
* the amounts minted of each asset type in the trading pair
* the identity of the claimant

An observer of the chain will see that an anonymous account minted shielded outputs of a swap in a specific trading pair, but those outputs can't be linked to the claimant.

## Providing liquidity to the DEX

Market makers that open liquidity positions reveal:
* the asset types (trading pair)
* the amount of liquidity provided
* the bounds in which the liquidity is concentrated

The liquidity positions are not linked to the identity of the market maker. If a market maker opens multiple positions they wish to be unlinkable, they can do so by opening multiple positions across different transactions.

## Delegator Voting

A delegator vote does not reveal:
* The address of the voter, so essentially the delegator vote is anonymous

A delegator vote does reveal:
* the voting power (the amount and asset type of the staked note that's used for voting)
* the vote itself
* the identity of the validator (equivalent to the asset type)
* the proposal being voted on

## Staking

Delegating does not reveal:
* The address of the delegator

Delegating does reveal:
* The validator being delegated to
* The delegation amount

## IBC Transfers

Inbound IBC transfers reveal:
* The source chain of the funds
* The amount and denomination
* The deposit address on the Penumbra chain

The boundary between Penumbra's private shielded pool and the public transparent ecosystem is the boundary between the Penumbra zone and the rest of the Cosmos ecosystem. IBC transfers into Penumbra effectively disappear into the shielded pool via the IBC deposit address. Since Penumbra shielded addresses are not linkable, the IBC deposit address is not linked to any other address in Penumbra. Clients should generate a new IBC deposit address for each IBC transfer to a Penumbra shielded address to prevent linking multiple IBC transfers.

Outbound IBC withdrawals reveal:
* The amount and denomination of the withdrawal
* The address on the destination chain that the withdrawal is sent to
* The sender/return address on the Penumbra chain (in case the funds need to be returned to the user)

The return address is typically configured to be a one-time only Penumbra shielded address. Alternatively, Penumbra transparent addresses can be used for the return address for maximum compatibility with Cosmos chains. However, multiple IBC withdrawals that use a Penumbra transparent return address can be linked due to there being a single transparent address per Penumbra wallet. Users can avoid this privacy leak by using a new wallet for each IBC transfer to a Penumbra transparent address.
