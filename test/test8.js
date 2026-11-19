/* The Clock: per-question timers, speed bonus, Time Attack */
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 40) console.log("FAIL", ...a); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
function boot(lang){
  const errors = [];
  const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
    beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:true, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function(){}; Object.defineProperty(w.navigator, "language", {value:lang, configurable:true});
      w.addEventListener("error", e => errors.push(e.error || e.message)); }});
  dom.errors = errors; return dom;
}
(async () => {
  for(const lang of ["en", "es"]){
    const dom = boot(lang), w = dom.window, d = w.document, P = w.__pgm, $ = id => d.getElementById(id);
    let warp = 0; const realNow = w.Date.now.bind(w.Date); w.Date.now = () => realNow() + warp;
    // menu
    if(d.querySelectorAll("#clockChips [data-clock]").length !== 5) fail(lang, "clock chips");
    d.querySelector('[data-clock="blitz"]').click();
    if(P.profile.clock !== "blitz") fail(lang, "clock not saved");
    d.querySelector('[data-mode="9"]').click(); await sleep(10);
    if(!$("clockGroup").hidden) fail(lang, "clock shown for Custom");
    d.querySelector('[data-mode="1"]').click(); await sleep(10);
    if($("clockGroup").hidden) fail(lang, "clock hidden for Practice");

    // Blitz: quick right answer gives a speed bonus
    $("startBtn").click();
    if(P.S.clock !== "blitz") fail(lang, "run has no clock");
    await sleep(250);
    if($("hudClock").hidden || $("clockBar").hidden) fail(lang, "clock UI hidden");
    const xp0 = P.S.xp || 0;
    $("answer").value = P.variantsOf(P.S.current.challenge)[0]; $("submitBtn").click();
    if(!P.S.stats.fast) fail(lang, "no speed bonus for an instant answer");
    if((P.S.xp || 0) - xp0 < 15) fail(lang, "bonus XP missing", (P.S.xp || 0) - xp0);
    // pause while the settings panel is open
    await sleep(250);
    $("setBtn").click();
    const w0 = $("clockBar").firstChild.style.width;
    warp += 0; await sleep(500);
    if($("clockBar").firstChild.style.width !== w0) fail(lang, "clock ran while paused", w0, $("clockBar").firstChild.style.width);
    $("setBtn").click();
    // run out of time: counts as I don't know
    const n0 = P.S.stats.answered, cur = P.S.current;
    const fast = setInterval(() => warp += 1000, 100);
    for(let k = 0; k < 60 && P.S.current === cur; k++) await sleep(100);
    clearInterval(fast);
    if(P.S.stats.answered !== n0 + 1 || !P.S.judgement || !P.S.judgement.gaveUp) fail(lang, "timeout did not count as a miss");

    // Time Attack
    $("menuBtn").click();
    d.querySelector('[data-clock="attack"]').click();
    $("startBtn").click();
    await sleep(250);
    const left0 = P.S.atk.left;
    $("answer").value = P.variantsOf(P.S.current.challenge)[0]; $("submitBtn").click();
    if(P.S.atk.left < left0 + 4000) fail(lang, "right answer did not add time", left0, P.S.atk.left);
    const left1 = P.S.atk.left;
    $("giveUpBtn").click();
    if(P.S.atk.left > left1 - 2500) fail(lang, "miss did not take time");
    const fast2 = setInterval(() => warp += 1000, 100);
    for(let k = 0; k < 200 && $("over").hidden; k++) await sleep(100);
    clearInterval(fast2);
    if($("over").hidden) fail(lang, "Time Attack never ended");
    else {
      if(!P.S.timeUp || P.S.status !== "gameover") fail(lang, "time attack end state");
      if($("overRestart").hidden) fail(lang, "no play again after Time Attack");
      if(!(P.profile.attackBest[1] >= 1)) fail(lang, "best not saved", JSON.stringify(P.profile.attackBest));
    }
    // off: no clock
    $("overMenuBtn").click();
    d.querySelector('[data-clock="off"]').click(); $("startBtn").click(); await sleep(250);
    if(!$("hudClock").hidden) fail(lang, "clock shown when off");
    if(dom.errors.length) fail(lang, "errors", dom.errors.slice(0, 3));
    console.log(lang, "clock ok");
    w.close();
  }
  console.log(fails ? fails + " FAILURES" : "ALL TESTS PASSED");
  process.exit(fails ? 1 : 0);
})();
