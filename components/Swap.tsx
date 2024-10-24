import type {
  SwapView,
  SwapView_Visible,
} from '@penumbra-zone/protobuf/penumbra/core/component/dex/v1/dex_pb';
import type {
  ActionView,
  TransactionView,
} from '@penumbra-zone/protobuf/penumbra/core/transaction/v1/transaction_pb';
import { ActionViewComponent } from '@penumbra-zone/ui/components/tx/action-view';
import type React from 'react';
import {
  getMetadata,
  useFeeMetadata,
  useSetScanSinceBlock,
  useSwaps,
} from './hooks';
import { useQuestStore } from './store';

const Swap: React.FC = () => {
  useSetScanSinceBlock();
  return (
    <div className="py-12 flex flex-col gap-8">
      <div className="space-y-6">
        <p>
          Penumbra offers a built-in DEX that allows you to swap tokens
          privately and with the best trade execution.
        </p>
        <p>
          We recommend swapping the USDC that you bridged in earlier to UM, the
          Penumbra staking token, but you can choose to swap any pair you want.
          <a
            className="underline px-1"
            target={'_blank'}
            href="https://stake.with.starlingcyber.net/#/swap?from=USDC&to=UM"
            rel="noreferrer"
          >
            Click here
          </a>
          to go to the Minifront Swap page.
        </p>

        <SwapMonitor />

        <h2 className="text-2xl font-bold">Instant Swaps</h2>

        <p>
          The simplest type of swap available is an "instant swap". This can be
          accessed by setting the 'Speed' slider all the way to the left-hand
          setting ('Instant Price').
        </p>

        <p>
          Using the selectors on the right-hand side, choose the two tokens you
          wish to swap between:
        </p>

        <img
          className="w-max"
          src="/images/swap-tokens-1.png"
          alt="Token swap interface"
        />

        <p>
          The left-hand side specifies the source token, which you will swap for
          the right-hand side. The amount of the source token you wish to swap
          is specified in the input box below the 'Trade' label.
        </p>

        <p>
          Thanks to Penumbra's DEX design, you're guaranteed to get the best
          market execution price at the time you perform the swap.
        </p>

        <p>
          To see a preview of how the swap will execute, you can press the
          'Estimate' button. This will show you information including:
        </p>

        <ul className="list-disc pl-5 space-y-2">
          <li>The total amount of the desired token to be received</li>
          <li>
            The individual routes taken to perform the swap (the Penumbra DEX
            allows synthetic liquidity by swapping through other trading pairs!)
          </li>
          <li>The price impact of executing your swap</li>
        </ul>

        <div className="h-4" />

        <img
          className="w-max"
          src="/images/swap-instant-1.png"
          alt="Instant swap preview"
        />

        <p>
          If you're happy with the proposed swap, press the 'Swap' button and
          wait for the transaction to be built.
        </p>

        <p>
          Prax will prompt you to sign the transaction after it's built. Click
          'Approve' in the extension and your swap will be executed at market
          price.
        </p>

        <h2 className="text-2xl font-bold">Gradual Dutch Auctions</h2>

        <p>
          Penumbra's DEX also supports{' '}
          <span className="font-bold">Gradual Dutch Auctions</span> which allow
          you to perform price discovery based on market demand, by offering
          your swap over a period of time at diminishing prices until all tokens
          are sold.
        </p>

        <p>
          Using the 'Speed' slider mechanism, you can view how different time
          scales affect the number of auctions that will be created. By moving
          the slider to the right, the auction will take place over a greater
          amount of time, leading to tokens being sold at more price points.
        </p>

        <p>
          You must also specify the maximum and minimum prices you're willing to
          sell your tokens at. This way, you can ensure that the auction allows
          you to get the highest prices possible for your tokens, without
          selling them for less than you're comfortable with.
        </p>

        <div className="h-4" />

        <img
          className="w-max"
          src="/images/swap-gda-1.png"
          alt="Gradual Dutch Auction interface"
        />

        <p>
          Press 'Start auctions' and Prax will present to you the proposed
          transaction, which allows you to view all the individual Dutch
          Auctions:
        </p>

        <div className="h-4" />

        <img
          className="w-max"
          src="/images/swap-gda-2.png"
          alt="Dutch Auction preview"
        />

        <p>
          As with the <span className="font-bold">Instant Swap</span>, you can
          then press 'Approve' in Prax to submit the auction.
        </p>
      </div>
    </div>
  );
};

function SwapMonitor() {
  const { scanSinceBlockHeight } = useQuestStore();
  const { data: swaps } = useSwaps({
    from: scanSinceBlockHeight,
    to: 99999999,
  });
  const swapActions =
    swaps?.flatMap(
      (swapTx) =>
        swapTx.txInfo?.view?.bodyView?.actionViews
          ?.filter((action) => action.actionView?.case === 'swap')
          .map((action) => ({
            action,
            fee: swapTx?.txInfo?.view?.bodyView?.transactionParameters?.fee,
            txView: swapTx?.txInfo?.view,
          })) ?? [],
    ) ?? [];

  return (
    <div className="flex flex-col items-stretch gap-3">
      {swapActions?.length ? (
        swapActions.map((s) => (
          <AssetSwapWithFeeMetadataComponent
            key={s.txView!.toJsonString()}
            action={s.action!}
            txv={s.txView!}
          />
        ))
      ) : (
        <div className="w-full p-4 bg-white shadow rounded">
          <div className="flex flex-row gap-3">
            <span>Waiting for a swap to occur</span>
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          </div>
        </div>
      )}
    </div>
  );
}

function AssetSwapWithFeeMetadataComponent(props: {
  txv: TransactionView;
  action: ActionView;
}) {
  // biome-ignore lint: The link that's displayed when claimTx is defined doesn't work outside minifront
  delete (
    (props.action.actionView.value as SwapView).swapView
      .value as SwapView_Visible
  ).claimTx;
  const { feeValueView } = useFeeMetadata(props.txv, getMetadata);
  return (
    <ActionViewComponent
      av={props.action}
      key={props.action.toJsonString()}
      feeValueView={feeValueView}
    />
  );
}

export default Swap;
