/* Voice exercises (Speak Up + dictation) and the idiom/slang lessons */
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 40) console.log("FAIL", ...a); };
const tick = (ms = 5) => new Promise(r => setTimeout(r, ms));
function boot(lang, speech){
  const errors = [];
  const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
    beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:true, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function(){}; Object.defineProperty(w.navigator, "language", {value:lang, configurable:true});
      if(speech){
        w.__said = []; w.__speechErr = "";
        w.webkitSpeechRecognition = class {
          start(){ const me = this; w.__lastLang = this.lang;
            setTimeout(() => {
              if(w.__speechErr){ me.onerror && me.onerror({error:w.__speechErr}); }
              else { const alts = w.__said.slice(); const res = alts.map(t => ({transcript:t})); res.length = alts.length; me.onresult && me.onresult({results:[res]}); }
              me.onend && me.onend();
            }, 1); }
          stop(){}
        };
      }
      w.addEventListener("error", e => errors.push(e.error || e.message)); }});
  dom.errors = errors; return dom;
}
const bare = s => s.toLowerCase().replace(/[¿¡?!.,;:]/g, "").replace(/\s+/g, " ").trim();

(async () => {
  for(const lang of ["en", "es"]){
    /* ---------- with speech recognition ---------- */
    const dom = boot(lang, true), w = dom.window, d = w.document, P = w.__pgm, $ = id => d.getElementById(id);
    if($("voiceExRow").hidden) fail(lang, "voice toggle hidden although supported");
    P.setup.mode = 1; P.setup.level = "B1"; P.setup.island = "";
    $("startBtn").click();
    const stat = {speak:0, read:0, talk:0, ok:0, close:0, wrong:0, dict:0};
    for(let turn = 0; turn < 220 && P.S; turn++){
      const S = P.S;
      if(S.status !== "playing"){ $("restartBtn").hidden ? $("overMenuBtn").click() : $("restartBtn").click(); if(!P.S || P.S.status !== "playing"){ P.setup.mode = 1; $("startBtn").click(); } continue; }
      const ch = S.current.challenge, good = P.variantsOf(ch)[0];
      if(ch.game === "Speak Up"){
        stat.speak++;
        const reading = ch.target === ch.answerKey; reading ? stat.read++ : stat.talk++;
        if(ch.boss) fail(lang, "Speak Up during a boss");
        if($("speakBox").hidden || !d.querySelector("[data-vmic]")) fail(lang, "no mic button on Speak Up");
        if(!$("micBtn").hidden) fail(lang, "dictation mic shown on Speak Up");
        let expectOk = true;
        const words = good.split(" ");
        if(stat.speak % 5 === 3){ w.__said = ["completely different words here"]; expectOk = false; }
        else if(stat.speak % 5 === 4 && reading && words.length >= 6){
          const ws = bare(good).split(" "); ws[ws.length - 1] = "zzzz"; w.__said = [ws.join(" ")]; stat.close++;
        } else w.__said = ["uh", bare(good)];
        d.querySelector("[data-vmic]").click();
        await tick(10);
        if(!w.__lastLang || !w.__lastLang.startsWith(ch.al)) fail(lang, "wrong recognition language", w.__lastLang, ch.al);
        const j = P.S.judgement;
        if(!j) { fail(lang, "speaking did not submit"); continue; }
        if(expectOk && !j.correct) fail(lang, "spoken answer rejected", good, w.__said);
        if(!expectOk){ if(j.correct) fail(lang, "wrong speech accepted", good); else stat.wrong++; }
        if(expectOk && j.correct) stat.ok++;
        if($("continueBtn") && !$("continueBtn").hidden) $("continueBtn").click();
        continue;
      }
      if(!$("micBtn").hidden && ch.k === "s" && stat.dict < 3){
        w.__said = [bare(good)];
        $("micBtn").click(); await tick(10);
        if(bare($("answer").value) !== bare(good)) fail(lang, "dictation did not fill the answer", $("answer").value);
        stat.dict++;
      }
      if(ch.k === "p" || !d.querySelector("#tiles").hidden && ch.game !== "Word Duel") $("giveUpBtn").click();
      else { $("answer").value = good; $("submitBtn").click(); }
      if($("continueBtn") && !$("continueBtn").hidden) $("continueBtn").click();
    }
    if(stat.speak < 8) fail(lang, "Speak Up rarely appears", stat.speak);
    if(!stat.read || !stat.talk) fail(lang, "need both read-aloud and say-it rounds", stat);
    if(!stat.dict) fail(lang, "dictation never used");
    // skip button swaps for a typing round
    let guard = 0;
    while(P.S && P.S.status === "playing" && P.S.current.challenge.game !== "Speak Up" && guard++ < 200){
      const ch = P.S.current.challenge; $("answer").value = P.variantsOf(ch)[0] || "x"; ch.k === "p" ? $("giveUpBtn").click() : $("submitBtn").click();
      if($("continueBtn") && !$("continueBtn").hidden) $("continueBtn").click();
    }
    if(P.S && P.S.current && P.S.current.challenge.game === "Speak Up"){
      d.querySelector("[data-vskip]").click();
      if(P.S.current.challenge.game === "Speak Up") fail(lang, "skip did not swap the round");
      if(!$("speakBox").hidden) fail(lang, "speak box still shown after skip");
    }
    // microphone denied: voice goes away
    guard = 0;
    while(P.S && P.S.status === "playing" && $("micBtn").hidden && guard++ < 50){
      const ch = P.S.current.challenge; if(ch.game === "Speak Up"){ d.querySelector("[data-vskip]").click(); continue; }
      $("answer").value = P.variantsOf(ch)[0] || "x"; ch.k === "p" ? $("giveUpBtn").click() : $("submitBtn").click();
      if($("continueBtn") && !$("continueBtn").hidden) $("continueBtn").click();
    }
    w.__speechErr = "not-allowed";
    if(!$("micBtn").hidden){ $("micBtn").click(); await tick(10); }
    if(!$("micBtn").hidden || !$("voiceExRow").hidden) fail(lang, "voice still offered after the mic was denied");
    console.log(lang, "voice ok", JSON.stringify(stat));
    if(dom.errors.length) fail(lang, "page errors", dom.errors.slice(0, 3));

    /* ---------- without speech recognition ---------- */
    const d2 = boot(lang, false), w2 = d2.window, P2 = w2.__pgm, $2 = id => w2.document.getElementById(id);
    if(!$2("voiceExRow").hidden) fail(lang, "voice toggle shown without support");
    P2.setup.mode = 2; P2.setup.level = "A2"; P2.setup.island = ""; $2("startBtn").click();
    for(let turn = 0; turn < 120 && P2.S && P2.S.status === "playing"; turn++){
      const ch = P2.S.current.challenge;
      if(ch.game === "Speak Up") { fail(lang, "Speak Up without speech support"); break; }
      if(!$2("micBtn") || !$2("micBtn").hidden) { fail(lang, "mic shown without support"); break; }
      $2("answer").value = P2.variantsOf(ch)[0] || "x"; ch.k === "p" ? $2("giveUpBtn").click() : $2("submitBtn").click();
      if($2("continueBtn") && !$2("continueBtn").hidden) $2("continueBtn").click();
    }
  }

  /* ---------- idiom and slang lessons ---------- */
  const dom = boot("en", false), P = dom.window.__pgm;
  const want = {es:{B1:["Everyday idioms"], B2:["Body and animal idioms", "Slang around the Spanish-speaking world"]},
    en:{B1:["Modismos en inglés del día a día"], B2:["Más modismos: cuerpo, animales y dinero", "Jerga (slang) en inglés"]}};
  let n = 0;
  for(const tg of ["es", "en"]) for(const lv in want[tg]) for(const title of want[tg][lv]){
    const c = P.COURSE[tg][lv].find(x => x.t === title);
    if(!c){ fail("missing lesson", tg, lv, title); continue; }
    if(c.it.length < 12) fail("lesson too small", title, c.it.length);
    n += c.it.length;
  }
  const slang = P.COURSE.es.B2.find(x => x.t === "Slang around the Spanish-speaking world");
  if(slang){
    const it = slang.it[0], st = {mode:2, native:"English", target:"Spanish"};
    // the region shows in the prompt, but typing the phrase back without it is fine
    const shown = P.expand(it[0])[0];
    if(!/Mexico/.test(shown)) fail("region not shown in prompt", shown);
    const rev = {k:"s", al:"en", acc:[it[0]], answerKey:shown};
    if(!P.gradeLocal(st, rev, "That's cool!", false).correct) fail("region required when translating back");
  }
  console.log("idiom/slang items:", n);
  if(fails){ console.log(fails + " FAILURES"); process.exit(1); }
  console.log("ALL TESTS PASSED");
  process.exit(0);
})().catch(e => { console.log("CRASH", e); process.exit(1); });
