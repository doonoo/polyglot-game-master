# Polyglot Game Master

Learn **Spanish** (for English speakers) or **English** (for Spanish speakers) with games.
Free, open source, works offline. No account, no ads, no tracking.

**▶ Play now: https://doonoo.github.io/polyglot-game-master/** · **📱 [Android app (APK)](https://github.com/doonoo/polyglot-game-master/releases/download/latest/PolyglotGameMaster.apk)**

## Get it

- **Android:** download [`PolyglotGameMaster.apk`](https://github.com/doonoo/polyglot-game-master/releases/download/latest/PolyglotGameMaster.apk) from the [latest build](../../releases/tag/latest) and open it on your phone. (Android asks you to allow installs from your browser or file manager the first time.) New versions install over the old one and keep your progress.
- **Android with automatic updates:** install [Obtainium](https://github.com/ImranR98/Obtainium) (free and open source), then [tap here to add Polyglot](https://apps.obtainium.imranr.dev/redirect?r=obtainium://add/https://github.com/doonoo/polyglot-game-master) or add `https://github.com/doonoo/polyglot-game-master` by hand. Obtainium checks this repo's releases and installs each new version.
- **iPhone:** open the [web app](https://doonoo.github.io/polyglot-game-master/) in Safari, then **Share → Add to Home Screen**.
- **PC / Mac:** open the [web app](https://doonoo.github.io/polyglot-game-master/) in Chrome, Edge or Brave and click the install icon in the address bar to get it as a desktop app. Edge has the most natural voices.
- Everything works offline after the first visit.

## What's inside

- **Full CEFR levels (A1 to B2):** every level covers grammar, everyday topics (food, home, travel, work, health, media, society...) and communication (introducing yourself, ordering, directions, invitations, opinions, complaints, formal emails...). Practice mode teaches each lesson, then brings it back until you recall it twice, and mixes in verb, tricky-pair and number drills.
- **Stories:** short bilingual stories with comprehension questions and audio.
- **Daily quests and a daily challenge**, streaks, XP and trophies.
- **Game modes:** Practice, Level Select, Survivor, Number Cruncher, Lexicon Onslaught, Island Hopper (memorize phrases about your own life), Conjugation Gym and Tricky Pairs (ser/estar, por/para, este/esto/aquel…).
- **Listening:** Echo Chamber and read-aloud use the device's own text-to-speech voices.
- **Custom Game:** build your own run. Pick content (grammar, topics, communication, verbs, tricky pairs, numbers, vocabulary), levels and mini-games, then set hearts, rounds, a per-question timer, strict accents, hints and re-asking misses. Quick picks and saved presets included.
- **Match Madness grows with you:** 4 rows at A1, one more per level and a bonus row on a hot streak, up to 8.
- **Animated:** cards, tiles, pairs, hearts, streaks and results all move. Switch it off in the 🎛️ panel; reduce-motion settings are respected.
- **Keyboard play:** play with just the keyboard. The answer box stays focused, Enter submits and continues, 1–9 picks tiles and options, Alt+A/E/I/O/U/N types á é í ó ú ñ, and **?** shows every shortcut. You can turn it on or off in the 🎛️ panel or with the ⌨️ button on the menu.
- **Fix my mistakes, phrasebook, stats** and a backup code to move progress between devices.

Progress is saved on the device only.

## Build it yourself

Needs Python 3 and Node.js 22.

```bash
npm install
npm run build      # writes www/index.html from src/
npm test           # plays thousands of rounds in both directions
```

Android app (needs the Android SDK and JDK 21). The `android/` project is checked in:

```bash
npx cap sync android
cd android && ./gradlew assembleRelease
```

To regenerate the app icon and splash screens from `assets/`, run `npx @capacitor/assets generate --android`.

Store listing text and screenshots for F-Droid live in `fastlane/metadata/android/`.

GitHub Actions does all of this on every push to `main`:
`android.yml` builds the APK and attaches it to the **latest** release, `pages.yml` publishes the web app, and `test.yml` runs the tests.

### Project layout

| Path | What it is |
| --- | --- |
| `src/base.html` | App shell, styles and core UI |
| `src/*.js` | Game engine, modes and all lesson content |
| `tools/build.py` | Stitches everything into one `www/index.html` |
| `www/` | The finished web app (also what the Android app loads) |
| `www/native-tts.js` | Gives the Android/iOS app access to the phone's text-to-speech |
| `assets/` | Icon and splash images for the app |
| `test/` | Automated tests (jsdom) |

### Signing

Release APKs are signed in GitHub Actions with a private key kept in the repository secrets (`PGM_KEYSTORE_BASE64`, `PGM_KEYSTORE_PASSWORD`, `PGM_KEY_ALIAS`, `PGM_KEY_PASSWORD`). Without those secrets the workflow falls back to `tools/debug.keystore`, a public debug key. F-Droid builds the app from source and signs it with its own key.

## Content

All lessons, stories and exercises are original. Corrections and new content are welcome: open an issue or a pull request.

## License

MIT
