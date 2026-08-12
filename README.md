# Proofly — Verifiable Credentials

Mint, share, and verify verifiable credentials entirely in the browser. Colleges issue certificates to students; anyone can verify a certificate by its **SHA-256 hash** or by scanning its **QR code**.

Fully **client-side** (no server, no database) and structured so a future Move/Aptos smart contract could anchor hashes on-chain for tamper-proof, cross-browser verification.

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

### Tech & UI
- React + TypeScript + Vite.
- Three.js WebGL scene behind the landing (particles + floating credential cubes).
- Framer Motion for smooth entrance and scroll animations.
- Custom cursor, glitch text, and a dark cinematic theme.
- Lucide icons and QRCode.react for QR generation.
- LocalStorage for client-side persistence.

## Demo

1. **Landing** — choose your role (College or Student) over an animated Three.js scene.
2. **College** — fill the mint form, then search/filter the issued list, copy share links, or print a PDF.
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
src/
  components/        # UI views: Landing, College, Student, Verify, Three.js scene
  context/           # certificates state + persistence
  lib/               # hashing, search, links, formatting
  types.ts           # shared data types
```

The Three.js scene is lazy-loaded and only renders on the landing view.

## How hashing works

The SHA-256 digest is computed over a canonical form of the certificate data
(student ID, name, course, title, details, issue date), so the same certificate
always produces the same hash. Verification compares the hash in the URL/QR
against the certificate store.

## Roadmap

- Anchor certificate hashes on an Aptos smart contract so verification works in
  any browser without sharing local storage.
- Revocation support.
- Bulk minting from CSV.

## License

[MIT](./LICENSE)
