/* Phone layout: the answer bar, folded answer cards and lessons */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = q => ({matches:/max-width/.test(q), addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:(o,k) => () => ({addColorStop(){}})}); w.addEventListener("error", e => console.log("ERR", e.message)); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id); const P = w.__pgm, M = w.__mg2;
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await sleep(300);
  let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
  w.__pickMode(2); P.setup.mode = 2; P.setup.target = "Spanish"; P.setup.native = "English"; P.setup.level = "A1"; $("targetSel").value = "Spanish"; $("nativeSel").value = "English";
  P.profile.clock = "blitz"; P.startNew();
  const dock = $("ansDock");
  if(!dock) fail("no answer bar");
  else {
    if(dock.parentNode !== $("game")) fail("answer bar not moved out of the card");
    for(const id of ["answer", "submitBtn", "giveUpBtn", "accentKeys"]) if(!dock.contains($(id))) fail("not in the answer bar", id);
  }
  let rightSeen = 0, minis = 0, lessonsFolded = 0;
  for(let i = 0; i < 40 && P.S.status === "playing"; i++){
    const ch = P.S.current.challenge;
    if(dock && dock.hidden !== $("challengeCard").hidden) fail("bar shown without a question", i);
    const r = Array.isArray(ch.opts) ? ch.opts.find(o => P.gradeLocal(P.S, ch, o, false).correct) : null;
    if(r && $("answer").hidden && d.querySelector("#tiles .tile[data-i]")) [...d.querySelectorAll("#tiles .tile[data-i]")][ch.opts.indexOf(r)].click();
    else { $("answer").value = i % 5 === 4 ? "zzz" : (P.variantsOf(ch)[0] || "x"); $("submitBtn").click(); }
    await sleep(60);
    const j = P.S.judgement, jc = $("judgeCard"), lc = $("lessonCard");
    if(j && j.correct){ rightSeen++; if(jc.classList.contains("jmini")) minis++; else fail("right answer card not folded"); }
    if(j && !j.correct && jc.classList.contains("jmini")) fail("wrong answer card folded");
    if(!lc.hidden && lc.classList.contains("lmini")) lessonsFolded++;
    if(j && j.correct && jc.querySelector(".mobtog")){ jc.querySelector(".mobtog").click(); if(jc.classList.contains("jmini")) fail("details did not open"); jc.querySelector(".mobtog").click(); }
    const nx = $("nextBtn"); if(nx && !nx.hidden) nx.click();
  }
  if(!rightSeen) fail("no right answers");
  if(!lessonsFolded) fail("lessons never folded under the clock");
  console.log(bad ? bad + " failures" : `phone layout ok: ${minis} folded answer cards, ${lessonsFolded} folded lessons`); process.exit(bad ? 1 : 0);
})();
