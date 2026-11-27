/* The new languages in every mode: content checks (planted mistakes, romanization, stories, islands,
   number words, verb forms) and a short game in every mode and level for French, Portuguese,
   Mandarin and Arabic. */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
const errs = [];
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:(o,k) => () => ({addColorStop(){}})}); w.addEventListener("error", e => errs.push(e.message + " " + (e.error && e.error.stack || "").split("\n").slice(0,3).join(" | "))); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id), P = w.__pgm;
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await sleep(300);
  if(errs.length) fail("load errors", errs.splice(0).join(" // "));
  const X = w.__xlm, WL = X.WL, STORIES = X.STORIES, ISLANDS = X.ISLANDS, TRICKY = X.TRICKY, CONJ = X.CONJ;
  const st = {native:"English", mode:1};
  /* ---------- planted mistakes and romanization ---------- */
  for(const code of ["fr","pt","zh","ar"]){
    const units = WL[code].units.filter(u => u.lv === "B1" || u.lv === "B2");
    if(units.filter(u => u.lv === "B1").length < 8) fail(code, "B1 units", units.length);
    for(const u of units) for(const s of u.s){
      const [en, tgt, rom, wrong] = s;
      if(!wrong) { fail(code, u.lv, "sentence without a planted mistake", tgt); continue; }
      const ch = {game:"Classic Mine", al:code, k:"s", acc:[tgt + (rom ? "|" + rom : "")], answerKey:P.canon(tgt), target:en, cw:[], why:""};
      if(P.gradeLocal(st, ch, wrong, false).correct) fail(code, "planted mistake is accepted as right", wrong);
      if(!P.gradeLocal(st, ch, P.canon(tgt), false).correct) fail(code, "right answer rejected", tgt);
      if(rom && P.canon(tgt).split(" ").length !== rom.split(/ +/).length) fail(code, "romanization needs one entry per word", tgt, "|", rom);
    }
    const items = [];
    for(const lv in WL[code].tricky) for(const c of WL[code].tricky[lv]) items.push(...c.it.map(x => [c.t, x]));
    if(code === "zh") for(const lv in WL.zh.measure) for(const c of WL.zh.measure[lv]) items.push(...c.it.map(x => [c.t, x]));
    if(items.length < 25) fail(code, "too few tricky items", items.length);
    for(const [t, [en, tgt, cz, wrong, opts, rom]] of items){
      if(!P.blank(P.canon(tgt), cz)) fail(code, t, "cloze word not in the sentence", cz, "|", tgt);
      if(!wrong || P.canon(wrong) === P.canon(tgt)) fail(code, t, "missing mistake", tgt);
      if((code === "zh" || code === "ar") && (!rom || tgt.split(" ").length !== rom.split(/ +/).length)) fail(code, t, "romanization per word", tgt, "|", rom);
    }
    if(!TRICKY[code] || !TRICKY[code].A1 || !TRICKY[code].A2) fail(code, "Tricky Pairs not loaded");
    if(!CONJ[code] || !CONJ[code].A1) fail(code, "mode 7 content not loaded");
    /* stories */
    const ss = STORIES.filter(s => s.lang === code);
    if(ss.length < 2) fail(code, "stories", ss.length);
    for(const s of ss){
      if(!s.t[code] || !s.t.en) fail(code, s.id, "story title");
      let q = 0;
      for(const p of s.p){
        if(p.q){ q++; if(!p.q.en || p.o.length < 3 || p.o.some(o => !o[code] || !o.en) || !(p.a >= 0 && p.a < p.o.length)) fail(code, s.id, "story question", JSON.stringify(p).slice(0, 80)); }
        else { if(!p[code] || !p.en) fail(code, s.id, "story line", JSON.stringify(p).slice(0, 80)); if((code === "zh" || code === "ar") && !p.r) fail(code, s.id, "story line without romanization"); }
      }
      if(q < 3) fail(code, s.id, "story needs 3 questions");
    }
    /* islands */
    const isl = ISLANDS.filter(i => i.lang === code);
    if(isl.length < 5) fail(code, "islands", isl.length);
    for(const i of isl){ if(i.it.length < 12) fail(code, i.id, "island too small", i.it.length); for(const it of i.it) if(!P.blank(P.canon(it[1]), it[3])) fail(code, i.id, "island cloze", it[3], "|", it[1]); }
  }
  /* ---------- number words and verb forms ---------- */
  const eq = (a, b, what) => { if(a !== b) fail(what, JSON.stringify(a), "≠", JSON.stringify(b)); };
  eq(X.frNum(71), "soixante et onze", "fr 71"); eq(X.frNum(80), "quatre-vingts", "fr 80"); eq(X.frNum(91), "quatre-vingt-onze", "fr 91");
  eq(X.frNum(200), "deux cents", "fr 200"); eq(X.frNum(201), "deux cent un", "fr 201"); eq(X.frNum(80000), "quatre-vingt mille", "fr 80000");
  eq(X.ptNum(16), "dezesseis", "pt 16"); eq(X.ptNum(100), "cem", "pt 100"); eq(X.ptNum(101), "cento e um", "pt 101"); eq(X.ptNum(1100), "mil e cem", "pt 1100");
  eq(X.zhNum(11), "十一", "zh 11"); eq(X.zhNum(105), "一百零五", "zh 105"); eq(X.zhNum(110), "一百一十", "zh 110"); eq(X.zhNum(1005, true), "一千零五", "zh 1005");
  eq(X.arNum(25)[0], "خمسة وعشرون", "ar 25"); eq(X.arNum(12)[0], "اثنا عشر", "ar 12"); eq(X.arNum(3000)[0], "ثلاثة آلاف", "ar 3000");
  if(!X.xlNumWords("fr", 75).includes("septante-cinq")) fail("fr Belgian 75");
  if(!X.xlNumWords("zh", 7).includes("qī")) fail("zh pinyin accepted");
  eq(X.frForm("aller", "pc", 3)[0], "est allée", "fr elle est allée"); eq(X.frForm("manger", "pres", 4)[0], "mangeons", "fr mangeons"); eq(X.frForm("manger", "imp", 4)[0], "mangions", "fr mangions");
  eq(X.frForm("être", "fut", 0)[0], "serai", "fr serai"); eq(X.ptForm("chegar", "pp", 0)[0], "cheguei", "pt cheguei"); eq(X.ptForm("ser", "pp", 0)[0], "fui", "pt fui");
  eq(X.arForm("كتب", "past", 6)[0], "كتبوا", "ar katabū"); eq(X.arForm("كتب", "pres", 2)[0], "تكتبين", "ar taktubīn"); eq(X.arForm("ذهب", "fut", 0)[0], "سأذهب", "ar sa-adhhab");
  /* ---------- play every mode and level ---------- */
  const seen = {};
  for(const tgt of ["French","Portuguese","Mandarin Chinese","Arabic"]){
    for(const mode of [1,2,3,4,5,6,7,8,9]){
      d.querySelector(`#modes [data-mode="${mode}"]`).click();
      P.setup.target = tgt; P.setup.native = "English"; $("targetSel").value = tgt; P.setup.mode = mode;
      X.renderMenu();
      if(d.querySelector(`#modes [data-mode="${mode}"]`).disabled) fail(tgt, "mode", mode, "is disabled");
      const lvls = mode === 3 || mode === 6 || mode === 9 ? [null] : X.levelsFor(mode, tgt);
      for(const lv of lvls){
        if(lv) P.setup.level = lv;
        try{ P.startNew(); }catch(e){ fail(tgt, mode, lv, "start", e.message); continue; }
        if(P.S.target !== tgt) fail(tgt, mode, "wrong target", P.S.target);
        for(let i = 0; i < 14; i++){
          const S = P.S; if(!S || S.status !== "playing") break;
          if($("islHide") && !$("islHide").hidden) $("islHide").click();
          const ch = S.current.challenge, k = tgt.slice(0, 2) + mode + " " + ch.game; seen[k] = (seen[k] || 0) + 1;
          if(ch.k === "p"){ $("giveUpBtn").click(); continue; }
          const ans = Array.isArray(ch.opts) ? ch.opts.filter(o => P.gradeLocal(S, ch, o, false).correct) : [P.variantsOf(ch)[0]];
          if(Array.isArray(ch.opts) && ans.length !== 1) fail(k, "options need exactly one right answer", JSON.stringify(ch.opts));
          if(ch.game === "Right or Wrong" && !/“|«/.test(ch.task)) fail(k, "Right or Wrong should show the meaning", ch.task);
          if(ch.game === "Verb Forge" && /undefined/.test(ch.target)) fail(k, "bad label", ch.target);
          if(/undefined|NaN/.test(ch.target + ch.answerKey)) fail(k, "undefined in challenge", ch.target, ch.answerKey);
          const a0 = S.stats.answered;
          $("answer").value = ans[0] || "x"; $("submitBtn").click();
          if(P.S.stats.answered !== a0 + 1){ fail(k, "turn did not advance"); break; }
          if(ans[0] && !P.S.judgement.correct) fail(k, "right answer rejected", ch.target, "|", ans[0]);
          if(errs.length){ fail(k, "script error", errs.splice(0).join(" // ")); break; }
        }
      }
    }
  }
  for(const k of ["Fr4 Clock Watcher","Ma4 Digit Dictation","Ar7 Verb Forge","Po7 Time Machine","Fr8 Word Duel","Ma7 Word Duel","Ar5 Classic Mine","Po6 Classic Mine"]) if(!seen[k] && !seen[k.replace(/ .*/, " Quick Pick")]) fail("never played", k);
  // the same modes with the Multiple choice answer mode on
  w.__mc.setMC(true);
  for(const tgt of ["French","Portuguese","Mandarin Chinese","Arabic"]) for(const mode of [4,5,6,7,8]){
    d.querySelector(`#modes [data-mode="${mode}"]`).click();
    P.setup.target = tgt; P.setup.native = "English"; $("targetSel").value = tgt; P.setup.mode = mode; P.setup.level = "A1";
    P.startNew();
    for(let i = 0; i < 10; i++){
      const S = P.S; if(!S || S.status !== "playing") break;
      if($("islHide") && !$("islHide").hidden) $("islHide").click();
      const ch = S.current.challenge;
      if(ch.k === "p"){ $("giveUpBtn").click(); continue; }
      const ans = Array.isArray(ch.opts) ? ch.opts.filter(o => P.gradeLocal(S, ch, o, false).correct) : [P.variantsOf(ch)[0]];
      if(Array.isArray(ch.opts) && ans.length !== 1) fail("MC", tgt, mode, ch.game, "one right option", JSON.stringify(ch.opts));
      $("answer").value = ans[0] || "x"; $("submitBtn").click();
      if(errs.length){ fail("MC", tgt, mode, "script error", errs.splice(0).join(" // ")); break; }
    }
  }
  w.__mc.setMC(false);
  // Mandarin's mode 7 card is about measure words
  P.setup.target = "Mandarin Chinese"; $("targetSel").value = "Mandarin Chinese"; X.renderMenu();
  if(!/Measure/.test(d.querySelector('#modes [data-mode="7"]').textContent)) fail("Mandarin mode 7 label");
  console.log(fails ? fails + " failures" : "new languages ok: " + Object.keys(seen).length + " mode/game pairs played");
  process.exit(fails ? 1 : 0);
})();
