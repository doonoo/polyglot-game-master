/* Multiple choice answers (every mode, every language, 2 players), the display size setting
   and the typo allowance (off in Survivor, Tricky Pairs and bosses) */
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
  beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
    w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:(o, k) => k in o ? o[k] : () => ({addColorStop(){}})});
    w.HTMLElement.prototype.scrollIntoView = function(){}; w.addEventListener("error", e => { if(!/setTransform|getContext/.test(e.message)) fail("page error", e.message, (e.error && e.error.stack || "").split("\n").slice(1, 7).join(" | ")); }); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await sleep(400);
  const P = w.__pgm, M = w.__mc, Z = w.__sz, T = w.__tp;
  /* ---------- typo allowance ---------- */
  const mk = (acc, al, game, target) => ({game:game || "Classic Mine", al, k:"s", acc:[acc], answerKey:P.canon(acc), target:target || "", cw:[], why:""});
  const st = {native:"English", mode:1};
  const cases = [
    [mk("Yo hablo español.", "es"), "Yo hablo espaol", true],
    [mk("Yo hablo español.", "es"), "Yo habla español", false],
    [mk("Mi casa es grande.", "es"), "Mi csaa es grande", true],
    [mk("Mi casa es grande.", "es"), "Mi cosa es grande", false],
    [mk("Mi casa es grande.", "es"), "Mi csaa es grnade", false],
    [mk("Hasta mañana.", "es", "Error Hunter", "¡Hasta mañano!"), "Hasta mañano", false],
    [mk("The weather is beautiful today.", "en"), "The weather is beutiful today", true],
    [mk("She is from Peru.", "en"), "She is form Peru", false],
    [mk("I am tired.", "en"), "I am tierd", true],
    [mk("Je suis étudiant.", "fr"), "Je suis etudaint", true]
  ];
  for(const [ch, a, want] of cases){
    const j = P.gradeLocal(st, ch, a, false);
    if(j.correct !== want) fail("typo", a, "expected", want);
    if(want && !(j.typo && /\*\*/.test(j.feedback))) fail("typo feedback", a);
    if(P.gradeLocal({native:"English", mode:3}, ch, a, false).correct && j.typo) fail("Survivor must stay strict", a);
    if(P.gradeLocal({native:"English", mode:8}, ch, a, false).correct && j.typo) fail("Tricky Pairs must stay strict", a);
    if(P.gradeLocal(st, Object.assign({}, ch, {boss:"X"}), a, false).correct && j.typo) fail("bosses must stay strict", a);
  }
  /* ---------- display size ---------- */
  if(!$("menuSizeBtn") || !$("szSheet")) fail("size controls missing");
  $("menuSizeBtn").click(); if($("szSheet").hidden) fail("size sheet did not open");
  $("szDown").click(); $("szDown").click();
  if(Z.v !== 80 || d.documentElement.style.fontSize !== "80%" || w.localStorage.getItem("pgm-size") !== "80") fail("size down", Z.v, d.documentElement.style.fontSize);
  for(let i = 0; i < 20; i++) $("szUp").click();
  if(Z.v !== 150 || !$("szUp").disabled) fail("size cap", Z.v);
  $("szReset").click(); if(Z.v !== 100 || d.documentElement.style.fontSize !== "") fail("size reset");
  $("szDone").click(); if(!$("szSheet").hidden) fail("size sheet did not close");
  if(!d.querySelector("#settingsPanel .szrow [data-sz]")) fail("no size row in the game settings");
  /* ---------- multiple choice ---------- */
  if(!$("mcBox")) fail("no answer mode box");
  d.querySelector('[data-mcs="1"]').click();
  if(!M.on || w.localStorage.getItem("pgm-mc") !== "1") fail("multiple choice switch");
  let tot = 0, mc = 0;
  const runs = [["Spanish","English",[1,2,3,4,5,6,7,8,9]],["English","Spanish",[1,2,3,4,5,7,8]],["French","English",[1,2,3]],["Mandarin Chinese","English",[1,2]],["Arabic","English",[1]],["Portuguese","English",[1]]];
  for(const [tgt, nat, modes] of runs) for(const mode of modes){
    w.__pickMode(mode);
    P.setup.mode = mode; P.setup.target = tgt; P.setup.native = nat; P.setup.level = "A1";
    $("targetSel").value = tgt; $("nativeSel").value = nat;
    P.startNew();
    if(!P.S.mc) fail(mode, tgt, "run did not keep multiple choice");
    for(let i = 0; i < 16; i++){
      const S = P.S; if(!S || S.status !== "playing") break;
      if($("islHide") && !$("islHide").hidden) $("islHide").click();
      const ch = S.current.challenge; tot++;
      if(!(Array.isArray(ch.opts) && ch.game !== "Word Duel")){ $("answer").value = P.variantsOf(ch)[0] || "x"; $("submitBtn").click(); continue; }
      mc++;
      if(ch.opts.length < (ch.game === "Right or Wrong" || ch.game === "Meaning Check" ? 2 : 3)) fail(mode, tgt, ch.game, "too few options");
      const right = ch.opts.filter(o => P.gradeLocal(S, ch, o, false).correct);
      if(right.length !== 1) fail(mode, tgt, ch.game, "options must have exactly one right answer", JSON.stringify(ch.opts));
      const tiles = [...d.querySelectorAll("#tiles .tile[data-i]")];
      if(tiles.length !== ch.opts.length || $("tiles").hidden || !$("answer").hidden || $("chTarget").parentElement.hidden) { fail(mode, tgt, ch.game, "options not shown"); break; }
      const good = i % 3 !== 0, want = good ? right[0] : ch.opts.find(x => !right.includes(x));
      const a0 = S.stats.answered;
      tiles[ch.opts.indexOf(want)].click();
      await sleep(200);
      if(P.S.stats.answered !== a0 + 1) { fail(mode, tgt, "tap did not answer"); break; }
      if(P.S.judgement && P.S.judgement.correct !== good) fail(mode, tgt, ch.game, "graded", P.S.judgement.correct, "for", want);
    }
  }
  if(mc < tot * 0.75) fail("too few multiple-choice rounds", mc, tot);
  // keys 1-4 pick on a PC
  P.setup.mode = 1; P.setup.target = "Spanish"; P.setup.native = "English"; $("targetSel").value = "Spanish"; $("nativeSel").value = "English";
  P.startNew();
  for(let k = 0; k < 5 && !(P.S.current.challenge.opts && P.S.current.challenge.game !== "Word Duel"); k++){ $("answer").value = "x"; $("submitBtn").click(); }
  const a1 = P.S.stats.answered;
  w.dispatchEvent(new w.KeyboardEvent("keydown", {key:"2", bubbles:true})); d.body.dispatchEvent(new w.KeyboardEvent("keydown", {key:"2", bubbles:true}));
  await sleep(250);
  if(P.S.stats.answered !== a1 + 1) fail("key 2 did not answer");
  // two players with multiple choice
  $("menuBtn").click();
  d.querySelector('[data-tpn="2"]').click();
  d.querySelector('#modes [data-mode="1"]').click();
  $("tpLang").value = "English"; $("tpLang").dispatchEvent(new w.Event("change", {bubbles:true}));
  if($("tpRounds")){ $("tpRounds").value = "5"; $("tpRounds").dispatchEvent(new w.Event("change", {bubbles:true})); }
  $("startBtn").click();
  if(!T.TP.on || !T.TP.states[0].mc || !T.TP.states[1].mc) fail("2 players: both runs should use multiple choice");
  let g = 0, taps = 0;
  while(g++ < 200 && $("tpRes").hidden){
    if(!$("tpOv").hidden){ $("tpReady").click(); continue; }
    if(T.TP.phase === "wait" || T.TP.phase === "done"){ $("tpNext").click(); continue; }
    const ch = P.S.current.challenge, b = d.querySelector("#tiles.mc .tile[data-i]");
    if(b && ch.opts){ b.click(); taps++; await sleep(200); } else { $("answer").value = "x"; $("submitBtn").click(); }
  }
  if($("tpRes").hidden) fail("2 players with multiple choice did not finish");
  if(!taps) fail("2 players: no options tapped");
  // Leo the lion: logo on the menu, reactions on the answer card
  if(!d.querySelector("#leoHero svg")) fail("Leo missing from the menu");
  if(!d.querySelector("#judgeCard .stamp.leoStamp svg") && !$("judgeCard").hidden) fail("Leo missing from the answer card");
  d.querySelector('[data-mcs="0"]').click();
  if(M.on) fail("switch back to typing");
  console.log(fails ? `${fails} failures` : `multiple choice ok: ${mc}/${tot} rounds as options; size and typo allowance ok`);
  process.exit(fails ? 1 : 0);
})();
