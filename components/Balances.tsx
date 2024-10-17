import { useBalances } from '@/components/hooks';
import type { ValueView } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import { ValueViewComponent } from '@penumbra-zone/ui/ValueViewComponent';
import type React from 'react';

export function Balances() {
  const { data: balances } = useBalances();

  return balances
    ? balances
        .map((bal) => bal.balanceView)
        .map((balanceView) => (
          <BalanceRow
            key={balanceView!.toJsonString()}
            balance={balanceView!}
          />
        ))
    : null;
}

function BalanceRow({
  balance,
}: {
  balance: ValueView;
}) {
  return (
    <div
      className="mt-3 flex gap-3 items-center bg-gray-700 text-white p-3"
      key={balance.toJsonString()}
    >
      <ValueViewComponent valueView={balance} />
    </div>
  );
}
