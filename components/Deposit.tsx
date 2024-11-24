import React, { useState } from 'react';
import { Widget } from '@skip-go/widget';
import { client } from '@/components/penumbra';
import { useQuestStore } from '@/components/store';
import { ViewService } from '@penumbra-zone/protobuf';
import { ValueView } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import type { CommitmentSource_Ics20Transfer } from '@penumbra-zone/protobuf/penumbra/core/component/sct/v1/sct_pb';
import type { NotesResponse } from '@penumbra-zone/protobuf/penumbra/view/v1/view_pb';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueViewComponent';
import { useQuery } from '@tanstack/react-query';
import { capitalize } from 'es-toolkit';
import { ChevronRightIcon } from 'lucide-react';
import {
  useConnect,
  useCurrentChainStatus,
  useNotes,
  useSetScanSinceBlock,
  useWalletManifests,
} from './hooks';
import {
  getAmountFromRecord,
  getAssetIdFromRecord,
} from '@penumbra-zone/getters/spendable-note-record';

const Deposit: React.FC = () => {
  useSetScanSinceBlock();
  const [showOld, setShowOld] = useState(false);

  const { data } = useNotes();
  const { connected, onConnect, connectionLoading } = useConnect();
  const { data: wallets, isLoading } = useWalletManifests();

  const { data: status } = useCurrentChainStatus();
  const currentBlock = BigInt(status?.syncInfo?.latestBlockHeight ?? 0);
  const depositNotes =
    data?.filter(
      (note) => note?.noteRecord?.source?.source.case === 'ics20Transfer',
    ) ?? [];

  const { scanSinceBlockHeight } = useQuestStore();
  const { data: notesWithMetadata } = useQuery({
    queryKey: [
      'notesWithMetadata',
      currentBlock.toString(),
      showOld,
      depositNotes,
      connected,
    ],
    staleTime: 0,
    initialData: [],
    queryFn: async () => {
      const deposits = await Promise.all(
        depositNotes.map(async (note) => {
          const metadata = await client.service(ViewService).assetMetadataById({
            assetId: getAssetIdFromRecord(note.noteRecord),
          });

          return {
            metadata,
            note,
            valueView: new ValueView({
              valueView: {
                case: 'knownAssetId',
                value: {
                  metadata: metadata.denomMetadata!,
                  amount: getAmountFromRecord(note.noteRecord),
                },
              },
            }),
          };
        }),
      );
      return deposits.filter(
        (d) =>
          Number(d.note!.noteRecord!.heightCreated) >
          (showOld ? 0 : scanSinceBlockHeight),
      );
    },
  });

  const defaultRoute = {
    srcChainId: 'noble-1',
    srcAssetDenom: 'uusdc',
    destChainId: 'penumbra-1',
    destAssetDenom: 'ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349'
  };

  const filter = {
    destination: {
      'penumbra-1': undefined,
    }
  }


  return (
    <div className="py-3 flex flex-col gap-8">
      <div>
        The&nbsp;
        <a
          href="https://go.skip.build/"
          className="font-medium text-blue-400 hover:text-blue-300 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Skip App
        </a>
        &nbsp;makes it easy to deposit funds into Penumbra.
        Select a source asset and chain (e.g., USDC) and set Penumbra as the destination chain.
        Or use the widget below to start your deposit:
      </div>

      <div className="px-8">
        <Widget
          theme="dark"
          brandColor="#3B82F6"
          defaultRoute={defaultRoute}
          filter={filter}
        />
      </div>

      {!isLoading &&
        wallets &&
        !connected &&
        Object.entries(wallets).map(([origin, manifest]) => (
          <button
            key={origin}
            onClick={() => onConnect(origin)}
            disabled={connectionLoading}
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {connectionLoading
              ? 'Connecting...'
              : `Connect to ${manifest.name}`}
          </button>
        ))}

      {notesWithMetadata.length === 0 && (
        <div className="w-full bg-gray-900/20 border-2 border-gray-700 rounded-lg p-4">
          <div className="flex flex-row gap-3 items-center">
            <div className="text-gray-300">Waiting for a deposit to occur</div>
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          </div>
        </div>
      )}

      {notesWithMetadata.length > 0 && (
        <div className="border-0">
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
        </div>
      )}

      <div className="flex items-center">
        <input
          id="default-checkbox"
          checked={showOld}
          type="checkbox"
          onChange={() => setShowOld((old) => !old)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="default-checkbox"
          className="ms-2 text-sm font-medium text-gray-300"
        >
          Show old deposits
        </label>
      </div>
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
      className="mt-3 flex gap-3 items-center bg-gray-900/20 border-2 border-gray-700 p-3 rounded-lg"
      key={note.toJsonString()}
    >
      Deposited
      <ValueViewComponent key={note.toJsonString()} valueView={valueView} />
      from {chainName}
      <ChevronRightIcon className="h-4 w-4" />
      <a
        className="text-blue-400 hover:text-blue-300 underline"
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