/* ===================== Practice as a full CEFR level =====================
   Practice (mode 1) and Level Select (mode 2) now cover everything a level asks for:
   grammar, everyday topics and communication, in an interleaved order. A lesson is
   mastered only after it is taught and then recalled correctly twice in later rounds,
   and every fifth round mixes in the level's verb forms, tricky pairs or numbers.
   Games started before this change keep their old order (no `cefr` flag). */
const STRAND = l => l.k || "g";
const CEFR_ORDER = {};
function cefrOrder(tgt, lv){
  const key = tgt + lv;
  if(CEFR_ORDER[key]) return CEFR_ORDER[key];
  const all = (COURSE[tgt][lv] || []).map((c, i) => ({i, k:STRAND(c)}));
  const g = all.filter(x => x.k === "g").map(x => x.i), t = all.filter(x => x.k === "t").map(x => x.i), f = all.filter(x => x.k === "f").map(x => x.i);
  // topics and communication lessons are spread evenly through the grammar, alternating,
  // so practice feels like a real course rather than grammar first and the rest at the end
  const side = [];
  for(let n = 0; n < Math.max(t.length, f.length); n++){ if(f[n] !== undefined) side.push(f[n]); if(t[n] !== undefined) side.push(t[n]); }
  const out = [], step = g.length / (side.length + 1);
  let s = 0;
  g.forEach((gi, n) => { out.push(gi); while(s < side.length && n + 1 >= Math.round((s + 1) * step)) out.push(side[s++]); });
  while(s < side.length) out.push(side[s++]);
  return CEFR_ORDER[key] = out;
}
const isCefr = st => st && st.cefr && (st.mode === 1 || st.mode === 2);
syllabusFor = (orig => function(st){
  if(!isCefr(st)) return orig(st);
  const tgt = LANG_CODE[st.target], lv = COURSE[tgt][st.level] ? st.level : "A1";
  return cefrOrder(tgt, lv).map(i => COURSE[tgt][lv][i].t);
})(syllabusFor);
conceptAt = (orig => function(st, idx){
  if(!isCefr(st)) return orig(st, idx);
  const tgt = LANG_CODE[st.target], lv = COURSE[tgt][st.level] ? st.level : "A1", ord = cefrOrder(tgt, lv);
  return COURSE[tgt][lv][ord[idx] !== undefined ? ord[idx] : ord[0]];
})(conceptAt);

// Other parts of the level that get mixed into practice
function mixSources(st){
  const tgt = LANG_CODE[st.target], out = [];
  if(CONJ[tgt] && CONJ[tgt][st.level]) out.push(7);
  if(TRICKY[tgt] && TRICKY[tgt][st.level]) out.push(8);
  if(NUMSYL[st.level]) out.push(4);
  return out;
}
const mixState = (st, src) => { const m = Object.assign({}, st, {mode:src, cefr:0}); m.syllabus = syllabusFor(m); m.done = m.syllabus.map(() => false); return m; };

generate = (orig => function(st, plan){
  if((st.mode === 1 || st.mode === 2) && !st.syllabus && typeof S !== "undefined" && S && S.mode === st.mode && !S.syllabus){ S.cefr = 1; st.cefr = 1; }
  if(plan && plan.kind === "mix"){
    const m = mixState(st, plan.src);
    const res = orig(m, {kind:"syllabus", idx:Math.min(plan.idx, m.syllabus.length - 1), game:plan.game, boss:false, scene:plan.scene, style:plan.style});
    if(res && res.lesson) res.lesson = Object.assign({}, res.lesson, {title:"🔀 " + t("mixT") + " · " + (res.lesson.title || ""), body:t("mixB")});
    return res;
  }
  return orig(st, plan);
})(generate);

makePlanCore = (orig => function(st, rolls, exclude){
  const p = orig(st, rolls, exclude);
  if(!p || !isCefr(st) || !st.syllabus || p.newSyllabus) return p;
  const n = st.stats.answered;
  if(n >= 4 && n % 5 === 4){
    const srcs = mixSources(st);
    if(srcs.length){
      const src = srcs[Math.floor(rolls.s * srcs.length)], m = mixState(st, src);
      const games = gamesFor(m).filter(g => g !== "Echo Chamber" && g !== "Match Madness");
      return {kind:"mix", src, idx:Math.floor(rolls.c * m.syllabus.length), game:games[Math.floor(rolls.g * games.length)]};
    }
  }
  const low = k => String(k || "").toLowerCase(), inSrs = k => st.srs.some(x => low(x.k) === low(k));
  const exKey = exclude ? low(exclude.kind === "syllabus" ? st.syllabus[exclude.idx] : exclude.key) : "";
  const exIdx = exclude && exclude.kind === "syllabus" ? exclude.idx : -1;
  const fresh = st.syllabus.map((_, i) => i).filter(i => !st.done[i] && !inSrs(st.syllabus[i]) && i !== exIdx);
  const due = st.srs.filter(x => low(x.k) !== exKey);
  const game = p.game;
  if(due.length && (!fresh.length || st.srs.length >= 3 || rolls.r < 0.45)){
    due.sort((a, b) => a.c - b.c);
    const pool = due.slice(0, Math.max(1, Math.ceil(due.length / 2)));
    return {kind:"srs", key:pool[Math.floor(rolls.s * pool.length)].k, game};
  }
  if(fresh.length){ const nx = fresh.find(i => i > exIdx); return {kind:"syllabus", idx:nx !== undefined ? nx : fresh[0], game}; }
  if(st.srs.length) return {kind:"srs", key:st.srs[0].k, game};
  return p;
})(makePlanCore);

applyResult = (orig => function(st, correct, plan){
  if(!isCefr(st) || !plan || !st.syllabus) return orig(st, correct, plan);
  if(plan.kind === "mix") return orig(st, correct, {kind:"mix"});
  if(plan.kind === "syllabus"){
    const key = st.syllabus[plan.idx];
    orig(st, correct, {kind:"teach"});
    if(st.status === "playing" && key) addSrs(st, key, "concept");
    return;
  }
  if(plan.kind === "srs"){
    const key = String(plan.key || "").toLowerCase();
    orig(st, correct, plan);
    if(correct && st.syllabus && !st.srs.some(x => x.k.toLowerCase() === key)){
      const i = st.syllabus.findIndex(x => x.toLowerCase() === key);
      if(i >= 0 && !st.done[i]){
        st.done[i] = true;
        const keep = JSON.stringify(st.stats), ev = st.event;
        orig(st, true, {kind:"none"});   // runs the level-complete check only
        st.stats = JSON.parse(keep); if(!st.event) st.event = ev;
      }
    }
    return;
  }
  return orig(st, correct, plan);
})(applyResult);

// Level map in the side panel
function sylHtml(){
  if(!S.syllabus) return `<p class="empty">${esc(t("generating"))}</p>`;
  if(!isCefr(S)) return `<ol class="syl">${S.syllabus.map((s, i) => `<li class="${S.done[i] ? "done" : ""}"><span class="n">${S.done[i] ? "✓" : i + 1}</span><span>${esc(s)}</span></li>`).join("")}</ol>`;
  const groups = {g:[], t:[], f:[]};
  S.syllabus.forEach((s, i) => {
    const c = conceptAt(S, i), k = STRAND(c || {});
    const sr = S.srs.find(x => x.k.toLowerCase() === s.toLowerCase());
    const st = S.done[i] ? 3 : sr ? 1 + sr.c : 0;
    (groups[k] || groups.g).push({s, st});
  });
  const done = S.done.filter(Boolean).length, pct = Math.round(100 * done / S.syllabus.length);
  const dots = n => "●".repeat(n) + "○".repeat(3 - n);
  const sec = (k, ico) => groups[k].length ? `<h4 class="sylh">${ico} ${esc(t("strand_" + k))} <small>${groups[k].filter(x => x.st === 3).length}/${groups[k].length}</small></h4><ol class="syl">${groups[k].map(x => `<li class="${x.st === 3 ? "done" : ""}"><span class="n">${x.st === 3 ? "✓" : ""}</span><span>${esc(x.s)}</span><em class="dots" title="${esc(t("dotsTip"))}">${dots(x.st)}</em></li>`).join("")}</ol>` : "";
  const mix = mixSources(S).map(m => t("mix_" + m)).join(" · ");
  return `<p class="note"><b>${esc(t("cefrMastery", {lvl:S.level, p:pct}))}</b><br>${esc(t("cefrHow"))}</p>` + sec("g", "📐") + sec("t", "🏷️") + sec("f", "💬") + (mix ? `<p class="note">🔀 ${esc(t("mixIn", {x:mix}))}</p>` : "");
}
