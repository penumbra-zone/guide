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
          Use the
          <a
            className="underline px-1"
            target={'_blank'}
            href="https://app.penumbra.zone/#/swap?from=USDC&to=UM"
            rel="noreferrer"
          >
            Swap page
          </a>
          to try swapping the USDC that you bridged in earlier to UM, the
          Penumbra staking token – or any other swap you prefer.
        </p>
        <p>
          Set the 'Speed' slider to the leftmost setting, <i>Instant Price</i>, to
          perform a swap at the current market price. Choosing a slower speed will
          perform an auction, offering your swap over time at gradually diminishing
          prices until all your input tokens are sold.
        </p>

        <SwapMonitor />

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
        <div className="w-full p-4 bg-gray-700 text-white shadow rounded">
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
