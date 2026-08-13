/** Minimal surface of the wallet injected by Petra (window.aptos). */
export interface AptosWallet {
  connect: () => Promise<{ address: string }>;
  account: () => Promise<{ address: string }>;
  network: () => Promise<{ name?: string }>;
  disconnect: () => Promise<void>;
  signAndSubmitTransaction: (
    payload: Record<string, unknown>,
  ) => Promise<{ hash: string }>;
}

declare global {
  interface Window {
    aptos?: AptosWallet;
  }
}

export const PETRA_INSTALL_URL = 'https://petra.app';

export function getWallet(): AptosWallet | null {
  return window.aptos ?? null;
}

export async function connectWallet(): Promise<string> {
  const wallet = getWallet();
  if (!wallet) {
    throw new Error('Petra wallet is not installed.');
  }
  const account = await wallet.connect();
  return account.address;
}

export async function disconnectWallet(): Promise<void> {
  const wallet = getWallet();
  if (wallet) {
    await wallet.disconnect();
  }
}

export async function getNetwork(): Promise<string> {
  const wallet = getWallet();
  if (!wallet) return 'unknown';
  const result = await wallet.network();
  return result.name ?? 'unknown';
}
