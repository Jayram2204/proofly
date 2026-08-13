import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { APTOS_CONFIG } from '../config';
import { getWallet } from './aptos-wallet';

const NETWORK_MAP: Record<string, Network> = {
  devnet: Network.DEVNET,
  testnet: Network.TESTNET,
  mainnet: Network.MAINNET,
};

let client: Aptos | null = null;

function getClient(): Aptos {
  if (!client) {
    client = new Aptos(
      new AptosConfig({
        network: NETWORK_MAP[APTOS_CONFIG.network] ?? Network.DEVNET,
      }),
    );
  }
  return client;
}

/**
 * Submits an `anchor_hash` transaction for the connected wallet.
 * Returns the on-chain transaction hash.
 */
export async function anchorHash(hash: string): Promise<string> {
  const wallet = getWallet();
  if (!wallet) throw new Error('Petra wallet is not installed.');
  if (!APTOS_CONFIG.isConfigured) {
    throw new Error('VITE_MODULE_ADDRESS is not configured.');
  }

  const response = await wallet.signAndSubmitTransaction({
    type: 'entry_function_payload',
    function: `${APTOS_CONFIG.moduleAddress}::credentials::anchor_hash`,
    type_arguments: [],
    arguments: [hash],
  });

  await getClient().waitForTransaction({ transactionHash: response.hash });
  return response.hash;
}

/**
 * Checks whether `hash` is anchored on-chain by `owner`.
 * Returns false when the module is not configured or the lookup fails.
 */
export async function isHashAnchored(
  owner: string,
  hash: string,
): Promise<boolean> {
  if (!APTOS_CONFIG.isConfigured) return false;
  try {
    const result = await getClient().view({
      payload: {
        function: `${APTOS_CONFIG.moduleAddress}::credentials::has_hash`,
        functionArguments: [owner, hash],
      },
    });
    return result[0] === true;
  } catch {
    return false;
  }
}
