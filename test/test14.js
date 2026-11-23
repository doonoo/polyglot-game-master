/* Two players (hot seat) in every mode: turns alternate, states stay separate, the
   single-player save is untouched, Survivor runs until both are out, results and rematch work */
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
  beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
    w.HTMLElement.prototype.scrollIntoView = function(){}; w.addEventListener("error", e => fail("page error", e.message, e.error && e.error.stack && e.error.stack.split("\n")[1])); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
function answer(P, right){
  const S = P.S, ch = S.current.challenge;
  if(ch.game === "Match Madness"){
    const prs = [...d.querySelectorAll("#pairs .pr")];
    if(!right){ const l = prs.find(x => x.dataset.side === "l"), r = prs.filter(x => x.dataset.side === "r" && x.dataset.pi !== l.dataset.pi); for(const x of r.slice(0, 3)){ l.click(); x.click(); } }
    for(const l of prs.filter(x => x.dataset.side === "l")){ if(l.classList.contains("done")) continue; l.click(); const r = prs.find(x => x.dataset.side === "r" && x.dataset.pi === l.dataset.pi); r && r.click(); }
    return;
  }
  $("answer").value = right ? P.variantsOf(ch)[0] : "zzz qqq";
  $("submitBtn").click();
}
(async () => {
  await sleep(300);
  const P = w.__pgm, T = w.__tp;
  // a single-player game in progress must survive 2-player games
  P.setup.mode = 1; P.setup.target = "Spanish"; P.setup.native = "English"; P.setup.level = "A1";
  P.startNew(); answer(P, true); answer(P, true);
  const solo = w.localStorage.getItem("pgm-pb-save");
  if(!solo) fail("no single-player save to protect");
  $("menuBtn").click();
  /* ---------- menu ---------- */
  if(!$("tpBox")) { console.log("FAIL no players box"); process.exit(1); }
  d.querySelector('[data-tpn="2"]').click();
  if(!$("tpName0") || !$("tpLang")) fail("2-player settings not shown");
  $("tpName0").value = "Ana"; $("tpName0").dispatchEvent(new w.Event("input", {bubbles:true}));
  $("tpName1").value = "Ben"; $("tpName1").dispatchEvent(new w.Event("input", {bubbles:true}));
  const setLang = v => { $("tpLang").value = v; $("tpLang").dispatchEvent(new w.Event("change", {bubbles:true})); };
  setLang("English");
  if(d.getElementById("duelBtn") || d.getElementById("duelPage")) fail("old duel page should be gone");
  /* ---------- every mode ---------- */
  const summary = {};
  for(const mode of [1, 2, 3, 4, 5, 6, 7, 8, 9]){
    P.setup.mode = mode; P.setup.level = "A1";
    d.querySelector(`#modes [data-mode="${mode}"]`).click();
    if($("tpRounds")){ $("tpRounds").value = "5"; $("tpRounds").dispatchEvent(new w.Event("change", {bubbles:true})); }
    $("tpHand").checked = mode % 2 === 1; $("tpHand").dispatchEvent(new w.Event("change", {bubbles:true}));
    $("startBtn").click();
    const tp = T.TP;
    if(!tp.on) { fail(mode, "2-player game did not start"); continue; }
    if(tp.states[0].target !== "Spanish" || tp.states[1].target !== "English") fail(mode, "courses", tp.states[0].target, tp.states[1].target);
    if(tp.states[0] === tp.states[1]) fail(mode, "players share a state");
    if(!tp.states[0].current || !tp.states[1].current) fail(mode, "both players need a first question");
    let order = [], guard = 0, sawOverlay = false;
    while(guard++ < 400){
      if(!$("tpRes").hidden) break;
      if(!$("tpOv").hidden){ sawOverlay = true; if($("challengeCard").offsetParent === null && false) fail(); $("tpReady").click(); continue; }
      const tpp = T.TP;
      if(tpp.phase === "wait" || tpp.phase === "done"){
        if(!$("challengeCard").hidden) fail(mode, "next question visible during the hand-off");
        if(!$("tpNext") || $("tpNext").hidden) { fail(mode, "no hand-off button"); break; }
        // keys are held back between turns
        const before = P.S.stats.answered; w.dispatchEvent(new w.KeyboardEvent("keydown", {key:"1", bubbles:true})); if(P.S.stats.answered !== before) fail(mode, "a key answered the hidden question");
        $("tpNext").click(); continue;
      }
      const me = tpp.cur, S = P.S;
      if(S !== tpp.states[me]) { fail(mode, "S is not the current player's state"); break; }
      if(!S.current){ fail(mode, "no question for", me); break; }
      order.push(me);
      const a0 = S.stats.answered;
      // Ana always right; Ben right only now and then (always wrong in Survivor so he goes out)
      answer(P, me === 0 ? true : (mode === 3 ? false : order.length % 4 === 0));
      if(T.TP.states[me].stats.answered !== a0 + 1) { fail(mode, "answer not counted", me, P.S.current && P.S.current.challenge.game); break; }
    }
    if($("tpRes").hidden) { fail(mode, "no results screen", T.TP.phase, JSON.stringify(T.TP.turns), JSON.stringify(T.TP.out)); T.tpEnd(true); d.querySelector('[data-tpn="2"]').click(); continue; }
    const tp2 = T.TP;
    // alternation: never the same player twice in a row while both are still in
    let bad = 0; for(let k = 1; k < order.length; k++) if(order[k] === order[k - 1] && !tp2.out[1 - order[k]] && tp2.turns[1 - order[k]] < tp2.rounds) bad++;
    if(bad) fail(mode, "turns did not alternate", order.join(""));
    if(mode !== 3 && mode !== 6 && (tp2.turns[0] !== 5 || tp2.turns[1] !== 5)) fail(mode, "expected 5 turns each", JSON.stringify(tp2.turns), JSON.stringify(tp2.out));
    if(mode === 3 && !tp2.out[1]) fail("Survivor: Ben should be out");
    if(mode % 2 === 1 && !sawOverlay) fail(mode, "pass-the-phone screen never shown");
    if(mode % 2 === 0 && sawOverlay) fail(mode, "pass-the-phone screen shown while switched off");
    const res = $("tpRes").textContent;
    if(!/Ana|Ben|tie/.test(res)) fail(mode, "results missing names");
    if(mode !== 6 && tp2.states[0].stats.correct < tp2.states[1].stats.correct) fail(mode, "Ana answered everything right but has fewer correct");
    if(!/Ana wins/.test(res)) fail(mode, "Ana should win", res.slice(0, 60));
    if(mode === 3 && order.length > 30) fail("Survivor should end once Ana passes Ben", order.length);
    summary[mode] = `${order.length} turns · Ana ${tp2.states[0].xp || 0}xp · Ben ${tp2.states[1].xp || 0}xp`;
    if(w.localStorage.getItem("pgm-pb-save") !== solo) fail(mode, "single-player save was overwritten");
    // rematch, then leave via the menu
    if(mode === 1){
      $("tpRematch").click();
      if(!T.TP.on || T.TP.turns[0] !== 0 || !$("tpRes").hidden) fail("rematch did not restart");
      $("menuBtn").click();
      if($("game").hidden) fail("one tap on ☰ should only warn");
      $("menuBtn").click();
      if(T.TP.on) fail("two taps on ☰ should leave");
      if($("menu").hidden) fail("menu not shown after leaving");
    } else {
      $("tpMenuBtn").click();
      if(T.TP.on || $("menu").hidden) fail(mode, "menu button on results failed");
    }
    if(!P.S || P.S.mode !== 1 || P.S.stats.answered !== 2) fail(mode, "single-player game not restored", P.S && P.S.stats.answered);
  }
  /* ---------- a new language on one side ---------- */
  setLang("Mandarin Chinese");
  d.querySelector('#modes [data-mode="4"]').click();
  if(!$("startBtn").disabled || !/Ben/.test($("tpBox").textContent)) fail("Numbers with Mandarin should be blocked with a note");
  d.querySelector('#modes [data-mode="1"]').click();
  if($("startBtn").disabled) fail("Practice with Mandarin should be allowed");
  $("startBtn").click();
  if(!T.TP.on || T.TP.states[1].target !== "Mandarin Chinese" || T.TP.states[1].native !== "English") fail("Mandarin player not set up", T.TP.states && T.TP.states[1].target);
  T.tpEnd(true);
  // back to 1 player: the normal start button starts a normal game
  d.querySelector('[data-tpn="1"]').click();
  $("startBtn").click();
  if(T.TP.on) fail("1-player start went into 2-player");
  if(!P.S || P.S.stats.answered !== 0) fail("1-player game did not start fresh");
  console.log(JSON.stringify(summary, null, 1));
  if(fails){ console.log(fails, "FAILURES"); process.exit(1); }
  console.log("ALL TESTS PASSED");
  process.exit(0);
})();
