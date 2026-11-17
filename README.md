# Polyglot Game Master

Learn **Spanish** (for English speakers) or **English** (for Spanish speakers) with games.
Free, open source, works offline. No account, no ads, no tracking.

**▶ Play now: https://doonoo.github.io/polyglot-game-master/** · **📱 [Android app (APK)](https://github.com/doonoo/polyglot-game-master/releases/download/latest/PolyglotGameMaster.apk)**

## Get it

- **Android:** download [`PolyglotGameMaster.apk`](https://github.com/doonoo/polyglot-game-master/releases/download/latest/PolyglotGameMaster.apk) from the [latest build](../../releases/tag/latest) and open it on your phone. (Android asks you to allow installs from your browser or file manager the first time.) New versions install over the old one and keep your progress.
- **iPhone:** open the [web app](https://doonoo.github.io/polyglot-game-master/) in Safari, then **Share → Add to Home Screen**.
- **PC / Mac:** open the [web app](https://doonoo.github.io/polyglot-game-master/) in Chrome, Edge or Brave and click the install icon in the address bar to get it as a desktop app. Edge has the most natural voices.
- Everything works offline after the first visit.

## What's inside

- **Learning path:** four units (A1 to B2) of short lessons, stories and unit tests, with jump-ahead tests.
- **Stories:** short bilingual stories with comprehension questions and audio.
- **Daily quests and a daily challenge**, streaks, XP and trophies.
- **Game modes:** Practice, Level Select, Survivor, Number Cruncher, Lexicon Onslaught, Island Hopper (memorize phrases about your own life), Conjugation Gym and Tricky Pairs (ser/estar, por/para, este/esto/aquel…).
- **Listening:** Echo Chamber and read-aloud use the device's own text-to-speech voices.
- **Fix my mistakes, phrasebook, stats** and a backup code to move progress between devices.

Progress is saved on the device only.

## Build it yourself

Needs Python 3 and Node.js 22.

```bash
npm install
npm run build      # writes www/index.html from src/
npm test           # plays thousands of rounds in both directions
```

Android app (needs Android Studio or the Android SDK and JDK 21):

```bash
npx cap add android
npx @capacitor/assets generate --android
npx cap sync android
cd android && ./gradlew assembleDebug
```

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

`tools/debug.keystore` is a public debug key (password `android`). It only keeps APK updates consistent for sideloading. To publish on Google Play, create your own private release key and never commit it.

## Content

All lessons, stories and exercises are original. Corrections and new content are welcome: open an issue or a pull request.

## License

MIT
