import { Loader2, PlugZap, Unplug } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { APTOS_CONFIG } from '../config';
import { PETRA_INSTALL_URL } from '../lib/aptos-wallet';

export function WalletPanel() {
  const wallet = useWallet();

  const shortAddress = wallet.accountAddress
    ? `${wallet.accountAddress.slice(0, 6)}…${wallet.accountAddress.slice(-4)}`
    : null;

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3 className="card-title">Aptos Blockchain</h3>
          <p className="card-subtitle">
            Anchor certificate hashes on-chain for cross-browser verification.
          </p>
        </div>
        <div className="wallet-controls">
          {wallet.accountAddress ? (
            <>
              <span className="wallet-chip">
                <span className="wallet-dot" />
                {shortAddress}
              </span>
              <span className="wallet-network">{wallet.network}</span>
              <button
                className="btn btn-ghost"
                onClick={wallet.disconnect}
              >
                <Unplug size={15} />
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={wallet.connect}
              disabled={wallet.connecting}
            >
              {wallet.connecting ? (
                <>
                  <Loader2 size={15} className="spin" /> Connecting…
                </>
              ) : (
                <>
                  <PlugZap size={15} /> Connect Petra
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {!wallet.hasWallet && (
        <p className="panel-note">
          No Aptos wallet detected. Install{' '}
          <a href={PETRA_INSTALL_URL} target="_blank" rel="noreferrer">
            Petra wallet
          </a>{' '}
          to anchor certificates on-chain.
        </p>
      )}

      {wallet.error && <p className="form-error">{wallet.error}</p>}

      {!APTOS_CONFIG.isConfigured && (
        <p className="panel-note">
          On-chain anchoring is not configured. Set{' '}
          <code>VITE_MODULE_ADDRESS</code> after publishing the Move module (see
          README).
        </p>
      )}
    </div>
  );
}
