// import { CompleteQuest } from '@/src/components/CompleteQuest.tsx';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  Link, useColorMode,
  VStack,
} from '@chakra-ui/react';

import type {
  AddressView,
  AddressView_Decoded,
} from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import {AddressViewComponent} from '@penumbra-zone/ui/AddressViewComponent';
import {useAddresses, useConnect, useWalletManifests} from './hooks';


const WalletInstall: React.FC = () => {

  const {data: wallets, isLoading} = useWalletManifests();
  const {connectionLoading, connected, onConnect, onDisconnect} =
    useConnect();
  const {data: addresses} = useAddresses(3);
  const isPraxInstalled =
    wallets &&
    Object.values(wallets).some((manifest) => manifest.name.includes('Prax'));

  return (
    <Box py={3} display={'flex'} flexDir={'column'} gap={'2rem'}>
      <>
        <Box>
          In order to interact with Penumbra, you need a compatible wallet. One
          such option is{' '}
          <Link
            textDecor={'underline'}
            href={
              'https://chromewebstore.google.com/detail/prax-wallet/lkpmkhpnhknhmibgnmmhdhgdilepfghe'
            }
          >
            Prax Wallet
          </Link>
          . Visit the link and click Add to Chrome to install it, then come back
          to this page.
        </Box>
        {!isPraxInstalled && (
          <Button
            onClick={() => {
              location.reload();
            }}
          >
            I've installed Prax
          </Button>
        )}
      </>

      {isPraxInstalled && (
        <>
          <Box>Great! You've now installed the Prax Wallet extension.</Box>

          <Box>
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
          </Box>

          <Box>
            Before you connect your wallet, websites cannot access any of your
            data. It's all stored locally and securely on your device. To give a
            site permission to access your data, click the Connect button below.
          </Box>

          {!isLoading &&
            wallets &&
            !connected &&
            Object.entries(wallets).map(([origin, manifest]) => (
              <Button
                key={origin}
                onClick={() => onConnect(origin)}
                disabled={connectionLoading}
              >
                {connectionLoading
                  ? 'Connecting...'
                  : `Connect to ${manifest.name}`}
              </Button>
            ))}

          {connected && (
            <Box>
              You have now connected Prax to this page. This means that the
              website can access the data in your wallet, such as balances and
              transaction history. A page can never access your seedphrase.
            </Box>
          )}

          <VStack
            alignItems={'start'}
            gap={3}
            css={
              '& > * {text-overflow: ellipsis; max-width: 100%;}; & > * button[title="Copy"] {display: none;}'
            }
          >
            <Heading size={'md'}>Here are your first 3 accounts:</Heading>
            {addresses?.map((address) => (
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
            ))}
            {!connected && (
              <div>
                Can't access accounts until you've connected your wallet
              </div>
            )}
          </VStack>

          {connected && (
            <>
              <Alert status="success">
                <AlertIcon/>
                Quest complete!
              </Alert>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default WalletInstall;
