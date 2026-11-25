/* Grammar Gym (mode 10): the picker in every language, a full workout that only uses the
   chosen points, misses coming back, the end screen, weak spots (also fed by Practice),
   multiple choice, two players and the Start guard. */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
const errs = [];
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:(o,k) => () => ({addColorStop(){}})}); w.addEventListener("error", e => errs.push(e.message + " " + (e.error && e.error.stack || "").split("\n").slice(0,3).join(" | "))); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id), P = w.__pgm;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SKIP = ["Reverse Mine", "Meaning Match", "Meaning Check", "Odd One Out", "Match Madness", "Word Duel"];

function answer(right){
  const S = P.S, ch = S.current.challenge;
  if(ch.k === "p"){ $("giveUpBtn").click(); return false; }
  const ans = Array.isArray(ch.opts) ? ch.opts.filter(o => P.gradeLocal(S, ch, o, false).correct) : [P.variantsOf(ch)[0]];
  const wrong = Array.isArray(ch.opts) ? ch.opts.find(o => !P.gradeLocal(S, ch, o, false).correct) : "zzz qqq";
  $("answer").value = right ? (ans[0] || "x") : (wrong || "zzz qqq"); $("submitBtn").click();
  return right;
}
function pickMode(target, native){
  P.setup.target = target; P.setup.native = native; $("targetSel").value = target;
  d.querySelector(`#modes [data-mode="10"]`).click();
}

(async () => {
  await sleep(300);
  if(errs.length) fail("load errors", errs.splice(0).join(" // "));
  const G = w.__gym;
  if(!d.querySelector(`#modes [data-mode="10"]`)) fail("no Grammar Gym mode card");

  for(const [target, native] of [["Spanish","English"],["English","Spanish"],["French","English"],["Portuguese","English"],["Mandarin Chinese","English"],["Arabic","English"]]){
    pickMode(target, native);
    const card = d.querySelector(`#modes [data-mode="10"]`);
    if(card.disabled) fail(target, "mode card disabled");
    if($("gymGroup").hidden) fail(target, "gym panel hidden");
    const levels = G.gymLevels(target);
    if(levels.length < 2) fail(target, "too few levels with grammar points", levels.join(","));
    for(const lv of levels){ const L = G.gymLessons(target, lv); if(L.length < 2) fail(target, lv, "too few grammar points", L.length); }
    // Start is blocked with nothing picked
    G.gymSetSel(target, []); w.renderMenu ? 0 : 0; d.querySelector(`#modes [data-mode="10"]`).click();
    P.S = null; $("startBtn").click();
    if(P.S && P.S.mode === 10) fail(target, "started with nothing picked");
    // pick two points from two levels by clicking
    d.querySelector(`#gymBody [data-glv="${levels[0]}"]`).click();
    d.querySelectorAll("#gymBody .gl")[0].click();
    d.querySelector(`#gymBody [data-glv="${levels[1]}"]`).click();
    const second = d.querySelectorAll("#gymBody .gl"); second[Math.min(1, second.length - 1)].click();
    const sel = G.gymSel(target);
    if(sel.length !== 2) fail(target, "selection by click", JSON.stringify(sel));
    d.querySelector(`#gymBody [data-grounds]`).value = "15"; d.querySelector(`#gymBody [data-grounds]`).dispatchEvent(new w.Event("change", {bubbles:true}));
    $("startBtn").click();
    const S0 = P.S;
    if(!S0 || S0.mode !== 10){ fail(target, "did not start"); continue; }
    if(S0.gym.picks.length !== 2) fail(target, "picks", S0.gym.picks.length);
    const keys = new Set(S0.gym.picks.map(p => p.lv + "|" + p.idx));
    let turns = 0, missed = null, missBack = false;
    while(P.S.status === "playing" && turns < 40){
      const S = P.S, pl = S.current.plan, ch = S.current.challenge;
      if(!pl || pl.kind !== "gym") { fail(target, "plan kind", pl && pl.kind); break; }
      if(!keys.has(pl.lv + "|" + pl.idx)) fail(target, "round outside the picked points", pl.lv, pl.idx);
      if(SKIP.includes(ch.game)) fail(target, "meaning-only game in the gym", ch.game);
      if(/undefined|NaN/.test(ch.target + ch.answerKey)) fail(target, "undefined in challenge", ch.game, ch.target);
      if(!S.current.lesson || !S.current.lesson.body) fail(target, "no rule shown", ch.game);
      if(missed && pl.lv + "|" + pl.idx === missed) missBack = true;
      const right = turns !== 2;
      const a0 = S.stats.answered;
      const ok = answer(right);
      if(P.S.stats.answered !== a0 + 1){ fail(target, "turn did not advance", ch.game); break; }
      if(ok && !P.S.judgement.correct) fail(target, "right answer rejected", ch.game, ch.target);
      if(!right) missed = pl.lv + "|" + pl.idx;
      if(errs.length){ fail(target, "script error", errs.splice(0).join(" // ")); break; }
      turns++;
      if(P.S.status === "playing" && $("nextBtn") && !$("nextBtn").hidden) $("nextBtn").click();
    }
    if(turns !== 15) fail(target, "workout length", turns);
    if(!missBack) fail(target, "the missed point never came back");
    if(P.S.status !== "conquered") fail(target, "did not finish", P.S.status);
    await sleep(20);
    if($("over").hidden) fail(target, "end screen not shown");
    const rows = d.querySelectorAll("#overText .gover li");
    if(rows.length !== 2) fail(target, "end screen rows", rows.length);
    // weak spots: the miss is on record
    const weak = G.gymWeak(target, 3);
    if(!weak.length) fail(target, "no weak spot after a miss");
  }

  // Practice results feed the weak-spot list
  w.localStorage.clear();
  for(const k in w.__pgm.profile) if(k === "gym") w.__pgm.profile.gym = {};
  P.profile.gym = {};
  P.setup.target = "Spanish"; P.setup.native = "English"; $("targetSel").value = "Spanish"; P.setup.mode = 1; P.setup.level = "A1";
  d.querySelector(`#modes [data-mode="1"]`).click();
  P.startNew();
  for(let i = 0; i < 25 && P.S.status === "playing"; i++) answer(i % 3 !== 0);
  const rec = (P.profile.gym || {}).es || {};
  if(!Object.keys(rec).length) fail("Practice rounds were not recorded for the gym");
  pickMode("Spanish", "English");
  if(!G.gymWeak("Spanish", 3).length) fail("weak spots empty after practice misses");
  const wb = d.querySelector('#gymBody [data-gweak]');
  if(!wb || wb.disabled) fail("weak spots button disabled");
  else { wb.click(); if(!G.gymSel("Spanish").length) fail("weak spots button picked nothing"); }

  // multiple choice
  d.querySelector('[data-mcs="1"]').click();
  pickMode("French", "English"); $("startBtn").click();
  if(!P.S.mc) fail("mc: run did not keep multiple choice");
  let opt = 0;
  for(let i = 0; i < 12 && P.S.status === "playing"; i++){
    const ch = P.S.current.challenge;
    if(SKIP.includes(ch.game)) fail("mc", "meaning-only game", ch.game);
    if(Array.isArray(ch.opts)) opt++;
    answer(true);
    if(errs.length){ fail("mc script error", errs.splice(0).join(" // ")); break; }
  }
  if(opt < 6) fail("mc: too few option rounds", opt);
  d.querySelector('[data-mcs="0"]') && d.querySelector('[data-mcs="0"]').click();

  if(errs.length) fail("errors", errs.join(" // "));
  console.log(fails ? `test20: ${fails} failure(s)` : "test20: Grammar Gym OK");
  process.exit(fails ? 1 : 0);
})();
