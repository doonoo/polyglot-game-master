const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
function boot(lang){
  const errors = [];
  const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
    beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:true, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function(){}; Object.defineProperty(w.navigator, "language", {value:lang, configurable:true});
      w.addEventListener("error", e => errors.push(e.error || e.message)); }});
  dom.errors = errors; return dom;
}
let fails = 0; const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
const right = (P, it) => P.canon(it.ch.acc[0]);

/* stories data */
{
  const P = boot("en").window.__pgm;
  if(P.STORIES.length < 8) fail("stories", P.STORIES.length);
  for(const s of P.STORIES){
    if(!P.LEVELS.includes(s.lv) || !s.t.es || !s.t.en) fail("story head", s.id);
    let q = 0;
    for(const p of s.p){
      if(p.q){ q++; if(!p.q.es || !p.q.en || !(p.a >= 0 && p.a < p.o.length) || p.o.some(o => !o.es || !o.en)) fail("story q", s.id, JSON.stringify(p).slice(0, 80)); }
      else if(!p.es || !p.en) fail("story line", s.id, JSON.stringify(p).slice(0, 80));
    }
    if(q < 3) fail("few questions", s.id, q);
  }
  console.log("stories data ok");
}
/* every lesson builds 6 gradeable items */
for(const lang of ["en", "es"]){
  const w = boot(lang).window, P = w.__pgm, tgt = lang === "en" ? "es" : "en";
  let n = 0;
  for(const lv of P.LEVELS) P.COURSE[tgt][lv].forEach((c, i) => {
    const items = P.lessonItems(tgt, lv, [i], 6);
    if(items.length < 5) fail("lesson items", tgt, lv, i, c.t, items.length);
    for(const it of items){ n++;
      const j = P.gradeLocal({native:it.native, mode:1}, it.ch, right(P, it), false);
      if(!j.correct) fail("canonical rejected", tgt, lv, c.t, it.ch.game, it.ch.target, right(P, it));
    }
  });
  console.log("lesson items", tgt, n);
}
/* path play-through: lesson, jump test, story, quests */
{
  const dom = boot("en"), w = dom.window, d = w.document, P = w.__pgm, $ = id => d.getElementById(id);
  const units = P.pathUnits("es");
  if(units.length !== 4) fail("units", units.length);
  let st = P.pathState("es");
  if(!st[0].open || !st[0].cur || st[1].open) fail("initial state");
  d.getElementById("pathBtn").click();
  if($("pathPage").hidden) fail("path page hidden");
  if(d.querySelectorAll(".pnode").length !== st.length) fail("node count");
  d.querySelector(`[data-pk="${st[0].key}"]`).click();
  if($("pathSheet").hidden) fail("sheet");
  d.querySelector('[data-pa="lesson"]').click();
  if($("quizIntro").hidden) fail("intro hidden");
  d.getElementById("introGo").click();
  const playAll = ok => { for(let k = 0; k < 20 && !P.Q.done; k++){
    const it = P.Q.items[P.Q.i];
    if(it.ch.game === "Syntax Scramble" && $("quizBuild").hidden) fail("scramble tiles hidden");
    $("quizAnswer").value = ok ? right(P, it) : "zzz"; $("quizSubmit").click(); $("quizNext").click(); } };
  const xp0 = P.profile.xp;
  playAll(true);
  if($("quizDone").hidden) fail("lesson not finished");
  if(P.profile.path.es[st[0].key] !== 2) fail("lesson not gold", JSON.stringify(P.profile.path));
  st = P.pathState("es");
  if(!st[1].open || !st[1].cur) fail("next not unlocked");
  $("quizHome").click();
  if($("pathPage").hidden) fail("did not return to path");
  // failing a lesson does not mark it
  P.startPathNode(st[1].key); d.getElementById("introGo").click(); playAll(false);
  if(P.profile.path.es[st[1].key]) fail("failed lesson marked");
  // jump test to B1
  P.startPathNode("B1:T");
  if(P.Q.items.length !== 10) fail("test size", P.Q.items.length);
  playAll(true);
  st = P.pathState("es");
  const firstB2 = st.findIndex(n => n.lv === "B2");
  if(!st.slice(0, firstB2).every(n => n.done)) fail("jump did not unlock");
  if(!st[firstB2].cur) fail("cursor not at B2");
  // story
  P.openStory("cafe", true);
  for(let k = 0; k < 80 && !$("storyDoneBtn"); k++){
    const nx = $("storyNext"); if(nx){ nx.click(); continue; }
    const opts = [...d.querySelectorAll(".sq:last-child .sopt:not([disabled])")]; if(opts.length) opts[0].click(); else break;
  }
  if(!P.profile.stories.cafe) fail("story not done");
  if(!P.profile.path.es["A1:S:cafe"]) fail("story path node");
  d.querySelector(".sline").click();
  $("storyDoneBtn").click();
  if($("pathPage").hidden) fail("story back to path");
  // quests
  P.ensureQuests();
  const q = P.profile.quests.list;
  if(q.length !== 3 || new Set(q.map(x => x.id)).size !== 3) fail("quests", JSON.stringify(q));
  const before = P.profile.xp, open = q.filter(x => !x.done).length;
  for(const x of q) if(!x.done) P.questAdd(x.id, x.g);
  if(!q.every(x => x.done) || !P.profile.quests.bonus) fail("quests not completed");
  if(P.profile.xp < before + open * 30 + 50) fail("quest xp", P.profile.xp - before);
  if(P.profile.xp <= xp0) fail("no xp");
  P.questAdd(q[0].id, 5);
  if(!d.querySelectorAll("#questCard .quest").length) fail("quest card empty");
  if(dom.errors.length) fail("errors", dom.errors);
  console.log("path/story/quests ok");
}
/* English learner side + persistence */
{
  const dom = boot("es"), w = dom.window, d = w.document, P = w.__pgm;
  if(P.pathUnits("en")[0].nodes.length < 5) fail("en path");
  P.openStory("flight", false);
  if(!/✈️/.test(d.getElementById("storyTitle").textContent)) fail("en story title");
  const s = JSON.parse(w.localStorage.getItem("pgm-pb-profile") || "{}");
  if(dom.errors.length) fail("errors es", dom.errors);
}
console.log(fails ? fails + " FAILURES" : "ALL TESTS PASSED");
process.exit(fails ? 1 : 0);
