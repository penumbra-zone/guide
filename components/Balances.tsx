import { useBalances, useAddresses } from '@/components/hooks';
import { AddressView } from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueViewComponent';
import { AddressViewComponent } from '@penumbra-zone/ui/AddressViewComponent';
import type React from 'react';

export function Balances() {
  const { data: balances } = useBalances();
  const { data: addresses } = useAddresses(1);

  const filteredBalances = balances?.filter(b =>
    b.balanceView !== undefined &&
    b.accountAddress?.addressView.case === 'decoded' &&
    b.accountAddress.addressView.value.index?.account === 0
  );

  if (!filteredBalances?.length || !addresses?.length) return null;

  const addressView = new AddressView({
    addressView: {
      case: 'decoded',
      value: {
        address: addresses[0].address,
        index: {
          account: 0,
          randomizer: new Uint8Array()
        }
      }
    }
  });

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <AddressViewComponent addressView={addressView} />
        {filteredBalances.map(({ balanceView }) => (
          <ValueViewComponent
            key={balanceView!.toJsonString()}
            valueView={balanceView!}
          />
        ))}
      </div>
    </div>
  );
}