import re, sys, os

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(base, "src", "base.html"), encoding="utf-8").read().split("\n")

def seg(a, b):
    return "\n".join(src[a - 1:b])

MORE = [f for f in ["more_es1.js","more_es2.js","more_en1.js","more_en2.js","more_bank.js"] if os.path.exists(os.path.join(base, "src", f))]

def rd(n):
    return open(os.path.join(base, "src", n), encoding="utf-8").read().rstrip("\n")

def rep(s, old, new, count=1):
    assert s.count(old) == count, (old[:70], s.count(old))
    return s.replace(old, new)

# boundary checks against the uploaded file
assert src[584].startswith("/* ===================== Persistence"), src[584]
assert src[745].startswith("/* ===================== Game logic"), src[745]
assert src[860].startswith("/* ===================== Prompt building"), src[860]
assert src[986].startswith("function absorb"), src[986]
assert src[1565] == "});", src[1565]
assert src[1599] == "})();", src[1599]

A = seg(1, 584)      # head, CSS, HTML, config, i18n, state
D = seg(746, 860)    # deterministic game logic
E = seg(987, 1566)   # absorb, rendering, sound, music, fun layer, narrator, actions
F = seg(1600, 1603)

# ---- head / CSS / HTML ----
A = rep(A, "</style>", """.lv:disabled{opacity:.38;cursor:not-allowed}
.lv:disabled::after{content:"🔒";font-size:.6em;margin-left:2px;vertical-align:middle}
.judge .ans .listen + .listen{margin-left:6px}
button.word{position:relative;padding-right:34px}
button.word .say{position:absolute;right:10px;top:8px;float:none}
</style>""")
A = rep(A, '<input type="text" id="islandIn" data-i18n-ph="surpriseMe" placeholder="Surprise me">', '<input type="hidden" id="islandIn">')
A = rep(A, '<section class="group">\n    <label class="toggle">', '<section class="group" hidden>\n    <label class="toggle">')
A, n = re.subn(r'<label class="f" for="nextIsland".*?Sail there</button>',
               '<p class="f" style="margin-top:16px" data-i18n="pickNext">Or pick the next island yourself:</p>\n    <div class="chips" id="nextChips"></div>',
               A, count=1, flags=re.S)
assert n == 1
A = rep(A, '<p class="note" id="startNote"></p>', '<p class="note" id="startNote"></p>\n  <p class="note" data-i18n="prebuiltTag" style="text-align:center"></p>')
A = rep(A, '<label class="f" for="islandIn" data-i18n="islandLabel">', '<label class="f" data-i18n="islandLabel">')

A = rep(A, "</style>", """.daily{background:var(--card);border-radius:18px;padding:12px 16px;margin:0 0 18px;box-shadow:var(--shadow)}
.daily .row3{display:flex;justify-content:space-between;gap:8px;font-weight:800;font-size:1.15rem;font-family:"Bricolage Grotesque",sans-serif}
.daily small{display:block;color:var(--muted);font-weight:400;font-size:.8rem;font-family:"Atkinson Hyperlegible",system-ui,sans-serif}
.daily .bar{margin-top:10px}
.tiles{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}
.tile{background:var(--card);border:2px solid var(--line);border-bottom-width:4px;border-radius:12px;padding:8px 13px;font-family:"Bricolage Grotesque",sans-serif;font-weight:700;font-size:1.1rem}
.tile:active{transform:translateY(2px);border-bottom-width:2px}
.tile.used{opacity:.3}
.tile.sel{background:var(--violet-soft);border-color:var(--violet)}
.tile.undo{margin-left:auto;color:var(--muted)}
.keys{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.key{background:var(--field);border:1.5px solid var(--line);border-radius:9px;min-width:38px;padding:6px 0;font-weight:700;font-size:1.05rem}
</style>""")
A = rep(A, '<div class="screen"><div class="target" id="chTarget"></div></div>', '<div class="screen"><div class="target" id="chTarget"></div></div>\n      <div class="tiles" id="tiles" hidden></div>')
A = rep(A, '<textarea id="answer" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>', '<textarea id="answer" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>\n      <div class="keys" id="accentKeys" hidden></div>')
A = rep(A, '<button id="continueBtn" class="continue" hidden>', '<div id="dailyCard" class="daily"></div>\n\n  <button id="continueBtn" class="continue" hidden>')
# ---- config ----
A = rep(A, 'const LEVELS = ["A1","A2","B1","B2","C1","C2"];', 'const LEVELS = ["A1","A2","B1","B2"];')
A = rep(A, "</style>", """.pairs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 12px}
.pr{background:var(--card);border:2px solid var(--line);border-bottom-width:4px;border-radius:12px;padding:10px 8px;font-weight:700;font-size:1rem;min-height:48px}
.pr.sel{background:var(--violet-soft);border-color:var(--violet)}
.pr.done{background:var(--green-soft);border-color:var(--green);color:var(--green);opacity:.75;pointer-events:none}
.pr.bad{animation:prbad .4s}
@keyframes prbad{0%,100%{transform:none}25%{transform:translateX(-4px);border-color:var(--red)}75%{transform:translateX(4px);border-color:var(--red)}}
.pmiss{grid-column:1/-1;margin:0;text-align:center}
.echo{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:6px 0}
.echo-btn{background:var(--violet);color:#fff;border:0;border-radius:14px;padding:14px 22px;font-weight:800;font-size:1.15rem;box-shadow:0 4px 0 rgba(0,0,0,.25)}
.echo-btn.slow{background:var(--card);color:var(--ink);border:2px solid var(--line)}
.echo-btn:active{transform:translateY(3px);box-shadow:none}
.echo-skip{flex-basis:100%;background:none;border:0;color:var(--muted);font-weight:700;font-size:.95rem;text-decoration:underline;padding:6px}
.menu-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 18px}
.menu-row .ghost{padding:12px 8px;font-size:.95rem}
.menu-row small{display:inline-block;font-size:.75rem;color:var(--muted);font-weight:700}
.menu-row .pill{background:var(--red);color:#fff;border-radius:999px;padding:1px 7px;margin-left:2px}
.qcard,.stcard{background:var(--card);border-radius:18px;padding:16px;box-shadow:var(--shadow);margin:14px 0}
.qhead{display:flex;justify-content:space-between;align-items:center;gap:10px}
.qgame{font-weight:800;font-family:"Bricolage Grotesque",sans-serif}
.qprog{font-weight:700;color:var(--muted)}
#quizAnswer{width:100%;min-height:70px;margin-top:10px}
.qverdict{font-weight:800;font-size:1.25rem;margin:0 0 8px}
.qverdict.ok{color:var(--green)} .qverdict.bad{color:var(--red)}
.qscore{font-size:3rem;font-weight:800;text-align:center;font-family:"Bricolage Grotesque",sans-serif;margin:6px 0}
.qmarks{text-align:center;font-size:1.4rem;letter-spacing:2px}
#shareText{width:100%;min-height:84px;font-size:.9rem}
.sttiles{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.sttile{background:var(--card);border-radius:16px;padding:12px;box-shadow:var(--shadow);text-align:center}
.sttile span{font-size:1.3rem;display:block} .sttile b{font-size:1.5rem;font-family:"Bricolage Grotesque",sans-serif;display:block} .sttile small{color:var(--muted)}
.stchart{display:flex;align-items:flex-end;gap:4px;height:120px;margin-top:10px}
.stcol{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;position:relative}
.stcol i{display:block;width:100%;background:var(--violet);border-radius:6px 6px 2px 2px;min-height:2px}
.stcol small{font-size:.7rem;color:var(--muted);margin-top:3px} .stcol em{position:absolute;top:-2px;font-style:normal;font-size:.65rem;color:var(--muted)}
.strow{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--line)}
.strow:last-child{border-bottom:0}
.strow > span:first-child{flex:1;min-width:0}
.stbar{flex:0 0 70px;height:8px;background:var(--line);border-radius:6px;overflow:hidden} .stbar i{display:block;height:100%;background:var(--green)}
.strow small{color:var(--muted);font-size:.75rem}
.stcard h2{font-size:1.05rem;margin:0 0 6px}
.book{display:grid;gap:8px;margin-top:12px}
.bw{position:relative;padding-right:34px}
.bw .say{position:absolute;right:10px;top:8px}
.bw .miss{font-style:normal;font-size:.8rem;color:var(--red);font-weight:700}
.book-title{font-size:2rem;margin:10px 0 2px}
#backupCode{min-height:80px;font-size:.8rem;margin:10px 0 0}
.vrow{padding:10px 0;border-top:1px solid var(--line)}
.vrow .vl{display:block;font-size:.85rem;color:var(--muted);margin:8px 0 4px}
.vsel{display:flex;gap:8px;align-items:center}
.vsel select{flex:1;min-width:0}
.vrow .note{margin:8px 0 0;font-size:.8rem}
.quests .qtitle{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
.quests .qtitle small{color:var(--muted);font-size:.75rem}
.quest{display:flex;align-items:center;gap:10px;padding:7px 0;border-top:1px solid var(--line)}
.quest .qi{font-size:1.3rem}
.quest .qt{flex:1;font-size:.9rem;font-weight:600}
.quest .bar{margin-top:5px;height:8px}
.quest.done{opacity:.65}
.quest b{font-size:.85rem;color:var(--muted)}
.qcard.intro h2{margin:0 0 8px}
.iwords{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 14px}
.iwords span{background:var(--violet-soft);border-radius:10px;padding:5px 10px;font-size:.9rem}
.qcard.intro .primary{width:100%}
.story{display:flex;align-items:center;gap:12px;text-align:left}
.story .sico{font-size:2rem}.story small{display:block;color:var(--muted)}
.story em{margin-left:auto;font-style:normal;color:var(--green);font-weight:800}
.sfeed{display:flex;flex-direction:column;gap:10px;margin:16px 0}
.sline{background:var(--card);border-radius:16px;padding:12px 44px 12px 14px;box-shadow:var(--shadow);position:relative;cursor:pointer;animation:sin .3s}
.sline.narr{background:transparent;box-shadow:none;border:1.5px dashed var(--line);font-style:italic}
.sline .who{display:block;color:var(--violet);font-weight:800;font-style:normal;font-size:.8rem}
.sline .stext{font-size:1.1rem}
.sline .say{position:absolute;right:8px;top:10px;background:none;border:0;font-size:1.1rem}
.sline .str{display:block;color:var(--muted);font-size:.9rem;margin-top:5px;font-style:normal}
.sq{background:var(--violet-soft);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px;animation:sin .3s}
.sopt{background:var(--card);border:2px solid var(--line);border-bottom-width:4px;border-radius:12px;padding:10px;font-weight:700;text-align:left}
.sopt.right{background:var(--green-soft);border-color:var(--green);color:var(--green)}
.sopt.wrong{border-color:var(--red);color:var(--red)}
.sdone{text-align:center}
#storyCtl .primary{width:100%}
.nbanner{display:flex;flex-wrap:wrap;align-items:center;gap:8px;background:var(--card);border:2px solid var(--violet);border-radius:16px;padding:12px 14px;margin:0 0 12px;box-shadow:var(--shadow)}
.nbanner[hidden]{display:none}
.nbanner span{flex:1 1 100%;font-weight:700}
.nbanner button{flex:1}
.ncard{background:var(--card);border-radius:18px;padding:6px 16px 14px;box-shadow:var(--shadow);margin-top:12px}
.nrow{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);cursor:pointer}
.nrow span{flex:1}.nrow small{display:block;color:var(--muted);font-size:.82rem;margin-top:2px}
.nrow input[type=checkbox]{width:24px;height:24px;accent-color:var(--violet)}
.nrow input[type=time]{font:inherit;padding:6px 8px;border:2px solid var(--line);border-radius:10px;background:var(--bg);color:inherit}
.nrow.big b{font-size:1.05rem}
.ngroup[data-off]{opacity:.45;pointer-events:none}
.ncard .ghost{width:100%;margin-top:12px}
.ncard .note{margin:12px 0 0;font-size:.85rem}
.ncard .note.warn{color:var(--red);font-weight:700}
.sylh{margin:12px 0 6px;font-size:.9rem;display:flex;gap:6px;align-items:baseline}.sylh small{color:var(--muted);font-weight:700}
.syl li .dots{margin-left:auto;font-style:normal;color:var(--violet);letter-spacing:1px;font-size:.75rem;white-space:nowrap}
.islgate{margin-top:14px}.islgate .primary{width:100%}.islgate .note{text-align:center;margin:8px 0 0}
@keyframes sin{from{opacity:0;transform:translateY(8px)}}
</style>""")
A = rep(A, '<div class="tiles" id="tiles" hidden></div>', '<div class="tiles" id="tiles" hidden></div>\n      <div class="pairs" id="pairs" hidden></div>')
A = rep(A, '<div id="dailyCard" class="daily"></div>', '<div id="dailyCard" class="daily"></div>\n  <div id="notifyBanner" class="nbanner" hidden></div>\n  <div class="menu-row"><button class="ghost" id="dailyBtn">📅 Daily challenge</button><button class="ghost" id="mistakesBtn">🩹 Fix my mistakes</button><button class="ghost" id="storiesBtn">📚 <span data-i18n="stories">Stories</span></button><button class="ghost" id="bookBtn">📖 <span data-i18n="phrasebook">Phrasebook</span></button><button class="ghost" id="statsBtn">📊 <span data-i18n="stats">Stats</span></button><button class="ghost" id="notifyBtn">🔔 <span data-i18n="n_btn">Reminders</span></button></div>\n  <div id="questCard" class="daily quests"></div>')
A = rep(A, '<label class="srow" id="readRow" hidden>', '<label class="srow" id="echoRow" hidden><span>🎧 <span data-i18n="echoOn">Listening games</span></span><input type="checkbox" id="echoChk"></label>\n      <div class="vrow" id="voiceRow" hidden><b>🗣️ <span data-i18n="voices">Voices</span></b><label class="vl" for="voice-es" data-i18n="voiceEs">Spanish voice</label><div class="vsel"><select id="voice-es"></select><button class="chip" type="button" data-vtest="es">▶ <span data-i18n="voiceTest">Test</span></button></div><label class="vl" for="voice-en" data-i18n="voiceEn">English voice</label><div class="vsel"><select id="voice-en"></select><button class="chip" type="button" data-vtest="en">▶ <span data-i18n="voiceTest">Test</span></button></div><p class="note" data-i18n="voiceTip"></p></div>\n      <label class="srow" id="readRow" hidden>')
A = rep(A, '  <div id="noClaude" class="alert" data-i18n="noClaude" hidden>The Game Master needs Claude to run. Open this page inside Claude to play.</div>\n', '')
A = rep(A, '<p class="note" data-i18n="prebuiltTag" style="text-align:center"></p>', """<p class="note" data-i18n="prebuiltTag" style="text-align:center"></p>
  <details class="panel" id="backupPanel" style="margin-top:18px">
    <summary>💾 <span data-i18n="backup">Move progress to another device</span></summary>
    <div class="panel-body">
      <p class="note" data-i18n="backupNote"></p>
      <button class="ghost" id="exportBtn" style="width:100%" data-i18n="exportBtn">Make a backup code</button>
      <textarea id="backupCode" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
      <div class="actions"><button class="ghost" id="copyBtn" data-i18n="copy">Copy</button><button class="primary" id="importBtn" data-i18n="importBtn">Load this code</button></div>
      <p class="note" id="backupMsg" aria-live="polite"></p>
    </div>
  </details>""")
A = rep(A, '<p class="note" data-i18n="prebuiltTag" style="text-align:center"></p>\n  <details class="panel" id="backupPanel"', '<details class="panel" id="backupPanel"')
A = rep(A, '<!-- ============ GAME ============ -->', """<main id="book" class="wrap" hidden>
  <div class="topbar" style="justify-content:flex-start"><button class="chip" id="bookBack">← <span data-i18n="back">Back</span></button></div>
  <h1 class="display book-title">📖 <span data-i18n="phrasebook">Phrasebook</span></h1>
  <p class="note" id="bookInfo"></p>
  <input type="text" id="bookSearch" data-i18n-ph="search" placeholder="Search">
  <div class="chips" id="bookChips"></div>
  <div id="bookList" class="book"></div>
</main>

<main id="quiz" class="wrap" hidden>
  <div class="topbar" style="justify-content:space-between"><button class="chip" id="quizBack">← <span data-i18n="back">Back</span></button><span class="qprog" id="quizProg"></span></div>
  <h1 class="display book-title" id="quizTitle"></h1>
  <div class="bar"><i id="quizBar"></i></div>
  <section class="qcard intro" id="quizIntro" hidden></section>
  <section class="qcard" id="quizCard">
    <div class="qhead"><span class="qgame" id="quizGame"></span></div>
    <p id="quizTask"></p>
    <div class="screen"><div class="target" id="quizTarget"></div></div>
    <p class="note" id="quizHint" hidden></p>
    <div class="tiles" id="quizOpts" hidden></div>
    <div class="tiles" id="quizBuild" hidden></div>
    <textarea id="quizAnswer" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
    <div class="keys" id="quizKeys" hidden></div>
    <div class="actions"><button class="primary" id="quizSubmit" data-i18n="check">Check</button><button class="ghost" id="quizSkip" data-i18n="idk">I don't know</button></div>
  </section>
  <section class="qcard" id="quizFeedback" hidden>
    <p class="qverdict" id="quizVerdict"></p>
    <p id="quizFb"></p>
    <div class="actions"><button class="primary" id="quizNext" data-i18n="next">Next</button></div>
  </section>
  <section class="qcard" id="quizDone" hidden>
    <div class="qscore" id="quizScore"></div>
    <div class="qmarks" id="quizMarks"></div>
    <p class="note" id="quizNote" style="text-align:center"></p>
    <div id="shareBox" hidden>
      <p class="note" data-i18n="shareHint">Share your score:</p>
      <textarea id="shareText" readonly></textarea>
      <div class="actions"><button class="primary" id="shareCopy" data-i18n="copyShare">Copy result</button></div>
      <p class="note" id="shareMsg" aria-live="polite"></p>
    </div>
    <div class="actions"><button class="ghost" id="quizHome" data-i18n="backMenu">Back to menu</button></div>
  </section>
</main>

<main id="statsPage" class="wrap" hidden>
  <div class="topbar" style="justify-content:flex-start"><button class="chip" id="statsBack">← <span data-i18n="back">Back</span></button></div>
  <h1 class="display book-title">📊 <span data-i18n="statsTitle">Your stats</span></h1>
  <div class="sttiles" id="stTiles"></div>
  <section class="stcard"><h2 data-i18n="stLast14">Correct answers, last 14 days</h2><div class="stchart" id="stChart"></div></section>
  <section class="stcard"><h2 data-i18n="stByMode">Accuracy by mode</h2><div id="stModes"></div></section>
  <section class="stcard"><h2 data-i18n="stTricky">Your trickiest words</h2><div id="stTricky"></div></section>
  <section class="stcard"><h2 data-i18n="stDailyH">Daily challenges</h2><p id="stDaily"></p><h2 data-i18n="stMistH">Mistakes</h2><p id="stMist"></p></section>
</main>

<main id="notifyPage" class="wrap" hidden>
  <div class="topbar" style="justify-content:flex-start"><button class="chip" id="notifyBack">← <span data-i18n="back">Back</span></button></div>
  <h1 class="display book-title">🔔 <span data-i18n="n_btn">Reminders</span></h1>
  <div id="notifyBody" class="ncard"></div>
</main>

<main id="storiesPage" class="wrap" hidden>
  <div class="topbar" style="justify-content:flex-start"><button class="chip" id="storiesBack">← <span data-i18n="back">Back</span></button></div>
  <h1 class="display book-title">📚 <span data-i18n="stories">Stories</span></h1>
  <p class="note" data-i18n="storiesSub"></p>
  <div id="storiesList" class="book"></div>
</main>

<main id="storyPage" class="wrap" hidden>
  <div class="topbar" style="justify-content:flex-start"><button class="chip" id="storyBack">← <span data-i18n="back">Back</span></button></div>
  <h1 class="display book-title" id="storyTitle"></h1>
  <div class="bar"><i id="storyBar"></i></div>
  <div id="storyFeed" class="sfeed"></div>
  <div id="storyCtl" class="actions"></div>
</main>

<!-- ============ GAME ============ -->""")
A = rep(A, 'const LANGS = ["English","Spanish","French","Italian","Portuguese","German","Japanese","Korean","Mandarin Chinese","Arabic","Russian","Dutch","Hindi","Other…"];', 'const LANGS = ["English","Spanish"];')
A = rep(A, 'const NATIVE = LANGS.filter(l => l !== "Other…").concat(["Other"]);', 'const NATIVE = LANGS;')
A, n = re.subn(r'const UI_LANGS = \[.*?\n\];', 'const UI_LANGS = [\n  {code:"en", name:"English", label:"English"}, {code:"es", name:"Spanish", label:"Español"}\n];', A, count=1, flags=re.S)
assert n == 1

# ---- game logic ----
D = rep(D, "function gamesFor(st){ return st.mode === 4 ? Object.keys(NUM_GAMES) : Object.keys(GAMES); }",
        'function gamesFor(st){\n  if(st.mode === 4) return Object.keys(NUM_GAMES);\n  const ear = canEcho() ? ["Echo Chamber"] : [];\n  if(st.mode === 7) return ["Verb Forge","Time Machine","Slip Fixer"];\n  if(st.mode === 8) return ["Word Duel","Cloze Combat","Error Hunter","Classic Mine"];\n  if(st.mode === 5) return ["Classic Mine","Reverse Mine","Syntax Scramble","Odd One Out","Match Madness"].concat(ear);\n  return (st.mode === 3 ? ["Classic Mine","Reverse Mine","Syntax Scramble","Error Hunter"] : ["Classic Mine","Reverse Mine","Syntax Scramble","Cloze Combat","Error Hunter"]).concat(ear);\n}')
D = rep(D, "function nextLevel(l){ const i = LEVELS.indexOf(l); return i < 0 || i >= LEVELS.length-1 ? null : LEVELS[i+1]; }",
        "function nextLevel(l, st){ const i = LEVELS.indexOf(l); const n = i < 0 || i >= LEVELS.length-1 ? null : LEVELS[i+1]; return n && hasLevel(st.mode, st.target, n) ? n : null; }")
D = rep(D, "nextLevel(st.level)", "nextLevel(st.level, st)", 2)

# ---- absorb / rendering ----
E = rep(E, 'speak:String(ch.speak||"")}', 'speak:String(ch.speak||""), acc:ch.acc||[], al:ch.al||"", k:ch.k||"s", nn:!!ch.nn, why:String(ch.why||""), cw:ch.cw||[], wk:ch.wk||"", wm:ch.wm||"", pairs:Array.isArray(ch.pairs) ? ch.pairs : null, opts:Array.isArray(ch.opts) ? ch.opts : null}')
E = rep(E, 'lesson.words.filter(w => w && w.w).slice(0,6)', 'lesson.words.filter(w => w && w.w).slice(0,12)')
E = rep(E, 'const v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(l.lang.toLowerCase().slice(0, 2)));', 'const v = bestVoice(l.lang);')
E = rep(E, "  renderPanels();\n  if(fresh){", "  renderPanels();\n  renderExtras(fresh);\n  if(fresh){")
E = rep(E, "if(Array.isArray(res.syllabus) && res.syllabus.length >= 10){\n      S.syllabus = res.syllabus.slice(0, 15).map(String);", "if(Array.isArray(res.syllabus) && res.syllabus.length >= 1){\n      S.syllabus = res.syllabus.slice(0, 40).map(String);")
E = rep(E, '$("game").hidden = true; $("over").hidden = true; $("menu").hidden = false;', '$("game").hidden = true; $("over").hidden = true; $("book").hidden = true; $("quiz").hidden = true; $("statsPage").hidden = true; ["storiesPage","storyPage","notifyPage"].forEach(x => $(x).hidden = true); $("menu").hidden = false;')
E = rep(E, "refreshContinue(); window.scrollTo(0,0);", "refreshContinue(); renderDaily(); window.scrollTo(0,0);")
E = rep(E, 'yours: answer, gaveUp: answer === null};', 'yours: answer, gaveUp: answer === null, al: j.al || ""};')
E = rep(E, 'L.push({text: j.answer, lang: tgt});', 'L.push({text: j.answer, lang: LANG_CODE[S.native] === j.al ? nat : tgt});')
E = rep(E, '<button class="listen" data-say="judge">🔊 ${esc(t("listen"))}</button>` : ""}</div>`;',
        '<button class="listen" data-say="judge">🔊 ${esc(t("listen"))}</button>` : ""}${canOverride() ? `<button class="listen" data-act="override">✋ ${esc(t("override"))}</button>` : ""}</div>`;')
E = rep(E, '$("overIsland").hidden = !conquered;', '$("overIsland").hidden = !conquered;\n  if(conquered) renderNextChips();')

CEFR = ["cefr_es1.js", "cefr_es2.js", "cefr_en1.js", "cefr_en2.js"]
E = rep(E, '$("sylBody").innerHTML = S.syllabus ? `<ol class="syl">${S.syllabus.map((s,i) => `<li class="${S.done[i] ? "done" : ""}"><span class="n">${S.done[i] ? "✓" : i+1}</span><span>${esc(s)}</span></li>`).join("")}</ol>` : `<p class="empty">${esc(t("generating"))}</p>`;', '$("sylBody").innerHTML = sylHtml();')
out = "\n".join([A, rd("m1.js"), "", D, rd("content_es.js"), "", rd("content_en.js"), "", rd("content_bank.js"), "", rd("content_b1.js"), "", rd("content_b2.js"), "", rd("content_islands2.js"), "", *[rd(f) for f in MORE], rd("gm.js"), "", rd("conj.js"), "", rd("tricky.js"), "", *[rd(f) for f in CEFR if os.path.exists(os.path.join(base, "src", f))], rd("features.js"), "", rd("features2.js"), "", rd("features3.js"), "", rd("stories.js"), "", rd("features4.js"), "", rd("island.js"), "", rd("notify.js"), "", rd("practice.js"), "", E, rd("boot.js"), F]) + "\n"
for bad in ["claude.use", "sample.json", "prompt("]:
    assert bad not in out, bad
# ---- app wrapper: local fonts, installable web app, native text-to-speech ----
import re
out, n = re.subn(r'<link rel="preconnect"[^>]*>\s*', "", out)
out, n = re.subn(r'<link href="https://fonts.googleapis.com/css2[^"]*" rel="stylesheet">', '<link rel="stylesheet" href="fonts/fonts.css">', out)
assert n == 1, "font link not found"
head = """<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#5B3FD9">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Polyglot">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<script src="native-tts.js"></script>
"""
assert out.count("</title>") == 1
out = out.replace("</title>", "</title>\n" + head, 1)
reg = """<script>
if("serviceWorker" in navigator && location.protocol === "https:" && !(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()))
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
</script>
"""
out = out.replace("</body>", reg + "</body>", 1)
os.makedirs(os.path.join(base, "www"), exist_ok=True)
open(os.path.join(base, "www", "index.html"), "w", encoding="utf-8").write(out)
print("built www/index.html", len(out), "bytes")
