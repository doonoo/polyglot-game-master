/* ===================== Multiple-choice mini-games =====================
   Four mini-games that join the rotation like Syntax Scramble, in typing mode too:
   - Quick Pick 🔘      : pick the right translation (sentences, words, verb forms)
   - Meaning Match 💡   : see a sentence/word in the target language, pick what it means
   - Right or Wrong ✅  : is this sentence correct? (half the time it carries the planted mistake)
   - Spot the Mistake 🔎: three or four sentences, one has the mistake; find it
   Each is built from an ordinary round (Classic Mine, Reverse Mine, Error Hunter, Verb Forge)
   asked for with plan.mcg, so mc.js stashes wrong-answer candidates; options live in ch.opts and
   mc.js shows them as tap targets (keys 1-4). If a round can't get honest options it stays the
   ordinary typing round. Bosses keep their own rounds. */
Object.assign(I18N.en, {"game.Quick Pick":"Quick Pick", "game.Meaning Match":"Meaning Match", "game.Right or Wrong":"Right or Wrong", "game.Spot the Mistake":"Spot the Mistake"});
Object.assign(I18N.es, {"game.Quick Pick":"Elección rápida", "game.Meaning Match":"¿Qué significa?", "game.Right or Wrong":"¿Bien o mal?", "game.Spot the Mistake":"Encuentra el error"});
Object.assign(GAME_ICO, {"Quick Pick":"🔘", "Meaning Match":"💡", "Right or Wrong":"✅", "Spot the Mistake":"🔎"});
const MCT = {
  en:{qp:T => `Pick the right ${T} translation.`, qpw:T => `Pick the ${T} word.`, qpc:"Pick the right verb form.", mm:N => `What does it mean in ${N}?`,
      rw:T => `Is this ${T} sentence correct?`, rwM:(N, T) => `Is this a correct way to say “${N}” in ${T}?`, rwY:"✓ Correct", rwN:"✗ Has a mistake", sm:"One sentence has a mistake. Which one?", smQ:"🔎 Find the sentence with the mistake",
      okRight:"Yes, it's correct:", okWrong:"Right, it has a mistake. Fixed:", badRight:"It was correct as written:", badWrong:"It has a mistake. Fixed:",
      okSpot:"You found it. Fixed:", badSpot:"The mistake was here:", fixed:"Fixed:"},
  es:{qp:T => `Elige la traducción correcta al ${T}.`, qpw:T => `Elige la palabra en ${T}.`, qpc:"Elige la forma verbal correcta.", mm:N => `¿Qué significa en ${N}?`,
      rw:T => `¿Esta frase en ${T} está bien?`, rwM:(N, T) => `¿Así se dice bien «${N}» en ${T}?`, rwY:"✓ Correcta", rwN:"✗ Tiene un error", sm:"Una frase tiene un error. ¿Cuál?", smQ:"🔎 Encuentra la frase con el error",
      okRight:"Sí, está bien:", okWrong:"Exacto, tiene un error. Corregida:", badRight:"Estaba bien así:", badWrong:"Tiene un error. Corregida:",
      okSpot:"¡La encontraste! Corregida:", badSpot:"El error estaba aquí:", fixed:"Corregida:"}
};
const mcT = st => MCT[LANG_CODE[st.native]] || MCT.en;
const mcStrict = st => !!(st && (st.mode === 3 || st.mode === 8));   // accents count there, so an accent slip is a real mistake
// the fixed sentence with the changed words in bold (all of it when only the word order changed)
const mcFix = (st, T, W, ch) => { const d = boldDiff(T, W, Object.assign({}, ch, {acc:[T]}), mcStrict(st)); return /\*\*/.test(d) ? d : `**${T}**`; };
const MCG_BASE = {"Quick Pick":"Classic Mine", "Meaning Match":"Reverse Mine", "Right or Wrong":"Error Hunter", "Spot the Mistake":"Error Hunter"};
const MCG_MODES = {1:["Quick Pick", "Meaning Match", "Right or Wrong", "Spot the Mistake"], 2:["Quick Pick", "Meaning Match", "Right or Wrong", "Spot the Mistake"],
  3:["Quick Pick", "Right or Wrong", "Spot the Mistake"], 6:["Quick Pick", "Meaning Match"], 5:["Quick Pick", "Meaning Match"], 7:["Quick Pick"], 8:["Right or Wrong", "Spot the Mistake"]};

gamesFor = (orig => function(st){
  const g = orig.apply(this, arguments), add = (MCG_MODES[st && st.mode] || []).filter(x => !g.includes(x));
  return g.concat(add);
})(gamesFor);

function mcgPick(st, ch, name){
  const L = mcT(st), nat = LANG_CODE[st.native], Tn = LN[nat][st.target], Nn = LN[nat][st.native];
  ch.game = name;
  if(name === "Quick Pick") ch.task = ch.k === "c" ? L.qpc : ch.k === "w" ? L.qpw(Tn) : L.qp(Tn);
  else ch.task = L.mm(Nn);
  mcBuild(st, ch);
  return Array.isArray(ch.opts);
}
function mcgRight(st, ch, mcx){
  const L = mcT(st), nat = LANG_CODE[st.native], W = ch.target, T = ch.answerKey;
  if(!W || !T || norm(W, ch.al, mcStrict(st)) === norm(T, ch.al, mcStrict(st))) return false;
  const showRight = Math.random() < 0.5;
  ch.game = "Right or Wrong";
  ch.task = mcx && mcx.n ? L.rwM(mcx.n, LN[nat][st.target]) : L.rw(LN[nat][st.target]);   // the meaning makes the judgement fair
  ch.target = showRight ? T : W;
  ch.acc = [showRight ? L.rwY : L.rwN, T];
  ch.answerKey = showRight ? L.rwY : L.rwN;
  ch.opts = [L.rwY, L.rwN];
  ch.hint = ""; ch.cw = [];
  return true;
}
function mcgSpot(st, ch, mcx){
  const L = mcT(st), W = ch.target, T = ch.answerKey, key = x => norm(x, ch.al, false);
  if(!W || !T || norm(W, ch.al, mcStrict(st)) === norm(T, ch.al, mcStrict(st))) return false;
  const seen = new Set([key(W), key(T)]), sib = [], mean = new Map([[W, (mcx && mcx.n) || ""]]);
  const S0 = ((mcx && mcx.s) || []).map((x, i) => [x, (mcx.sm || [])[i] || ""]);
  for(const [x, m] of shuffle(S0)){
    const k = key(x); if(!k || seen.has(k)) continue;
    seen.add(k); sib.push(x); mean.set(x, m); if(sib.length >= 3) break;
  }
  if(sib.length < 2) return false;
  ch.game = "Spot the Mistake";
  ch.task = L.sm;
  ch.target = L.smQ;
  ch.acc = [W, T];
  ch.answerKey = W;
  ch.opts = shuffle([W].concat(sib));
  ch.optm = ch.opts.map(o => mean.get(o) || "");   // each sentence's meaning, shown under it
  ch.hint = ""; ch.cw = [];
  return true;
}
function mcgWrap(orig){
  return function(st, plan){
    const name = plan && plan.game;
    if(!plan || plan.boss || !MCG_BASE[name] && name !== "Quick Pick") return orig.apply(this, arguments);
    const args = [...arguments];
    const base = this === "conj" ? "Verb Forge" : MCG_BASE[name];
    args[1] = Object.assign({}, plan, {game:base, mcg:true});
    const res = orig.apply(this, args), ch = res && res.challenge;
    if(!ch) return res;
    try{
      const mcx = ch.mcx;
      let ok = false;
      // a slip made by swapping two words isn't a real learner mistake: ask for the translation instead
      if((name === "Right or Wrong" || name === "Spot the Mistake") && ch.game === "Error Hunter" && typeof XL_AUTO_WRONG !== "undefined" && XL_AUTO_WRONG.has(ch.target) && mcx && mcx.n){
        ch.target = mcx.n; ok = mcgPick(st, ch, "Quick Pick");
      }
      else if(name === "Right or Wrong" && ch.game === "Error Hunter") ok = mcgRight(st, ch, mcx);
      else if(name === "Spot the Mistake" && ch.game === "Error Hunter") ok = mcgSpot(st, ch, mcx) || mcgRight(st, ch, mcx);
      else if(ch.game === "Classic Mine" || ch.game === "Verb Forge" || (name === "Quick Pick" && ch.k === "c")) ok = mcgPick(st, ch, "Quick Pick");
      else if(ch.game === "Reverse Mine") ok = mcgPick(st, ch, "Meaning Match");
      if(ok){ delete ch.mcx; if(res._k) res._k = res._k.replace(/^[^|]*/, ch.game); }
      else { ch.game = ch.game === "Quick Pick" || ch.game === "Meaning Match" ? base : ch.game; delete ch.opts; }
    }catch(e){}
    return res;
  };
}
genSentence = mcgWrap(genSentence);
genVocab = mcgWrap(genVocab);
genConj = (w => function(){ return w.apply("conj", arguments); })(mcgWrap(genConj));

/* feedback for the two judging games: show the fixed sentence */
gradeLocal = (orig => function(st, ch, answer, force){
  const j = orig.apply(this, arguments);
  try{
    if(!ch || !st || (ch.game !== "Right or Wrong" && ch.game !== "Spot the Mistake") || answer === null) return j;
    const L = mcT(st), T = ch.acc[1];
    let fb;
    if(ch.game === "Right or Wrong"){
      const wasRight = ch.answerKey === L.rwY;
      fb = j.correct ? (wasRight ? `${L.okRight} **${T}**` : `${L.okWrong} ${mcFix(st, T, ch.target, ch)}`)
                     : (wasRight ? `${L.badRight} **${T}**` : `${L.badWrong} ${mcFix(st, T, ch.target, ch)}`);
    } else fb = j.correct ? `${L.okSpot} ${mcFix(st, T, ch.answerKey, ch)}` : `${L.badSpot} ${ch.answerKey} → ${mcFix(st, T, ch.answerKey, ch)}`;
    return Object.assign({}, j, {feedback:fb, struggled:[]});
  }catch(e){ return j; }
})(gradeLocal);
if(window.__PGM_TEST) window.__mcg = {gamesFor:st => gamesFor(st), MCG};
// Spot the Mistake's prompt is an instruction, not a sentence to hear; each option shows its meaning
renderExtras = (orig => function(){
  const r = orig.apply(this, arguments);
  try{
    const ch = S && S.current && S.current.challenge;
    if(ch && ch.game === "Spot the Mistake"){
      const b = document.querySelector('#chTarget [data-say="target"]'); if(b) b.remove();
      if(Array.isArray(ch.optm)) document.querySelectorAll("#tiles .tile[data-i]").forEach(t => {
        const m = ch.optm[+t.dataset.i]; if(!m) return;
        t.dataset.r = (t.dataset.r ? t.dataset.r + "\n" : "") + "“" + m + "”"; t.classList.add("mcm");
      });
    }
  }catch(e){}
  return r;
})(renderExtras);
(() => { const c = document.createElement("style"); c.textContent = ".tile.mcm::after{white-space:pre-line;color:var(--muted,#6b6b80);font-style:italic}"; document.head.appendChild(c); })();
