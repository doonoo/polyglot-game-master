/* ===================== Card Clash (mode 11) =====================
   A card battle: each turn shows a sentence in your language and deals a hand of word cards:
   the real words plus decoys (words from other sentences at the level, and a word from the
   lesson's planted mistake when there is one). Play the cards in order to attack.
   Damage grows with the sentence's length and your chain of right answers, with a
   "Linked!" bonus when the sentence reuses a word from the last one. A wrong answer costs a
   heart and the sentence comes back later. Beat three foes to win. Typing still works. */
MODES.push({id:11, name:"Card Clash", ico:"🃏", color:"#9AD0F5", desc:"Play word cards to build sentences and beat three foes."});
if(typeof XL_MODES !== "undefined" && !XL_MODES.includes(11)) XL_MODES.push(11);

Object.assign(I18N.en, {
  m11n:"Card Clash", m11d:"Play word cards to build sentences and beat three foes.",
  kFoe:"Foe {n}/{d}", kChain:"Chain ×{n}", kLinked:"Linked!", kKO:"{name} is down!",
  kWinT:"Victory!", kLoseT:"Knocked out", kOver:"Foes beaten: {f} of {d} · damage dealt: {dmg} · best chain: ×{c}",
  kHow:"Each turn: tap the word cards in order to build the sentence, then attack. Decoy cards are mixed in. Longer sentences and right answers in a row hit harder; reuse a word from the last sentence for a Linked! bonus. 5 hearts.",
  kHp:"{name}: {hp} of {max} HP"
});
Object.assign(I18N.es, {
  m11n:"Duelo de cartas", m11d:"Juega cartas de palabras para formar frases y vencer a tres rivales.",
  kFoe:"Rival {n}/{d}", kChain:"Cadena ×{n}", kLinked:"¡Enlazada!", kKO:"¡{name} cae!",
  kWinT:"¡Victoria!", kLoseT:"Derrotado", kOver:"Rivales vencidos: {f} de {d} · daño causado: {dmg} · mejor cadena: ×{c}",
  kHow:"En cada turno: toca las cartas en orden para formar la frase y ataca. Hay cartas trampa mezcladas. Las frases largas y los aciertos seguidos pegan más fuerte; repite una palabra de la frase anterior para el bonus ¡Enlazada! 5 corazones.",
  kHp:"{name}: {hp} de {max} PV"
});

const CARD_FOES = [
  {ico:"👾", en:"Typo Imp", es:"Diablillo errata", hp:170},
  {ico:"🧌", en:"Grammar Troll", es:"Trol gramatical", hp:260},
  {ico:"🐲", en:"Word Wyrm", es:"Sierpe verbal", hp:360}
];
const CARD_HEARTS = 5;
const cardFoeName = f => (LANG_CODE[(S || setup).native] === "es" ? f.es : f.en);
const cardScale = lv => 1 + 0.2 * Math.max(0, ["A1", "A2", "B1", "B2"].indexOf(lv));
/* a sentence's cards: punctuation off, the first word lower-cased (so it isn't a giveaway) */
const cardClean = w => w.replace(/^[¿¡"“«(]+|[.,!?;:"”»)…]+$/g, "");
function cardWords(sentence){
  const ws = canon(sentence).split(" ").map(cardClean).filter(Boolean);
  if(ws.length && ws[0] !== "I" && !/^[A-ZÀ-Þ]{2,}$/.test(ws[0])) ws[0] = ws[0].charAt(0).toLowerCase() + ws[0].slice(1);
  return ws;
}
/* the level's sentences in the language being answered, for decoy cards */
const CARD_POOL = {};
function cardPool(tgt, lv){
  const k = tgt + "|" + lv;
  if(!CARD_POOL[k]){
    const set = new Set();
    for(const L of (COURSE[tgt] || {})[lv] || []) for(const it of (L.it || [])) for(const w of cardWords(it[1])) if(w.length > 1 || /[㐀-鿿]/.test(w)) set.add(w);
    CARD_POOL[k] = [...set];
  }
  return CARD_POOL[k];
}
const cardLow = w => w.toLowerCase();
/* words that count for a link: real words, not tiny grammar words */
const CARD_STOP = new Set(["the","and","you","are","was","for","not","but","que","los","las","una","por","con","del","les","des","une","est","pas","uma","não","com","dos","das","的","了","吗","是","我","你","他","她","在","不","和","في","من","على","هو","هي","أنا","أن"]);
const cardLinkable = w => !CARD_STOP.has(w) && (w.length > 2 || /[\u3400-\u9fff]/.test(w));

/* ---------- engine hooks ---------- */
freshState = (orig => function(o){
  const st = orig(o);
  if(o.mode === 11){
    st.hp = st.maxHp = CARD_HEARTS; st.clock = "off";
    const f = CARD_FOES[0], max = Math.round(f.hp * cardScale(st.level));
    st.card = {foe:0, hp:max, max, chain:0, best:0, dealt:0, last:[], redo:[], ev:null};
    st.syllabus = [t("m11n")]; st.done = [false];
  }
  return st;
})(freshState);

makePlanCore = (orig => function(st, rolls, exclude){
  if(st.mode !== 11) return orig(st, rolls, exclude);
  if(st.status !== "playing") return null;
  const L = (COURSE[LANG_CODE[st.target]] || {})[st.level] || [];
  const redo = (st.card.redo || []).filter(x => !(exclude && exclude.idx === x.idx && exclude.it === x.it));
  // a missed sentence comes back two turns later
  const due = redo.filter(x => st.stats.answered - (x.at || 0) >= 2);
  if(due.length){ const p = due[0]; return {kind:"card", lv:st.level, idx:p.idx, it:p.it, redo:true, ch:p.ch}; }
  // half the time stay in the same lesson: its sentences share words, so chains can link
  const idx = st.card.lastIdx != null && st.card.chain > 0 && rolls.r < 0.5 ? st.card.lastIdx : Math.floor(rolls.s * L.length);
  return {kind:"card", lv:st.level, idx: exclude && exclude.idx === idx && L.length > 1 ? (idx + 1) % L.length : idx, it:Math.floor(rolls.g * 1000)};
})(makePlanCore);

generate = (orig => function(st, plan){
  if(st.mode !== 11 || !plan || plan.kind !== "card") return orig(st, plan);
  // a missed sentence comes back exactly, with the hand shuffled again
  if(plan.redo && plan.ch){ const ch = JSON.parse(JSON.stringify(plan.ch)); ch.card.hand = shuffle(ch.card.hand); return {challenge:ch, lesson:null}; }
  const tgt = LANG_CODE[st.target], L = (COURSE[tgt] || {})[plan.lv] || [];
  const m = Object.assign({}, st, {mode:2, level:plan.lv, cefr:0, mc:false});
  m.syllabus = syllabusFor(m); m.done = m.syllabus.map(() => false);
  // a translate-into-the-language round whose sentence makes a playable hand (3 to 9 words)
  let res = null;
  for(let k = 0; k < 12; k++){
    const idx = (plan.idx + k * 7) % Math.max(1, L.length);
    const r = orig(m, {kind:"syllabus", idx:Math.min(idx, m.syllabus.length - 1), game:"Classic Mine", boss:false});
    const ch = r && r.challenge;
    if(!ch || ch.game !== "Classic Mine" || ch.k !== "s" || ch.al !== tgt || Array.isArray(ch.opts) || ch.double) continue;
    const n = cardWords(ch.acc[0]).length;
    if(n < 3 || n > 9) continue;
    res = r; res.cardIdx = idx; break;
  }
  if(!res) return orig(m, {kind:"syllabus", idx:Math.min(plan.idx, m.syllabus.length - 1), game:"Classic Mine", boss:false});
  const ch = res.challenge, words = cardWords(ch.acc[0]), have = new Set(words.map(cardLow));
  // decoys: a word from the planted mistake (the tricky card), then words from other sentences
  const lesson = L[res.cardIdx] || {}, item = (lesson.it || []).find(it => canon(it[1]) === canon(ch.acc[0]));
  const decoys = [];
  if(item && item[3]) for(const w of cardWords(item[3])) if(!have.has(cardLow(w)) && !decoys.includes(w)){ decoys.push(w); break; }
  const want = words.length <= 4 ? 3 : words.length <= 7 ? 3 : 2;
  for(const w of shuffle(cardPool(tgt, plan.lv))){
    if(decoys.length >= want + (decoys.length && item && item[3] ? 1 : 0)) break;
    if(!have.has(cardLow(w)) && !decoys.some(d => cardLow(d) === cardLow(w))) decoys.push(w);
  }
  ch.card = {hand:shuffle(words.concat(decoys)), n:words.length, words, li:res.cardIdx};
  res.lesson = null;   // a battle: no lesson card every turn
  res.plan = Object.assign({}, plan, {idx:res.cardIdx});
  return res;
})(generate);

/* the hand is dealt as word tiles (Mandarin / Arabic tiles get their romanization from langs.js) */
tileItems = (orig => function(ch){
  if(S && S.mode === 11 && ch && ch.card && Array.isArray(ch.card.hand)) return {mode:"words", items:ch.card.hand, keepScreen:true};
  return orig.apply(this, arguments);
})(tileItems);

applyResult = (orig => function(st, correct, plan){
  if(st.mode !== 11) return orig(st, correct, plan);
  orig(st, correct, plan && plan.kind === "card" ? {kind:"card"} : plan);
  const c = st.card, ch = st.current && st.current.challenge, cc = ch && ch.card;
  if(!c || st.status !== "playing") return;
  const id = st.stats.answered;
  if(correct){
    const words = cc ? cc.words.map(cardLow) : [], n = cc ? cc.n : 4;
    const linked = c.last.length > 0 && words.some(w => cardLinkable(w) && c.last.includes(w));
    const mult = 1 + 0.25 * Math.min(c.chain, 6);
    const dmg = Math.round(8 * n * mult * (linked ? 1.2 : 1));
    c.chain++; c.best = Math.max(c.best, c.chain); c.dealt += dmg; c.last = words;
    if(cc && cc.li != null) c.lastIdx = cc.li;
    c.hp -= dmg;
    let ko = null;
    if(c.hp <= 0){
      ko = CARD_FOES[c.foe];
      c.foe++;
      if(c.foe >= CARD_FOES.length){ c.hp = 0; st.status = "conquered"; }
      else { const f = CARD_FOES[c.foe]; c.max = Math.round(f.hp * cardScale(st.level)); c.hp = c.max; }
    }
    c.ev = {id, dmg, linked, chain:c.chain, ko:ko ? c.foe - 1 : -1};
    if(plan && plan.redo) c.redo = c.redo.filter(x => !(x.idx === plan.idx && x.it === plan.it));
  } else {
    c.chain = 0; c.last = [];
    st.hp--;
    c.ev = {id, hit:true};
    if(plan && plan.kind === "card" && cc){
      const keep = {k:ch.k, game:ch.game, al:ch.al, acc:ch.acc, target:ch.target, task:ch.task, hint:ch.hint, answerKey:ch.answerKey, cw:ch.cw, why:ch.why, card:cc};
      c.redo = c.redo.filter(x => !(x.idx === plan.idx && x.it === plan.it)).concat([{idx:plan.idx, it:plan.it, ch:keep, at:st.stats.answered}]).slice(-6);
    }
    if(st.hp <= 0) st.status = "gameover";
  }
})(applyResult);

progress = (orig => function(){
  if(!S || S.mode !== 11) return orig();
  const c = S.card, f = Math.min(c.foe + 1, CARD_FOES.length);
  return {n:c.foe, d:CARD_FOES.length, label:t("kFoe", {n:f, d:CARD_FOES.length})};
})(progress);

renderHud = (orig => function(){
  orig();
  if(!S || S.mode !== 11) return;
  const h = $("hudHearts");
  h.hidden = false;
  h.textContent = "❤️".repeat(Math.max(0, S.hp)) + "🖤".repeat(Math.max(0, CARD_HEARTS - S.hp));
  h.setAttribute("aria-label", t("hearts", {hp:S.hp}));
  $("hudBadge").textContent = "🃏 " + S.level;
})(renderHud);

/* the foe bar above the question, with the last hit floating over it */
let cardShown = -1;
const CARD_ROWS = $("answer").getAttribute("rows");
function renderCardBar(){
  let bar = $("cardBar");
  const c = S && S.mode === 11 && S.card;
  if(!c || S.status !== "playing"){ if(bar) bar.hidden = true; return; }
  if(!bar){ bar = document.createElement("div"); bar.id = "cardBar"; bar.className = "cardbar"; bar.setAttribute("aria-live", "polite"); $("challengeCard").querySelector(".ch-head").after(bar); }
  const f = CARD_FOES[Math.min(c.foe, CARD_FOES.length - 1)], name = cardFoeName(f), pct = Math.max(0, Math.round(100 * c.hp / c.max));
  bar.hidden = false;
  bar.innerHTML = `<span class="kf-ico" aria-hidden="true">${f.ico}</span><span class="kf-main"><b>${esc(name)}</b><span class="kf-bar" role="img" aria-label="${esc(t("kHp", {name, hp:Math.max(0, c.hp), max:c.max}))}"><i style="width:${pct}%"></i></span><small>${Math.max(0, c.hp)} / ${c.max}</small></span>` +
    (c.chain > 1 ? `<span class="kf-chain">⛓️ ${esc(t("kChain", {n:c.chain}))}</span>` : "");
  const ev = c.ev;
  if(ev && ev.id !== cardShown){
    cardShown = ev.id;
    const pop = document.createElement("span");
    pop.className = "kf-pop" + (ev.hit ? " hurt" : "");
    pop.textContent = ev.hit ? "💥 −❤️" : `−${ev.dmg}` + (ev.linked ? " 🔗 " + t("kLinked") : "") + (ev.ko >= 0 ? " · " + t("kKO", {name:cardFoeName(CARD_FOES[ev.ko])}) : "");
    bar.appendChild(pop);
    setTimeout(() => pop.remove(), 1600);
    try{ if(!window.__PGM_TEST){ if(ev.hit) Sound.bossAttack(); else if(ev.ko >= 0) Sound.bossDefeat(); else Sound.bossHit(); } }catch(e){}
  }
}
renderExtras = (orig => function(fresh){
  orig(fresh);
  renderCardBar();
  const ch = S && S.mode === 11 && S.current && S.current.challenge;
  const a = $("answer");
  if(ch && ch.card){
    $("chTarget").parentElement.hidden = false;   // keep the sentence to build in view
    $("chIco").textContent = "🃏"; $("chGame").textContent = t("m11n");
    $("accentKeys").hidden = true;                 // the cards carry every letter needed
    a.classList.add("kcard"); a.setAttribute("rows", "1");
  } else if(a.classList.contains("kcard")){ a.classList.remove("kcard"); if(CARD_ROWS) a.setAttribute("rows", CARD_ROWS); else a.removeAttribute("rows"); }
})(renderExtras);

showOver = (orig => function(){
  orig();
  if(!S || S.mode !== 11) return;
  const c = S.card, won = S.status === "conquered";
  $("overTitle").textContent = won ? t("kWinT") : t("kLoseT");
  $("overEmoji").textContent = won ? "🃏" : "💀";
  $("overText").textContent = t("kOver", {f:Math.min(c.foe, CARD_FOES.length), d:CARD_FOES.length, dmg:c.dealt, c:c.best});
  $("overIsland").hidden = true;
  if(won) $("overRestart").hidden = false;
  if($("cardBar")) $("cardBar").hidden = true;
})(showOver);

/* battle music */
syncMood = (orig => function(){
  orig();
  try{ if(S && S.mode === 11 && S.status === "playing" && $("game") && !$("game").hidden) Music.setMood("boss"); }catch(e){}
})(syncMood);

/* menu: a short how-to under the level picker */
(() => {
  const css = document.createElement("style");
  css.textContent = `
.cardbar{position:relative;display:flex;align-items:center;gap:10px;padding:8px 14px;background:linear-gradient(90deg,#0B2A44,#1D4E7A);color:#fff}
.cardbar .kf-ico{font-size:1.8rem;line-height:1}
.cardbar .kf-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.cardbar .kf-main b{font-weight:800;overflow-wrap:anywhere}
.cardbar .kf-bar{display:block;height:10px;border-radius:6px;background:rgba(255,255,255,.2);overflow:hidden}
.cardbar .kf-bar i{display:block;height:100%;background:linear-gradient(90deg,#FF6B6B,#FFB347);transition:width .4s}
.cardbar small{opacity:.85;font-weight:700}
.cardbar .kf-chain{flex:none;font-weight:800;background:rgba(255,255,255,.15);border-radius:999px;padding:2px 10px}
.cardbar .kf-pop{position:absolute;right:14px;top:-6px;font-weight:900;color:#FFE066;text-shadow:0 2px 0 #000;pointer-events:none;animation:kfPop 1.5s ease-out forwards;white-space:nowrap;max-width:90%;overflow:hidden;text-overflow:ellipsis}
.cardbar .kf-pop.hurt{color:#FF8A8A}
@keyframes kfPop{0%{opacity:0;transform:translateY(8px) scale(.8)}15%{opacity:1;transform:translateY(-6px) scale(1.1)}100%{opacity:0;transform:translateY(-26px)}}
@media (prefers-reduced-motion: reduce){.cardbar .kf-pop{animation:none}}
#cardHow{margin-top:8px}
#answer.kcard{min-height:0;height:auto;resize:none}`;
  document.head.appendChild(css);
})();
renderMenu = (orig => function(){
  orig();
  let how = $("cardHow");
  if(setup.mode === 11){
    if($("clockGroup")) $("clockGroup").hidden = true;
    if(!how){ how = document.createElement("p"); how.id = "cardHow"; how.className = "note"; $("levelGroup").appendChild(how); }
    how.hidden = false; how.textContent = t("kHow");
  } else if(how) how.hidden = true;
})(renderMenu);

if(window.__PGM_TEST) window.__cards = {CARD_FOES, cardWords, cardPool};
