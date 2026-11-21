# 13 Patti

An Android card game (Thirteen / 13 Patti) built with React Native and Expo.
Play against 3 computer rivals. Everything runs on the device: no server, no online play.

## Features

- **Local login**: create an account with a name, a 4-digit PIN and an avatar, then log in again later. Accounts are stored on the device only.
- **Home**: record (played, won, win rate), total points, stars and avatar unlocks, plus Rules and History.
- **House rules**: rounds (3/5/7/10), arrange time (45/60/90/120s), sweep bonus (off/+3/+5), computer difficulty (easy/medium/hard).
- **Table**: arrange 13 cards into four 3-card hands plus a spare. Tap a card, then another to swap. Suggest arranges for you. The timer locks your arrangement when it runs out.
- **Reveal**: hands are revealed one at a time with a point to the strongest hand in each position. The spare breaks ties.
- **Resume**: the game autosaves. Closing the game (✕, Android back or app going to background) keeps the exact position. On the next launch, or when you press Play Now, you are asked whether to **continue the unsaved game** or **start a new one**.

## Project layout

```
App.tsx                 root: session, login, resume prompt, stats
src/game/types.ts       data types and default house rules
src/game/cards.ts       deck and shuffle
src/game/evaluate.ts    3-card hand ranking and comparison
src/game/arrange.ts     computer arrangement (easy / medium / hard)
src/game/engine.ts      match flow: deal, swap, lock, reveal, scoring, rounds
src/game/engine.test.ts unit tests for the rules
src/storage.ts          local accounts, session, saved game (AsyncStorage)
src/avatars.ts          avatar list and star unlocks
src/screens/            Login, Home, Game
src/components/         card, avatar and choice components
```

## Run it

Requires Node 20+ and the Expo Go app (or an Android emulator / dev build).

```bash
npm install
npm run android        # or: npm start, then scan the QR code in Expo Go
npm test               # rules unit tests
npm run typecheck
```

## Build an APK / AAB

Use EAS Build (needs an Expo account):

```bash
npx eas-cli build -p android --profile preview
```

Before publishing, change `android.package` in `app.json` from `com.example.thirteenpatti` to your own package name.

## Rules: current status

The engine implements the variant shown in the design mock-ups:

- 52-card deck, 4 players, 13 cards each, arranged into four 3-card hands and one spare.
- Hand ranking, strongest first: Trail, Pure sequence, Sequence, Color, Pair, High card. A-2-3 is the lowest sequence and Q-K-A the highest.
- Each hand position is revealed in turn. The strongest hand wins one point. Equal hands are broken by the spare card.
- Winning all four hands is a sweep and earns the sweep bonus.
- The player with the most total points after the chosen number of rounds wins the match.
- Stars for a win: Easy 1, Medium 2, Hard 3. Stars unlock avatars.

The official rules sites could not be fetched automatically. Check `src/rulesText.ts` and `src/game/evaluate.ts` against the final rules before release.

## Assets

Avatars currently use emoji placeholders on coloured circles (`src/avatars.ts`). Replace them with the artwork from the design when it is ready.
