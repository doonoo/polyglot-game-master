/* Keyboard play: the whole game without a mouse */
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
for(const lang of ["en", "es"]){
  const dom = boot(lang), w = dom.window, d = w.document, P = w.__pgm, $ = id => d.getElementById(id);
  const key = (k, o = {}, el) => { const ev = new w.KeyboardEvent("keydown", Object.assign({key:k, bubbles:true, cancelable:true}, o)); (el || d.activeElement || d.body).dispatchEvent(ev); return ev; };
  if(!d.body.classList.contains("kb")) fail(lang, "keyboard play not on by default on desktop");
  if(!$("menuKbBtn") || !d.querySelector("#settingsPanel .kbChk")) fail(lang, "toggles missing");

  // ? opens help, Esc closes
  d.body.focus(); key("?", {}, d.body);
  if(!$("kbHelp")) fail(lang, "help did not open");
  key("Escape", {}, d.body);
  if($("kbHelp")) fail(lang, "help did not close");

  // Enter on the menu starts the game, answer box gets focus
  P.setup.mode = 1;
  key("Enter", {}, d.body);
  if($("game").hidden || !P.S) { fail(lang, "Enter did not start"); continue; }
  if(d.activeElement !== $("answer")) fail(lang, "answer not focused at start", d.activeElement && d.activeElement.id);

  // Alt+letter accents
  const a = $("answer"); a.value = ""; a.focus();
  key("a", {altKey:true, code:"KeyA"}, a); key("n", {altKey:true, code:"KeyN"}, a); key("?", {altKey:true, shiftKey:true, code:"Slash"}, a); key("E", {altKey:true, shiftKey:true, code:"KeyE"}, a);
  if(a.value !== "áñ¿É") fail(lang, "accents", a.value);
  // AltGr (Ctrl+Alt) is left alone
  const ev = key("a", {altKey:true, ctrlKey:true, code:"KeyA"}, a);
  if(ev.defaultPrevented) fail(lang, "AltGr was intercepted");

  // Shift+Enter twice gives up; once does not
  a.value = "";
  const before = P.S.stats.answered;
  key("Enter", {shiftKey:true}, a);
  if(P.S.stats.answered !== before) fail(lang, "gave up on first Shift+Enter");
  key("Enter", {shiftKey:true}, a);
  if(P.S.stats.answered !== before + 1 || !P.S.judgement || !P.S.judgement.gaveUp) fail(lang, "Shift+Enter twice did not give up");
  if(d.activeElement !== $("answer")) fail(lang, "focus lost after turn");

  // typing a letter from nowhere lands in the answer box
  a.blur(); d.body.focus();
  key("h", {}, d.body);
  if(d.activeElement !== $("answer")) fail(lang, "letter did not focus answer");

  // play with Custom game: tiles by number, match pairs by number+letter
  const cfg = P.curCfg(); for(const k in cfg.sources) cfg.sources[k] = k === "vocab" || k === "g"; cfg.levels = ["A1"];
  for(const g in cfg.games) cfg.games[g] = ["Odd One Out", "Match Madness", "Syntax Scramble", "Word Duel"].includes(g);
  cfg.hearts = 0; cfg.rounds = 0; cfg.timer = 0;
  P.profile.custom = cfg; P.setup.mode = 9; $("startBtn").click();
  const did = {pick:0, order:0, pairs:0};
  for(let turn = 0; turn < 60 && P.S.status === "playing"; turn++){
    const ch = P.S.current.challenge, n0 = P.S.stats.answered;
    if(!$("pairs").hidden){
      const L = [...d.querySelectorAll('#pairs .pr[data-side="l"]')];
      for(const l of L){
        const r = d.querySelector(`#pairs .pr[data-side="r"][data-pi="${l.dataset.pi}"]`);
        d.body.focus(); key(l.dataset.kb, {}, d.body); key(r.dataset.kb.toLowerCase(), {}, d.body);
      }
      if(P.S.stats.answered !== n0 + 1) fail(lang, "pairs by keyboard did not finish");
      else if(!P.S.judgement.correct) fail(lang, "pairs by keyboard not correct");
      did.pairs++; continue;
    }
    const tiles = [...d.querySelectorAll("#tiles .tile[data-i]")];
    if(!$("tiles").hidden && tiles.length && tiles[0].dataset.kb){
      const mode = $("tiles").dataset.mode;
      $("answer").focus(); $("answer").value = "";
      if(mode === "pick"){
        key("2", {}, $("answer"));
        if($("answer").value !== tiles[1].textContent) fail(lang, "pick tile 2", $("answer").value);
        did.pick++;
      } else {
        key("1", {}, $("answer")); key("2", {}, $("answer"));
        const joined = [tiles[0].textContent, tiles[1].textContent].join(mode === "letters" ? "" : " ");
        if($("answer").value !== joined) fail(lang, "order tiles", $("answer").value, joined);
        key("Backspace", {}, $("answer"));
        if($("answer").value !== tiles[0].textContent) fail(lang, "backspace undo", $("answer").value);
        did.order++;
      }
      $("answer").value = P.variantsOf(ch)[0];
      key("Enter", {}, $("answer"));
      if(P.S.stats.answered !== n0 + 1) fail(lang, "Enter did not submit");
      continue;
    }
    $("answer").value = P.variantsOf(ch)[0]; key("Enter", {}, $("answer"));
  }
  if(!did.pick || !did.order || !did.pairs) fail(lang, "did not see every tile type", JSON.stringify(did));

  // results screen: lose all hearts by keyboard, Enter plays again, Esc goes to the menu
  const c2 = P.curCfg(); c2.hearts = 1; c2.rounds = 0; c2.timer = 0; c2.sources = {g:true}; c2.levels = ["A1"]; P.profile.custom = c2; P.setup.mode = 9; $("startBtn").click();
  key("Enter", {shiftKey:true}, $("answer")); key("Enter", {shiftKey:true}, $("answer"));
  if($("over").hidden) fail(lang, "no results screen after losing");
  else {
    d.body.focus(); key("Enter", {}, d.body);
    if($("game").hidden || P.S.status !== "playing") fail(lang, "Enter did not play again");
    key("Enter", {shiftKey:true}, $("answer")); key("Enter", {shiftKey:true}, $("answer"));
    d.body.focus(); key("Escape", {}, d.body);
    if($("menu").hidden) fail(lang, "Esc did not go to the menu");
  }

  // stories: Enter continues, numbers answer
  $("storiesBtn").click(); P.openStory("market");
  for(let k = 0; k < 80 && !$("storyDoneBtn"); k++){
    d.body.focus();
    if($("storyNext")) key("Enter", {}, d.body); else key("1", {}, d.body);
  }
  if(!P.profile.stories.market) fail(lang, "story not finished by keyboard");
  d.body.focus(); key("Enter", {}, d.body);
  if($("menu").hidden) fail(lang, "story Enter did not return to menu");
  // daily quiz: type + Enter, Enter for next, through to the end
  $("dailyBtn").click();
  if(!$("introGo") || $("introGo").hidden === true){} else { d.body.focus(); key("Enter", {}, d.body); }
  for(let k = 0; k < 40 && $("quizDone").hidden; k++){
    if(!$("quizCard").hidden){ $("quizAnswer").focus(); $("quizAnswer").value = "x"; key("Enter", {}, $("quizAnswer")); }
    else { d.body.focus(); key("Enter", {}, d.body); }
  }
  if($("quizDone").hidden) fail(lang, "daily quiz not finished by keyboard");
  d.body.focus(); key("Enter", {}, d.body);
  if($("menu").hidden) fail(lang, "quiz Enter did not return to menu");

  // toggle off: no autofocus
  const chk = d.querySelector("#settingsPanel .kbChk"); chk.checked = false; chk.dispatchEvent(new w.Event("change", {bubbles:true}));
  if(d.body.classList.contains("kb")) fail(lang, "toggle off did not apply");
  if(w.localStorage.getItem("pgm-kb") !== "off") fail(lang, "toggle not saved");
  if(dom.errors.length) fail(lang, "errors", dom.errors.slice(0, 3));
  console.log(lang, "keyboard ok", JSON.stringify(did));
}
console.log(fails ? fails + " FAILURES" : "ALL TESTS PASSED");
process.exit(fails ? 1 : 0);
