# TapFlow

TapFlow turns everyday objects into buttons for your phone. You stick a small NFC tag on something you touch every day, like a coffee mug, the car dashboard or a bedside table. Tap your phone on the tag and it runs a whole routine at once: starts a playlist, opens navigation, turns on Do Not Disturb, sets an alarm or switches the smart lights. Which actions a tag runs is set up in the companion app for iOS and Android.

This repository is the landing page for the product.

**Live site:** https://tap-flow-psi.vercel.app/

## What is on the page

- Hero with an interactive 3D scene: a phone taps an NFC tag and the routine shows up on its screen
- How it works: a scroll story with three tags (morning, car, night) and a working phone mockup that shows what each tap does
- Features
- Shop: physical tags are coming soon
- The app itself is coming soon to iOS and Android

## Tech

React 18, TypeScript, Vite, Tailwind CSS and Framer Motion. The hero scene is built with Three.js and React Three Fiber, loads lazily and falls back to a flat image without WebGL. The light and dark themes use CSS custom properties.

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
