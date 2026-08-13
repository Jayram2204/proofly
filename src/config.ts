const RAW_NETWORK = (
  import.meta.env.VITE_APTOS_NETWORK ?? 'devnet'
)
  .trim()
  .toLowerCase();
const VALID_NETWORKS = ['devnet', 'testnet', 'mainnet'];

const network = (
  VALID_NETWORKS.includes(RAW_NETWORK) ? RAW_NETWORK : 'devnet'
) as 'devnet' | 'testnet' | 'mainnet';

const moduleAddress = (import.meta.env.VITE_MODULE_ADDRESS ?? '').trim();

export const APTOS_CONFIG = {
  network,
  moduleAddress,
  /** True when the on-chain module address is configured via VITE_MODULE_ADDRESS. */
  isConfigured: moduleAddress.length > 0,
};
