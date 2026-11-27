/* French, Portuguese, Mandarin, Arabic content checks (2.15): every sentence's readings are accepted,
   every planted mistake is rejected, English prompts are unique per course, romanization lines up word for word. */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 80) console.log("FAIL", ...a); };
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:() => () => ({addColorStop(){}})}); }});
const w = dom.window, P = w.__pgm;

setTimeout(() => {
  const PUN = /[.,!?¿¡;:。，！？、،؟"«»“”…]/g;
  const st = {mode:1, target:"x", native:"English"};
  const counts = {};
  for(const code of ["fr", "pt", "zh", "ar"]){
    const C = P.COURSE[code]; let n = 0;
    const prompts = new Map(), targets = new Map();
    for(const lv in C) for(const L of C[lv]) for(const it of L.it){
      n++;
      const en = it[0].trim().toLowerCase();
      if(prompts.has(en)) fail(code, "duplicate English prompt", it[0], "in", L.t, "and", prompts.get(en));
      prompts.set(en, L.t);
      const first = P.canon(it[1]).replace(PUN, "").replace(/\s+/g, "").toLowerCase();
      if(targets.has(first)) fail(code, "duplicate sentence", it[1], "in", L.t, "and", targets.get(first));
      targets.set(first, L.t);
      const ch = {k:"s", al:code, acc:[it[1]], game:"Classic Mine", target:it[0], answerKey:P.canon(it[1]), cw:[], why:""};
      for(const v of P.expand(it[1])){
        const r = P.gradeLocal(st, ch, v, false);
        if(!r.correct) fail(code, lv, L.t, "reading rejected:", v);
      }
      if(it[3]){
        if(P.gradeLocal(st, ch, it[3], false).correct) fail(code, lv, L.t, "planted mistake accepted:", it[3]);
        if(P.gradeLocal({...st, mode:3}, ch, it[3], false).correct) fail(code, lv, L.t, "planted mistake accepted (strict):", it[3]);
      }
    }
    counts[code] = n;
  }
  // romanization: one entry per word in the source packs
  const vm = require("vm"), ctx = {}; vm.createContext(ctx);
  for(const c of ["zh", "ar"]) for(const sfx of ["", "2", "3", "4", "5"]){
    const f = path.join(__dirname, "..", "src", `lang_${c}${sfx}.js`);
    if(fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, "utf8").replace(/^var WL = WL \|\| \{\};/m, "var WL = this.WL || {}; this.WL = WL;").replace(/^const /gm, "var "), ctx);
  }
  for(const code of ["zh", "ar"]) for(const u of ctx.WL[code].units) for(const s of u.s){
    if(!s[2]) continue;
    const disp = /[|[\]()]/.test(s[1]) ? P.canon(s[1]) : s[1];
    const tk = disp.split(/\s+/).map(x => x.replace(PUN, "")).filter(Boolean);
    const rk = String(s[2]).split(/ +/).filter(Boolean);
    if(tk.length !== rk.length) fail(code, u.t, "romanization has", rk.length, "entries for", tk.length, "words:", s[1], "|", s[2]);
  }
  // word lists: every target and every English meaning once per pack; tips need a bold term
  for(const code of ["fr", "pt", "zh", "ar"]){
    const seenT = new Map(), seenE = new Map();
    for(const lv in P.COURSE[code]) for(const L of P.COURSE[code][lv]){
      if(!/\*\*[^*]+\*\*/.test(L.b || "")) fail(code, L.t, "tip has no bold term");
      for(const [t, e] of L.w){
        const k = t.replace(/ \(.*\)$/, "").toLowerCase(), m = e.toLowerCase();
        if(seenT.has(k)) fail(code, "duplicate word", t, "in", L.t, "and", seenT.get(k)); seenT.set(k, L.t);
        if(seenE.has(m)) fail(code, "duplicate meaning", e, "in", L.t, "and", seenE.get(m)); seenE.set(m, L.t);
      }
    }
  }
  // the answer card's pinyin / transliteration belongs to the judged answer, not to the next question
  const d = w.document, $ = id => d.getElementById(id), X = w.__xl;
  for(const [L, code] of [["Mandarin Chinese", "zh"], ["Arabic", "ar"]]){
    const sel = $("targetSel"); sel.value = L; sel.dispatchEvent(new w.Event("change", {bubbles:true}));
    P.setup.mode = 2; P.setup.level = "B2"; $("startBtn").click();
    let checked = 0;
    for(let i = 0; i < 80 && checked < 4 && P.S && P.S.status === "playing"; i++){
      const ch = P.S.current.challenge;
      const mine = ch.game === "Classic Mine" && ch.al === code && !Array.isArray(ch.opts);
      $("giveUpBtn").click();
      if(mine){
        const r = d.querySelector("#judgeCard .xlrom"), want = X.XL_ROM[X.xlKey ? X.xlKey(P.S.judgement.answer) : P.S.judgement.answer];
        if(!r) fail(code, "no reading line on the answer card", P.S.judgement.answer);
        else if(want && r.textContent !== want) fail(code, "answer card reading belongs to another sentence:", P.S.judgement.answer, "|", r.textContent);
        if(code === "zh" && /[㐀-鿿] [㐀-鿿]/.test([...d.querySelectorAll("#judgeCard *")].filter(e => !e.closest(".xlrom") && !e.children.length).map(e => e.textContent).join("|"))) fail("zh answer card shows spaces between Chinese words");
        checked++;
      }
      const c = $("continueBtn"); if(c && !c.hidden) c.click();
    }
    if(!checked) fail(code, "no Classic Mine round to check the reading line");
  }
  for(const code in counts) if(counts[code] < 300) fail(code, "only", counts[code], "sentences");
  console.log(fails ? `test23: ${fails} failures` : `test23: new-language content OK ${JSON.stringify(counts)}`);
  process.exit(fails ? 1 : 0);
}, 2500);
