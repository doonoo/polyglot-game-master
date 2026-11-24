/* The multiple-choice mini-games: Quick Pick, Meaning Match, Right or Wrong, Spot the Mistake */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:(o,k) => () => ({addColorStop(){}})}); w.addEventListener("error", e => console.log("ERR", e.message)); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id); const P = w.__pgm;
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await sleep(300);
  const seen = {}, MC = ["Quick Pick","Meaning Match","Right or Wrong","Spot the Mistake"]; let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
  for(const [tgt, nat, mode] of [["Spanish","English",1],["English","Spanish",1],["Spanish","English",3],["Spanish","English",5],["Spanish","English",7],["Spanish","English",8],["French","English",1],["Mandarin Chinese","English",1]]){
    d.querySelector(`#modes [data-mode="${mode}"]`).click(); P.setup.mode = mode; P.setup.target = tgt; P.setup.native = nat; P.setup.level = "A1"; $("targetSel").value = tgt; $("nativeSel").value = nat; P.startNew();
    for(let i = 0; i < (mode === 1 || mode === 8 ? 90 : 40); i++){
      const S = P.S; if(S.status !== "playing") break;
      const ch = S.current.challenge;
      if(MC.includes(ch.game)){
        const k = tgt.slice(0,2) + mode + " " + ch.game; seen[k] = (seen[k] || 0) + 1;
        const right = ch.opts.filter(o => P.gradeLocal(S, ch, o, false).correct);
        if(right.length !== 1) fail("one right option", k, ch.target, ch.opts, right);
                const tiles = [...d.querySelectorAll("#tiles .tile[data-i]")];
        if(!tiles.length || !$("answer").hidden){ fail("options not shown", k); break; }
        const good = i % 3 !== 0, want = good ? right[0] : ch.opts.find(x => x !== right[0]);
        tiles[ch.opts.indexOf(want)].click(); await sleep(200);
        const j = P.S.judgement; if(j.correct !== good) fail("graded", k, want, j.correct);
        if((ch.game === "Right or Wrong" || ch.game === "Spot the Mistake") && !/\*\*/.test(j.feedback) ) fail("fixed sentence missing", k, j.feedback);
      } else { $("answer").value = P.variantsOf(ch)[0] || "x"; $("submitBtn").click(); }
    }
  }
  for(const g of MC) if(!seen["Sp1 " + g] && !seen["En1 " + g]) fail("never played", g);
  for(const k of ["Sp5 Quick Pick","Sp7 Quick Pick"]) if(!seen[k]) fail("never played", k);
  if(!seen["Fr1 Quick Pick"] && !seen["Fr1 Meaning Match"]) fail("no option games in French");
  if(!seen["Ma1 Quick Pick"] && !seen["Ma1 Meaning Match"]) fail("no option games in Mandarin");
  // quiz screens (typing) never get the option games
  if(w.__mcg.gamesFor({mode:1}).filter(g => MC.includes(g)).length !== 4) fail("rotation", w.__mcg.gamesFor({mode:1}));
  for(const m of [1,2,3,5,6,8]) if(w.__mcg.gamesFor({mode:m}).some(g => g === "Echo Chamber" || g === "Speak Up")) fail("listening / speaking rounds should be gone", m);
  console.log(bad ? bad + " failures" : "mini-games ok: " + JSON.stringify(seen)); process.exit(bad ? 1 : 0);
})();
