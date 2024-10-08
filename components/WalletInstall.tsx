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
  const { data: addresses } = useAddresses(3);
  const isPraxInstalled =
    wallets &&
    Object.values(wallets).some((manifest) => manifest.name.includes('Prax'));

  return (
    <div className="py-3 flex flex-col gap-8">
      <>
        <div>
          In order to interact with Penumbra, you need a compatible wallet. One
          such option is{' '}
          <a
            className="underline"
            href="https://chromewebstore.google.com/detail/prax-wallet/lkpmkhpnhknhmibgnmmhdhgdilepfghe"
          >
            Prax Wallet
          </a>
          . Visit the link and click Add to Chrome to install it, then come back
          to this page.
        </div>
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
            Open it by clicking the extension icon in the Chrome toolbar, select
            Create a new wallet. During the guided tutorial, you'll need to set
            a passphrase to protect your wallet. The passphrase is not the same
            as the recovery phrase. The passphrase is used to restrict access to
            the web wallet on your computer. The recovery phrase can be used to
            restore your wallet in case you forget your passphrase, switch to a
            new machine or delete the extension. Make sure to store both the
            passphrase and the recovery phrase securely, for example in a
            password manager. Re-enter portions of the recovery phrase when
            prompted, to confirm that you've saved it properly.
          </div>

          <div>
            Before you connect your wallet, websites cannot access any of your
            data. It's all stored locally and securely on your device. To give a
            site permission to access your data, click the Connect button below.
          </div>

          {!isLoading &&
            wallets &&
            !connected &&
            Object.entries(wallets).map(([origin, manifest]) => (
              <button
                type={'button'}
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
            <div>
              You have now connected Prax to this page. This means that the
              website can access the data in your wallet, such as balances and
              transaction history. A page can never access your seedphrase.
            </div>
          )}

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
            {!connected && (
              <div>
                Can't access accounts until you've connected your wallet
              </div>
            )}
          </div>

          {connected && (
            <div
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
              role="alert"
            >
              <p className="font-bold">Quest complete!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WalletInstall;
