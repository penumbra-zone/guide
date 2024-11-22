import { bech32mIdentityKey } from '@penumbra-zone/bech32m/penumbravalid';
import {
  getBalanceView,
  getMetadataFromBalancesResponse,
  getValueViewCaseFromBalancesResponse,
} from '@penumbra-zone/getters/balances-response';
import {
  getAmount,
  getEquivalentValues,
  getExtendedMetadata,
  getSymbolFromValueView,
} from '@penumbra-zone/getters/value-view';
import {
  ValueView,
  ValueView_KnownAssetId,
} from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { ValidatorInfo } from '@penumbra-zone/protobuf/penumbra/core/component/stake/v1/stake_pb';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueViewComponent';

import type React from 'react';
import { useBalances, useDelegations } from './hooks';

const Staking: React.FC = () => {
  const { data: delegations } = useDelegations();
  const validators =
    delegations
      ?.filter(
        (delegation) => getAmount(delegation.valueView).toJsonString() !== '{}',
      )
      .map((delegation) => {
        const extendedMetadata = getExtendedMetadata(delegation.valueView);
        return ValidatorInfo.fromBinary(extendedMetadata.value as Uint8Array);
      }) ?? [];
  const { data: balances } = useBalances();
  const delegationTokens =
    balances
      ?.filter(
        (balance) =>
          getValueViewCaseFromBalancesResponse(balance) === 'knownAssetId' &&
          getMetadataFromBalancesResponse(balance).base.includes('udelegation'),
      )
      .map((balance) => {
        const bal = balance;
        const symbol = getSymbolFromValueView(bal.balanceView);

        (bal.balanceView?.valueView?.value as ValueView_KnownAssetId)!
          .metadata!.symbol = truncateMiddle(symbol, 30);
        return bal;
      }) ?? [];

  return (
    <div className="py-3 flex flex-col gap-8">
      <div className="space-y-6">
        <p>
          Holders of UM can stake their tokens to participate in network validation and governance.
        </p>
        <p>
          Use the
          <a
            className="underline px-1"
            target={'_blank'}
            href="https://stake.with.starlingcyber.net/#/staking"
            rel="noreferrer"
          >
            Stake page
          </a>
          to delegate to a validator.
        </p>

        {delegationTokens.length === 0 && (
          <div className="w-full bg-gray-700 text-white shadow-md rounded-lg p-4">
            <div className="flex flex-row gap-3 items-center">
              <div>Waiting for a staking delegation to occur</div>
              <div
                className="animate-spin h-5 w-5 border-2 border-blue-500
            rounded-full border-t-transparent"
              />
            </div>
          </div>
        )}

        {delegationTokens.length > 0 && (
          <div className="flex flex-col items-start">
            <div
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 w-full"
              role="alert"
            >
              <p className="font-bold">Staked UM successfully!</p>
            </div>
            <div
              className="flex  px-3
           items-center gap-5 my-5  bg-gray-700 text-white p-3 w-full"
            >
              {delegationTokens?.map((balance) => {
                const validator = validators?.find((validator) =>
                  getMetadataFromBalancesResponse(balance).base?.includes(
                    bech32mIdentityKey({
                      ik:
                        validator?.validator?.identityKey?.ik ?? new Uint8Array(),
                    }),
                  ),
                )?.validator;
                return (
                  <div
                    className="flex flex-col gap-3 items-start justify-center"
                    key={balance.toJsonString()}
                  >
                    <div className="flex items-center gap-3 justify-center">
                      Successfully staked
                      <ValueViewComponent
                        valueView={
                          new ValueView({
                            valueView: {
                              value: new ValueView_KnownAssetId({
                                amount:
                                  getBalanceView.pipe(getEquivalentValues)(
                                    balance,
                                  )[0].equivalentAmount,
                                metadata:
                                  getBalanceView.pipe(getEquivalentValues)(
                                    balance,
                                  )[0].numeraire,
                              }),
                              case: 'knownAssetId',
                            },
                          })
                        }
                      />{' '}
                      on
                      <a
                        target={'_blank'}
                        href={validator?.website}
                        className="underline"
                        rel="noreferrer"
                      >
                        {validator?.name}
                      </a>
                    </div>

                    {/*TODO: support ellipsis in the value view component*/}
                    <div
                      className={
                        '[&_*]:text-ellipsis flex items-center gap-3 justify-center'
                      }
                    >
                      using delegation token:
                      <ValueViewComponent valueView={balance.balanceView} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-3 w-full"
              role="alert"
            >
              <p className="font-bold">Info</p>
              <p>
                Delegation tokens are liquid - their value increases over time as you earn staking rewards.
                They will also show up under your Balances in frontends.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function truncateMiddle(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const start = 5;
  const end = 5;
  const ellipsis = '...';
  const charsToShow = maxLength - (start + end + ellipsis.length);

  if (charsToShow < 1) {
    return text.slice(0, start) + ellipsis + text.slice(-end);
  }

  const leftChars = Math.ceil(charsToShow / 2);
  const rightChars = Math.floor(charsToShow / 2);

  return (
    text.slice(0, start + leftChars) +
    ellipsis +
    text.slice(-(end + rightChars))
  );
}

export default Staking;
