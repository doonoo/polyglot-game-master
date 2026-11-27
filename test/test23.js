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
  for(const c of ["zh", "ar"]) for(const sfx of ["", "2", "3", "4"]){
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
  for(const code in counts) if(counts[code] < 300) fail(code, "only", counts[code], "sentences");
  console.log(fails ? `test23: ${fails} failures` : `test23: new-language content OK ${JSON.stringify(counts)}`);
  process.exit(fails ? 1 : 0);
}, 2500);
