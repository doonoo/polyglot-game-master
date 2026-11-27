/* 2.17: wrapper chains are named and in the documented order; the first-run "start here" sheet works. */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; console.log("FAIL", ...a); };
// innermost → outermost. Update this (and the map in CLAUDE.md) on purpose when a wrapper is added, removed or moved.
const EXPECTED = {
  applyI18n:["chiptune", "voiceprefs"],
  applyResult:["island", "practice", "custom", "boss", "gym", "cards", "dialog"],
  bossIntro:["boss"],
  ckPaused:["twoplayer"],
  conceptAt:["practice", "langmodes"],
  conjAccepted:["langmodes"],
  conjQuestion:["langmodes", "mc"],
  conjWrongs:["langmodes"],
  findConcept:["langmodes"],
  freshState:["custom", "timer", "mc", "gym", "cards", "dialog"],
  gamesFor:["langmodes", "mcgames", "mcgames2"],
  genConj:["langmodes", "mc", "mcgames", "mcgames2"],
  genNumber:["langmodes", "mc", "mcgames2"],
  genSentence:["mc", "mcgames", "mcgames2"],
  genVocab:["langmodes", "mc", "mcgames", "mcgames2"],
  generate:["practice", "custom", "boss", "mc", "gym", "cards", "dialog"],
  gradeLocal:["custom", "boss", "typo", "mcgames", "mcgames2", "alts"],
  grantRewards:["timer", "boss"],
  levelsFor:["langmodes"],
  makePlan:["boss"],
  makePlanCore:["island", "practice", "custom", "gym", "cards", "dialog"],
  mixSources:["langs"],
  norm:["langs"],
  numChallenge:["langmodes"],
  playOutcome:["juice", "sfx", "gym"],
  progress:["custom", "gym", "cards", "dialog"],
  recordAnswer:["features4", "notify", "twoplayer"],
  recordTurn:["features4"],
  renderDaily:["features3", "features4", "notify"],
  renderExtras:["island", "boss", "feedback", "keyboard", "anim", "voice", "juice", "langs", "mc", "mcgames", "mcgames2", "cards", "dialog"],
  renderGame:["twoplayer", "leo", "mobile"],
  renderHud:["custom", "anim", "juice", "gym", "cards", "dialog"],
  renderMenu:["custom", "timer", "langs", "langmodes", "mc", "uisize", "twoplayer", "gym", "cards", "dialog", "menumerge", "leo", "firstrun"],
  runJuice:["gym"],
  runTurn:["twoplayer"],
  save:["twoplayer"],
  showMenu:["twoplayer"],
  showOnly:["chiptune", "sfx"],
  showOver:["custom", "timer", "anim", "juice", "twoplayer", "gym", "cards", "dialog", "leo", "firstrun"],
  startNew:["langs"],
  syllabusFor:["practice", "langmodes"],
  syncMood:["langs", "sfx", "twoplayer", "cards"],
  tileItems:["langs", "langmodes", "mc", "cards", "dialog"],
  wordForms:["langmodes"]
};
const mk = (extra) => new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; Object.assign(w, extra || {}); w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:() => () => ({addColorStop(){}})}); }});
(async () => {
  /* ---------- chains ---------- */
  let dom = mk(), w = dom.window;
  await new Promise(r => setTimeout(r, 400));
  const got = w.__wrapChains();
  for(const k of new Set(Object.keys(EXPECTED).concat(Object.keys(got)))){
    const a = JSON.stringify(got[k] || []), b = JSON.stringify(EXPECTED[k] || []);
    if(a !== b) fail("chain", k, "is", a, "expected", b);
  }
  /* ---------- first run ---------- */
  dom.window.close();
  dom = mk({__FIRSTRUN_FORCE:true}); w = dom.window;
  await new Promise(r => setTimeout(r, 400));
  const $ = id => w.document.getElementById(id), F = w.__fr, P = w.__pgm;
  if(!F) fail("first-run hooks missing");
  if($("frSheet").hidden) fail("first-run sheet should open for a brand-new player");
  const courses = [...w.document.querySelectorAll("#frSheet [data-frcourse]")].map(b => b.dataset.frcourse);
  if(courses.length !== 6 || courses[0] !== "Spanish") fail("course list", courses);
  if(!w.document.querySelector('#modes [data-mode="1"] .frbadge:not([hidden])')) fail("Start here badge missing on Practice");
  w.document.querySelector('#frSheet [data-frcourse="Mandarin Chinese"]').click();
  if(!$("frGo")) fail("Start with Practice button missing after picking a course");
  if($("targetSel").value !== "Mandarin Chinese") fail("course not set", $("targetSel").value);
  $("frGo").click();
  if($("game").hidden || !P.S || P.S.mode !== 1 || P.S.target !== "Mandarin Chinese" || P.S.level !== "A1") fail("Start with Practice should start Mandarin A1 Practice", P.S && [P.S.mode, P.S.target, P.S.level]);
  if(w.localStorage.getItem("pgm-firstrun") !== "done") fail("first-run flag not saved");
  // not again: flag set, or a player who has played
  if(F.frIsNew()) fail("should not count as new after the sheet");
  w.localStorage.removeItem("pgm-firstrun"); P.S.status = "playing";
  if(F.frIsNew()) fail("a saved game in progress should skip the sheet");
  // finishing a game removes the badge
  P.S.status = "gameover"; F.over();
  if(w.localStorage.getItem("pgm-firstgame") !== "done") fail("first game flag not saved");
  // "Show me the menu" closes for good
  dom.window.close();
  dom = mk({__FIRSTRUN_FORCE:true}); w = dom.window;
  await new Promise(r => setTimeout(r, 400));
  w.document.getElementById("frSkip").click();
  if(!w.document.getElementById("frSheet").hidden || w.localStorage.getItem("pgm-firstrun") !== "done") fail("Show me the menu should close and remember");
  // Spanish app: English course first
  dom.window.close();
  dom = mk({__FIRSTRUN_FORCE:true}); w = dom.window;
  await new Promise(r => setTimeout(r, 300));
  const ui = w.document.getElementById("uiSel"); ui.value = "es"; ui.dispatchEvent(new w.Event("change", {bubbles:true}));
  w.__fr.frOpen();
  const es = [...w.document.querySelectorAll("#frSheet [data-frcourse]")].map(b => b.dataset.frcourse);
  if(es[0] !== "English") fail("Spanish app should list English first", es);
  if(!/Aprender francés/.test(w.document.getElementById("frCourses").textContent)) fail("Spanish course names");
  console.log(fails ? `test24: ${fails} failures` : `test24: ${Object.keys(got).length} wrapper chains in order, first run OK`);
  process.exit(fails ? 1 : 0);
})();
