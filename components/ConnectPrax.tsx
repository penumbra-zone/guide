'use client';

import { createPenumbraClient } from '@penumbra-zone/client';
import { Button } from '@penumbra-zone/ui/Button';

const prax_id = 'lkpmkhpnhknhmibgnmmhdhgdilepfghe';
const prax_origin = new URL(`chrome-extension://${prax_id}`).origin;

const ConnectPrax = () => {
  const onConnect = async () => {
    const penumbra = createPenumbraClient(prax_origin);
    void penumbra.connect();
  };

  return (
    <Button onClick={onConnect}>
      Connect Prax
    </Button>
  );
};

export default ConnectPrax;
