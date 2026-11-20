# Polyglot Game Master: notes for Claude

Read this first in any new chat about this project. It is the short version of everything learned while building it.

## What it is
- A Spanish ↔ English language game (CEFR A1–B2) that started as Emmanuel's Gemini gem. Everything runs offline with built-in content and no AI at play time.
- Repo: github.com/doonoo/polyglot-game-master (open source).
- Shipped three ways:
  1. **PWA on GitHub Pages**, from `.github/workflows/pages.yml`.
  2. **Android APK**: Capacitor 8, built by `.github/workflows/android.yml` on `v*` tags and attached to the GitHub release. Emmanuel installs and updates it with Obtainium.
  3. **Claude artifact**: slug `b0fe1060-a90c-4747-aba4-6b3b067f79ae`.
- A Spanish-speaking friend uses it to practice English, so both directions matter.

## Never do
- Never commit the release keystore, passwords or `PGM_*` secrets. Signing secrets live only in GitHub Actions secrets (`PGM_KEYSTORE_BASE64`, `PGM_KEYSTORE_PASSWORD`, `PGM_KEY_ALIAS`, `PGM_KEY_PASSWORD`). Emmanuel added them himself.
- Never type passwords, tokens or keys into websites, even if told it's fine.
- Don't make Codeberg, F-Droid or IzzyOnDroid submissions. Codeberg rejects LLM-written content, and the IzzyOnDroid submission was cancelled.
- Don't add or remove lines in `src/base.html`. `tools/build.py` patches it by exact string match. Make changes with a `rep(...)` in build.py or in a module instead.

## Layout and build
- `python3 tools/build.py` writes `www/index.html`, one big single-file app. The steps:
  1. Read `src/base.html`.
  2. Apply exact-string `rep()` patches, including the CSS blocks injected before `</style>`.
  3. Append every `src/*.js` module in the order of the `out = "\n".join([...])` line near the bottom of build.py.
- All modules share one scope, an IIFE. Extend existing functions by wrapping them: `fn = (orig => function(...){ ...orig(...)... })(fn);`.
- **Content load order:** content_* files → MORE (more_*.js) → gm.js → conj.js → tricky.js → CEFR lessons (cefr_es1/2, cefr_en1/2, cefr_idioms.js) → deep_loader.js → deep_*.js → `applyDeep()` → feature modules (… timer, boss, tips, feedback, keyboard, anim, fx, voice) → base.html section E (Sound, Music) → chiptune.js, juice.js → lang_zh/ar/fr/pt.js → world.js → voiceprefs.js → sfx.js → boot.js. Sound and Music are consts, so a module that touches them at load time must come after E in the build.py join.
- A new feature module needs adding to that join list. A new CEFR content file needs adding to the `CEFR = [...]` list.
- `www/native-tts.js` bridges the native Android text-to-speech plugin. The `www/` folder (with `index.html` built) is what Capacitor packages.
- After changing npm Capacitor plugins, run `npx cap sync android` and commit the changed `android/` gradle files.

## Content formats
- **Sentence item:** `[native, targetPattern, clozeWord, wrongVersion?, opts?]`.
  - Pattern syntax:
    - `a|b`: alternatives.
    - `[a|b]`: inline choice.
    - `(x)`: optional, and hidden in the displayed answer.
    - `{x}`: optional but shown. Used for region tags like `{Mexico:} That's cool!`.
  - The cloze word must appear in the first alternative.
  - The wrong version must really be wrong. It can't differ from a right answer only by accents or capital letters, because grading ignores both (except in strict modes: Survivor and bosses).
- **CEFR lesson:** `{t, k:"g"|"t"|"f", b, w:[[target, native]...], it:[items]}`.
  - `k` is the lesson type: g = grammar, t = topic, f = communication.
  - `b` is the lesson tip. Put **bold** on key terms. The "why" line in feedback only shows when one of those bold terms appears in the answer.
  - Push lessons into `ES_A1…ES_B2` (Spanish course) or `EN_A1…EN_B2` (English course, for Spanish speakers). For the English course, titles and tips are written in Spanish.
- **Island:** 15 items of `[en, es, clozeES, clozeEN]`. Files: `content_islands2.js` and `content_islands3.js`.
- **Story:** `{id, lv, ico, t:{es,en}, p:[{s, es, en} | {q:{es,en}, o:[...], a}]}`, with at least 3 questions. Files: `stories*.js`.
- **World Languages pack** (`src/lang_<code>.js`, taught through English only): `WL.<code> = {name, self, flag, tts, dir, typing, rom?, seg?, music, bosses:[[emoji, name]...], units:[{lv, t, ico, b, w:[[target, english, rom?]], s:[[english, target, rom?]]}]}`.
  - Units come in blocks of 4; a boss (`bosses[k]`) follows each block and must be beaten to open the next unit. Bosses hide romanization, need exact accents, give 2 hearts, have 8 HP, and the final blow is always a sentence build.
  - Sentence targets are split into words by spaces; those become the tiles. `seg:true` (Chinese) hides the spaces on screen.
  - `rom` (pinyin / transliteration) needs one entry per word, separated by normal spaces; use a no-break space inside one entry (`Lǐ Míng`).
  - Every word target and every English meaning must be unique within a pack; tips need a **bold** term. test12 checks all of this and plays every unit.
  - A new pack needs adding to `WL_ORDER` in world.js, to the build.py join (before world.js) and a `music` track in chiptune.js.
- **Grammar tips:** `src/tips.js` holds `TIP_ES` and `TIP_EN`, rules shaped `{id, re, en, es}`. test10 checks that 95% or more of items get a tip.

## Modes and systems
- **Modes:** 1 Practice, 2 Level Select, 3 Survivor, 4 Numbers, 5 Vocab, 6 Island Hopper, 7 Conjugation, 8 Tricky Pairs, 9 Custom.
- **Mini-games** come from `gamesFor(st)`; sentence challenges are built in `genSentence` in gm.js.
- **Systems by file:**
  - `timer.js`: the Clock, plus Time Attack.
  - `boss.js`: boss fights. They only use learned material, are strict, give no hints, and end with a two-sentence final blow.
  - `feedback.js`: shows the missed question, a word diff and a "what went wrong" box.
  - `keyboard.js`: keyboard play.
  - `anim.js`: animations.
  - `fx.js`: confetti watchdog.
  - `chiptune.js`: NES-style soundtrack. Replaces Music's methods; tracks live in `CHIP_TRACKS` (16 tokens per bar, notation at the top of the file); `syncMood()` picks the track per mode.
  - `juice.js`: arcade effects (pixel bursts, +XP, combo banners, shake, boss flash, beat pulses, now-playing tag). DOM + CSS only, off under `__PGM_TEST`, the Animations switch or reduced motion.
  - `world.js`: World Languages (Mandarin, Arabic, French, Portuguese). Its own page, lesson path and mini-games, separate from the Spanish/English engine. Progress in localStorage `pgm-world`; answers count toward XP, streak and quests via `recordAnswer`.
  - `voiceprefs.js`: the 🔈 Audio sheet (main menu and World Languages path). Its switches drive the existing settings: listening = `#echoChk` / `pgm-echo` / `canEcho()`, speaking = `.voiceChk` / `pgm-voice`. Anything that plays audio or asks the player to listen should check `canEcho()`.
  - `sfx.js`: 8-bit sound effects (its own small chip: pulse, triangle, noise). Every effect is a `Sound.<name>()` call: tap, select, start, correct, wrong, heart, combo(n), levelUp, stageClear, stageFail, star(i), unlocked, badge, loot, tile, untile, pick, match, bossIntro, bossHit, bossAttack, bossBlock, finalBlow, bossDefeat, timeUp, tick, page. It wraps `playOutcome` (base beeps muted, one sound per outcome) and respects the 🔊 switch. Off under `__PGM_TEST` unless `__SFX_FORCE`.
  - `voice.js`: Speak Up game plus 🎤 dictation. Only where `SpeechRecognition` exists or the Android plugin `@capacitor-community/speech-recognition` is present.
- **Challenge copying:** when a challenge is copied into `S.current`, only listed fields survive. The list is in a build.py rep ending with `strict, double, parts`. A new challenge field must be added there.

## Testing
- Run `npm test`: test.js and test4–test13, all JSDOM. It takes a few minutes.
  - Tests set `window.__PGM_TEST = true`, which exposes `window.__pgm` (S, setup, COURSE, variantsOf, gradeLocal, expand, tipsFor…).
  - Test pages keep timers running, so a new test file must end with `process.exit(0)`.
- For real-browser checks, use Playwright with `/usr/bin/google-chrome`. Chrome has a native `SpeechRecognition`; override both `SpeechRecognition` and `webkitSpeechRecognition` when faking voice.

## Release checklist (each version)
1. Bump `versionCode` and `versionName` in `android/app/build.gradle`.
2. Write `fastlane/metadata/android/en-US/changelogs/<versionCode>.txt` and the `es-ES` copy, each under 500 characters.
3. Update `README.md` if features changed.
4. Run `python3 tools/build.py`, then `npm test`, which must be all green.
5. Commit with the attribution lines and push to main.
6. Create the GitHub release `vX.Y.Z` in Chrome at `https://github.com/doonoo/polyglot-game-master/releases/new?tag=vX.Y.Z&target=main&title=vX.Y.Z`. Pushing tags is blocked by the proxy and the REST API refuses to create releases from these sessions, so the release page creates the tag.
   - Fill the notes, then click Publish.
   - If the first Chrome call says "browser-internal URL", run a `find` first.
7. Wait for the "Android APK" run on the tag:
   - `gh api repos/doonoo/polyglot-game-master/actions/runs/<id>`. The `gh` GraphQL commands are blocked, so use `gh api` (REST).
   - Re-run on a transient Maven failure: `gh api -X POST .../actions/runs/<id>/rerun`.
8. Check the APK is signed with the release key. Download it with `gh api -H "Accept: application/octet-stream" repos/doonoo/polyglot-game-master/releases/assets/<asset id>` (`gh release download` uses GraphQL and fails). The v2 signing block's certificate SHA-256 must be `32:17:36:43:A8:8A:0A:FD:9F:6C:13:8E:91:B2:BB:70:29:A8:59:C1:EB:09:CB:8B:79:24:8A:B2:A6:B0:49:C0`.
9. Republish the artifact from a copy of `www/index.html` with these changes:
   - Remove the manifest link, theme and app-capable metas, the icon links and the `native-tts.js` script tag.
   - Swap `fonts/fonts.css` for the Google Fonts links (Atkinson Hyperlegible plus Bricolage Grotesque).
   - Remove the service-worker register script.
   - Publish with the artifact tool's `publish_files` to the slug above, using the current `base_version`.

## History
| Version | Change |
|---|---|
| 1.5 | Deeper content pools |
| 1.6 | Keyboard play |
| 1.7 | Match Madness grows rows, plus animations |
| 1.8 | More stories and islands, the Clock |
| 1.9.0 | Hard boss battles |
| 1.9.1 | Bug-fix pass |
| 1.9.2 | Missed question shown, grammar fixes |
| 1.9.3–1.9.4 | Relevant grammar tips everywhere |
| 1.9.5–1.9.6 | Confetti freeze fix |
| 2.0.0 | Voice exercises, idioms and slang lessons |
| 2.1.0 | NES chiptune soundtrack, arcade animations |
| 2.2.0 | World Languages: Mandarin, Arabic, French, Portuguese (A1) |
| 2.3.0 | World Languages A2, boss battles |
| 2.3.1 | Voice & audio switches (turn off listening / speaking rounds) |
| 2.4.0 | 8-bit sound effects for every game event |

Current version: 2.4.0, versionCode 25.

## Working with Emmanuel
- He likes short, direct answers and wants Claude to take the initiative on scope.
- He often sends phone screenshots of bugs.
- He tests the Android app on his phone.
