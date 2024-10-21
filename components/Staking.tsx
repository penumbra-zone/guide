import { bech32mIdentityKey } from '@penumbra-zone/bech32m/penumbravalid';
import {
  ValueView,
  ValueView_KnownAssetId,
} from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { ValidatorInfo } from '@penumbra-zone/protobuf/penumbra/core/component/stake/v1/stake_pb';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueViewComponent';
import { ValueComponent } from '@penumbra-zone/ui/components/value/value';

import type React from 'react';
import { useBalances, useDelegations } from './hooks';

const Staking: React.FC = () => {
  const { data: delegations } = useDelegations();
  const validators =
    delegations
      ?.filter(
        (delegation) =>
          delegation?.valueView?.valueView?.value?.amount?.toJsonString() !==
          '{}',
      )
      .map((delegation) => {
        const valueView = delegation.valueView?.valueView
          ?.value as ValueView_KnownAssetId;
        return ValidatorInfo.fromBinary(
          valueView.extendedMetadata?.value as Uint8Array,
        );
      }) ?? [];
  const { data: balances } = useBalances();
  const delegationTokens =
    balances
      ?.filter(
        (balance) =>
          balance?.balanceView?.valueView.case === 'knownAssetId' &&
          balance?.balanceView?.valueView?.value?.metadata?.base.includes(
            'udelegation',
          ),
      )
      .map((balance) => {
        const bal = balance;

        (bal.balanceView?.valueView?.value as ValueView_KnownAssetId)!
          .metadata!.symbol = truncateMiddle(
          (bal.balanceView?.valueView?.value as ValueView_KnownAssetId)!
            .metadata!.symbol,
          30,
        );
        return bal;
      }) ?? [];

  delegationTokens.length, balances?.length, balances;
  return (
    <div className="py-3 flex flex-col gap-8">
      <div className="space-y-6">
        <p>
          If you hold the staking token "UM" you can delegate, or stake, those
          tokens to a validator. This enables you to receive rewards and
          participate in governance in exchange for taking on the risk of
          validator misbehavior.
        </p>

        <div className="space-y-4">
          <p>To stake with Prax, follow these steps:</p>
          <ul className="list-disc pl-8 space-y-2">
            <li>
              First ensure you hold the Penumbra protocol's staking token 'UM'.
            </li>
            <li>Next, select the 'Stake' tab on your frontend.</li>
            <li>
              On the 'Stake' tab, you can see how much 'UM' you have available
              to delegate, along with a list of possible validators.
            </li>
          </ul>
        </div>

        <p>For each validator, you will see some important data:</p>
        <ul className="list-disc pl-8 space-y-2">
          <li>
            'VP': the voting power of the validator in the governance system,
          </li>
          <li>'Com': the commission rate that validator takes.</li>
        </ul>

        <div className="space-y-4">
          <p>
            Once you select a validator to stake with, you can click the
            'Delegate' button.
          </p>
          <p>
            Select how much 'UM' you wish to delegate, then press 'Delegate':
          </p>
          <img
            className="max-w-full"
            src="/images/delegation_amount_example.png"
            alt="Delegation token amount selection"
          />
        </div>

        <p>
          It will take a few moments for the delegation transaction to be
          prepared, then Prax will generate a view of your transaction. Verify
          one of the outputs is to the validator you selected, then click
          'Approve':
        </p>
        <img
          className="max-w-full"
          src="/images/delegation_prax.png"
          alt="Delegation prax"
        />

        <p>
          You should see a pop-up in the lower right hand of the page indicating
          that the transaction was approved!
        </p>

        <img
          className="max-w-full"
          src="/images/delegation_popup.png"
          alt="Delegation popup"
        />

        <p>
          You will receive the delegation token associated with that validator.
          At a later point, you can undelegate by clicking the 'Undelegate'
          button to undelegate from that validator, and receive staking tokens.
        </p>
      </div>

      {delegationTokens.length === 0 && (
        <div className="w-full bg-white shadow-md rounded-lg p-4">
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
                (
                  balance?.balanceView?.valueView
                    ?.value as ValueView_KnownAssetId
                )?.metadata?.base?.includes(
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
                              amount: (
                                balance?.balanceView?.valueView
                                  ?.value as ValueView_KnownAssetId
                              )?.equivalentValues[0]?.equivalentAmount,
                              metadata: (
                                balance?.balanceView?.valueView
                                  ?.value as ValueView_KnownAssetId
                              )?.equivalentValues[0]?.numeraire,
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
              Delegation tokens are liquid - you can swap them the same way you
              would other assets. They will also show up under your Balances in
              frontends.
            </p>
          </div>
        </div>
      )}
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
