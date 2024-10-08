import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Link,
  Spinner,
} from '@chakra-ui/react';
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
import type React from 'react';
import {
  useBalances,
  useCurrentChainStatus,
  useEphemeralAddress,
  useNotes,
} from './hooks';

const Deposit: React.FC = () => {
  const { data } = useNotes();
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
    <Box py={3} display={'flex'} flexDir={'column'} gap={'2rem'}>
      <div>
        Now it's time to shield your funds and transfer them into Penumbra.
        We've displayed one of your IBC Deposit addresses for you convenience
        below. Copy it using the button on the right.
      </div>

      {ibcInAddress?.address && (
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
      )}

      <Alert status={'info'}>
        <AlertIcon />
        <AlertDescription>
          IBC Deposit addresses exist because source chains record the deposit
          address. They serve as an additional layer of anonymity to not link
          your deposit and actual addresses.
        </AlertDescription>
      </Alert>
      <Box>
        We will use&nbsp;
        <Link
          textDecor={'underline'}
          href={'https://go.skip.build/'}
          className={'font-medium underline'}
        >
          Skip Protocol
        </Link>
        &nbsp; to bridge funds into Penumbra. Go to the Skip app, and input your
        IBC Deposit address. Select your source chain and asset (we recommend
        USDC, but any common asset is fine) and select Penumbra and USDC as the
        destination chain. Then initiate the deposit and come back to this page.
      </Box>
      <Alert status={'info'}>
        <AlertIcon />
        <AlertDescription>
          Penumbra supports paying fees in multiple tokens, including USDC. Prax
          will always choose the best token to pay fees with depending on your
          balances.
        </AlertDescription>
      </Alert>

      {depositedBalances.length === 0 && (
        <Card w={'full'}>
          <CardBody gap={3} flexDir={'row'} display={'flex'}>
            <Box>Waiting for a deposit to occur</Box>
            <Spinner />
          </CardBody>
        </Card>
      )}

      {depositedBalances.length > 0 &&
        depositedBalances.map(({ balance, note }) => (
          <Alert key={note.toJsonString()} status="success">
            <AlertIcon />
            Deposit completed succesfully! Received
            <Flex direction={'column'} gap={3} px={3}>
              <ValueViewComponent
                key={balance.toJsonString()}
                valueView={balance.balanceView as ValueView}
              />
            </Flex>
          </Alert>
        ))}

      {depositsWithNotes.length > 0 && (
        <Accordion
          allowToggle
          borderWidth={'0'}
          css={'* { border-width: 0!important;}'}
        >
          <AccordionItem>
            <AccordionButton color={'grey'}>
              <Box as="span" flex="1" textAlign="left">
                Show old deposits
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {depositsWithNotes.length > 0 &&
                depositsWithNotes?.map((balanceWithNote) => {
                  return (
                    <DepositRow
                      key={JSON.stringify(balanceWithNote)}
                      balanceWithNote={balanceWithNote}
                    />
                  );
                })}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
    </Box>
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
    <Flex mt={3} gap={3} alignItems={'center'} key={balance.toJsonString()}>
      Deposited
      <ValueViewComponent
        key={balance.toJsonString()}
        valueView={balance.balanceView as ValueView}
      />
      from {chainName}
      <ChevronRightIcon />
      <Link
        textDecoration={'underline'}
        target={'_blank'}
        href={`https://ibc.range.org/ibc/status?id=${chainIdToExplorerChainName(chainId)}/${source.channelId}/${source.packetSeq}`}
      >
        Inspect deposit
      </Link>
    </Flex>
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
