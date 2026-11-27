# Polyglot Game Master: notes for Claude

Read this first in any new chat about this project. It is the short version of everything learned while building it.

## What it is
- A language game: Spanish ↔ English (CEFR A1–B2) plus French, Portuguese, Mandarin Chinese and Arabic taught through English (A1–B2 in the course modes; Numbers and Tricky Pairs A1–A2, Conjugation up to B1) that started as Emmanuel's Gemini gem. Everything runs offline with built-in content and no AI at play time.
- Repo: github.com/doonoo/polyglot-game-master (open source).
- Shipped three ways:
  1. **PWA on GitHub Pages**, from `.github/workflows/pages.yml`.
  2. **Android APK**: Capacitor 8, built by `.github/workflows/android.yml` on `v*` tags and attached to the GitHub release. Emmanuel installs and updates it with Obtainium.
  3. **Claude artifact**: slug `b0fe1060-a90c-4747-aba4-6b3b067f79ae`.
- A Spanish-speaking friend uses it to practice English, so both directions matter.

## Never do
- Never commit the release keystore, passwords or `PGM_*` secrets. Signing secrets live only in GitHub Actions secrets (`PGM_KEYSTORE_BASE64`, `PGM_KEYSTORE_PASSWORD`, `PGM_KEY_ALIAS`, `PGM_KEY_PASSWORD`). Emmanuel added them himself.
- Never type passwords, tokens or keys into websites, even if told it's fine.
- Don't make Codeberg, F-Droid or IzzyOnDroid submissions (the store text and screenshots in `fastlane/` are kept current for when Emmanuel resubmits to F-Droid himself; `node` + Playwright made the 2.16 screenshots at 411×913, scale 2.625). Codeberg rejects LLM-written content, and the IzzyOnDroid submission was cancelled.
- Don't add or remove lines in `src/base.html`. `tools/build.py` patches it by exact string match. Make changes with a `rep(...)` in build.py or in a module instead.

## Layout and build
- `python3 tools/build.py` writes `www/index.html`, one big single-file app. The steps:
  1. Read `src/base.html`.
  2. Apply exact-string `rep()` patches, including the CSS blocks injected before `</style>`.
  3. Append every `src/*.js` module in the order of the `out = "\n".join([...])` line near the bottom of build.py.
- All modules share one scope, an IIFE. Extend an existing function only through `wrap()` (src/wrap.js, loaded first): `fn = wrap("fn", "<module file name>", fn, orig => function(...){ ...orig(...)... });`. It names the layer for stack traces (`gradeLocal[typo]`) and records the chain; `wrapChains()` (`window.__wrapChains` in tests) lists every chain innermost → outermost. **test24 holds the expected chains**: adding, removing or moving a wrapper (or a module in the build.py join) means updating `EXPECTED` there and the map below, on purpose. Layer order is behavior: an outer layer sees what inner layers return (e.g. Card Clash and Grammar Gym wrap `generate` outside mc.js so their rounds can switch multiple choice off).
- **Wrapper chains (2.18), innermost → outermost** (single-layer ones are in test24):
  - `applyI18n`: chiptune → voiceprefs
  - `applyResult`: island → practice → custom → boss → gym → cards → dialog
  - `conceptAt`: practice → langmodes
  - `conjQuestion`: langmodes → mc
  - `freshState`: custom → timer → mc → gym → cards → dialog
  - `gamesFor`: langmodes → mcgames → mcgames2
  - `genConj`: langmodes → mc → mcgames → mcgames2
  - `genNumber`: langmodes → mc → mcgames2
  - `genSentence`: mc → mcgames → mcgames2
  - `genVocab`: langmodes → mc → mcgames → mcgames2
  - `generate`: practice → custom → boss → mc → gym → cards → dialog
  - `gradeLocal`: custom → boss → typo → mcgames → mcgames2 → alts
  - `grantRewards`: timer → boss
  - `makePlanCore`: island → practice → custom → gym → cards → dialog
  - `playOutcome`: juice → sfx → gym
  - `progress`: custom → gym → cards → dialog
  - `recordAnswer`: features4 → notify → twoplayer
  - `renderDaily`: features3 → features4 → notify
  - `renderExtras`: island → boss → feedback → keyboard → anim → voice → juice → langs → mc → mcgames → mcgames2 → cards → dialog
  - `renderGame`: twoplayer → leo → mobile
  - `renderHud`: custom → anim → juice → gym → cards → dialog
  - `renderMenu`: custom → timer → langs → langmodes → mc → uisize → twoplayer → gym → cards → dialog → menumerge → leo → firstrun
  - `showOnly`: chiptune → sfx
  - `showOver`: custom → timer → anim → juice → twoplayer → gym → cards → dialog → leo → firstrun
  - `syllabusFor`: practice → langmodes
  - `syncMood`: langs → sfx → twoplayer → cards
  - `tileItems`: langs → langmodes → mc → cards → dialog
- **Content load order:** content_* files → MORE (more_*.js) → gm.js → conj.js → tricky.js → CEFR lessons (cefr_es1/2, cefr_en1/2, cefr_idioms.js) → deep_loader.js → deep_*.js → `applyDeep()` → feature modules (… timer, boss, tips, feedback, keyboard, anim, fx, voice) → base.html section E (Sound, Music) → chiptune.js, juice.js → lang_zh/ar/fr/pt.js (each followed by its lang_<code>2.js and lang_<code>3.js) → lang_<code>4.js and lang_<code>5.js for zh, ar, fr, pt → langs.js → langmodes.js → typo.js → mc.js → mcgames.js → mcgames2.js → alts.js → uisize.js → voiceprefs.js → sfx.js → twoplayer.js → gym.js → cards.js → dialog_data.js → dialog.js → menumerge.js → mascot.js → leo.js → firstrun.js → mobile.js → boot.js. `wrap.js` comes first of all, right after base.html section A. Sound and Music are consts, so a module that touches them at load time must come after E in the build.py join.
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
  - **`src/lang_<code>4.js`** (2.15) adds sentences to the existing A1–B1 topic units (not the grammar units), pushed by unit title before langs.js runs: 7 per A1–A2 topic unit, 5 per B1 topic unit, `[english, target, rom|null, planted mistake]`. B1 sentences must have a planted mistake (test17). English prompts and sentences must be unique across the whole course, because multiple-choice rounds use other items' sentences as wrong options; test23 checks that, plus every `|` reading is accepted, every planted mistake is rejected (normal and strict) and zh/ar romanization has one entry per word.
  - **`src/lang_<code>5.js`** (2.16) holds B2: 7 topic units + 4 grammar units (`k:"g"`), 6 sentences each, every one with a planted mistake (test17 checks B1 and B2). B2 shows up by itself in Practice, Level Select, Survivor, Vocab, Grammar Gym and Card Clash because levels come from `COURSE[code]`; Numbers (`XLNUM`), Conjugation (`CONJ`) and Tricky Pairs (`WL.<code>.tricky`) have their own level keys and stop earlier.
  - **`src/lang_<code>3.js`** (2.13) holds the grammar lessons: units with `k:"g"` (langs.js uses `u.k` before its title regex), 4–5 per level, every sentence `[english, target, rom|null, planted mistake]`. Word targets and meanings must stay unique across the whole pack (check with a duplicate scan before building).
- **Grammar tips:** `src/tips.js` holds `TIP_ES` and `TIP_EN`, rules shaped `{id, re, en, es}`. test10 checks that 95% or more of items get a tip.

## Modes and systems
- **Mini-games** (rotation): Classic Mine, Reverse Mine, Syntax Scramble, Cloze Combat, Error Hunter, Word Duel, Odd One Out, Match Madness, Verb Forge, Time Machine, Slip Fixer, the number games, plus Quick Pick, Meaning Match, Right or Wrong, Spot the Mistake, Gap Fill, Order Up, Meaning Check, Number Pick, Number Match, Who's Doing It?, Tense Detective.
- **Modes:** 1 Practice, 2 Level Select (no menu card since 2.18: it is Practice with **Stay on this level** on; menumerge.js), 3 Survivor, 4 Numbers, 5 Vocab, 6 Island Hopper, 7 Conjugation Station (renamed from Conjugation Gym in 2.17 so it isn't confused with Grammar Gym; es "Estación de verbos"), 8 Tricky Pairs, 9 Custom (under **More modes** since 2.18), 10 Grammar Gym, 11 Card Clash, 12 Dialogues.
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
  - **Listening and speaking rounds are removed (2.10.1, Emmanuel found them inefficient; their code went in 2.15):** no Echo Chamber or Speak Up generators, skip buttons, `canEcho()`, `echoOn` / `#echoChk`, listening switch or Quiet mode. The listening quest stays defined with `ear:1` but is always filtered out. The Echo Chamber / Speak Up i18n strings and icons stay so old stats still show names. The 🔊 hear buttons and the 🎤 dictation button stay. Don't bring them back unless he asks.
  - `voiceprefs.js`: the 🔈 Audio sheet with the 🎤 dictation switch (`.voiceChk` / `pgm-voice`, kept in sync with the in-game 🎛️ panel).
  - `sfx.js`: 8-bit sound effects (its own small chip: pulse, triangle, noise). Every effect is a `Sound.<name>()` call: tap, select, start, correct, wrong, heart, combo(n), levelUp, stageClear, stageFail, star(i), unlocked, badge, loot, tile, untile, pick, match, bossIntro, bossHit, bossAttack, bossBlock, finalBlow, bossDefeat, timeUp, tick, page. It wraps `playOutcome` (base beeps muted, one sound per outcome) and respects the 🔊 switch. Off under `__PGM_TEST` unless `__SFX_FORCE`.
  - `langmodes.js`: every mode for the new languages. Numbers: `frNum`, `ptNum`, `zhNum` (+ pinyin via `zhPin`), `arNum` (+ transliteration), `xlTime`, `xlPrice`, syllabus `XLNUM` (concepts carry `tip`; wraps numChallenge / genNumber / syllabusFor / conceptAt / findConcept). Vocab: `XLV[code][lv]` from the units' words, swapped into `VLIST` during genVocab (`customVocab()` in custom.js picks the right list). Conjugation: `frForm`, `ptForm` (Brazil), `arForm` (sound three-letter verbs, written + transliteration), `CONJ.fr/pt/ar`, wrapping conjQuestion / conjWrongs / conjAccepted / genConj; Mandarin's mode 7 = measure words played through genSentence as mode 8 (menu card relabelled). Islands get `lang` and m1.js `islandsFor(target)` filters them; stories get `lang` and features4 `storiesFor(tgt)` filters them. Mandarin / Arabic number and verb rounds carry tap options in `ch.opts`. Arabic labels use U+2068/U+2069 isolates so mixed text reads left to right.
  - Answer card in fr/pt/zh/ar (`xlDecorate` in langs.js): the reading line comes from `S.judgement.answer` / `qal`, never `S.current` (by then it is already the next question); Chinese text on the whole card goes through `xlSpace`. test23 plays zh/ar rounds to check both.
  - Grammar tips (`tipsFor` in tips.js) are skipped when the answer is in the player's own language (Reverse Mine / Meaning Match, every English answer in fr/pt/zh/ar): tips explain the language being learned.
  - `typo.js`: typo allowance, wrapping `gradeLocal`. One word may be 1 letter off (2 in 6+ word answers; 2 letters for 8+ letter words) if the typed word isn't a real word (lexicon from all course content and verb tables), isn't in a planted mistake (`it[3]`), isn't in the question, and the slip isn't in the last two letters (endings are grammar). Off in Survivor, Tricky Pairs, bosses, strict Custom, conjugation drills and letter scrambles; es/en/fr/pt only. Sets `j.typo`.
  - `mc.js`: Multiple choice answer mode (menu toggle Type / Multiple choice, localStorage `pgm-mc`, kept per run in `S.mc`). Generators stash candidates in `ch.mcx`; the outer `generate` wrapper builds `ch.opts` = right answer + up to 3 wrong ones, each checked with `gradeLocal` so exactly one is accepted (fewer than 2 honest wrong options → stays a typing round). Uses `opts` because it already survives every challenge copy. A tap (or keys 1-4) answers at once; the text box, accent keys and Check are hidden. Skips Match Madness, Odd One Out, Word Duel and two-sentence final blows.
  - Right or Wrong shows the sentence's meaning in its task, and Spot the Mistake shows each option's meaning under it (`ch.optm`, in the copy list), so a mistake that's only wrong in context stays fair.
  - `mcgames.js`: four multiple-choice mini-games in the rotation (also in typing mode): Quick Pick 🔘 (from Classic Mine / Verb Forge), Meaning Match 💡 (from Reverse Mine), Right or Wrong ✅ and Spot the Mistake 🔎 (from Error Hunter; need a planted mistake). `MCG_MODES` says which modes get which. `mcgWrap` asks the generator for the base game with `plan.mcg` so mc.js stashes candidates, then converts; if it can't get honest options it stays the base typing round. The judging games keep the fixed sentence in `acc[1]`; their grade sets a short verdict plus `j.rw = {shown, fix, had}` (copied into `S.judgement` by the build.py rep), and feedback.js `renderCorrection` shows the sentence with the mistake crossed out and a ✏️ Correct version row (or "nothing to fix") plus a grammar tip. `MCG` (in mc.js) is filtered out of the typed review quiz (features3).
  - `mcgames2.js` (2.11): seven more tap games built the same way (`mg2Wrap` asks for the base game with `plan.mcg`, converts, falls back to the base round when it can't make honest options): Gap Fill 🧩 (Cloze Combat; options built by `mcBuild` *before* renaming, islands borrow other phrases' gap words; not on fr/pt/zh/ar islands, which have no gaps), Order Up 🔀 (Syntax Scramble; options = word orders without punctuation), Meaning Check ⚖️ (Reverse Mine; yes / no on a proposed meaning), Number Pick 🔢 / Number Match 🔣 (Digit Dictation, Real-World Numbers, Clock Watcher in mode 4; siblings from `numChallenge`), Who's Doing It? 👤 / Tense Detective 🕵️ (mode 7, not Mandarin; from Verb Forge using `mcLastQ`, skipped when another person / taught tense has the same form). `MG2_MODES` says which modes get which. The judging games keep their card rows in `ch.info` (in the copy list) and their grade sets `j.rw.rows`, which feedback.js `renderCorrection` shows (✏️ rows in the green box, "del" rows crossed out). test18 forces every game in every language and plays them.
  - `mobile.js` (2.11.1): phone layout, only under `(max-width: 760px)`. Moves the answer area (label, `#answer` + mic, `#accentKeys`, the Submit row) into `#ansDock`, which on phones lives in `#game` as a fixed bottom bar (hidden with the question card; `--mob-dock` pads the feed) and goes back into the card on wider screens. After a right answer the judge card gets `jmini` (verdict only, ▾ Details button) and the turn scrolls to the question; after a miss the card stays open. Lesson cards fold (`lmini`, ▾ Lesson) once seen, for review refreshers, and always when a clock runs (brisk / blitz / attack), where the answer box also gets focus after a right answer. test19 runs it in JSDOM with `matchMedia` saying max-width matches.
  - `gym.js` (2.12): Grammar Gym, mode 10, built like Custom. `gymLessons(target, lv)` = the course's grammar lessons (`k:"g"`, minus anything titled greetings / saludos); fr/pt/zh/ar labels add the tip's first bold terms. A workout under 60% still ends "conquered" but `gymCalm` runs playOutcome / runJuice / showOver as if it were gameover, so there's no fanfare or confetti; the title is Keep training! and Leo thinks (💪 in leo.js). Picks are stored per course in `profile.gymSel[code]` as `"lv|title"`, rounds in `profile.gymRounds`. Plans are `{kind:"gym", lv, idx, t, game}`, generated as a mode-2 syllabus round (`cefr:0`, so idx = COURSE index); games = `gamesFor({mode:2})` minus `GYM_SKIP` (meaning-only games), and a fallback to a skipped game is retried with another game. The least-drilled point comes next; misses go into `st.gym.redo`. Lifetime record `profile.gym[code]["lv|title"] = {r, w, h}` (h = last 10 results) feeds the ✅/🟡/🔴/⚪ marks and `gymWeak()`; it is also filled by Practice / Level Select / Survivor (syllabus and srs plans) and Custom grammar rounds. **applyResult runs twice per turn** (on a preview clone in runTurn, then on S in absorb), so side effects outside the state must check `st === S`. Not recorded in two-player games. test20 covers it; test14 plays it with two players.
  - `alts.js` (2.13.1): also-right answers, the outermost gradeLocal wrapper (after mcgames2). `ALT_EQ[lang]` = groups of phrases interchangeable **as a whole clause** (between punctuation; `{lead:true}` groups may also start a clause, e.g. thanks / thank you + rest). If a typed answer fails but its clause key (`altKey`) equals a variant's, it's accepted with `alt:true` and the feedback names the lesson's phrase (also in `S.judgement.alt`, via the build.py rep; mobile.js keeps those cards unfolded). "My answer was right" (gradeLocal with force) stores the answer in `profile.okAns["al|first variant"]`, accepted next time, unless it's a planted mistake from any course (`altBad`) or shares under a third of the lesson's words (`altClose`). Strict grading (Survivor, bosses, strict Custom) keeps accents in the comparison (`ALT_ACC` = the group phrases as written). Skipped: tap rounds (`ch.opts`), gap / scramble / match games, numbers, Tricky Pairs. test21 checks every planted mistake in every course stays wrong. Add new equivalents to `ALT_EQ` only when they hold as a standalone clause.
  - `cards.js` (2.14): Card Clash, mode 11 (idea from a Reddit reply about a Thai card battler). Plans `{kind:"card", lv, idx, it}`; generate asks for a mode-2 syllabus **Classic Mine** round (mc off, 3–9 words, retrying other lessons), then deals `ch.card = {hand, n, words, li}`: the sentence's words (`cardWords`: punctuation off, first word lower-cased) + decoys (one word from the item's planted mistake, then words from the level's sentences via `cardPool`). `card` is in the build.py challenge copy list. `tileItems` returns the hand as word tiles (langs.js adds romanization for zh/ar); the prompt stays visible, the head reads Card Clash, accent keys hide, `#answer.kcard` is one line. State `S.card = {foe, hp, max, chain, best, dealt, last, lastIdx, redo, ev}`: damage = 8 × words × (1 + 0.25 × min(chain, 6)) × 1.2 if Linked (shares a `cardLinkable` word with the previous sentence; half the time the next sentence comes from the same lesson). Three `CARD_FOES` (HP 170/260/360 × 1 + 0.2 per level), 5 hearts; a miss stores a copy of the challenge in `redo` and re-deals it two turns later. `#cardBar` shows the foe, HP bar, chain and a floating hit; battle music via syncMood ("boss"). test22 plays a run in every language; test14 plays it with two players.
  - `dialog_data.js` + `dialog.js` (2.18): Dialogues, mode 12. `DLG` = scenes `{id, lv, ico, t:{en,es}, note:{en,es}, lines}`, lines alternating `{w:"n"}` (the other person) and `{w:"y"}` (you), each with `en, es, fr, pt, zh, ar` (+ `zr` pinyin / `an` transliteration of the first reading, one entry per word; Chinese split by spaces); "y" lines may hold `|` alternatives and carry `x:{<code>:planted mistake}` for every language. One script serves every course: es course answers `es` (prompts `en`), en course answers `en` (prompts `es`), fr/pt/zh/ar answer their language (prompts `en`). Two scenes per level, three replies each; a run = the level's scenes in order (6 replies), 5 hearts, a miss costs a heart and the talk goes on. Plans `{kind:"dlg", sid, ti}`; generate builds the challenge itself (game `"Dialogue"`, `ch.dlg = {sid, ti, n, hist, ico, t, lv}`, `dlg` is in the build.py copy list) and calls `mcBuild` when `st.mc` (candidates: the planted mistake, then other replies). zh/ar typing gets word tiles; the y lines' readings go into `XL_ROM` / `XL_TOKROM`. `renderDlg` draws `#dlgBox` (chat bubbles; tap = hear it and reveal the meaning, which is hidden from B1 up). test25 checks every line in every course and plays every course × level, typing and multiple choice; test14 plays it with two players.
  - `menumerge.js` (2.18): one **Practice** card (selected for mode 1 and 2) with a **Stay on this level** switch under the level picker (on = `setup.mode = 2`); `MORE_MODES = [9]` go in a collapsible `#modesMore` below the list (`pgm-more`), open while one is picked. Tests pick modes with `window.__pickMode(m)`.
  - `uisize.js`: Display size 70–150% (root font size, all type is rem), localStorage `pgm-size`. 🔍 chip in the menu top bar opens a sheet; A−/A+ row in the 🎛️ panel.
  - `mascot.js`: `lionSVG(mood, {crown, title, cls})` draws Leo the lion (viewBox 200×200; moods happy, cheer, sad, think, wow, wink). No app globals, so `tools/icons.js` can render it too. The build checks for exactly one closing title tag in the page, so never write that tag literally in a module.
  - `firstrun.js` (2.17): a brand-new player (nothing answered, no saved game, no `pgm-firstrun` flag) gets one sheet over the menu: pick a course (Spanish first in an English app, English first in a Spanish one), then **Start with Practice** (mode 1, A1) or Show me the menu. The Practice card has a **Start here** badge until a first game ends (`pgm-firstgame`) or 10 answers. Off under `__PGM_TEST` unless `__FIRSTRUN_FORCE`; test24 covers it.
  - `leo.js`: Leo in the app: menu hero (tap = hello in a course language), the answer card stamp (cheer / wink for a typo / sad / think when giving up) and the end-screen emoji (cheer, sad for 💀, wow for ⏱️).
  - `voice.js`: 🎤 dictation (fills the answer box; Alt+M). Only where `SpeechRecognition` exists or the Android plugin `@capacitor-community/speech-recognition` is present.
- **Challenge copying:** when a challenge is copied into `S.current`, only listed fields survive. The list is in a build.py rep ending with `strict, double, parts`. A new challenge field must be added there.

## Testing
- Run `npm run test:quick` (about 2 minutes) while working and `npm test` (everything, about 10 minutes) before a release. `npm test`: test.js and test4–test25, all JSDOM. test14 plays a 2-player game in every mode; test15 covers multiple choice, display size and the typo allowance; test16 the multiple-choice mini-games; test17 the new languages in every mode (content checks plus a game in every mode and level); test18 the 2.11 tap games; test19 the phone layout; test20 Grammar Gym; test21 also-right answers; test22 Card Clash; test23 the fr/pt/zh/ar content checks (readings, planted mistakes, unique prompts / words / meanings per course, bold tip terms, romanization per word, the answer card reading line); test24 the wrapper chains and the first-run sheet; test25 Dialogues and the merged menu. Tests that type answers must answer option rounds with the right option (see test.js `optRound`). It takes a few minutes.
  - anim.js skips its MutationObserver under `__PGM_TEST`: tests play thousands of turns in one synchronous loop, and undelivered mutation records kept every old node alive (test.js used to peak near 6 GB and get killed; now about 2 GB). test.js also closes each simulated page.
  - Tests set `window.__PGM_TEST = true`, which exposes `window.__pgm` (S, setup, COURSE, variantsOf, gradeLocal, expand, tipsFor…).
  - Test pages keep timers running, so a new test file must end with `process.exit(0)`.
- For real-browser checks, use Playwright with `/usr/bin/google-chrome`. Chrome has a native `SpeechRecognition`; override both `SpeechRecognition` and `webkitSpeechRecognition` when faking voice.

## Release checklist (each version)
1. Bump `versionCode` and `versionName` in `android/app/build.gradle`.
2. Write `fastlane/metadata/android/en-US/changelogs/<versionCode>.txt` and the `es-ES` copy, each under 500 characters.
3. Update `README.md` if features changed.
4. Run `python3 tools/build.py`, then `npm test` (the full run, not test:quick), which must be all green.
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
| 2.14.0 | Card Clash (mode 11): word-card battle with decoys, chains, Linked! bonus, three foes |
| 2.15.0 | 152 more sentences per extra language (lang_<code>4.js, ~360 each), with planted mistakes; listening/speaking round code removed; test23; `npm run test:quick` |
| 2.16.0 | B2 for fr/pt/zh/ar (lang_<code>5.js, 11 units each); answer card reading line fixed (showed the next question's); no grammar tips on answers in your own language; new store text and screenshots |
| 2.17.0 | First-run sheet + Start here badge (firstrun.js); Conjugation Gym → Conjugation Station; every wrapper goes through `wrap()` with named, test-locked chains (wrap.js, test24) |
| 2.18.0 | Dialogues (mode 12, 8 scenes A1–B2 in six languages); Practice and Level Select merged (Stay on this level switch); Custom under More modes |

Current version: 2.18.0, versionCode 45.

## Working with Emmanuel
- He likes short, direct answers and wants Claude to take the initiative on scope.
- Grading should accept any answer that's genuinely right, even if it's more advanced than the lesson or uses a different common phrase, while still showing the lesson's own version. Don't make a valid answer look like a mistake.
- He often sends phone screenshots of bugs.
- He tests the Android app on his phone, which uses a large system text size: check layouts with a bigger root font (e.g. 160%) so nothing overflows.
