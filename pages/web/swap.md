# Swapping Tokens

Performing shielded swaps in the Penumbra web frontend is easy and there are several different options depending
on your time preference.

## Instant Swaps

The simplest type of swap available is an "instant swap". This can be accessed by setting the `Speed` slider
all the way to the left-hand setting (`Instant Price`).

Using the selectors on the right-hand side, choose the two tokens you wish to swap between:

<picture>
  <source
    srcSet="/images/swap-tokens-1.png"
    media="(prefers-color-scheme: dark)"
  />
  <img src="/images/swap-tokens-1.png" />
</picture>

The left-hand side specifies the source token, which you will swap for the right-hand side. The amount of the source token you wish to swap is specified in the input box below the `Trade` label.

Thanks to Penumbra's DEX design, you're guaranteed to get the best market execution price at the time you
perform the swap.

To see a preview of how the swap will execute, you can press the `Estimate` button. This will show you information
including:

- The total amount of the desired token to be received
- The individual routes taken to perform the swap (the Penumbra DEX allows synthetic liquidity by swapping through other trading pairs!)
- The price impact of executing your swap

<br/>

<picture>
  <source
    srcSet="/images/swap-instant-1.png"
    media="(prefers-color-scheme: dark)"
  />
  <img src="/images/swap-instant-1.png" />
</picture>

If you're happy with the proposed swap, press the `Swap` button and wait for the transaction to be built.

Prax will prompt you to sign the transaction after it's built. Click `Approve` in the extension and your
swap will be executed at market price.

<!--
should we document the swap claim transaction here as well?
-->

## Gradual Dutch Auctions

Penumbra's DEX also supports **Gradual Dutch Auctions** which allow you to perform price discovery based
on market demand, by offering your swap over a period of time at diminishing prices until all tokens
are sold.

Using the `Speed` slider mechanism, you can view how different time scales affect the number of auctions that will be created. By moving the slider to the right, the auction will take place over a greater amount of time, leading to tokens being sold at more price points.

You must also specify the maximum and minimum prices you're willing to sell your tokens at. This way, you can ensure that the auction allows you to get the highest prices possible for your tokens, without selling them for less than you're comfortable with.

<br/>

<picture>
  <source
    srcSet="/images/swap-gda-1.png"
    media="(prefers-color-scheme: dark)"
  />
  <img src="/images/swap-gda-1.png" />
</picture>

Press `Start auctions` and Prax will present to you the proposed transaction, which allows you to view all the individual Dutch Auctions:

<br/>

<picture>
  <source
    srcSet="/images/swap-gda-2.png"
    media="(prefers-color-scheme: dark)"
  />
  <img src="/images/swap-gda-2.png" />
</picture>

As with the **Instant Swap**, you can then press `Approve` in Prax to submit the auction.
