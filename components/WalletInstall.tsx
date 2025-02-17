import type {
  AddressView,
  AddressView_Decoded,
} from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import { AddressViewComponent } from '@penumbra-zone/ui/AddressViewComponent';
import type React from 'react';
import { useAddresses, useConnect, useWalletManifests } from './hooks';

const WalletInstall: React.FC = () => {
  const { data: wallets, isLoading } = useWalletManifests();
  const { connectionLoading, connected, onConnect } = useConnect();
  const isPraxInstalled =
    wallets &&
    Object.values(wallets).some((manifest) => manifest.name.includes('Prax'));

  return (
    <div className="py-3 flex flex-col gap-8">
      <>
        {!isPraxInstalled && (
          <button
            type={'button'}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              location.reload();
            }}
          >
            I've installed Prax
          </button>
        )}
      </>

      {isPraxInstalled && (
        <>
          <div>Great! You've now installed the Prax Wallet extension.</div>

          <div>
            Before you connect your wallet, websites cannot access any of your
            data. It's all stored locally and securely on your device. To give a
            site permission to access your data, click the <b>Connect</b> button below.
          </div>

          {!isLoading &&
            wallets &&
            !connected &&
            Object.entries(wallets).map(([origin, manifest]) => (
              // biome-ignore lint: we don't want or need a type here
              <button
                key={origin}
                onClick={() => onConnect(origin)}
                disabled={connectionLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {connectionLoading
                  ? 'Connecting...'
                  : `Connect to ${manifest.name}`}
              </button>
            ))}

          {connected && (
            <>
              <div>
                You have now connected Prax to this page. This means that the
                website can access the data in your wallet, such as balances and
                transaction history. A page can <b>never</b> access your recovery seed phrase.
              </div>

              <div
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
                role="alert"
              >
                <p className="font-bold">Quest complete!</p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export const AddressDisplay: React.FC = () => {
  const { data: wallets, isLoading } = useWalletManifests();
  const { data: addresses } = useAddresses(3);
  const { connected } = useConnect();
  const isPraxInstalled =
    wallets &&
    Object.values(wallets).some((manifest) => manifest.name.includes('Prax'));

  return isPraxInstalled && (
    <div className="flex flex-col items-start gap-3 [&>*]:overflow-ellipsis [&>*]:max-w-full [&>*_button[title='Copy']]:hidden">
      <h2 className="text-lg font-semibold">
        Here are your first 3 accounts:
      </h2>
      {addresses?.map((address) => (
        <div className="bg-gray-700 p-3" key={address.toJsonString()}>
          <AddressViewComponent
            key={address?.toBinary().toString()}
            addressView={
              {
                addressView: {
                  value: {
                    address: address.address,
                  } as AddressView_Decoded,
                  case: 'decoded',
                },
              } as AddressView
            }
          />
        </div>
      ))}

      {connected ? (
        <div
          className="w-full bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
          role="alert"
        >
          <p className="font-bold">Quest complete!</p>
        </div>
      ) : (
        <div>
          Can't access accounts until you've connected your wallet
        </div>
      )}
    </div>
  );
};

export default WalletInstall;