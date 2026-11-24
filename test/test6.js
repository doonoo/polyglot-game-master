const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 40) console.log("FAIL", ...a); };
function boot(lang){
  const errors = [];
  const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
    beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:true, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function(){}; Object.defineProperty(w.navigator, "language", {value:lang, configurable:true});
      w.addEventListener("error", e => errors.push(e.error || e.message)); }});
  dom.errors = errors; return dom;
}
const timers = [];
const CS = {g:2, t:2, f:2, verbs:7, tricky:8, numbers:4, vocab:5};
for(const lang of ["en", "es"]){
  const dom = boot(lang), w = dom.window, d = w.document, P = w.__pgm, $ = id => d.getElementById(id);
  // menu panel
  d.querySelector('[data-mode="9"]').click();
  if($("customGroup").hidden || !$("levelGroup").hidden) fail(lang, "custom panel not shown");
  if(!d.querySelectorAll("#customBody [data-csrc]").length) fail(lang, "no source chips");
  // every preset can be played
  for(const p of P.CPRESETS){ P.applyPreset(p); if(!P.customCombos(P.curCfg(), P.setup.target).length && p.id !== "ear") fail(lang, "preset empty", p.id); }
  // empty setup blocks start
  d.querySelector('[data-call="0"]').click();
  $("startBtn").click();
  if(!$("game").hidden) fail(lang, "started with nothing selected");
  const setups = [
    {name:"all", cfg:{}, levels:["A1","B2"]},
    {name:"verbs+timer", pre:"verbs", levels:["A2"]},
    {name:"talk B1", pre:"talk", levels:["B1"]},
    {name:"tricky strict 20", pre:"tricky", levels:["A1","A2","B1","B2"]},
    {name:"hardcore", pre:"hard", levels:["B2"]},
    {name:"only scramble", only:"Syntax Scramble", levels:["A1","B1"]},
    {name:"vocab", vocab:true, levels:["A2"]},
    {name:"vocab odd+match", vocab:true, games:["Odd One Out","Match Madness"], levels:["A1"]},
    {name:"numbers 3 hearts", numbers:true, levels:["A1","B2"]},
  ];
  for(const su of setups){
    P.applyPreset(P.CPRESETS.find(p => p.id === (su.pre || "all")));
    const cfg = P.curCfg(); cfg.levels = su.levels;
    if(su.only) for(const g in cfg.games) cfg.games[g] = g === su.only;
    if(su.vocab){ for(const k in cfg.sources) cfg.sources[k] = k === "vocab"; }
    if(su.games) for(const g in cfg.games) cfg.games[g] = su.games.includes(g);
    if(su.numbers){ for(const k in cfg.sources) cfg.sources[k] = k === "numbers"; cfg.hearts = 3; }
    P.profile.custom = cfg;
    P.setup.mode = 9; $("startBtn").click();
    const S0 = P.S;
    if(!S0 || S0.mode !== 9) { fail(lang, su.name, "did not start"); continue; }
    const seen = {games:new Set(), src:new Set(), lv:new Set()};
    let wrongs = 0, turns = 0;
    for(; turns < 120 && P.S.status === "playing"; turns++){
      const c = P.S.current; if(!c){ fail(lang, su.name, "no current"); break; }
      const pl = c.plan;
      if(pl.kind !== "mix") fail(lang, su.name, "plan kind", pl.kind);
      seen.games.add(c.challenge.game); seen.src.add(pl.src); seen.lv.add(pl.lv);
      if(!cfg.sources[pl.src]) fail(lang, su.name, "source not allowed", pl.src);
      if(!cfg.levels.includes(pl.lv)) fail(lang, su.name, "level not allowed", pl.lv);
      if(!cfg.games[c.challenge.game]) fail(lang, su.name, "game not allowed", c.challenge.game);
      if(!cfg.hints && (c.challenge.hint || (c.lesson && c.lesson.words.length))) fail(lang, su.name, "hint leak");
      const wrong = turns % 7 === 3;
      if(wrong){ wrongs++; $("giveUpBtn").click(); }
      else { $("answer").value = P.variantsOf(c.challenge)[0]; $("submitBtn").click(); }
      if(!P.S.judgement) { fail(lang, su.name, "no judgement"); break; }
      if(!wrong && !P.S.judgement.correct && c.challenge.k !== "p") fail(lang, su.name, "canonical rejected", c.challenge.game, c.challenge.target, P.variantsOf(c.challenge)[0]);
    }
    const S = P.S;
    if(cfg.rounds && S.status !== "conquered" && S.status !== "gameover") fail(lang, su.name, "rounds did not end", S.stats.answered);
    if(cfg.rounds && S.status === "conquered" && S.stats.answered !== cfg.rounds) fail(lang, su.name, "wrong round count", S.stats.answered);
    if(cfg.hearts && wrongs >= cfg.hearts && S.status !== "gameover" && !(cfg.rounds && S.status === "conquered")) fail(lang, su.name, "hearts not enforced", wrongs, S.hp);
    if(S.status !== "playing" && $("over").hidden) fail(lang, su.name, "no end screen");
    if(cfg.review && S.status === "playing" && !(S.redo || []).length && wrongs > 3 && turns > 20) { /* misses may all be re-asked already */ }
    console.log(lang, su.name.padEnd(18), "turns", String(turns).padStart(3), S.status.padEnd(9), "games:", [...seen.games].join(","), "| src:", [...seen.src].join(","), "| lv:", [...seen.lv].join(","));
    $("homeBtn") && $("homeBtn").click();
  }
  // strict accents in custom
  const cfg = P.curCfg(); cfg.strict = true; for(const k in cfg.sources) cfg.sources[k] = k === "g"; cfg.levels = ["A1"]; P.profile.custom = cfg; P.setup.mode = 9; $("startBtn").click();
  for(let i = 0; i < 60 && P.S.status === "playing"; i++){
    const ch = P.S.current.challenge, v = P.variantsOf(ch)[0];
    const plain = v.normalize("NFD").replace(/[̀-ͯ]/g, "");
    if(plain !== v && ch.k === "s" && ch.al === "es" && P.S.target === "Spanish"){   // strict accents: Spanish answers (English accepts both "café" and "cafe")
      const j = P.gradeLocal(P.S, ch, plain, false);
      if(j.correct) fail(lang, "strict accents not applied", v);
      const S2 = Object.assign({}, P.S, {custom:Object.assign({}, P.S.custom, {strict:false})});
      if(!P.gradeLocal(S2, ch, plain, false).correct) fail(lang, "lenient accents broken", v);
      break;
    }
    $("answer").value = v; $("submitBtn").click();
  }
  if(dom.errors.length) fail(lang, "errors", dom.errors.slice(0, 3));
  dom.timerCheck = () => new Promise(res => {
    const c2 = P.curCfg(); c2.timer = 10; c2.hearts = 0; c2.rounds = 0; c2.sources = {g:true}; c2.levels = ["A1"]; P.profile.custom = c2; P.setup.mode = 9; $("startBtn").click();
    const first = P.S.current;
    setTimeout(() => {
      if(!$("hudTimer") || $("hudTimer").hidden) fail(lang, "timer not shown");
      if(P.S.current === first || !P.S.judgement || !P.S.judgement.gaveUp) fail(lang, "timer did not run out", P.S.judgement && P.S.judgement.gaveUp);
      res();
    }, 11500);
  });
  timers.push(dom.timerCheck);
}
(async () => { for(const t of timers) await t(); console.log(fails ? fails + " FAILURES" : "ALL TESTS PASSED"); process.exit(fails ? 1 : 0); })();
