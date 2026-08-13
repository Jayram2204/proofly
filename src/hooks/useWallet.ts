import { useCallback, useEffect, useState } from 'react';
import {
  connectWallet,
  disconnectWallet,
  getNetwork,
  getWallet,
} from '../lib/aptos-wallet';
import { APTOS_CONFIG } from '../config';

export function useWallet() {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>(APTOS_CONFIG.network);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const hasWallet = Boolean(getWallet());

  useEffect(() => {
    if (!hasWallet) return;
    const wallet = getWallet();
    if (!wallet) return;

    let cancelled = false;
    wallet
      .account()
      .then(async (account) => {
        if (cancelled) return;
        setAccountAddress(account.address);
        setNetwork(await getNetwork());
      })
      .catch(() => {
        /* wallet present but not connected yet */
      });
    return () => {
      cancelled = true;
    };
  }, [hasWallet]);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const address = await connectWallet();
      setAccountAddress(address);
      setNetwork(await getNetwork());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not connect to the wallet.',
      );
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectWallet();
    setAccountAddress(null);
    setError(null);
  }, []);

  return {
    hasWallet,
    accountAddress,
    network,
    error,
    connecting,
    connect,
    disconnect,
  };
}
