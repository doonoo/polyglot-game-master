/* ===================== Multiple choice answers =====================
   An answer mode that works in every game mode, every language and in two-player games:
   instead of typing, the player taps one of up to 4 options (keys 1-4 on a PC).
   The run keeps its style in S.mc (set from localStorage pgm-mc when it starts).
   Generators stash raw candidates in ch.mcx ({w:[near misses], s:[siblings]});
   the outer generate() wrapper turns them into ch.opts = shuffled [right, 3 wrong],
   checking with gradeLocal that no wrong option would be accepted. ch.opts already
   survives every challenge copy (Word Duel uses it), so nothing else needs to know. */
Object.assign(I18N.en, {mc_label:"Answer mode", mc_type:"Type", mc_pick:"Multiple choice", mc_note:"Tap one of 4 answers instead of typing. Works in every mode."});
Object.assign(I18N.es, {mc_label:"Forma de responder", mc_type:"Escribir", mc_pick:"Opción múltiple", mc_note:"Toca una de 4 respuestas en vez de escribir. Funciona en todos los modos."});

// multiple-choice mini-games (mcgames.js): always options, whatever the answer mode
const MCG = new Set(["Quick Pick", "Meaning Match", "Right or Wrong", "Spot the Mistake"]);
const mcWant = (st, plan) => !!(st && (st.mc || (plan && plan.mcg)));
let MCS = false;
try{ MCS = localStorage.getItem("pgm-mc") === "1"; }catch(e){}
const mcSave = () => { try{ localStorage.setItem("pgm-mc", MCS ? "1" : "0"); }catch(e){} };
const mcNoSp = s => String(s || "").replace(/\s+/g, " ").trim();
const mcStrip = s => String(s || "").replace(/^~/, "");

freshState = (orig => function(o){ const st = orig.apply(this, arguments); st.mc = MCS; return st; })(freshState);

/* ---------- candidate pools, stashed by each generator ---------- */
genSentence = (orig => function(st, plan, c){
  const res = orig.apply(this, arguments);
  try{
    const ch = res && res.challenge;
    if(mcWant(st, plan) && ch && c && Array.isArray(c.it)){
      const rev = ch.game === "Reverse Mine", cz = ch.game === "Cloze Combat";
      const it = c.it.find(x => rev ? x[0] === ch.acc[0] : cz ? x[1] === ch.acc[1] : x[1] === ch.acc[0]);
      const others = shuffle(c.it.filter(x => x !== it));
      const w = [], s = [];
      if(rev) s.push(...others.map(x => canon(x[0])));
      else if(cz){
        if(it && it[3]){
          // only when the wrong version swaps exactly the blanked word
          const Tt = canon(it[1]).split(" "), Wt = canon(mcStrip(it[3])).split(" ");
          const T = new Set(Tt.map(bare)), Wset = new Set(Wt.map(bare));
          const W = Wt.filter(x => !T.has(bare(x))), gone = Tt.filter(x => !Wset.has(bare(x))).map(bare).join(" ");
          if(W.length && W.length <= 2 && gone === bare(it[2])) w.push(W.join(" ").replace(/^[¿¡]+|[.,!?;:]+$/g, ""));
        }
        w.push(...((it && it[4]) || c.o || []));
        s.push(...others.map(x => x[2]).filter(Boolean));
        s.push(...(c.w || []).map(x => x[0]).filter(x => x && !/\s/.test(x)));
      } else {
        if(ch.game === "Error Hunter") w.push(ch.target);
        if(it && it[3]) w.push(canon(mcStrip(it[3])));
        s.push(...others.map(x => canon(x[1])));
      }
      // the meaning of the item and of each sibling (Right or Wrong and Spot the Mistake show them)
      ch.mcx = {w, s, n:it ? canon(it[0]) : "", sm:(!rev && !cz) ? others.map(x => canon(x[0])) : []};
    }
  }catch(e){}
  return res;
})(genSentence);

genVocab = (orig => function(st, plan){
  const res = orig.apply(this, arguments);
  try{
    const ch = res && res.challenge;
    if(mcWant(st, plan) && ch && ch.k === "w"){
      const nat = LANG_CODE[st.native], tgt = LANG_CODE[st.target];
      const list = (typeof customVocab === "function" ? customVocab(tgt, st.level) || customVocab(tgt, "A1") : null) || VLIST[st.level] || VLIST.A1, entry = VMAP[tgt][String(ch.wk || "").toLowerCase()];
      const side = ch.al === tgt ? tgt : nat;
      const same = entry ? shuffle(list.filter(e => e !== entry && e.cat === entry.cat)) : [];
      const rest = shuffle(list.filter(e => e !== entry && !(entry && e.cat === entry.cat))).slice(0, 12);
      ch.mcx = {w:[], s:same.concat(rest).map(e => first(e[side]))};
    }
  }catch(e){}
  return res;
})(genVocab);

genNumber = (orig => function(st, plan, c){
  const res = orig.apply(this, arguments);
  try{
    const ch = res && res.challenge;
    if(st && st.mc && ch && c){
      const tgt = LANG_CODE[st.target], s = [];
      for(let i = 0; i < 30 && s.length < 8; i++){
        const q = numChallenge(c, tgt, "", true);
        if(q && q.target !== ch.target && q.acc && q.acc[0]) s.push(q.acc[0]);
      }
      ch.mcx = {w:[], s};
    }
  }catch(e){}
  return res;
})(genNumber);

let mcLastQ = null;
conjQuestion = (orig => function(){ const q = orig.apply(this, arguments); mcLastQ = q; return q; })(conjQuestion);
genConj = (orig => function(st, plan, c){
  mcLastQ = null;
  const res = orig.apply(this, arguments);
  try{
    const ch = res && res.challenge, q = mcLastQ;
    if(mcWant(st, plan) && ch && q){
      const tgt = LANG_CODE[st.target], w = shuffle([...conjWrongs(tgt, q)]), s = [];
      if(tgt === "es") for(const tn of shuffle(c.ten || [])) if(tn !== q.ten){ try{ const f = esForm(q.inf, tn, q.p); if(f && f[0]) s.push(f[0]); }catch(e){} }
      ch.mcx = {w, s};
    }
  }catch(e){}
  return res;
})(genConj);

/* ---------- near misses made from the right answer ---------- */
const MC_SWAP = {el:"la", la:"el", los:"las", las:"los", un:"una", una:"un", le:"la", du:"de la", o:"a", a:"o", os:"as", as:"os", um:"uma", uma:"um"};
function mcPerturb(right, ch, pool){
  const out = [], m = String(right).match(/^(.*?)([.?!。？！]*)$/), body = m[1], end = m[2];
  const toks = body.split(" ").filter(Boolean);
  const join = a => a.join(" ") + end;
  if(toks.length >= 3){
    const i = 1 + Math.floor(Math.random() * (toks.length - 2)), a = toks.slice();
    if(!/[,;:]$/.test(a[i]) && !/[,;:]$/.test(a[i + 1])){ [a[i], a[i + 1]] = [a[i + 1], a[i]]; out.push(join(a)); }
  }
  // swap an article for its partner (el ↔ la, un ↔ una…)
  const ai = toks.findIndex(x => MC_SWAP[x.toLowerCase()] !== undefined);
  if(ai >= 0 && ch.al !== "en"){
    const a = toks.slice(), sw = MC_SWAP[a[ai].toLowerCase()];
    a[ai] = a[ai][0] === a[ai][0].toUpperCase() && a[ai][0] !== a[ai][0].toLowerCase() ? cap(sw) : sw; out.push(join(a));
  }
  // replace one word with a word from the sibling answers
  const ptoks = shuffle([...new Set(pool.flatMap(p => String(p).replace(/[.?!。？！,¿¡]+/g, "").split(" ")).filter(x => x && !toks.includes(x) && (x === "I" || x[0] === x[0].toLowerCase() || /[㐀-鿿]/.test(x))))]);
  if(toks.length >= 2 && ptoks.length){
    const i = 1 + Math.floor(Math.random() * (toks.length - 1)), a = toks.slice();
    a[i] = ptoks[0]; out.push(join(a));
  }
  // a single word: two letters trade places (spelling)
  if(toks.length === 1 && toks[0].length >= 4 && /^\p{L}+$/u.test(toks[0]) && !/[㐀-鿿]/.test(toks[0])){
    const w = [...toks[0]], i = 1 + Math.floor(Math.random() * (w.length - 2));
    if(w[i] !== w[i + 1]){ [w[i], w[i + 1]] = [w[i + 1], w[i]]; out.push(w.join("") + end); }
  }
  if(toks.length >= 4){ const a = toks.slice(), i = 1 + Math.floor(Math.random() * (toks.length - 1)); a.splice(i, 1); out.push(join(a)); }
  return shuffle(out);
}

function mcBuild(st, ch){
  const mcx = ch.mcx; delete ch.mcx;
  if(ch.k === "p" || ch.parts || Array.isArray(ch.opts) || ch.game === "Odd One Out" || ch.game === "Match Madness") return;
  const loose = {native:st.native, mode:1};
  const ok = (a, s) => { try{ return gradeLocal(s || loose, ch, a, false).correct; }catch(e){ return false; } };
  let right = ch.game === "Cloze Combat" ? first(ch.acc[0]) : String(ch.answerKey || "");
  if(!right || !ok(right, st)){ right = variantsOf(ch).find(v => ok(v, st)); if(!right) return; }
  right = mcNoSp(right);
  const key = x => norm(x, ch.al, false);
  const seen = new Set([key(right)]), out = [];
  const take = (list, n) => {
    for(const x0 of list){
      if(out.length >= 3 || n <= 0) break;
      const x = mcNoSp(x0);
      if(!x || x.length > right.length * 2.6 + 12) continue;
      const k = key(x);
      if(!k || seen.has(k) || ok(x)) continue;
      seen.add(k); out.push(x); n--;
    }
  };
  const w = (mcx && mcx.w) || [], s = (mcx && mcx.s) || [];
  // closer lengths first, so the right answer doesn't stand out
  const n0 = right.split(" ").length;
  const sib = s.slice().sort((a, b) => Math.abs(String(a).split(" ").length - n0) - Math.abs(String(b).split(" ").length - n0));
  take(w, 2);
  take(mcPerturb(right, ch, s), 1);
  take(sib, 3);
  take(mcPerturb(right, ch, s), 3);
  if(out.length < 2) return;                 // not enough honest options: keep it a typing round
  // one-word answers: every option starts with the same kind of letter as the right one
  if(!/\s/.test(right)){
    const up = right[0] !== right[0].toLowerCase();
    for(let i = 0; i < out.length; i++) if(!/\s/.test(out[i]) && out[i] !== "I") out[i] = up ? cap(out[i]) : out[i][0].toLowerCase() + out[i].slice(1);
    if(new Set(out.map(key).concat(key(right))).size !== out.length + 1 || out.some(x => ok(x))) return;
  }
  ch.opts = shuffle([right].concat(out));
  ch.hint = "";                              // "starts with…" would give it away
}

generate = (orig => function(st){
  const res = orig.apply(this, arguments);
  try{ if(st && st.mc && res && res.challenge) mcBuild(st, res.challenge); else if(res && res.challenge) delete res.challenge.mcx; }catch(e){}
  return res;
})(generate);

/* ---------- playing: options instead of the text box ---------- */
const mcLive = () => { const ch = S && S.current && S.current.challenge; return !!(ch && Array.isArray(ch.opts) && ch.game !== "Word Duel" && (S.mc || MCG.has(ch.game))); };
tileItems = (orig => function(ch){
  if(ch && S && S.current && ch === S.current.challenge && mcLive()) return {mode:"pick", items:ch.opts, keepScreen:true, mc:true};
  return orig.apply(this, arguments);
})(tileItems);
let mcBusy = false;
renderExtras = (orig => function(fresh){
  const r = orig.apply(this, arguments);
  const tiles = $("tiles"), live = mcLive();
  tiles.classList.toggle("mc", live);
  if(live){
    mcBusy = false;
    $("chTarget").parentElement.hidden = false;
    $("answer").hidden = true; $("accentKeys").hidden = true; $("submitBtn").hidden = true;
    const lab = document.querySelector('label[for="answer"]'); if(lab) lab.hidden = true;
    const mic = $("micBtn"); if(mic) mic.hidden = true;
    const code = typeof xlCode === "function" ? xlCode(S.target) : null;
    tiles.querySelectorAll(".tile[data-i]").forEach((b, i) => {
      b.disabled = false;
      b.dataset.n = i + 1;
      if(code === "zh"){
        const raw = b.textContent, r = typeof XL_ROM !== "undefined" && XL_ROM[xlKey(raw)];
        b.textContent = xlSpace(raw);
        if(r) b.dataset.r = r; else delete b.dataset.r;
      } else if(code === "ar"){ const r = typeof XL_ROM !== "undefined" && XL_ROM[xlKey(b.textContent)]; if(r) b.dataset.r = r; }
    });
  }
  return r;
})(renderExtras);
// a tap answers straight away
$("tiles").addEventListener("click", e => {
  const b = e.target.closest(".tile[data-i]");
  if(!b || !mcLive() || mcBusy) return;
  mcBusy = true;
  $("tiles").querySelectorAll(".tile[data-i]").forEach(x => { x.disabled = x !== b; });
  b.classList.add("mcgo");
  setTimeout(() => { if(mcLive()) submit(false); else mcBusy = false; }, 160);
});

/* ---------- menu: Type | Multiple choice ---------- */
(() => {
  const css = document.createElement("style");
  css.textContent = `
.mcbox{margin:4px 0 12px}
.mcbox .note{margin:6px 2px 0}
#tiles.mc{display:grid;grid-template-columns:1fr;gap:8px}
#tiles.mc .tile{display:flex;align-items:center;gap:12px;width:100%;text-align:start;padding:13px 14px;font-size:1.05rem;line-height:1.3;white-space:normal;min-height:52px}
#tiles.mc .tile::before{content:attr(data-n);flex:none;width:1.7em;height:1.7em;border-radius:50%;display:grid;place-items:center;background:var(--field);font-size:.85rem;font-weight:800}
#tiles.mc .tile[data-r]{flex-wrap:wrap}
#tiles.mc .tile.mcgo{background:var(--violet);color:#fff;border-color:var(--violet-deep)}
#tiles.mc .tile:disabled:not(.mcgo){opacity:.5}
@media (min-width:700px){#tiles.mc{grid-template-columns:1fr 1fr}}
`;
  document.head.appendChild(css);
  const box = document.createElement("div");
  box.className = "mcbox"; box.id = "mcBox";
  $("startBtn").before(box);
})();
function mcMenu(){
  const box = $("mcBox"); if(!box) return;
  box.innerHTML = `<div class="f" style="margin-bottom:6px">✍️ ${esc(t("mc_label"))}</div>
    <div class="tpseg" role="group" aria-label="${esc(t("mc_label"))}"><button type="button" data-mcs="0" aria-pressed="${!MCS}">⌨️ ${esc(t("mc_type"))}</button><button type="button" data-mcs="1" aria-pressed="${MCS}">🔘 ${esc(t("mc_pick"))}</button></div>
    ${MCS ? `<p class="note">${esc(t("mc_note"))}</p>` : ""}`;
}
renderMenu = (orig => function(){ const r = orig.apply(this, arguments); try{ mcMenu(); }catch(e){} return r; })(renderMenu);
document.addEventListener("click", e => {
  const b = e.target.closest("[data-mcs]");
  if(b){ MCS = b.dataset.mcs === "1"; mcSave(); Sound.tap(); renderMenu(); }
});
if(window.__PGM_TEST) window.__mc = {mcBuild, mcPerturb, setMC:v => { MCS = !!v; mcSave(); }, get on(){ return MCS; }};
