const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");

function boot(lang, tts){
  const errors = [];
  const dom = new JSDOM(html, {
    runScripts: "dangerously", pretendToBeVisual: true, url: "https://example.test/",
    beforeParse(w){
      w.__PGM_TEST = true;
      w.matchMedia = () => ({matches: true, addEventListener(){}, removeEventListener(){}});
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function(){};
      Object.defineProperty(w.navigator, "language", {value: lang, configurable: true});
      w.addEventListener("error", e => errors.push(e.error || e.message));
      if(tts){
        w.__spoken = [];
        const V = Array.isArray(tts) ? tts : [];
        w.speechSynthesis = {speak(u){ w.__spoken.push(u.text); w.__voices = (w.__voices || []).concat(u.voice ? u.voice.name : ""); if(u.onend) setTimeout(u.onend, 0); }, cancel(){}, getVoices(){ return V; }, addEventListener(){}};
        w.SpeechSynthesisUtterance = function(text){ this.text = text; };
      }
    }
  });
  dom.errors = errors;
  return dom;
}

let fails = 0;
const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
const matchSizes = new Set();

/* ---------- 1. Content validation ---------- */
{
  const w = boot("en").window, P = w.__pgm;
  if(!P){ console.log("boot failed", boot("en").errors); process.exit(1); }
  const mk = (acc, al, k) => ({acc, al, k: k || "s", game: "", answerKey: "", cw: []});
  for(const tgt of ["es", "en"]){
    const nat = tgt === "es" ? "en" : "es";
    const stL = {native: nat === "en" ? "English" : "Spanish", mode: 1}, stS = Object.assign({}, stL, {mode: 3});
    const titles = new Set();
    for(const lv in P.COURSE[tgt]){
      const list = P.COURSE[tgt][lv];
      if(list.length < 15) fail(tgt, lv, "has", list.length, "concepts");
      for(const c of list){
        if(titles.has(c.t)) fail("dup title", c.t); titles.add(c.t);
        if(c.it.length < 5) fail(c.t, "only", c.it.length, "items");
        if(!c.w || c.w.length < 3 || c.w.length > 6) fail(c.t, "words", c.w && c.w.length);
        for(const it of c.it){
          const N = P.canon(it[0]), T = P.canon(it[1]);
          if(/[\[\]{}()|]/.test(N + T)) fail("leftover pattern chars", N, T);
          if(!P.gradeLocal(stS, mk([it[1]], tgt), T).correct) fail("canonical target rejected (strict)", T);
          if(!P.gradeLocal(stS, mk([it[0]], nat), N).correct) fail("canonical native rejected", N);
          for(const v of P.expand(it[1])) if(/\s{3,}/.test(v)) fail("odd spacing", v);
          if(it[2]){
            const b = P.blank(T, it[2]);
            if(!b) fail("cloze word not in sentence:", it[2], "|", T);
            else if(!P.gradeLocal(stL, Object.assign(mk([it[2], it[1]], tgt), {game: "Cloze Combat", answerKey: T}), it[2]).correct) fail("cloze answer rejected", it[2]);
          }
          if(it[3]){
            const wrong = it[3].replace(/^~/, "");
            if(P.gradeLocal(stL, mk([it[1]], tgt), wrong).correct) fail("planted error is accepted as correct:", wrong, "|", T);
          }
        }
      }
    }
  }
  // vocab
  for(const lv in P.VOCAB){
    const n = P.VLIST[lv].length; if(n < 50) fail("vocab", lv, "only", n);
    for(const lang of ["es", "en"]){
      const keys = P.VLIST[lv].map(e => P.first(e[lang]).toLowerCase());
      const d = keys.filter((k, i) => keys.indexOf(k) !== i); if(d.length) fail("dup vocab keys", lang, lv, d);
    }
  }
  const allEs = Object.values(P.VLIST).flat().map(e => P.first(e.es).toLowerCase());
  if(new Set(allEs).size !== allEs.length) fail("dup es vocab across levels");
  const allEn = Object.values(P.VLIST).flat().map(e => P.first(e.en).toLowerCase());
  if(new Set(allEn).size !== allEn.length) fail("dup en vocab across levels", allEn.filter((k, i) => allEn.indexOf(k) !== i));
  // islands
  for(const isl of P.ISLANDS){
    if(!isl.en || !isl.es) fail("island names", isl.id);
    if(isl.it.length < 15) fail("island", isl.id, isl.it.length);
    for(const it of isl.it){
      const E = P.canon(it[0]), S = P.canon(it[1]);
      if(/[\[\]{}()|]/.test(E + S)) fail("leftover pattern chars", E, S);
      if(!P.blank(S, it[2])) fail("island cloze es missing:", it[2], "|", S);
      if(!P.blank(E, it[3])) fail("island cloze en missing:", it[3], "|", E);
    }
  }
  // numbers
  const en = {0:"zero",13:"thirteen",21:"twenty-one",100:"one hundred",105:"one hundred five",999:"nine hundred ninety-nine",1000:"one thousand",2024:"two thousand twenty-four",1000000:"one million",21000:"twenty-one thousand",350400:"three hundred fifty thousand four hundred"};
  const es = {0:"cero",16:"dieciséis",21:"veintiuno",22:"veintidós",31:"treinta y uno",100:"cien",101:"ciento uno",500:"quinientos",1000:"mil",2024:"dos mil veinticuatro",21000:"veintiún mil",31000:"treinta y un mil",100000:"cien mil",1000000:"un millón",2000000:"dos millones",1999:"mil novecientos noventa y nueve",701:"setecientos uno",21000000:"veintiún millones"};
  for(const k in en) if(P.enNum(+k) !== en[k]) fail("enNum", k, P.enNum(+k));
  for(const k in es) if(P.esNum(+k) !== es[k]) fail("esNum", k, P.esNum(+k));
  const numSt = {native: "English", mode: 4};
  const chk = (acc, al, ans, want) => { const r = P.gradeLocal(numSt, {acc, al, k: "n", nn: true, game: "", answerKey: acc[0], cw: []}, ans).correct; if(r !== want) fail("num grade", ans, "vs", acc[0], "expected", want); };
  for(const lv in P.NUMSYL){
    if(P.NUMSYL[lv].length !== 15) fail("numsyl", lv);
    for(const c of P.NUMSYL[lv]) for(const tgt of ["es", "en"]) for(let i = 0; i < 40; i++){
      const q = P.numChallenge(c, tgt, i % 2 ? "Digit Dictation" : "", false);
      if(!q.acc || !q.acc.length || q.acc.some(a => !a || /undefined|NaN/.test(a)) || /undefined|NaN/.test(q.target)) fail("bad number challenge", lv, c.en, JSON.stringify(q));
      else for(const a of q.acc) chk(q.acc, tgt, a, true);
    }
  }
  chk(["one hundred five"], "en", "One hundred and five", true);
  chk(["a quarter past three", "three fifteen"], "en", "It's a quarter past three", true);
  chk(["a quarter past three", "three fifteen"], "en", "3:15", false);
  chk(["las tres y cuarto"], "es", "Son las tres y cuarto de la tarde", true);
  chk(["las tres y cuarto"], "es", "tres y cuarto", true);
  chk(["dieciséis"], "es", "dieciseis", true);
  chk(["tres dólares con cincuenta centavos"], "es", "tres dolares con cincuenta céntimos", true);
  chk(["twenty-five percent"], "en", "twenty five per cent", true);
  chk(["doce"], "es", "trece", false);
  // grading behaviour
  const g = (st, acc, al, ans, k) => P.gradeLocal(st, mk(acc, al, k), ans);
  const prac = {native: "English", mode: 1}, surv = {native: "English", mode: 3};
  const T = (cond, msg) => { if(!cond) fail(msg); };
  T(g(prac, ["{Ella} está cansada."], "es", "ella esta cansada").correct, "lenient accent should pass");
  T(/\*\*está\*\*/.test(g(prac, ["{Ella} está cansada."], "es", "ella esta cansada").feedback), "accent feedback bolds word");
  T(!g(surv, ["{Ella} está cansada."], "es", "ella esta cansada").correct, "survivor accent should fail");
  T(g(surv, ["{Ella} está cansada."], "es", "Está cansada.").correct, "pronoun drop");
  T(g(prac, ["I do not speak English."], "en", "i don't speak english").correct, "contraction");
  T(g(prac, ["I cannot drive."], "en", "I can't drive").correct, "can't");
  T(g(prac, ["It is Ana's car."], "en", "its anas car") .correct === false, "its != it is");
  T(g(prac, ["el perro"], "es", "perro", "w").correct, "word w/o article");
  T(g(prac, ["el perro"], "es", "un perro", "w").correct, "word indefinite");
  T(!g(prac, ["el perro"], "es", "la perro", "w").correct, "wrong gender");
  T(g(prac, ["to eat"], "en", "eat", "w").correct, "verb without to");
  T(g(prac, ["dog"], "en", "the dog", "w").correct, "en article");
  T(/\*\*soy\*\*/i.test(g(prac, ["(Yo) soy estudiante."], "es", "yo es estudiante").feedback), "bold correction");
  T(P.canon("¿El libro? (Yo) lo tengo.") === "¿El libro? Lo tengo.", "canon caps: " + P.canon("¿El libro? (Yo) lo tengo."));
  T(P.canon("¿(Tú) hablas español?") === "¿Hablas español?", "canon q");
  T(P.canon("{[Ellos|Ellas]} son de México.") === "Ellos son de México.", "canon nested");
  console.log("content validation done, fails so far:", fails);
}

/* ---------- 2. Play-through simulation ---------- */
function play(lang, mode, level, turns, wrongRate, opts){
  opts = opts || {};
  const dom = boot(lang, opts.tts), w = dom.window, d = w.document, P = w.__pgm;
  const tag = `[${lang} mode ${mode}${opts.tts ? " +audio" : ""}]`;
  P.setup.mode = mode; P.setup.level = level || "A1"; if(opts.island !== undefined) P.setup.island = opts.island;
  d.getElementById("startBtn").click();
  let skips = 0, islTeach = 0, cefrTeach = null, cefrMix = 0;
  const seenGames = {}, levels = new Set(); let overrides = 0, lastGame = "", repeats = 0, events = 0, sails = 0;
  for(let i = 0; i < turns; i++){
    let S = P.S;
    if(dom.errors.length){ fail(tag, "script error", dom.errors[0] && (dom.errors[0].stack || dom.errors[0])); break; }
    if(S.status === "gameover"){ d.getElementById("restartBtn").click(); continue; }
    if(S.status === "conquered"){ sails++; d.getElementById("sailBtn").click(); continue; }
    const c = S.current;
    if(!c || !c.challenge || !c.challenge.target){ fail(tag, "no challenge at turn", i); break; }
    const ch = c.challenge;
    seenGames[ch.game] = (seenGames[ch.game] || 0) + 1; levels.add(S.level);
    if(ch.game === lastGame) repeats++; lastGame = ch.game;
    if(/undefined|NaN|\[object/.test(ch.task + ch.target + c.lesson.title + c.lesson.body + ch.hint)) fail(tag, "bad text", ch.task, ch.target);
    if(mode === 6 && c.plan.kind === "syllabus"){
      const hb = d.getElementById("islHide");
      if(!hb || !d.getElementById("challengeCard").hidden) fail(tag, "no study gate");
      else { hb.click(); if(!d.getElementById("lessonCard").hidden) fail(tag, "phrase still visible"); }
      islTeach = (islTeach || 0) + 1;
    }
    if(mode === 6 && c.plan.kind === "srs" && c.lesson.words.length) fail(tag, "review shows phrase");
    if(d.getElementById("challengeCard").hidden) fail(tag, "challenge card hidden");
    if(mode === 3 && (ch.hint || c.lesson.words.length || ch.game === "Cloze Combat")) fail(tag, "survivor leak", ch.game, ch.hint);
    if((mode === 1 || mode === 2 || mode === 3) && !S.cefr) fail(tag, "game without CEFR flag");
    if((mode === 1 || mode === 2 || mode === 3) && S.syllabus){
      const tl = lang === "en" ? "es" : "en";
      if(S.syllabus.length !== P.COURSE[tl][S.level].length) fail(tag, "syllabus does not cover the level", S.syllabus.length, P.COURSE[tl][S.level].length);
      if(c.plan.kind === "syllabus") cefrTeach = {idx:c.plan.idx, level:S.level};
      if(c.plan.kind === "mix") cefrMix++;
    }
    if(S.event) events++;
    if(ch.game === "Echo Chamber" && d.getElementById("chTarget").textContent.includes(ch.target)) fail(tag, "echo target visible", ch.target);
    if(ch.game === "Echo Chamber" && !opts.tts) fail(tag, "echo without audio");
    if(ch.game === "Echo Chamber" && Math.random() < 0.4){
      const btn = d.querySelector("[data-echoskip]");
      if(!btn){ fail(tag, "no skip button"); break; }
      const a0 = S.stats.answered, hp0 = S.hp, xp0 = S.xp, st0 = S.stats.streak, done0 = JSON.stringify(S.done);
      btn.click();
      const S2 = P.S, c2 = S2.current.challenge;
      if(S2.stats.answered !== a0 || S2.hp !== hp0 || S2.xp !== xp0 || S2.stats.streak !== st0 || JSON.stringify(S2.done) !== done0) fail(tag, "skip changed score");
      if(c2.game === "Echo Chamber" || !c2.target || !c2.acc.length) fail(tag, "skip did not swap", c2.game);
      if(mode === 5 && c2.wk !== ch.wk) fail(tag, "skip changed word", ch.wk, c2.wk);
      if(!!c2.boss !== !!ch.boss) fail(tag, "skip lost boss");
      if(!d.getElementById("chTarget").textContent.includes(c2.target) || d.querySelector("[data-echoskip]")) fail(tag, "skip render", d.getElementById("chTarget").textContent);
      skips = (skips || 0) + 1;
      continue;
    }
    if(ch.game === "Match Madness"){
      const before0 = S.stats.answered, prs = [...d.querySelectorAll("#pairs .pr")];
      if(d.getElementById("pairs").hidden || prs.length < 6 || !d.getElementById("submitBtn").hidden) fail(tag, "pairs ui", prs.length);
      const slips = Math.random() < 0.1 ? 3 : Math.random() < 0.15 ? 2 : Math.random() < 0.3 ? 1 : 0;
      for(let k = 0; k < slips; k++){ const l = prs.find(x => x.dataset.side === "l" && !x.classList.contains("done")), r = prs.find(x => x.dataset.side === "r" && x.dataset.pi !== l.dataset.pi); l.click(); r.click(); }
      for(const l of prs.filter(x => x.dataset.side === "l")){ if(l.classList.contains("done")) continue; l.click(); prs.find(x => x.dataset.side === "r" && x.dataset.pi === l.dataset.pi).click(); }
      if(P.S.stats.answered !== before0 + 1){ fail(tag, "match did not auto-submit"); break; }
      const allow = prs.length / 2 >= 6 ? 2 : 1;
      if(P.S.judgement.correct !== (slips <= allow)) fail(tag, "match verdict", slips, prs.length / 2, P.S.judgement.correct);
      matchSizes.add(ch.pairs.length + "@" + S.level);
      seenGames["Match Madness"] = seenGames["Match Madness"]; continue;
    }
    const good = P.variantsOf(ch);
    const wrong = Math.random() < wrongRate;
    const before = S.stats.answered;
    d.getElementById("answer").value = wrong ? "zzz qqq" : good[Math.floor(Math.random() * good.length)];
    const tilesEl = d.getElementById("tiles"), isTile = ch.game === "Syntax Scramble" || ch.game === "Odd One Out" || ch.game === "Word Duel";
    if(isTile === tilesEl.hidden) fail(tag, "tiles visibility", ch.game);
    if(isTile && !wrong){
      const bare = x => x.toLowerCase().replace(/[.,!?¿¡;:"“”]/g, "");
      const btns = [...tilesEl.querySelectorAll(".tile[data-i]")], used = new Set();
      let seq;
      if(ch.game === "Odd One Out") seq = [ch.wk];
      else if(ch.game === "Word Duel") seq = [ch.acc[0].toLowerCase()];
      else if(ch.k === "w") seq = ch.wk.replace(/^(el|la|los|las|to) /i, "").split("");
      else seq = ch.answerKey.split(" ").map(bare).filter(Boolean);
      d.getElementById("answer").value = "";
      for(const tok of seq){ const b = btns.find((x, i) => !used.has(i) && (ch.k === "w" || ch.game === "Word Duel" ? x.textContent.toLowerCase() === tok.toLowerCase() : bare(x.textContent) === tok)); if(!b){ fail(tag, "tile missing", tok, "|", ch.target); break; } used.add(btns.indexOf(b)); b.click(); }
    }
    if(Math.random() < 0.03) d.getElementById("giveUpBtn").click(); else d.getElementById("submitBtn").click();
    S = P.S;
    if(dom.errors.length){ fail(tag, "script error", dom.errors[0] && (dom.errors[0].stack || dom.errors[0])); break; }
    if(S.stats.answered !== before + 1){ fail(tag, "turn did not advance", ch.game, ch.target); break; }
    const j = S.judgement;
    if(!j){ fail(tag, "no judgement"); break; }
    if(mode !== 3 && cefrTeach && S.level === cefrTeach.level && S.done[cefrTeach.idx]) fail(tag, "taught lesson counted as mastered at once");
    cefrTeach = null;
    if(!wrong && !j.gaveUp && !j.correct) fail(tag, "valid answer rejected:", ch.game, "|", ch.target, "|", d.getElementById("answer").value, "| acc", JSON.stringify(ch.acc));
    if(wrong && j.correct) fail(tag, "garbage accepted", ch.target);
    if(wrong && !j.gaveUp && mode !== 3 && S.status === "playing" && Math.random() < 0.3){
      const btn = d.querySelector('[data-act="override"]');
      if(!btn) fail(tag, "override button missing");
      else { const a = S.stats.answered, c0 = S.stats.correct; btn.click(); overrides++; if(P.S.stats.answered !== a || P.S.stats.correct !== c0 + 1 || !P.S.judgement.correct) fail(tag, "override bookkeeping", a, P.S.stats.answered, c0, P.S.stats.correct); }
    }
  }
  const S = P.S;
  // saved game can be reloaded
  const raw = w.localStorage.getItem("pgm-pb-save");
  if(!raw) fail(tag, "nothing saved"); else JSON.parse(raw);
  if(!(P.profile.correct > 0 && P.profile.streak === 1 && P.profile.xp > 0 && P.profile.answered >= P.profile.correct - overrides)) fail(tag, "profile", JSON.stringify(P.profile));
  if(!/🔥 1/.test(d.getElementById("dailyCard").textContent)) { d.getElementById("menuBtn").click(); if(!/🔥 1/.test(d.getElementById("dailyCard").textContent)) fail(tag, "daily card", d.getElementById("dailyCard").textContent); }
  console.log(tag, "ok; answered", S.stats.answered, "acc", Math.round(100 * S.stats.correct / S.stats.answered) + "%", "xp", S.xp, "levels", [...levels].join(">"), "events", events, "sails", sails, "overrides", overrides, "back-to-back same game", repeats, "echo skips", skips, "isl teach", islTeach, "mix", cefrMix, "games", JSON.stringify(seenGames));
  const out = {S: JSON.parse(JSON.stringify(S)), seenGames, levels};
  w.close();   // each run boots its own page; close it so its timers and DOM can be freed
  return out;
}
for(const lang of ["en", "es"]){
  let r = play(lang, 1, "A1", 400, 0.15);
  if(!r.levels.has("A2")) fail(lang, "practice never reached A2");
  play(lang, 2, "A2", 150, 0.2);
  play(lang, 2, "B2", 400, 0.2);
  play(lang, 5, "B2", 300, 0.1);
  r = play(lang, 1, "B1", 500, 0.1); if(!r.levels.has("B2")) fail(lang, "practice never reached B2");
  play(lang, 2, "B1", 300, 0.2);
  play(lang, 5, "B1", 300, 0.1);
  r = play(lang, 1, "A2", 500, 0.1); if(!r.levels.has("B1")) fail(lang, "practice never reached B1");
  play(lang, 3, "A1", 300, 0.08);
  for(const lv of ["A1", "A2", "B1"]) play(lang, 4, lv, 200, 0.15);
  r = play(lang, 5, "A1", 500, 0.1);
  if(!r.levels.has("A2")) fail(lang, "lexicon never reached A2");
  play(lang, 6, "A2", 200, 0.15, {island: ""});
  play(lang, 6, "A2", 60, 0.15, {island: "food"});
  play(lang, 6, "A2", 80, 0.1, {island: "idioms"});
  play(lang, 6, "A2", 400, 0.1, {island: ""});
  play(lang, 1, "A1", 300, 0.15, {tts: true});
  play(lang, 3, "A1", 200, 0.05, {tts: true});
  play(lang, 5, "A1", 300, 0.1, {tts: true});
  play(lang, 4, "B2", 200, 0.15);
  r = play(lang, 7, "A1", 700, 0.12); if(!r.levels.has("B2")) fail(lang, "conjugation never reached B2");
  play(lang, 7, "B2", 200, 0.12);
  r = play(lang, 8, "A1", 500, 0.12); if(!r.levels.has("B2")) fail(lang, "tricky never reached B2");
  if(!r.seenGames["Word Duel"]) fail(lang, "no word duel");
  r = play(lang, 2, "B2", 60, 0.1);
}
/* ---------- 3. Phrasebook, backup codes, levels ---------- */
{
  const dom = boot("en", true), w = dom.window, d = w.document, P = w.__pgm;
  if(P.LEVELS.join() !== "A1,A2,B1,B2") fail("levels", P.LEVELS);
  if(d.querySelectorAll("#levels .lv").length !== 4 || d.querySelectorAll("#levels .lv:disabled").length) fail("level buttons");
  for(const m of [1,2,4,5]){ d.querySelector(`[data-mode="${m}"]`).click(); if(d.querySelectorAll("#levels .lv:disabled").length) fail("locked level in mode", m); if(d.getElementById("levelNote").textContent.trim() && m !== 2) fail("level note", m); }
  d.querySelector('[data-mode="1"]').click();
  d.getElementById("startBtn").click();
  for(let i = 0, missed = 0; i < 80; i++){
    const ch = P.S.current.challenge;
    if(ch.game === "Match Madness"){ if(missed >= 6) break; d.getElementById("giveUpBtn").click(); continue; }   // need a few misses for the tricky filter
    const wrong = !(i % 4) && ch.k === "s";
    if(wrong) missed++;
    d.getElementById("answer").value = wrong ? "zzz" : P.variantsOf(ch)[0];
    d.getElementById("submitBtn").click();
  }
  if(dom.errors.length) fail("script error", dom.errors[0]);
  const n = P.bankCount();
  if(n < 20) fail("phrasebook count", n);
  d.getElementById("menuBtn").click();
  d.getElementById("bookBtn").click();
  if(d.getElementById("book").hidden || d.getElementById("menu").hidden === false) fail("book screen");
  const rows = d.querySelectorAll("#bookList .bw").length;
  if(rows !== n) fail("book rows", rows, n);
  d.querySelector('[data-bf="tricky"]').click();
  const tricky = d.querySelectorAll("#bookList .bw").length;
  if(!(tricky > 0 && tricky < rows)) fail("tricky filter", tricky, rows);
  const first = d.querySelector("#bookList .bw b").textContent;
  d.querySelector('[data-bf="all"]').click();
  const sb = d.getElementById("bookSearch"); sb.value = first; sb.dispatchEvent(new w.Event("input"));
  if(!d.querySelectorAll("#bookList .bw").length) fail("search");
  const sp0 = w.__spoken.length; d.querySelector("#bookList .bw").click(); if(w.__spoken.length <= sp0) fail("book listen");
  d.getElementById("bookBack").click();
  if(d.getElementById("menu").hidden) fail("back to menu");
  // backup round trip
  d.getElementById("exportBtn").click();
  const code = d.getElementById("backupCode").value;
  if(!code.startsWith("PGM1:")) fail("export code");
  const xp = P.profile.xp, ans = P.S.stats.answered;
  const dom2 = boot("es"), d2 = dom2.window.document, P2 = dom2.window.__pgm;
  d2.getElementById("backupCode").value = "garbage";
  d2.getElementById("importBtn").click();
  if(!/no funcionó|did not work/.test(d2.getElementById("backupMsg").textContent)) fail("bad code message", d2.getElementById("backupMsg").textContent);
  d2.getElementById("backupCode").value = code;
  d2.getElementById("importBtn").click();
  if(P2.profile.xp !== xp || P2.bankCount() !== n || !P2.S || P2.S.stats.answered !== ans) fail("import", P2.profile.xp, xp, P2.bankCount(), n);
  if(d2.getElementById("continueBtn").hidden) fail("continue after import");
  d2.getElementById("continueBtn").click();
  if(dom2.errors.length) fail("script error after import", dom2.errors[0]);
  if(!P2.S.current) fail("no challenge after import");
  if(d2.documentElement.lang !== "en") fail("ui lang not restored", d2.documentElement.lang);
  console.log("phrasebook", n, "tricky", tricky, "backup code length", code.length);
}
/* ---------- 7. Daily challenge, mistakes, stats ---------- */
{
  const dom = boot("en"), w = dom.window, d = w.document, P = w.__pgm;
  // play a few rounds with deliberate misses to fill the mistakes list
  d.getElementById("startBtn").click();
  for(let i = 0; i < 30; i++){ const ch = P.S.current.challenge; d.getElementById("answer").value = i % 3 ? P.variantsOf(ch)[0] : "zzz"; d.getElementById("submitBtn").click(); }
  const m0 = P.profile.mistakes.length;
  if(m0 < 5) fail("mistakes not recorded", m0);
  d.getElementById("menuBtn").click();
  if(!/\d/.test(d.getElementById("mistakesBtn").textContent)) fail("mistakes count on button", d.getElementById("mistakesBtn").textContent);
  // fix mistakes session: answer all correctly
  d.getElementById("mistakesBtn").click();
  if(d.getElementById("quiz").hidden) fail("quiz screen");
  let n = 0;
  while(!d.getElementById("quizCard").hidden && n < 20){
    const it = P.Q.items[P.Q.i];
    d.getElementById("quizAnswer").value = P.variantsOf(it.ch)[0];
    d.getElementById("quizSubmit").click();
    if(!/✓/.test(d.getElementById("quizVerdict").textContent)) fail("mistake review rejected right answer", it.ch.game, it.ch.target);
    d.getElementById("quizNext").click(); n++;
  }
  if(P.profile.mistakes.length !== m0 - Math.min(10, m0)) fail("mistakes not cleared", P.profile.mistakes.length, m0);
  d.getElementById("quizHome").click();
  // daily challenge: deterministic, then play it
  const a = P.buildDaily(), b = P.buildDaily();
  if(a.length < 9) fail("daily too short", a.length);
  if(JSON.stringify(a.map(x => x.ch.target)) !== JSON.stringify(b.map(x => x.ch.target))) fail("daily not deterministic");
  for(const lv of ["A1","A2","B1","B2"]) for(const tg of ["Spanish","English"]){ P.setup.level = lv; P.setup.target = tg; P.setup.native = tg === "Spanish" ? "English" : "Spanish"; const x = P.buildDaily(); if(x.length < 9 || x.some(q => !q.ch.target || !q.ch.acc.length)) fail("daily build", lv, tg, x.length); }
  P.setup.level = "A1"; P.setup.target = "Spanish"; P.setup.native = "English";
  d.getElementById("dailyBtn").click();
  let k = 0;
  while(!d.getElementById("quizCard").hidden && k < 15){
    const it = P.Q.items[P.Q.i];
    if(k === 2){ d.getElementById("quizSkip").click(); }
    else {
      if(it.ch.game === "Word Duel"){ const btn = [...d.querySelectorAll("#quizOpts [data-qo]")].find(x => x.dataset.qo.toLowerCase() === it.ch.acc[0].toLowerCase()); if(!btn) fail("duel option missing"); else btn.click(); }
      else d.getElementById("quizAnswer").value = P.variantsOf(it.ch)[0];
      d.getElementById("quizSubmit").click();
    }
    d.getElementById("quizNext").click(); k++;
  }
  if(d.getElementById("quizDone").hidden) fail("daily did not finish");
  const share = d.getElementById("shareText").value;
  if(!/🟥/.test(share) || !/\d\/\d+/.test(share)) fail("share text", share);
  if(P.profile.dailyCount !== 1) fail("daily count");
  d.getElementById("quizHome").click();
  if(!/✓/.test(d.getElementById("dailyBtn").textContent)) fail("daily done mark");
  d.getElementById("dailyBtn").click();
  if(d.getElementById("quizDone").hidden || d.getElementById("shareText").value !== share) fail("daily replay should show result");
  d.getElementById("quizBack").click();
  // stats
  d.getElementById("statsBtn").click();
  if(d.getElementById("statsPage").hidden) fail("stats page");
  if(d.querySelectorAll("#stChart .stcol").length !== 14) fail("chart cols");
  if(!d.querySelectorAll("#stModes .strow").length) fail("mode rows");
  if(!/\d/.test(d.getElementById("stTiles").textContent)) fail("stat tiles");
  d.getElementById("statsBack").click();
  if(d.getElementById("menu").hidden) fail("back from stats");
  if(dom.errors.length) fail("script error", dom.errors[0]);
  console.log("daily/mistakes/stats ok; daily share:\n" + share);
}
console.log("match board sizes seen:", [...matchSizes].sort().join(" "));
if(![...matchSizes].some(x => +x.split("@")[0] > 4)) fail("match madness never grew past 4 rows");
/* ---------- 6. Tricky pairs content ---------- */
{
  const P = boot("en").window.__pgm;
  const mk = (acc, al) => ({acc, al, k:"s", game:"", answerKey:"", cw:[]});
  let n = 0;
  for(const tgt of ["es","en"]){
    const nat = tgt === "es" ? "en" : "es", st = {native: nat === "en" ? "English" : "Spanish", mode: 8};
    for(const lv in P.TRICKY[tgt]) for(const c of P.TRICKY[tgt][lv]) for(const it of c.it){
      n++;
      const T = P.canon(it[1]), N = P.canon(it[0]);
      if(/[\[\]{}()|]/.test(N + T)) fail("tricky pattern chars", T);
      if(!P.gradeLocal(st, mk([it[1]], tgt), T).correct) fail("tricky target rejected", T);
      if(!P.blank(T, it[2])) fail("tricky cloze missing", it[2], "|", T);
      const opts = it[4] || c.o;
      if(!opts) fail("tricky no options", T);
      else {
        const cl = Object.assign(mk([it[2], it[1]], tgt), {game: "Word Duel", answerKey: T});
        if(!P.gradeLocal(st, cl, it[2]).correct) fail("tricky cloze rejected", it[2], T);
        for(const o of opts) if(o.toLowerCase() !== it[2].toLowerCase() && P.gradeLocal(st, cl, o).correct) fail("tricky wrong option accepted", o, "for", it[2], "|", T);
      }
      if(it[3] && P.gradeLocal(st, mk([it[1]], tgt), it[3]).correct) fail("tricky planted error accepted", it[3], "|", T);
    }
  }
  console.log("tricky items checked", n);
}
/* ---------- 5. Conjugation engine ---------- */
{
  const P = boot("en").window.__pgm;
  const ES = {
    "pres hablar 3":"hablamos","pres tener 0":"tengo","pres tener 1":"tienes","pres jugar 2":"juega","pres pedir 3":"pedimos","pres decir 0":"digo",
    "pres dormir 2":"duerme","pres saber 0":"sé","pres conocer 0":"conozco","pres venir 3":"venimos","pres empezar 4":"empiezan","pres ir 3":"vamos","pres vivir 3":"vivimos",
    "pret buscar 0":"busqué","pret empezar 0":"empecé","pret jugar 0":"jugué","pret pedir 2":"pidió","pret dormir 4":"durmieron","pret hacer 2":"hizo","pret decir 4":"dijeron",
    "pret leer 2":"leyó","pret tener 0":"tuve","pret querer 3":"quisimos","pret comer 2":"comió","pret hablar 4":"hablaron","pret estar 1":"estuviste","pret dar 2":"dio","pret ver 0":"vi","pret traer 4":"trajeron","pret venir 2":"vino",
    "impf ser 3":"éramos","impf ir 0":"iba","impf ver 2":"veía","impf hablar 3":"hablábamos","impf vivir 4":"vivían",
    "fut tener 0":"tendré","fut decir 3":"diremos","fut hacer 4":"harán","fut hablar 2":"hablará","fut ir 1":"irás","cond poder 1":"podrías","cond salir 3":"saldríamos","cond querer 0":"querría",
    "subj tener 3":"tengamos","subj dormir 3":"durmamos","subj pedir 0":"pida","subj empezar 0":"empiece","subj empezar 3":"empecemos","subj jugar 1":"juegues","subj buscar 4":"busquen",
    "subj conocer 2":"conozca","subj ser 0":"sea","subj dar 0":"dé","subj querer 3":"queramos","subj volver 0":"vuelva","subj pensar 3":"pensemos","subj venir 3":"vengamos","subj saber 4":"sepan","subj estar 1":"estés","subj ir 3":"vayamos","subj hablar 2":"hable","subj vivir 1":"vivas",
    "impSubj hablar 3":"habláramos","impSubj tener 0":"tuviera","impSubj ser 3":"fuéramos","impSubj dormir 2":"durmiera","impSubj leer 0":"leyera","impSubj decir 4":"dijeran","impSubj comer 3":"comiéramos","impSubj pedir 1":"pidieras",
    "perf hacer 2":"ha hecho","perf volver 3":"hemos vuelto","perf escribir 0":"he escrito","plup ver 4":"habían visto","futPerf decir 0":"habré dicho","condPerf hacer 3":"habríamos hecho",
    "perfSubj llegar 1":"hayas llegado","plupSubj saber 3":"hubiéramos sabido","prog leer 0":"estoy leyendo","prog dormir 2":"está durmiendo","prog pedir 1":"estás pidiendo","prog decir 4":"están diciendo","pastProg hablar 3":"estábamos hablando"
  };
  for(const k in ES){ const [t, v, p] = k.split(" "); const got = P.esForm(v, t, +p)[0]; if(got !== ES[k]) fail("es conj", k, got, "expected", ES[k]); }
  const EN = {
    "pres study 2 she":["studies"],"presNeg have 2 he":["does not have"],"presQ work 2 she":["does she work"],"past travel 0 I":["traveled","travelled"],
    "presPerf get 2 she":["has gotten","has got"],"prog run 0 I":["am running"],"bePast be 1 you":["were"],"futPerf write 4 they":["will have written"],
    "pastQ go 1 you":["did you go"],"pres go 2 he":["goes"],"past swim 3 we":["swam"],"presPerf swim 3 we":["have swum"],"pastPerfProg wait 2 she":["had been waiting"],"bePres be 0 I":["am"]
  };
  for(const k in EN){ const [t, v, p, pr] = k.split(" "); const got = P.enForm(v, t, +p, pr); if(JSON.stringify(got) !== JSON.stringify(EN[k])) fail("en conj", k, got, "expected", EN[k]); }
  // every syllabus combination produces non-empty forms
  for(const tgt of ["es","en"]) for(const lv in P.CONJ[tgt]) for(const c of P.CONJ[tgt][lv]){
    if(!c.vb.every(v => tgt === "es" ? P.ESV[v] : P.ENV[v])) fail("unknown verb in", c.t, c.vb.filter(v => !(tgt === "es" ? P.ESV[v] : P.ENV[v])));
    for(const v of c.vb) for(const t of c.ten){ if(tgt === "en" && (v === "be") !== /^be[A-Z]/.test(t)) continue;
      for(const p of (c.ps || [0,1,2,3,4])){ const f = tgt === "es" ? P.esForm(v, t, p) : P.enForm(v, t, p, "she"); if(!f.length || f.some(x => !x || /undefined/.test(x))) fail("bad form", tgt, v, t, p, f); } }
  }
  console.log("conjugation engine checked");
}
/* ---------- 4. Voice choice ---------- */
{
  const V = [
    {name:"eSpeak Spanish", lang:"es", voiceURI:"espeak-es", localService:true, default:true},
    {name:"Microsoft Helena - Spanish (Spain)", lang:"es-ES", voiceURI:"helena", localService:true},
    {name:"Microsoft Dalia Online (Natural) - Spanish (Mexico)", lang:"es-MX", voiceURI:"dalia", localService:false},
    {name:"Google español", lang:"es-ES", voiceURI:"google-es", localService:false},
    {name:"Microsoft David - English (United States)", lang:"en-US", voiceURI:"david", localService:true},
    {name:"Google US English", lang:"en-US", voiceURI:"google-en", localService:false},
    {name:"Samantha (Enhanced)", lang:"en_US", voiceURI:"sam-enh", localService:true}
  ];
  const dom = boot("en", V), w = dom.window, d = w.document, P = w.__pgm;
  if(P.bestVoice("es").voiceURI !== "dalia") fail("best es voice", P.bestVoice("es").name);
  if(P.bestVoice("en-US").voiceURI !== "sam-enh") fail("best en voice", P.bestVoice("en-US").name);
  if(d.getElementById("voiceRow").hidden) fail("voice row hidden");
  const sel = d.getElementById("voice-es");
  if(sel.options.length !== 5 || !/Dalia/.test(sel.options[0].textContent) || !/⭐/.test(sel.options[1].textContent)) fail("voice options", [...sel.options].map(o => o.textContent));
  sel.value = "google-es"; sel.dispatchEvent(new w.Event("change", {bubbles: true}));
  if(P.bestVoice("es").voiceURI !== "google-es") fail("chosen voice not used");
  if(w.__voices.slice(-1)[0] !== "Google español") fail("test playback voice", w.__voices);
  d.querySelector('[data-vtest="en"]').click();
  if(w.__voices.slice(-1)[0] !== "Samantha (Enhanced)") fail("en test voice", w.__voices.slice(-1));
  d.getElementById("startBtn").click();
  d.querySelector('[data-say="challenge"]') && d.querySelector('[data-say="challenge"]').click();
  if(!w.__voices.slice(-1)[0]) fail("narrator used no voice");
  sel.value = ""; sel.dispatchEvent(new w.Event("change", {bubbles: true}));
  if(P.bestVoice("es").voiceURI !== "dalia") fail("auto reset");
  if(dom.errors.length) fail("script error", dom.errors[0]);
  console.log("voices ok");
}
console.log(fails ? `\n${fails} FAILURES` : "\nALL TESTS PASSED");
process.exit(fails ? 1 : 0);
