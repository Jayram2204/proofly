# Proofly — Verifiable Credentials

Mint, share, and verify verifiable credentials entirely in the browser. Colleges issue certificates to students; anyone can verify a certificate by its **SHA-256 hash** or by scanning its **QR code**.

Core features work fully **client-side** (no server, no database). Certificate hashes can additionally be **anchored on Aptos**, making verification tamper-proof and cross-browser via the Move smart contract in `move/`.

![demo](https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Vite-3b5bff) ![license](https://img.shields.io/github/license/Jayram2204/proofly)

## Features

### College view
- Mint certificates with student ID, name, course, title, details, and issue date.
- Every certificate gets a unique **SHA-256 hash** at mint time.
- Search and filter issued certificates by **name, ID, course, title, or hash**.
- Print or export any certificate as a PDF (with QR code) via the print dialog.

### Student view
- Look up certificates with a **Student ID**.
- See all certificates issued to that student.
- Copy a shareable verification link for each certificate.

### Verification
- Verify any certificate via a URL query parameter: `?verify=<hash>`.
- Every certificate carries a **QR code** that points to its verification page.

### On-chain anchoring (Aptos)
- Connect an **Aptos wallet** (Petra) in the College view.
- Anchor any certificate's hash on-chain with one click; share links then carry the issuer address.
- The verification page checks the on-chain registry in addition to local storage.

### Tech & UI
- React + TypeScript + Vite.
- Three.js WebGL scene behind the landing (particles + floating credential cubes).
- Framer Motion for smooth entrance and scroll animations.
- Custom cursor, glitch text, and a dark cinematic theme.
- Aptos Move smart contract (`@aptos-labs/ts-sdk`) for on-chain anchoring.
- Lucide icons and QRCode.react for QR generation.
- LocalStorage for client-side persistence.

## Demo

1. **Landing** — choose your role (College or Student) over an animated Three.js scene.
2. **College** — fill the mint form, then search/filter the issued list, copy share links, print a PDF, or anchor hashes on-chain with your Aptos wallet.
3. **Student** — enter your student ID to see your certificates and share/verify them.
4. **Verify** — open any share link (or scan any QR code) to confirm the certificate's integrity.

## Installation

```bash
git clone https://github.com/Jayram2204/proofly.git
cd proofly
npm install
npm run dev
```

Open `http://localhost:5173` to use the app.

## Build

```bash
npm run build   # type-checks and builds to dist/
npm run preview # serve the production build locally
```

## Project structure

```
move/
  sources/credentials.move   # Aptos Move anchoring contract
  deploy.sh                  # deploy helper
src/
  components/        # UI views: Landing, College, Student, Verify, Three.js scene
  context/           # certificates state + persistence
  hooks/             # wallet state
  lib/               # hashing, search, links, aptos, wallet
  types.ts           # shared data types
```

The Three.js scene is lazy-loaded and only renders on the landing view. The Aptos SDK is also lazy-loaded — it only downloads when you anchor a hash or verify one on-chain.

## Aptos on-chain anchoring

Anchoring requires publishing the Move module in `move/` to an Aptos account, then pointing the app at it.

### 1. Install the Aptos CLI

```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
aptos --version
```

### 2. Create an account and fund it

```bash
aptos init --network devnet --profile proofly
# Faucet (devnet): https://aptos.dev/en/build/get-started/faucet
```

### 3. Publish the module

```bash
aptos move compile --named-addresses proofly=default
aptos move publish --named-addresses proofly=default --profile proofly --assume-yes
```

Or run `./move/deploy.sh devnet proofly`.

### 4. Configure the frontend

Copy `.env.example` to `.env.local` and set the deployed module's address:

```bash
VITE_APTOS_NETWORK=devnet
VITE_MODULE_ADDRESS=0x<your-account-address>
```

### Contract

`move/sources/credentials.move` exposes:

- `anchor_hash(owner, hash)` — stores a 64-char SHA-256 hash under the caller's account.
- `has_hash(owner, hash): bool` — on-chain lookup used by the verification page.

## How hashing works

The SHA-256 digest is computed over a canonical form of the certificate data
(student ID, name, course, title, details, issue date), so the same certificate
always produces the same hash. Verification compares the hash in the URL/QR
against the certificate store and, when anchored, against the Aptos registry.

## Roadmap

- Revocation support.
- Bulk minting from CSV.

## License

[MIT](./LICENSE)
