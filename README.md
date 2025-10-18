# TapFlow

TapFlow turns everyday objects into buttons for your phone. You stick a small NFC tag on something you touch every day, like a coffee mug, the car dashboard or a bedside table. Tap your phone on the tag and it runs a whole routine at once: starts a playlist, opens navigation, turns on Do Not Disturb, sets an alarm or switches the smart lights. Which actions a tag runs is set up in the companion app for iOS and Android.

This repository is the landing page for the product.

**Live site:** https://tap-flow-psi.vercel.app/

## What is on the page

- Hero with links to the App Store and Google Play
- How it works: a scroll story with three tags (morning, car, night) and a phone that shows what each tap does
- Features
- Shop: physical tags are coming soon
- Footer with a QR code for each store

## Tech

React 18, TypeScript, Vite, Tailwind CSS and Framer Motion. The light and dark themes use CSS custom properties. A Three.js card for the hero is in the code but switched off for now.

## Run locally

```bash
npm ci
npm run dev
```

`npm run build` type-checks and builds into `dist/`. `npm run lint` runs ESLint.

## Deploy

Vercel runs `npm run build` and serves `dist/` (see `vercel.json`).

## Status

This is the start of a small personal business. The app, the shop and the infrastructure are still being built.
