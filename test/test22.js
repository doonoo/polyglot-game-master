/* Card Clash (mode 11): in every language, the hand holds the sentence's words plus decoys,
   playing the cards in order wins the turn and damages the foe, misses cost hearts and come
   back, a full run ends in victory and a bad one in defeat. Also two players and multiple choice. */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
const errs = [];
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:() => () => ({addColorStop(){}})}); w.addEventListener("error", e => errs.push(e.message + " " + (e.error && e.error.stack || "").split("\n").slice(0, 3).join(" | "))); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id), P = w.__pgm;
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* tap the cards that spell the sentence, in order (or a wrong hand) */
function play(right){
  const S = P.S, ch = S.current.challenge;
  if(!ch.card){
    // a fallback round: answer it normally
    const ok = Array.isArray(ch.opts) ? ch.opts.find(o => P.gradeLocal(S, ch, o, false).correct) : P.variantsOf(ch)[0];
    $("answer").value = right ? (ok || "x") : "zzz qqq"; $("submitBtn").click(); return "fallback";
  }
  const tiles = [...d.querySelectorAll("#tiles .tile[data-i]")];
  if(tiles.length !== ch.card.hand.length) fail("hand not dealt as tiles", tiles.length, ch.card.hand.length);
  const want = right ? ch.card.words : ch.card.words.slice().reverse();
  const used = new Set();
  for(const word of want){
    const t = tiles.find((x, i) => !used.has(i) && x.textContent === word);
    if(!t){ fail("card missing from the hand", word, ch.card.hand.join(" / ")); return "bad"; }
    used.add(tiles.indexOf(t)); t.click();
  }
  if(right && $("answer").value !== ch.card.words.join(" ")) fail("answer box doesn't match the cards", $("answer").value);
  $("submitBtn").click();
  return "cards";
}
function start(target, native, level){
  P.setup.target = target; P.setup.native = native; $("targetSel").value = target;
  d.querySelector('#modes [data-mode="11"]').click();
  P.setup.level = level; P.setup.mode = 11;
  $("startBtn").click();
}

(async () => {
  await sleep(300);
  if(errs.length) fail("load errors", errs.splice(0).join(" // "));
  if(!d.querySelector('#modes [data-mode="11"]')) fail("no Card Clash mode card");
  for(const [target, native, level] of [["Spanish","English","A1"],["English","Spanish","A2"],["French","English","A1"],["Portuguese","English","B1"],["Mandarin Chinese","English","A1"],["Arabic","English","A2"],["Spanish","English","B2"]]){
    start(target, native, level);
    const S0 = P.S;
    if(!S0 || S0.mode !== 11){ fail(target, "did not start"); continue; }
    if(S0.hp !== 5) fail(target, "hearts", S0.hp);
    if(!$("cardHow")) fail(target, "no how-to in the menu");
    let turns = 0, cards = 0, missed = null, back = false, linked = 0, decoyTricky = 0;
    while(P.S.status === "playing" && turns < 80){
      const S = P.S, ch = S.current.challenge;
      if(ch.card){
        const words = ch.card.words, hand = ch.card.hand;
        if(hand.length <= words.length) fail(target, "no decoy cards", hand.join(" / "));
        if(words.length < 3 || words.length > 9) fail(target, "hand size", words.length);
        if(/[.,!?¿¡]$/.test(hand.join(" "))) fail(target, "punctuation on a card", hand.join(" / "));
        if($("chTarget").parentElement.hidden) fail(target, "sentence to build is hidden");
        if(!$("cardBar") || $("cardBar").hidden) fail(target, "no foe bar");
        if(missed && ch.acc[0] === missed) back = true;
      }
      const right = turns !== 3;
      const hp0 = S.hp, dealt0 = S.card.dealt, a0 = S.stats.answered;
      const how = play(right);
      if(how === "cards") cards++;
      if(P.S.stats.answered !== a0 + 1){ fail(target, "turn did not advance", ch.game); break; }
      if(right && how === "cards"){
        if(!P.S.judgement.correct) fail(target, "right cards rejected", ch.card.words.join(" "), "|", ch.acc[0]);
        else if(P.S.card.dealt <= dealt0) fail(target, "no damage dealt");
        if(P.S.card.ev && P.S.card.ev.linked) linked++;
      }
      if(!right){
        if(P.S.judgement.correct) fail(target, "reversed cards accepted", ch.card && ch.card.words.join(" "));
        if(P.S.hp !== hp0 - 1) fail(target, "miss didn't cost a heart");
        missed = ch.acc[0];
      }
      if(errs.length){ fail(target, "script error", errs.splice(0).join(" // ")); break; }
      turns++;
      if(P.S.status === "playing" && $("nextBtn") && !$("nextBtn").hidden) $("nextBtn").click();
    }
    if(P.S.status !== "conquered") fail(target, level, "run not won", P.S.status, turns, "foe", P.S.card.foe);
    if(cards < turns * 0.8) fail(target, "too few card rounds", cards, "of", turns);
    if(!back) fail(target, "missed sentence never came back");
    await sleep(10);
    if($("over").hidden) fail(target, "no end screen");
    if(!/Victory|Victoria/.test($("overTitle").textContent)) fail(target, "victory title", $("overTitle").textContent);
    console.log(`${target} ${level}: ${turns} turns, ${cards} card rounds, best chain ×${P.S.card.best}, ${linked} linked, ${P.S.card.dealt} damage`);
  }

  // a losing run
  start("Spanish", "English", "A1");
  for(let i = 0; i < 10 && P.S.status === "playing"; i++){ play(false); if($("nextBtn") && !$("nextBtn").hidden) $("nextBtn").click(); }
  if(P.S.status !== "gameover") fail("five misses didn't end the run", P.S.status, P.S.hp);
  await sleep(10);
  if(!/Knocked out|Derrotado/.test($("overTitle").textContent)) fail("defeat title", $("overTitle").textContent);

  // multiple choice is ignored here: cards are the point
  d.querySelector('[data-mcs="1"]').click();
  start("French", "English", "A2");
  if(P.S.current.challenge.opts) fail("multiple choice took over the cards");
  for(let i = 0; i < 6 && P.S.status === "playing"; i++) play(true);
  d.querySelector('[data-mcs="0"]').click();

  if(errs.length) fail("errors", errs.join(" // "));
  console.log(fails ? `test22: ${fails} failure(s)` : "test22: Card Clash OK");
  process.exit(fails ? 1 : 0);
})();
