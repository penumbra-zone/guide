import type {
  ValueView,
  ValueView_KnownAssetId,
} from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import type { CommitmentSource_Ics20Transfer } from '@penumbra-zone/protobuf/penumbra/core/component/sct/v1/sct_pb';
import { AddressView } from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import type {
  BalancesResponse,
  NotesResponse,
} from '@penumbra-zone/protobuf/penumbra/view/v1/view_pb';
import { AddressViewComponent } from '@penumbra-zone/ui/AddressViewComponent';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueViewComponent';
import { capitalize } from 'es-toolkit';
import { ChevronRightIcon } from 'lucide-react';
import type React from 'react';
import {
  useBalances,
  useConnect,
  useCurrentChainStatus,
  useEphemeralAddress,
  useNotes,
  useWalletManifests,
} from './hooks';

const Deposit: React.FC = () => {
  const { data } = useNotes();
  const { connected, onConnect, connectionLoading } = useConnect();
  const { data: wallets, isLoading } = useWalletManifests();

  const { data: status } = useCurrentChainStatus();
  const currentBlock = BigInt(status?.syncInfo?.latestBlockHeight ?? 0);
  const depositNotes = data?.filter(
    (note) => note?.noteRecord?.source?.source.case === 'ics20Transfer',
  );

  const { data: balances } = useBalances();
  const knownBalances = balances?.filter(
    (balance) => balance.balanceView?.valueView.case === 'knownAssetId',
  );

  const depositsWithNotes =
    (knownBalances
      ?.map((balance) => ({
        note: depositNotes?.find((note) =>
          note.noteRecord?.note?.value?.assetId?.equals(
            (balance.balanceView?.valueView?.value as ValueView_KnownAssetId)
              ?.metadata?.penumbraAssetId,
          ),
        ),
        balance,
      }))
      .filter(({ note }) => note !== undefined) as BalanceWithNote[]) ?? [];

  const depositedBalances = depositsWithNotes.filter(
    ({ note }) => currentBlock - (note.noteRecord?.heightCreated ?? 0n) < 50,
  );
  const { data: ibcInAddress } = useEphemeralAddress({
    index: 0,
  });

  return (
    <div className="py-3 flex flex-col gap-8">
      <div>
        Now it's time to shield your funds and transfer them into Penumbra.
        We've displayed one of your IBC Deposit addresses for you convenience
        below. Copy it using the button on the right.
      </div>

      {!isLoading &&
        wallets &&
        !connected &&
        Object.entries(wallets).map(([origin, manifest]) => (
          <button
            // type={'button'}
            key={origin}
            onClick={() => onConnect(origin)}
            disabled={connectionLoading}
            className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {connectionLoading
              ? 'Connecting...'
              : `Connect to ${manifest.name}`}
          </button>
        ))}

      {ibcInAddress?.address && connected && (
        <div className={'bg-gray-700 p-3'}>
          <AddressViewComponent
            addressView={
              new AddressView({
                addressView: {
                  case: 'decoded',
                  value: {
                    address: ibcInAddress.address,
                  },
                },
              })
            }
          />
        </div>
      )}

      <div
        className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
        role="alert"
      >
        <p className="font-bold">Info</p>
        <p>
          IBC Deposit addresses exist because source chains record the deposit
          address. They serve as an additional layer of anonymity to not link
          your deposit and actual addresses.
        </p>
      </div>

      <div>
        We will use&nbsp;
        <a
          href="https://go.skip.build/"
          className="font-medium underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Skip Protocol
        </a>
        &nbsp; to bridge funds into Penumbra. Go to the Skip app, and input your
        IBC Deposit address. Select your source chain and asset (we recommend
        USDC, but any common asset is fine) and select Penumbra and USDC as the
        destination chain. Then initiate the deposit and come back to this page.
      </div>

      <div
        className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
        role="alert"
      >
        <p className="font-bold">Info</p>
        <p>
          Penumbra supports paying fees in multiple tokens, including USDC. Prax
          will always choose the best token to pay fees with depending on your
          balances.
        </p>
      </div>

      {depositedBalances.length === 0 && (
        <div className="w-full bg-white text-black shadow-md rounded-lg p-4">
          <div className="flex flex-row gap-3 items-center">
            <div>Waiting for a deposit to occur</div>
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          </div>
        </div>
      )}

      {depositedBalances.length > 0 &&
        depositedBalances.map(({ balance, note }) => (
          <div
            key={note.toJsonString()}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
            role="alert"
          >
            <p className="font-bold">
              Deposit completed successfully! Received
            </p>
            <div className="flex flex-col gap-3 px-3">
              <ValueViewComponent
                key={balance.toJsonString()}
                valueView={balance.balanceView as ValueView}
              />
            </div>
          </div>
        ))}

      {depositsWithNotes.length > 0 && (
        <div className="border-0">
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>Show old deposits</span>
              <span className="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  shapeRendering="geometricPrecision"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </summary>
            <div className="śmt-3 group-open:animate-fadeIn">
              {depositsWithNotes.length > 0 &&
                depositsWithNotes?.map((balanceWithNote) => (
                  <DepositRow
                    key={JSON.stringify(balanceWithNote)}
                    balanceWithNote={balanceWithNote}
                  />
                ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

type BalanceWithNote = {
  note: NotesResponse;
  balance: BalancesResponse;
};

function DepositRow({
  balanceWithNote: { balance, note },
}: {
  balanceWithNote: BalanceWithNote;
}) {
  const source = note.noteRecord?.source?.source
    ?.value as CommitmentSource_Ics20Transfer;
  const chainId = source.sender.replace(/^(\D+)(\d).*$/, '$1-$2');

  const chainName = capitalize(source.sender.replace(/^(\D+).*$/, '$1'));
  return (
    <div
      className="mt-3 flex gap-3 items-center bg-gray-700 text-white p-3"
      key={balance.toJsonString()}
    >
      Deposited
      <ValueViewComponent
        key={balance.toJsonString()}
        valueView={balance.balanceView as ValueView}
      />
      from {chainName}
      <ChevronRightIcon className="h-4 w-4" />
      <a
        className="underline"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://ibc.range.org/ibc/status?id=${chainIdToExplorerChainName(chainId)}/${source.channelId}/${source.packetSeq}`}
      >
        Inspect deposit
      </a>
    </div>
  );
}

function chainIdToExplorerChainName(chainId: string) {
  switch (chainId) {
    case 'osmo-1':
      return 'osmosis-1';
    default:
      return chainId;
  }
}

export default Deposit;
