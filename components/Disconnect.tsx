import type React from 'react';
import { useConnect } from './hooks';

const Disconnect: React.FC = () => {
  const { connected } = useConnect();
  return (
    <div className="py-3 flex flex-col gap-8">
      <div>
        Once you are done working with a page, you can disconnect your wallet.
        To do this in Prax. You can go to the Settings, click Connected sites,
        and click the trash button next to the site URL. This will disconnect
        the extension from the site, after which the site can no longer access
        your data.
      </div>
      {connected && (
        <div className="w-full bg-white shadow-md rounded-lg p-4">
          <div className="flex flex-row gap-3 items-center">
            <div>Waiting for extension to disconnect</div>
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
          </div>
        </div>
      )}
      {!connected && (
        <div>Congratulations. The site can no longer access your data.</div>
      )}
    </div>
  );
};

export default Disconnect;
