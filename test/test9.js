/* Boss battles: multi-hit fights, shield, strict grading, double final blow, rematch */
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
const doublesByLang = {};
const deacc = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
for(const lang of ["en", "es"]){
  for(const mode of [1, 2, 3, 5, 6, 8, 4]){
    const dom = boot(lang), w = dom.window, d = w.document, P = w.__pgm, $ = id => d.getElementById(id);
    P.setup.mode = mode; P.setup.level = mode === 5 ? "A2" : "B1"; P.setup.island = "";
    if(mode === 3 || mode === 6) P.setup.level = "A1";
    $("startBtn").click();
    const stat = {fights:0, wins:0, losses:0, doubles:0, strictTested:false, hits:0};
    let inFight = false;
    for(let turn = 0; turn < 160 && P.S; turn++){
      const S = P.S;
      if(S.status !== "playing"){ $("restartBtn").hidden ? $("overMenuBtn").click() : $("restartBtn").click(); if(!P.S || P.S.status !== "playing"){ P.setup.mode = mode; $("startBtn").click(); } continue; }
      if(mode === 6 && $("islHide") && !$("islHide").hidden && !d.getElementById("challengeCard").hidden === false) $("islHide").click();
      const c = S.current, ch = c.challenge, boss = c.plan && c.plan.boss && ch.boss;
      if(boss){
        if(!inFight){ stat.fights++; inFight = true; }
        if(ch.hint) fail(lang, mode, "boss has a hint");
        if(c.lesson.words.length) fail(lang, mode, "boss shows word list");
        if(!$("bossBar") || $("bossBar").hidden) fail(lang, mode, "no boss bar");
        if(!ch.strict) fail(lang, mode, "boss not strict");
        if(ch.double){
          stat.doubles++;
          // any valid wording of each sentence must count, not just the sampled combinations
          if(!Array.isArray(ch.parts) || ch.parts.length !== 2) fail(lang, mode, "double has no parts");
          else {
            const va = ch.parts[0].acc.flatMap(P.expand), vb = ch.parts[1].acc.flatMap(P.expand);
            const late = va[va.length - 1] + " " + vb[vb.length - 1];
            if(!P.gradeLocal(S, ch, late, false).correct) fail(lang, mode, "valid final-blow wording rejected", late);
            if(!P.gradeLocal(S, ch, va[0] + " + " + vb[0], false).correct) fail(lang, mode, "final blow with a plus sign rejected");
            if(P.gradeLocal(S, ch, va[0], false).correct) fail(lang, mode, "half a final blow accepted");
          }
        }
        const good = P.variantsOf(ch)[0];
        // strict accents: the accent-less answer must fail
        if(!stat.strictTested && ch.k === "s" && deacc(good) !== good){
          const j = P.gradeLocal(S, ch, deacc(good), false);
          if(j.correct) fail(lang, mode, "boss accepted missing accents", good);
          stat.strictTested = true;
        }
        const f = S.bossFight, hp0 = f.hp, sh0 = f.shield;
        // lose the first fight on purpose, win the rest
        const lose = stat.fights === 1 && stat.losses === 0;
        if(lose) $("giveUpBtn").click(); else { $("answer").value = good; $("submitBtn").click(); }
        const j = P.S.judgement;
        if(!lose && !j.correct && ch.k !== "p") fail(lang, mode, "boss rejected its own answer", ch.game, good);
        const nf = P.S.bossFight;
        if(lose){
          if(nf && nf.shield !== sh0 - 1) fail(lang, mode, "shield not reduced");
          if(!nf){ stat.losses++; inFight = false; if(!P.S.bossRematch && P.S.status === "playing") fail(lang, mode, "no rematch scheduled"); }
        } else if(j.correct){
          stat.hits++;
          if(hp0 === 1){ if(nf) fail(lang, mode, "boss survived at 0 hp"); stat.wins++; inFight = false; }
          else if(!nf || nf.hp !== hp0 - 1) fail(lang, mode, "hp not reduced");
        }
        continue;
      }
      inFight = false;
      $("answer").value = P.variantsOf(ch)[0];
      if(ch.game === "Match Madness"){
        for(const l of [...d.querySelectorAll('#pairs .pr[data-side="l"]')]){ l.click(); d.querySelector(`#pairs .pr[data-side="r"][data-pi="${l.dataset.pi}"]`).click(); }
      } else $("submitBtn").click();
    }
    if(!stat.fights) fail(lang, mode, "never met a boss");
    if(!stat.losses) fail(lang, mode, "never lost a fight");
    if(!stat.wins) fail(lang, mode, "never won a fight");
    if([1, 2, 3, 6, 8].includes(mode)) doublesByLang[lang] = (doublesByLang[lang] || 0) + stat.doubles;
    if(P.S && (P.S.bosses || 0) !== (P.S.bossKills || 0) && P.S.status === "playing") fail(lang, mode, "kill count mismatch", P.S.bosses, P.S.bossKills);
    if(dom.errors.length) fail(lang, mode, "errors", dom.errors.slice(0, 2));
    console.log(lang, "mode", mode, JSON.stringify(stat));
    w.close();
  }
}
for(const l of ["en", "es"]) if(!(doublesByLang[l] >= 3)) fail(l, "too few double final blows", doublesByLang[l]);
console.log(fails ? fails + " FAILURES" : "ALL TESTS PASSED");
process.exit(fails ? 1 : 0);
