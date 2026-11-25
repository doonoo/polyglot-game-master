# Polyglot Game Master: notes for Claude

Read this first in any new chat about this project. It is the short version of everything learned while building it.

## What it is
- A language game: Spanish ↔ English (CEFR A1–B2) plus French, Portuguese, Mandarin Chinese and Arabic taught through English (A1–B1, every mode) that started as Emmanuel's Gemini gem. Everything runs offline with built-in content and no AI at play time.
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
- **Content load order:** content_* files → MORE (more_*.js) → gm.js → conj.js → tricky.js → CEFR lessons (cefr_es1/2, cefr_en1/2, cefr_idioms.js) → deep_loader.js → deep_*.js → `applyDeep()` → feature modules (… timer, boss, tips, feedback, keyboard, anim, fx, voice) → base.html section E (Sound, Music) → chiptune.js, juice.js → lang_zh/ar/fr/pt.js (each followed by its lang_<code>2.js and lang_<code>3.js) → langs.js → langmodes.js → typo.js → mc.js → mcgames.js → mcgames2.js → alts.js → uisize.js → voiceprefs.js → sfx.js → twoplayer.js → gym.js → mascot.js → leo.js → mobile.js → boot.js. Sound and Music are consts, so a module that touches them at load time must come after E in the build.py join.
- A new feature module needs adding to that join list. A new CEFR content file needs adding to the `CEFR = [...]` list.
- `www/native-tts.js` bridges the native Android text-to-speech plugin. The `www/` folder (with `index.html` built) is what Capacitor packages.
- After changing npm Capacitor plugins, run `npx cap sync android` and commit the changed `android/` gradle files.

## Icons
- Leo is the logo. After changing `src/mascot.js`, run `node tools/icons.js` (Playwright + Chrome, then `tools/icons.py` with Pillow). It rewrites the PWA icons, favicon, apple-touch icon, maskable icon, the store icon, every Android launcher mipmap (legacy, round, adaptive background/foreground), the splash screens and the white notification icon.

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
- **Extra-language pack** (`src/lang_<code>.js`, taught through English only): `WL.<code> = {name, self, flag, tts, dir, typing, rom?, seg?, music, bosses, units:[{lv, t, ico, b, w:[[target, english, rom?]], s:[[english, target, rom?]]}]}`. `langs.js` turns each unit into an ordinary CEFR lesson in `COURSE[code][lv]`.
  - Sentence targets are split into words by spaces (they become tiles and Error Hunter swaps). Chinese is written with spaces between words in the data; `xlSpace()` hides them on screen and grading ignores them.
  - `rom` (pinyin / transliteration) needs one entry per word, separated by normal spaces; use a no-break space inside one entry (`Lǐ Míng`). Mandarin and Arabic sentences get the romanization as a `|` alternative, so typing it in plain letters is accepted.
  - Every word target and every English meaning must be unique within a pack; tips need a **bold** term. test12 checks the lessons and plays every new course.
  - A new language: add a pack, add its code to `XL` / `XL_NAME` in langs.js, the file to the build.py join (before langs.js), and a `music` track in chiptune.js. `XL_MODES` lists the modes it can play (all of them now); langmodes.js needs its numbers, verbs and mode data.
  - **`src/lang_<code>2.js`** extends each pack: B1 units, whose sentences are `[english, target, rom|null, planted mistake]` (a real learner error; without one, langs.js makes a word-swap slip and lists it in `XL_AUTO_WRONG`, which Right or Wrong / Spot the Mistake skip); `tricky` (Tricky Pairs, items `[english, target, cloze, mistake, options|null, rom]`); `stories` (lines `{s, <code>, en, r?}` with `r` = pinyin / transliteration); `islands` (`{id, en, es, ico, units:[unit titles]}`, built from those units' sentences); Mandarin also has `measure` (mode 7). Sentence targets may use pattern syntax; their words come from `canon()`.
  - **`src/lang_<code>3.js`** (2.13) holds the grammar lessons: units with `k:"g"` (langs.js uses `u.k` before its title regex), 4–5 per level, every sentence `[english, target, rom|null, planted mistake]`. Word targets and meanings must stay unique across the whole pack (check with a duplicate scan before building).
- **Grammar tips:** `src/tips.js` holds `TIP_ES` and `TIP_EN`, rules shaped `{id, re, en, es}`. test10 checks that 95% or more of items get a tip.

## Modes and systems
- **Mini-games** (rotation): Classic Mine, Reverse Mine, Syntax Scramble, Cloze Combat, Error Hunter, Word Duel, Odd One Out, Match Madness, Verb Forge, Time Machine, Slip Fixer, the number games, plus Quick Pick, Meaning Match, Right or Wrong, Spot the Mistake, Gap Fill, Order Up, Meaning Check, Number Pick, Number Match, Who's Doing It?, Tense Detective.
- **Modes:** 1 Practice, 2 Level Select, 3 Survivor, 4 Numbers, 5 Vocab, 6 Island Hopper, 7 Conjugation, 8 Tricky Pairs, 9 Custom, 10 Grammar Gym.
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
  - `langs.js`: French, Portuguese, Mandarin, Arabic in the main engine. Native is always English for them; modes outside `XL_MODES` and Stories are disabled; `mixSources` returns nothing so no Spanish/English numbers or verb drills leak in; Mandarin/Arabic typed games get word tiles with romanization; `norm` drops spaces and tones for zh and vowel marks for ar.
  - `twoplayer.js`: two players (hot seat) in every mode. Menu toggle 1/2 players (settings in localStorage `pgm-2p`). Each player has a full state in `TP.states`; after an answer the player sees feedback, then `tpGo()` swaps the other state into `S` (their question was already generated). Wraps `save` and `recordAnswer` (off in 2P, so the single-player save and stats stay untouched; `loadSave()` restores S afterwards), `runTurn`, `showOver`, `renderGame`, `showMenu`, `ckPaused`. End rules: practice-style = N turns each; Survivor/Time Attack = last one standing (ends when the survivor passes the eliminated player); Island Hopper = race. Between turns all keys except Enter are blocked so the hidden question can't be answered.
  - **Listening and speaking rounds are removed (2.10.1, Emmanuel found them inefficient):** `canEcho()` in features2.js always returns false (so no Echo Chamber rounds or listening quests), and voice.js's gamesFor wrapper filters out Speak Up. The 🔊 hear buttons and the 🎤 dictation button stay. Don't bring them back unless he asks.
  - `voiceprefs.js`: the 🔈 Audio sheet (now only the 🎤 dictation switch; the listening row and Quiet mode are hidden). Its switches drive the existing settings: listening = `#echoChk` / `pgm-echo` / `canEcho()`, speaking = `.voiceChk` / `pgm-voice`. Anything that plays audio or asks the player to listen should check `canEcho()`.
  - `sfx.js`: 8-bit sound effects (its own small chip: pulse, triangle, noise). Every effect is a `Sound.<name>()` call: tap, select, start, correct, wrong, heart, combo(n), levelUp, stageClear, stageFail, star(i), unlocked, badge, loot, tile, untile, pick, match, bossIntro, bossHit, bossAttack, bossBlock, finalBlow, bossDefeat, timeUp, tick, page. It wraps `playOutcome` (base beeps muted, one sound per outcome) and respects the 🔊 switch. Off under `__PGM_TEST` unless `__SFX_FORCE`.
  - `langmodes.js`: every mode for the new languages. Numbers: `frNum`, `ptNum`, `zhNum` (+ pinyin via `zhPin`), `arNum` (+ transliteration), `xlTime`, `xlPrice`, syllabus `XLNUM` (concepts carry `tip`; wraps numChallenge / genNumber / syllabusFor / conceptAt / findConcept). Vocab: `XLV[code][lv]` from the units' words, swapped into `VLIST` during genVocab (`customVocab()` in custom.js picks the right list). Conjugation: `frForm`, `ptForm` (Brazil), `arForm` (sound three-letter verbs, written + transliteration), `CONJ.fr/pt/ar`, wrapping conjQuestion / conjWrongs / conjAccepted / genConj; Mandarin's mode 7 = measure words played through genSentence as mode 8 (menu card relabelled). Islands get `lang` and m1.js `islandsFor(target)` filters them; stories get `lang` and features4 `storiesFor(tgt)` filters them. Mandarin / Arabic number and verb rounds carry tap options in `ch.opts`. Arabic labels use U+2068/U+2069 isolates so mixed text reads left to right.
  - `typo.js`: typo allowance, wrapping `gradeLocal`. One word may be 1 letter off (2 in 6+ word answers; 2 letters for 8+ letter words) if the typed word isn't a real word (lexicon from all course content and verb tables), isn't in a planted mistake (`it[3]`), isn't in the question, and the slip isn't in the last two letters (endings are grammar). Off in Survivor, Tricky Pairs, bosses, strict Custom, conjugation drills and letter scrambles; es/en/fr/pt only. Sets `j.typo`.
  - `mc.js`: Multiple choice answer mode (menu toggle Type / Multiple choice, localStorage `pgm-mc`, kept per run in `S.mc`). Generators stash candidates in `ch.mcx`; the outer `generate` wrapper builds `ch.opts` = right answer + up to 3 wrong ones, each checked with `gradeLocal` so exactly one is accepted (fewer than 2 honest wrong options → stays a typing round). Uses `opts` because it already survives every challenge copy. A tap (or keys 1-4) answers at once; the text box, accent keys and Check are hidden. Skips Match Madness, Odd One Out, Word Duel and two-sentence final blows.
  - Right or Wrong shows the sentence's meaning in its task, and Spot the Mistake shows each option's meaning under it (`ch.optm`, in the copy list), so a mistake that's only wrong in context stays fair.
  - `mcgames.js`: four multiple-choice mini-games in the rotation (also in typing mode): Quick Pick 🔘 (from Classic Mine / Verb Forge), Meaning Match 💡 (from Reverse Mine), Right or Wrong ✅ and Spot the Mistake 🔎 (from Error Hunter; need a planted mistake). `MCG_MODES` says which modes get which. `mcgWrap` asks the generator for the base game with `plan.mcg` so mc.js stashes candidates, then converts; if it can't get honest options it stays the base typing round. The judging games keep the fixed sentence in `acc[1]`; their grade sets a short verdict plus `j.rw = {shown, fix, had}` (copied into `S.judgement` by the build.py rep), and feedback.js `renderCorrection` shows the sentence with the mistake crossed out and a ✏️ Correct version row (or "nothing to fix") plus a grammar tip. `MCG` (in mc.js) is filtered out of the typed review quiz (features3).
  - `mcgames2.js` (2.11): seven more tap games built the same way (`mg2Wrap` asks for the base game with `plan.mcg`, converts, falls back to the base round when it can't make honest options): Gap Fill 🧩 (Cloze Combat; options built by `mcBuild` *before* renaming, islands borrow other phrases' gap words; not on fr/pt/zh/ar islands, which have no gaps), Order Up 🔀 (Syntax Scramble; options = word orders without punctuation), Meaning Check ⚖️ (Reverse Mine; yes / no on a proposed meaning), Number Pick 🔢 / Number Match 🔣 (Digit Dictation, Real-World Numbers, Clock Watcher in mode 4; siblings from `numChallenge`), Who's Doing It? 👤 / Tense Detective 🕵️ (mode 7, not Mandarin; from Verb Forge using `mcLastQ`, skipped when another person / taught tense has the same form). `MG2_MODES` says which modes get which. The judging games keep their card rows in `ch.info` (in the copy list) and their grade sets `j.rw.rows`, which feedback.js `renderCorrection` shows (✏️ rows in the green box, "del" rows crossed out). test18 forces every game in every language and plays them.
  - `mobile.js` (2.11.1): phone layout, only under `(max-width: 760px)`. Moves the answer area (label, `#answer` + mic, `#accentKeys`, the Submit row) into `#ansDock`, which on phones lives in `#game` as a fixed bottom bar (hidden with the question card; `--mob-dock` pads the feed) and goes back into the card on wider screens. After a right answer the judge card gets `jmini` (verdict only, ▾ Details button) and the turn scrolls to the question; after a miss the card stays open. Lesson cards fold (`lmini`, ▾ Lesson) once seen, for review refreshers, and always when a clock runs (brisk / blitz / attack), where the answer box also gets focus after a right answer. test19 runs it in JSDOM with `matchMedia` saying max-width matches.
  - `gym.js` (2.12): Grammar Gym, mode 10, built like Custom. `gymLessons(target, lv)` = the course's grammar lessons (`k:"g"`, minus anything titled greetings / saludos); fr/pt/zh/ar labels add the tip's first bold terms. A workout under 60% still ends "conquered" but `gymCalm` runs playOutcome / runJuice / showOver as if it were gameover, so there's no fanfare or confetti; the title is Keep training! and Leo thinks (💪 in leo.js). Picks are stored per course in `profile.gymSel[code]` as `"lv|title"`, rounds in `profile.gymRounds`. Plans are `{kind:"gym", lv, idx, t, game}`, generated as a mode-2 syllabus round (`cefr:0`, so idx = COURSE index); games = `gamesFor({mode:2})` minus `GYM_SKIP` (meaning-only games), and a fallback to a skipped game is retried with another game. The least-drilled point comes next; misses go into `st.gym.redo`. Lifetime record `profile.gym[code]["lv|title"] = {r, w, h}` (h = last 10 results) feeds the ✅/🟡/🔴/⚪ marks and `gymWeak()`; it is also filled by Practice / Level Select / Survivor (syllabus and srs plans) and Custom grammar rounds. **applyResult runs twice per turn** (on a preview clone in runTurn, then on S in absorb), so side effects outside the state must check `st === S`. Not recorded in two-player games. test20 covers it; test14 plays it with two players.
  - `alts.js` (2.13.1): also-right answers, the outermost gradeLocal wrapper (after mcgames2). `ALT_EQ[lang]` = groups of phrases interchangeable **as a whole clause** (between punctuation; `{lead:true}` groups may also start a clause, e.g. thanks / thank you + rest). If a typed answer fails but its clause key (`altKey`) equals a variant's, it's accepted with `alt:true` and the feedback names the lesson's phrase (also in `S.judgement.alt`, via the build.py rep; mobile.js keeps those cards unfolded). "My answer was right" (gradeLocal with force) stores the answer in `profile.okAns["al|first variant"]`, accepted next time. Skipped: tap rounds (`ch.opts`), gap / scramble / match games, numbers, Tricky Pairs. test21 checks every planted mistake in every course stays wrong. Add new equivalents to `ALT_EQ` only when they hold as a standalone clause.
  - `uisize.js`: Display size 70–150% (root font size, all type is rem), localStorage `pgm-size`. 🔍 chip in the menu top bar opens a sheet; A−/A+ row in the 🎛️ panel.
  - `mascot.js`: `lionSVG(mood, {crown, title, cls})` draws Leo the lion (viewBox 200×200; moods happy, cheer, sad, think, wow, wink). No app globals, so `tools/icons.js` can render it too. The build checks for exactly one closing title tag in the page, so never write that tag literally in a module.
  - `leo.js`: Leo in the app: menu hero (tap = hello in a course language), the answer card stamp (cheer / wink for a typo / sad / think when giving up) and the end-screen emoji (cheer, sad for 💀, wow for ⏱️).
  - `voice.js`: Speak Up game plus 🎤 dictation. Only where `SpeechRecognition` exists or the Android plugin `@capacitor-community/speech-recognition` is present.
- **Challenge copying:** when a challenge is copied into `S.current`, only listed fields survive. The list is in a build.py rep ending with `strict, double, parts`. A new challenge field must be added there.

## Testing
- Run `npm test`: test.js and test4–test15, all JSDOM. test14 plays a 2-player game in every mode; test15 covers multiple choice, display size and the typo allowance; test16 the multiple-choice mini-games; test17 the new languages in every mode (content checks plus a game in every mode and level); test18 the 2.11 tap games; test19 the phone layout; test20 Grammar Gym; test21 also-right answers. Tests that type answers must answer option rounds with the right option (see test.js `optRound`). It takes a few minutes.
  - anim.js skips its MutationObserver under `__PGM_TEST`: tests play thousands of turns in one synchronous loop, and undelivered mutation records kept every old node alive (test.js used to peak near 6 GB and get killed; now about 2 GB). test.js also closes each simulated page.
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
   - Publish with the artifact tool's `publish_files` to the slug above, using the current `base_version`. Keep the copy under `/home/claude` (files under `/tmp` are refused).

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
| 2.5.0 | French, Portuguese, Mandarin, Arabic in the main game (World Languages section removed); two-player duel |
| 2.6.0 | Two players built into every mode (duel page removed), PC layout |
| 2.6.1 | Menu top bar wraps instead of overflowing off-screen with large text |
| 2.7.0 | Multiple choice answer mode, display size setting, typo allowance |
| 2.8.0 | Leo the lion: mascot, app icon and in-game reactions; test memory fix |
| 2.9.0 | Multiple-choice mini-games: Quick Pick, Meaning Match, Right or Wrong, Spot the Mistake |
| 2.10.0 | French, Portuguese, Mandarin, Arabic in every mode (numbers, verbs / measure words, tricky pairs, vocab, islands, stories) + B1 units with planted mistakes |
| 2.10.1 | Listening (Echo Chamber) and speaking (Speak Up) rounds removed |
| 2.10.2 | Right or Wrong / Spot the Mistake show the correction on every answer |
| 2.11.0 | Seven more tap mini-games: Gap Fill, Order Up, Meaning Check, Number Pick, Number Match, Who's Doing It?, Tense Detective |
| 2.11.1 | Phone layout: answer bar fixed at the bottom, folded answer cards and lessons, no scrolling to answer |
| 2.11.2 | Music no longer restarts after every answer in fr/pt/zh/ar (syncMood set two moods per call; `Chip.setMood` now settles on the last one in a microtask and only restarts on a real change) |
| 2.12.0 | Grammar Gym (mode 10): pick grammar points, drill only those, mastery marks, My weak spots |
| 2.13.0 | 52 grammar lessons for fr/pt/zh/ar (lang_<code>3.js); Greetings out of the gym; calm end screen for workouts under 60% |
| 2.13.1 | Also-right answers (alts.js): equivalent phrases accepted with the lesson's phrase shown; "My answer was right" remembered per question |

Current version: 2.13.1, versionCode 40.

## Working with Emmanuel
- He likes short, direct answers and wants Claude to take the initiative on scope.
- Grading should accept any answer that's genuinely right, even if it's more advanced than the lesson or uses a different common phrase, while still showing the lesson's own version. Don't make a valid answer look like a mistake.
- He often sends phone screenshots of bugs.
- He tests the Android app on his phone, which uses a large system text size: check layouts with a bigger root font (e.g. 160%) so nothing overflows.
