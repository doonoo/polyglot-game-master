/* World Languages: content checks for every pack, then every unit played through in the UI */
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
function boot(lang){
  const errors = [];
  const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
    beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:true, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function(){}; Object.defineProperty(w.navigator, "language", {value:lang, configurable:true});
      w.addEventListener("error", e => errors.push(e.error || e.message)); }});
  dom.errors = errors; return dom;
}

(async () => {
  const dom = boot("en"), w = dom.window, d = w.document, $ = id => d.getElementById(id), W = w.__world;
  if(!W) { console.log("FAIL no __world"); process.exit(1); }
  const codes = ["zh", "ar", "fr", "pt"];
  /* ---------- content ---------- */
  for(const c of codes){
    const P = W.wlPack(c);
    if(!P) { fail(c, "missing pack"); continue; }
    for(const k of ["name", "self", "flag", "tts", "dir", "music"]) if(!P[k]) fail(c, "pack field", k);
    if(P.units.length < 8) fail(c, "fewer than 8 units");
    const seenT = new Map(), seenEn = new Map();
    P.units.forEach((u, ui) => {
      if(!u.t || !u.ico || !u.b) fail(c, ui, "unit header");
      if(!/\*\*[^*]+\*\*/.test(u.b)) fail(c, u.t, "tip has no bold term");
      if(u.words.length < 9) fail(c, u.t, "needs 9+ words", u.words.length);
      if(u.sents.length < 4) fail(c, u.t, "needs 4+ sentences", u.sents.length);
      for(const x of u.words){
        if(!x.t || !x.en) fail(c, u.t, "empty word");
        if(P.rom && !x.r) fail(c, u.t, "word without romanization", x.t);
        if(seenT.has(x.t)) fail(c, "duplicate word", x.t, u.t, seenT.get(x.t)); seenT.set(x.t, u.t);
        if(seenEn.has(x.en)) fail(c, "duplicate meaning", x.en, u.t, seenEn.get(x.en)); seenEn.set(x.en, u.t);
        if(P.rom === "pinyin" && !W.wlToneVariants(x.r).length) fail(c, "no tone variants", x.t, x.r);
      }
      for(const s of u.sents){
        if(s.tk.length < 1) fail(c, u.t, "empty sentence");
        if(P.rom && s.rk.length !== s.tk.length) fail(c, u.t, "romanization not aligned", s.t, "|", s.r, s.tk.length, s.rk.length);
        if(P.code === "zh" && /[a-z]/i.test(s.t)) fail(c, "latin letters in hanzi", s.t);
        if(P.code === "ar" && /[a-z]/i.test(s.t)) fail(c, "latin letters in arabic", s.t);
      }
    });
    // every generated challenge is answerable
    for(let rep = 0; rep < 12; rep++) P.units.forEach((u, ui) => {
      for(const ch of W.wlLesson(P, ui)){
        if(!ch) { fail(c, u.t, "null challenge"); continue; }
        if(ch.opts){
          if(!ch.opts.includes(ch.ans)) fail(c, u.t, ch.type, "answer missing from options");
          if(new Set(ch.opts).size !== ch.opts.length) fail(c, u.t, ch.type, "duplicate options", ch.opts.join("/"));
          if(ch.opts.length < 3) fail(c, u.t, ch.type, "too few options");
          if(ch.type === "fill" && ch.opts.filter(o => W.wlNorm(o) === W.wlNorm(ch.ans)).length > 1) fail(c, u.t, "fill options equal after normalizing");
        }
        if(ch.type === "build"){
          const tiles = ch.tiles.map(x => x.t);
          for(const tk of ch.ans) if(!tiles.includes(tk)) fail(c, u.t, "build tile missing", tk);
          if(tiles.length < ch.ans.length + 2) fail(c, u.t, "build needs 2+ extra tiles");
        }
        if(ch.type === "match" && ch.pairs.length !== 4) fail(c, u.t, "match needs 4 pairs");
      }
    });
  }
  /* ---------- UI: play every unit of every pack through ---------- */
  $("worldBtn").click();
  if($("worldPage").hidden) fail("world page did not open");
  if(!$("menu").hidden) fail("menu still visible");
  if(d.querySelectorAll("[data-wpack]").length !== 4) fail("expected 4 packs on home");
  let answered = 0, types = {};
  for(const c of codes){
    d.querySelector(`[data-wpack="${c}"]`).click();
    const P = W.wlPack(c);
    if(d.querySelector('[data-wunit="1"]').getAttribute("aria-disabled") !== "true") fail(c, "unit 2 should start locked");
    for(let ui = 0; ui < P.units.length; ui++){
      const node = d.querySelector(`[data-wunit="${ui}"]`);
      if(!node) { fail(c, "no node", ui); break; }
      node.click();
      if(W.WV.view !== "intro") { fail(c, ui, "intro did not open (locked?)"); break; }
      if(c === "ar" && !d.querySelector('#worldPage [dir="rtl"]')) fail("arabic text not marked rtl");
      $("wlGo").click();
      let guard = 0, missedOnce = false;
      while(W.WV.view === "play" && guard++ < 80){
        const R = W.WV.run, ch = R.items[R.i];
        types[ch.type] = (types[ch.type] || 0) + 1;
        // miss the first question of unit 0 on purpose, to exercise hearts and requeue
        const wantWrong = ui === 0 && !missedOnce && ch.opts;
        if(ch.opts){
          const i = wantWrong ? ch.opts.findIndex(o => o !== ch.ans) : ch.opts.indexOf(ch.ans);
          d.querySelector(`[data-wopt="${i}"]`).click();
          if(wantWrong){ missedOnce = true; if(R.state !== "bad") fail(c, "wrong option graded as right"); }
          else if(R.state !== "ok") fail(c, ch.type, "right option graded wrong", ch.ans);
        } else if(ch.type === "build"){
          const used = new Set();
          for(const tk of ch.ans){ const i = ch.tiles.findIndex((x, k) => x.t === tk && !used.has(k)); used.add(i); d.querySelector(`[data-wtile="${i}"]`).click(); }
          $("wlCheck").click();
          if(R.state !== "ok") fail(c, "build graded wrong", ch.ans.join(" "));
        } else if(ch.type === "type"){
          const inp = $("wlType"); inp.value = ch.ans.normalize("NFD").replace(/[̀-ͯ]/g, ""); inp.dispatchEvent(new w.Event("input"));
          $("wlCheck").click();
          if(R.state !== "ok") fail(c, "typed answer without accents not accepted", ch.ans);
        } else if(ch.type === "match"){
          for(const i of ch.left){ d.querySelector(`[data-wml="${i}"]`).click(); d.querySelector(`[data-wmr="${i}"]`).click(); }
          if(R.state !== "ok") fail(c, "match not completed");
        }
        answered++;
        if(R.state === "ask") { fail(c, ch.type, "stuck in ask"); break; }
        $("wlNext").click();
      }
      if(W.WV.view !== "end") fail(c, ui, "did not reach end", W.WV.view);
      if(!W.WV.run.won) fail(c, ui, "lost the unit");
      if(ui === 0 && W.WV.run.stars === 3) fail(c, "a miss should cost a star");
      if(ui > 0 && W.WV.run.stars !== 3) fail(c, ui, "perfect run should give 3 stars");
      d.querySelector('#worldPage [data-wgo="path"]').click();
    }
    if(W.wpOf(c) && Object.keys(W.wpOf(c).u).length !== P.units.length) fail(c, "not all units recorded");
    $("wlPractice").click();
    if(W.WV.view !== "play") fail(c, "practice did not start");
    d.querySelector('#worldPage [data-wgo="path"]').click();
    d.querySelector('#worldPage [data-wgo="home"]').click();
  }
  // losing all hearts ends the run
  d.querySelector('[data-wpack="fr"]').click(); d.querySelector('[data-wunit="0"]').click(); $("wlGo").click();
  for(let k = 0; k < 10 && W.WV.view === "play"; k++){
    const R = W.WV.run, ch = R.items[R.i];
    if(ch.opts){ d.querySelector(`[data-wopt="${ch.opts.findIndex(o => o !== ch.ans)}"]`).click(); }
    else if(ch.type === "type"){ $("wlType").value = "zzz"; $("wlCheck").click(); }
    else if(ch.type === "build"){ d.querySelector('[data-wtile="0"]').click(); $("wlCheck").click(); if(W.WV.run.state === "ok"){ $("wlNext").click(); continue; } }
    else if(ch.type === "match"){ for(const i of ch.left){ d.querySelector(`[data-wml="${i}"]`).click(); d.querySelector(`[data-wmr="${i}"]`).click(); } }
    if(W.WV.view === "play") $("wlNext").click();
  }
  if(W.WV.view !== "end" || W.WV.run.won) fail("three misses should end the unit");
  d.querySelector('#worldPage [data-wgo="path"]').click();
  d.querySelector('#worldPage [data-wgo="home"]').click();
  d.querySelector('#worldPage [data-wgo="menu"]').click();
  if($("menu").hidden || !$("worldPage").hidden) fail("back to menu failed");
  // progress survives a reload
  const saved = w.localStorage.getItem("pgm-world");
  if(!saved || !JSON.parse(saved).zh || Object.keys(JSON.parse(saved).zh.u).length !== 8) fail("progress not saved");
  if(dom.errors.length) fail("page errors", dom.errors.slice(0, 3).map(String));
  console.log("world packs ok", {answered, types});
  if(fails){ console.log(fails, "FAILURES"); process.exit(1); }
  console.log("ALL TESTS PASSED");
  process.exit(0);
})();
