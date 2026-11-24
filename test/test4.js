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
    if(s.lang) continue;   // stories for the new languages are checked in test17
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
/* path removed; stories, quests and mastery tracking */
{
  const dom = boot("en"), w = dom.window, d = w.document, P = w.__pgm, $ = id => d.getElementById(id);
  if($("pathBtn") || $("pathPage")) fail("learning path still present");
  $("storiesBtn").click();
  if($("storiesPage").hidden) fail("stories page hidden");
  P.openStory("cafe");
  for(let k = 0; k < 80 && !$("storyDoneBtn"); k++){
    const nx = $("storyNext"); if(nx){ nx.click(); continue; }
    const opts = [...d.querySelectorAll(".sq:last-child .sopt:not([disabled])")]; if(opts.length) opts[0].click(); else break;
  }
  if(!P.profile.stories.cafe) fail("story not done");
  d.querySelector(".sline").click();
  $("storyDoneBtn").click();
  if($("menu").hidden) fail("story did not return to menu");
  P.ensureQuests();
  const q = P.profile.quests.list;
  if(q.length !== 3 || new Set(q.map(x => x.id)).size !== 3) fail("quests", JSON.stringify(q));
  if(q.some(x => x.id === "lesson" || x.id === "perfect")) fail("old path quest");
  const before = P.profile.xp, open = q.filter(x => !x.done).length;
  for(const x of q) if(!x.done) P.questAdd(x.id, x.g);
  if(!q.every(x => x.done) || !P.profile.quests.bonus) fail("quests not completed");
  if(P.profile.xp < before + open * 30 + 50) fail("quest xp", P.profile.xp - before);
  if(!d.querySelectorAll("#questCard .quest").length) fail("quest card empty");
  // old saved quests with removed ids are replaced
  P.profile.quests = {d:P.profile.today, list:[{id:"perfect", g:1, n:0, done:false}], bonus:false}; P.ensureQuests();
  if(P.profile.quests.list.some(x => x.id === "perfect")) fail("stale quest kept");
  // mastering lessons in Practice counts
  P.setup.mode = 1; P.setup.level = "A1"; $("startBtn").click();
  for(let i = 0; i < 60 && P.S.status === "playing"; i++){ const c = P.S.current; $("answer").value = P.variantsOf(c.challenge)[0]; $("submitBtn").click(); }
  if(!(P.profile.mastered > 0)) fail("mastered not counted", P.profile.mastered);
  if(dom.errors.length) fail("errors", dom.errors);
  console.log("stories/quests/mastery ok, mastered", P.profile.mastered);
}
/* English learner side + persistence */
{
  const dom = boot("es"), w = dom.window, d = w.document, P = w.__pgm;
  P.openStory("flight");
  if(!/✈️/.test(d.getElementById("storyTitle").textContent)) fail("en story title");
  const s = JSON.parse(w.localStorage.getItem("pgm-pb-profile") || "{}");
  if(dom.errors.length) fail("errors es", dom.errors);
}
console.log(fails ? fails + " FAILURES" : "ALL TESTS PASSED");
process.exit(fails ? 1 : 0);
