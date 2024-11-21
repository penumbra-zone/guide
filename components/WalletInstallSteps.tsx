import React from 'react';
import { useWalletManifests, useConnect } from './hooks';

const WalletInstallSteps = () => {
    const { data: wallets } = useWalletManifests();
    const { connected, connectionLoading, onConnect } = useConnect();

    const isPraxInstalled = wallets &&
        Object.values(wallets).some(manifest => manifest.name.includes('Prax'));

    return (
        <div className="flex items-center justify-center gap-6 py-8">
            <div className={`rounded-lg p-4 border-2 ${isPraxInstalled
                    ? 'bg-green-900/20 border-green-500 text-green-400'
                    : 'bg-gray-900/20 border-blue-500'
                }`}>
                {isPraxInstalled ? (
                    <div className="font-medium">
                        Prax Wallet Installed
                    </div>
                ) : (
                    <a
                        href="https://praxwallet.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                        Install Prax Wallet
                    </a>
                )}
            </div>

            <div className="flex-grow-0 h-0.5 w-16 bg-gray-700" />

            <div className={`rounded-lg p-4 border-2 ${!isPraxInstalled ? 'bg-gray-900/20 border-gray-700 text-gray-500' :
                    connected ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-gray-900/20 border-blue-500'
                }`}>
                {connected ? (
                    <div className="font-medium">
                        Wallet Connected
                    </div>
                ) : (
                    <button
                        onClick={() => isPraxInstalled && onConnect(Object.keys(wallets)[0])}
                        disabled={!isPraxInstalled || connectionLoading}
                        className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 font-medium"
                    >
                        {connectionLoading ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default WalletInstallSteps;