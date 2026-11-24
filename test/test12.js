/* More languages in the main game */
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
  beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:true, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
    w.HTMLElement.prototype.scrollIntoView = function(){}; w.addEventListener("error", e => fail("page error", e.message)); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id);
const setTarget = L => { const s = $("targetSel"); s.value = L; s.dispatchEvent(new w.Event("change", {bubbles:true})); };
(async () => {
  await new Promise(r => setTimeout(r, 300));
  const P = w.__pgm, X = w.__xl;
  /* ---------- the picker ---------- */
  const tg = [...$("targetSel").options].map(o => o.value);
  for(const L of ["English", "Spanish", "French", "Portuguese", "Mandarin Chinese", "Arabic"]) if(!tg.includes(L)) fail("missing course", L);
  if(d.getElementById("worldBtn") || d.getElementById("worldPage")) fail("World Languages section should be gone");
  /* ---------- course content ---------- */
  for(const code of ["fr", "pt", "zh", "ar"]){
    const C = P.COURSE[code];
    if(!C || !C.A1 || !C.A2) { fail(code, "missing A1/A2"); continue; }
    if(C.A1.length < 8 || C.A2.length < 8) fail(code, "expected 8 lessons per level");
    for(const lv of ["A1", "A2"]) for(const c of C[lv]){
      if(!c.t || !c.b || !c.w.length || c.it.length < 4) fail(code, lv, c.t, "incomplete lesson");
      for(const it of c.it){
        if(!P.blank(P.canon(it[1]), it[2])) fail(code, c.t, "cloze word not in sentence", it[1], it[2]);
        if(it[3]){ const ok = P.gradeLocal({target:"x", native:"English"}, {k:"s", al:code, acc:[it[1]], game:"Classic Mine"}, it[3]); if(ok.correct) fail(code, "wrong version graded right", it[3]); }
        const self = P.gradeLocal({target:"x", native:"English"}, {k:"s", al:code, acc:[it[1]], game:"Classic Mine"}, P.canon(it[1]));
        if(!self.correct) fail(code, "own answer not accepted", it[1]);
        if(code === "zh" || code === "ar"){
          const rom = it[1].split("|")[1];
          if(!rom) fail(code, "no romanization alternative", it[1]);
          else { const plain = rom.normalize("NFD").replace(/[̀-ͯ]/g, ""); const g = P.gradeLocal({target:"x", native:"English"}, {k:"s", al:code, acc:[it[1]], game:"Classic Mine"}, plain); if(!g.correct) fail(code, "plain-letter romanization not accepted", plain); }
        }
      }
    }
  }
  /* ---------- playing each new course in each available mode ---------- */
  for(const L of ["French", "Portuguese", "Mandarin Chinese", "Arabic"]){
    setTarget(L);
    if($("nativeSel").value !== "English") fail(L, "native should be English");
    const disabled = [...d.querySelectorAll("#modes [data-mode]")].filter(b => b.disabled).map(b => +b.dataset.mode);
    if(disabled.length) fail(L, "every mode should be open now", disabled);   // langmodes.js gives every mode content (test17 plays them)
    if($("storiesBtn").disabled) fail(L, "stories should be open");
    for(const mode of [1, 2, 3]) for(const lv of ["A1", "A2"]){
      P.setup.mode = mode; P.setup.level = lv; P.startNew();
      const S0 = w.__pgm.S;
      if(S0.target !== L || S0.native !== "English") { fail(L, "started wrong course", S0.target, S0.native); break; }
      for(let k = 0; k < 30; k++){
        const S = w.__pgm.S; if(!S.current) { fail(L, mode, "no challenge"); break; }
        const ch = S.current.challenge;
        if(ch.al !== LANG_CODE_OF(L) && ch.al !== "en") fail(L, mode, "challenge in another language", ch.game, ch.al, ch.target);
        if(/Digit|Clock|Price|Time Machine|Verb Forge|Slip Fixer|Linguistic/.test(ch.game)) fail(L, "mode mixing leaked", ch.game);
        if((ch.al === "zh" || ch.al === "ar") && /Classic Mine|Cloze Combat|Error Hunter/.test(ch.game) && $("tiles").hidden) fail(L, ch.game, "no tiles for non-Latin script");
        $("answer").value = P.variantsOf(ch)[0]; $("submitBtn").click();
        if(!w.__pgm.S.judgement || !w.__pgm.S.judgement.correct) fail(L, mode, ch.game, "right answer graded wrong", ch.acc[0]);
        if(w.__pgm.S.status !== "playing") break;
        const nb = $("nextBtn"); if(nb) nb.click();
      }
    }
  }
  function LANG_CODE_OF(L){ return {French:"fr", Portuguese:"pt", "Mandarin Chinese":"zh", Arabic:"ar"}[L]; }
  // Spanish and English still work and still offer every mode
  setTarget("Spanish");
  if([...d.querySelectorAll("#modes [data-mode]")].some(b => b.disabled)) fail("Spanish has disabled modes");
  P.setup.mode = 4; P.setup.level = "A1"; P.startNew();
  if(!w.__pgm.S || w.__pgm.S.target !== "Spanish") fail("Spanish numbers did not start");
  if(fails){ console.log(fails, "FAILURES"); process.exit(1); }
  console.log("ALL TESTS PASSED");
  process.exit(0);
})();
