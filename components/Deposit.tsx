import { client } from '@/components/penumbra';
import { ViewService } from '@penumbra-zone/protobuf';
import { ValueView } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import type { CommitmentSource_Ics20Transfer } from '@penumbra-zone/protobuf/penumbra/core/component/sct/v1/sct_pb';
import { AddressView } from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import type { NotesResponse } from '@penumbra-zone/protobuf/penumbra/view/v1/view_pb';
import { AddressViewComponent } from '@penumbra-zone/ui/AddressViewComponent';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueViewComponent';
import { useQuery } from '@tanstack/react-query';
import { capitalize } from 'es-toolkit';
import { ChevronRightIcon } from 'lucide-react';
import type React from 'react';
import {
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
  const depositNotes =
    data?.filter(
      (note) => note?.noteRecord?.source?.source.case === 'ics20Transfer',
    ) ?? [];

  const { data: notesWithMetadata } = useQuery({
    queryKey: ['notesWithMetadata', currentBlock.toString()],
    staleTime: 0,
    initialData: [],
    queryFn: async () => {
      return await Promise.all(
        depositNotes.map(async (note) => {
          const metadata = await client.service(ViewService).assetMetadataById({
            assetId: note.noteRecord?.note?.value?.assetId!,
          });

          return {
            metadata,
            note,
            valueView: new ValueView({
              valueView: {
                case: 'knownAssetId',
                value: {
                  metadata: metadata.denomMetadata!,
                  amount: note?.noteRecord?.note?.value?.amount!,
                },
              },
            }),
          };
        }),
      );
    },
  });

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

      {notesWithMetadata.length === 0 && (
        <div className="w-full bg-white text-black shadow-md rounded-lg p-4">
          <div className="flex flex-row gap-3 items-center">
            <div>Waiting for a deposit to occur</div>
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          </div>
        </div>
      )}

      {notesWithMetadata.length > 0 &&
        notesWithMetadata.map(({ valueView }) => (
          <div
            key={valueView.toJsonString()}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
            role="alert"
          >
            <p className="font-bold">
              Deposit completed successfully! Received
            </p>
            <div className="flex text-black flex-col gap-3 px-3">
              <ValueViewComponent
                key={valueView.toJsonString()}
                valueView={valueView}
              />
            </div>
          </div>
        ))}

      {notesWithMetadata.length > 0 && (
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
            <div className="mt-3 group-open:animate-fadeIn">
              {notesWithMetadata.length > 0 &&
                notesWithMetadata?.map(({ note, valueView }) => (
                  <DepositRow
                    key={note.toJsonString()}
                    note={note}
                    valueView={valueView}
                  />
                ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

function DepositRow({
  note,
  valueView,
}: {
  note: NotesResponse;
  valueView: ValueView;
}) {
  const source = note.noteRecord?.source?.source
    ?.value as CommitmentSource_Ics20Transfer;
  const chainId = source.sender.replace(/^(\D+)(\d).*$/, '$1-$2');

  const chainName = capitalize(source.sender.replace(/^(\D+).*$/, '$1'));
  return (
    <div
      className="mt-3 flex gap-3 items-center bg-gray-700 text-white p-3"
      key={note.toJsonString()}
    >
      Deposited
      <ValueViewComponent key={note.toJsonString()} valueView={valueView} />
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
