#!/usr/bin/env bash
set -euo pipefail

# Deploys the Proofly credentials module to Aptos.
#
# Usage:
#   ./move/deploy.sh [network] [account-alias]
#
# Example:
#   ./move/deploy.sh devnet proofly
#
# Requirements:
#   - aptos CLI (https://aptos.dev/en/build/cli)
#   - An account funded on the target network (run `aptos init` first).

NETWORK="${1:-devnet}"
ACCOUNT="${2:-proofly}"

cd "$(dirname "$0")"

echo "Compiling module..."
aptos move compile --named-addresses proofly=default --save-metadata

echo "Publishing to ${NETWORK}..."
aptos move publish \
  --named-addresses proofly=default \
  --profile "$ACCOUNT" \
  --assume-yes

echo ""
echo "Module published. Set the frontend config:"
echo "  VITE_MODULE_ADDRESS=0x<your-account-address>"
echo "  VITE_APTOS_NETWORK=${NETWORK}"
