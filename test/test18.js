/* More mini-games: Gap Fill, Order Up, Meaning Check, Number Pick, Number Match, Who's Doing It?, Tense Detective */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:(o,k) => () => ({addColorStop(){}})}); w.addEventListener("error", e => console.log("ERR", e.message)); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id); const P = w.__pgm, M = w.__mg2;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const JUDGE = new Set(["Meaning Check", "Who's Doing It?", "Tense Detective"]);
(async () => {
  await sleep(300);
  let bad = 0; const fail = (...a) => { bad++; if(bad < 40) console.log("FAIL", ...a); };
  const start = (tgt, nat, mode, level) => { w.__pickMode(mode); P.setup.mode = mode; P.setup.target = tgt; P.setup.native = nat; P.setup.level = level; $("targetSel").value = tgt; $("nativeSel").value = nat; P.startNew(); };
  const LANGS = [["Spanish","English"],["English","Spanish"],["French","English"],["Portuguese","English"],["Mandarin Chinese","English"],["Arabic","English"]];
  const MODES = {1:["Gap Fill","Order Up","Meaning Check"], 3:["Order Up"], 5:["Meaning Check"], 6:["Gap Fill","Order Up","Meaning Check"], 4:["Number Pick","Number Match"], 7:["Who's Doing It?","Tense Detective"]};
  const made = {};
  // 1. forced rounds: the game is made (often) and exactly one option is accepted
  for(const [tgt, nat] of LANGS) for(const mode of Object.keys(MODES).map(Number)) for(const level of ["A1","A2","B1"]){
    if(mode === 7 && tgt === "Mandarin Chinese") continue;
    start(tgt, nat, mode, level);
    const S = P.S; if(!S || S.status !== "playing") continue;
    const g = M.gamesFor(S);
    for(const name of MODES[mode]){
      if(mode === 6 && name === "Gap Fill" && !/^(Spanish|English)$/.test(tgt)){ if(g.includes(name)) fail("gap fill on gapless islands", tgt); continue; }
      if(!g.includes(name)) fail("not in rotation", tgt, mode, name);
      const k = `${tgt.slice(0,3)} ${mode} ${name}`; made[k] = made[k] || [0, 0];
      for(let i = 0; i < 12; i++){
        const plan = Object.assign({}, S.current.plan || {kind:"syllabus", idx:0}, {game:name, boss:false});
        if(plan.kind === "syllabus" && Array.isArray(S.syllabus) && S.syllabus.length) plan.idx = i % S.syllabus.length;   // islands teach one phrase per step: try several
        let res; try{ res = M.gen(JSON.parse(JSON.stringify(S)), plan); }catch(e){ fail("crash", k, e.message); break; }
        const ch = res && res.challenge; made[k][1]++;
        if(!ch) { fail("no challenge", k); continue; }
        if(ch.game !== name) continue;
        made[k][0]++;
        if(!Array.isArray(ch.opts) || ch.opts.length < (name === "Meaning Check" ? 2 : 3)) fail("options", k, ch.opts);
        const right = ch.opts.filter(o => P.gradeLocal(S, ch, o, false).correct);
        if(right.length !== 1) fail("one right option", k, ch.target, JSON.stringify(ch.opts), right);
        if(new Set(ch.opts).size !== ch.opts.length) fail("duplicate options", k, ch.opts);
        if(!ch.task) fail("no task", k);
        if(JUDGE.has(name) && !ch.info) fail("no info", k);
      }
    }
  }
  const sum = {};
  for(const [k, [a, n]] of Object.entries(made)){ const g = k.split(" ").slice(2).join(" "); sum[g] = sum[g] || [0, 0]; sum[g][0] += a; sum[g][1] += n; if(n >= 12 && a === 0 && !/^(Man|Ara) 3 Order Up|^Eng 7 Who/.test(k)) fail("never made", k); }
  // 2. real play: tap answers and check the card
  const seen = {};
  for(const [tgt, nat] of LANGS) for(const mode of [1, 4, 5, 7]){
    if(mode === 7 && tgt === "Mandarin Chinese") continue;
    start(tgt, nat, mode, "A2");
    for(let i = 0; i < 70; i++){
      const S = P.S; if(S.status !== "playing") break;
      const ch = S.current.challenge;
      if(M.MG2.includes(ch.game)){
        const k = tgt.slice(0,3) + mode + " " + ch.game; seen[k] = (seen[k] || 0) + 1;
        const right = ch.opts.filter(o => P.gradeLocal(S, ch, o, false).correct);
        const tiles = [...d.querySelectorAll("#tiles .tile[data-i]")];
        if(!tiles.length || !$("answer").hidden){ fail("options not shown", k); break; }
        const good = i % 3 !== 0, want = good ? right[0] : ch.opts.find(x => x !== right[0]);
        tiles[ch.opts.indexOf(want)].click(); await sleep(200);
        const j = P.S.judgement; if(!j || j.correct !== good) fail("graded", k, want, j && j.correct);
        if(JUDGE.has(ch.game) && P.S.status === "playing"){
          const card = $("judgeCard").querySelector(".ans");
          if(!card || !card.querySelector(".fbfix")) fail("card missing the answer row", k, card && card.textContent);
          if(card && /What went wrong|Qué falló/.test(card.textContent)) fail("word diff on labels", k);
        }
      } else if(Array.isArray(ch.opts) && $("answer").hidden && d.querySelector("#tiles .tile[data-i]")){
        const r = ch.opts.find(o => P.gradeLocal(S, ch, o, false).correct) || ch.opts[0];
        [...d.querySelectorAll("#tiles .tile[data-i]")][ch.opts.indexOf(r)].click(); await sleep(200);
      } else { $("answer").value = P.variantsOf(ch)[0] || "x"; $("submitBtn").click(); }
      const nx = $("nextBtn"); if(nx && !nx.hidden) nx.click();
    }
  }
  for(const g of M.MG2) if(!Object.keys(seen).some(k => k.endsWith(" " + g))) fail("never played", g);
  console.log(JSON.stringify(sum));
  console.log(bad ? bad + " failures" : "more mini-games ok: " + JSON.stringify(seen)); process.exit(bad ? 1 : 0);
})();
