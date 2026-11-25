/* ===================== Grammar Gym (mode 10) =====================
   Pick one or more grammar points (any level) and drill only those. Each round shows the
   lesson tip and plays one of the grammar-focused mini-games on that lesson's sentences;
   misses come back until they're right. At the end every point gets a mastery verdict.
   Results from Practice, Level Select, Survivor and Custom grammar rounds are recorded too,
   so "My weak spots" can build a workout from the points you miss most.
   Spanish / English: the course's grammar lessons (k:"g"). French, Portuguese, Mandarin,
   Arabic: every unit except Greetings, since each unit's tip teaches a grammar point. */
MODES.push({id:10, name:"Grammar Gym", ico:"📐", color:"#F7A6C4", desc:"Pick grammar points and drill just those."});
if(typeof XL_MODES !== "undefined" && !XL_MODES.includes(10)) XL_MODES.push(10);

Object.assign(I18N.en, {
  m10n:"Grammar Gym", m10d:"Pick the grammar points you want and drill just those.",
  gTitle:"Pick your grammar points", gIntro:"Choose one or a few points. Each round shows the rule, then tests it; misses come back until you get them right.",
  gWeak:"My weak spots", gWeakNone:"Play a few rounds first: your weak spots show up here once you miss something.",
  gWeakPicked:"Weak spots picked: {n}", gClear:"Clear", gRoundsL:"Rounds",
  gSel:"{n} selected", gSelNone:"Pick at least one grammar point to start.", gNone:"No grammar points at this level.",
  gKey:"✅ solid · 🟡 getting there · 🔴 needs work · ⚪ new",
  gDoneT:"Workout done!", gDoneB:"{c} of {n} right ({p}%).", gOverT:"How each point went",
  gSolid:"Solid", gShaky:"Getting there", gWork:"Needs work", gNew:"New", gOf:"{r} of {n}",
  gBadge:"Grammar Gym"
});
Object.assign(I18N.es, {
  m10n:"Gimnasio de gramática", m10d:"Elige los puntos de gramática que quieras y practica solo esos.",
  gTitle:"Elige tus puntos de gramática", gIntro:"Elige uno o varios puntos. Cada ronda muestra la regla y luego la pone a prueba; los fallos vuelven hasta que los aciertes.",
  gWeak:"Mis puntos débiles", gWeakNone:"Juega unas rondas primero: tus puntos débiles aparecen aquí cuando falles algo.",
  gWeakPicked:"Puntos débiles elegidos: {n}", gClear:"Borrar", gRoundsL:"Rondas",
  gSel:"{n} elegidos", gSelNone:"Elige al menos un punto de gramática para empezar.", gNone:"No hay puntos de gramática en este nivel.",
  gKey:"✅ dominado · 🟡 casi · 🔴 hay que practicar · ⚪ nuevo",
  gDoneT:"¡Entrenamiento terminado!", gDoneB:"{c} de {n} bien ({p} %).", gOverT:"Cómo te fue en cada punto",
  gSolid:"Dominado", gShaky:"Casi", gWork:"Hay que practicar", gNew:"Nuevo", gOf:"{r} de {n}",
  gBadge:"Gimnasio de gramática"
});

/* games that test form and structure, not just meaning */
const GYM_SKIP = new Set(["Reverse Mine", "Meaning Match", "Meaning Check", "Odd One Out", "Match Madness", "Word Duel", "Echo Chamber", "Speak Up"]);
const gymGames = st => gamesFor({mode:2, target:st.target, native:st.native, level:st.level}).filter(g => !GYM_SKIP.has(g));

profile.gym = {}; profile.gymSel = {}; profile.gymRounds = 15;
const GYM_HIST = 10;

/* the grammar points of a language, per level: [{lv, idx, t, label}] */
function gymLessons(target, lv){
  const tgt = LANG_CODE[target], L = (COURSE[tgt] || {})[lv] || [], xl = L.some(c => c.xl);
  const out = [];
  L.forEach((c, idx) => {
    const k = c.k || "g";
    if(xl ? k === "f" : k !== "g") return;
    let label = c.t;
    if(xl){ const bold = [...(c.b || "").matchAll(/\*\*(.+?)\*\*/g)].map(m => m[1]).slice(0, 2); if(bold.length) label += " · " + bold.join(", "); }
    out.push({lv, idx, t:c.t, label});
  });
  return out;
}
const gymLevels = target => levelsFor(2, target).filter(lv => gymLessons(target, lv).length);
const gymKey = (lv, title) => lv + "|" + title;
const gymFind = (target, key) => { const [lv, ...r] = key.split("|"), title = r.join("|"); return gymLessons(target, lv).find(x => x.t === title) || null; };

/* lifetime record per point: right / wrong counts and the last few results */
function gymRecord(target, lv, title, correct){
  const tgt = LANG_CODE[target]; if(!tgt || !title) return;
  const all = profile.gym || (profile.gym = {}), mine = all[tgt] || (all[tgt] = {});
  const k = gymKey(lv, title), rec = mine[k] || (mine[k] = {r:0, w:0, h:""});
  if(correct) rec.r++; else rec.w++;
  rec.h = (rec.h + (correct ? "1" : "0")).slice(-GYM_HIST);
  rec.at = Date.now();
}
function gymRec(target, key){ const m = (profile.gym || {})[LANG_CODE[target]] || {}; return m[key] || null; }
function gymMastery(rec){
  if(!rec || rec.h.length < 3) return {ico:"⚪", id:"gNew", acc:null};
  const acc = [...rec.h].filter(x => x === "1").length / rec.h.length;
  if(rec.h.length >= 5 && acc >= 0.8) return {ico:"✅", id:"gSolid", acc};
  return acc >= 0.5 ? {ico:"🟡", id:"gShaky", acc} : {ico:"🔴", id:"gWork", acc};
}
/* weakest points first: most recent misses, then lowest accuracy */
function gymWeak(target, n){
  const m = (profile.gym || {})[LANG_CODE[target]] || {};
  return Object.keys(m).filter(k => m[k].w > 0 && /0/.test(m[k].h) && gymFind(target, k)).map(k => {
    const h = m[k].h, miss = [...h].filter(x => x === "0").length / h.length;
    return {k, score:miss + (h.slice(-3).includes("0") ? 0.5 : 0) + Math.min(m[k].w, 10) / 100};
  }).sort((a, b) => b.score - a.score).slice(0, n).map(x => x.k);
}
const gymSel = target => { const s = (profile.gymSel || {})[LANG_CODE[target]] || []; return s.filter(k => gymFind(target, k)); };
function gymSetSel(target, keys){ (profile.gymSel || (profile.gymSel = {}))[LANG_CODE[target]] = keys; saveProfile(); }

/* ---------- engine hooks ---------- */
freshState = (orig => function(o){
  const st = orig(o);
  if(o.mode === 10){
    let picks = gymSel(o.target).map(k => gymFind(o.target, k)).filter(Boolean);
    // nothing picked for this course (the second player's course in a duel): the first points of the level
    if(!picks.length){ const lv = gymLevels(o.target).includes(o.level) ? o.level : gymLevels(o.target)[0]; picks = gymLessons(o.target, lv).slice(0, 3); }
    st.gym = {picks:picks.map(p => ({lv:p.lv, idx:p.idx, t:p.t})), rounds:profile.gymRounds || 15, per:{}, redo:[]};
    st.level = picks.length ? picks[0].lv : st.level;
    st.hp = st.maxHp = 99; st.clock = "off";
    st.syllabus = [t("m10n")]; st.done = [false];
  }
  return st;
})(freshState);

makePlanCore = (orig => function(st, rolls, exclude){
  if(st.mode !== 10) return orig(st, rolls, exclude);
  if(st.status !== "playing") return null;
  const g = st.gym, picks = g.picks;
  const games = gymGames(st), avoid = games.filter(x => x !== st.lastGame), pool = avoid.length ? avoid : games;
  const game = pool[Math.floor(rolls.g * pool.length)];
  const same = (a, b) => a && b && a.lv === b.lv && a.idx === b.idx;
  const redo = (g.redo || []).filter(x => !same(x, exclude));
  if(redo.length && (redo.length >= 3 || rolls.r < 0.35)){ const p = redo[Math.floor(rolls.s * redo.length)]; return {kind:"gym", lv:p.lv, idx:p.idx, t:p.t, game, redo:true}; }
  // spread rounds evenly: the least-drilled points first
  const n = p => { const s = g.per[gymKey(p.lv, p.t)]; return s ? s.r + s.w : 0; };
  let cand = picks.filter(p => !same(p, exclude)); if(!cand.length) cand = picks;
  const low = Math.min(...cand.map(n)), least = cand.filter(p => n(p) === low);
  const p = least[Math.floor(rolls.s * least.length)];
  return {kind:"gym", lv:p.lv, idx:p.idx, t:p.t, game};
})(makePlanCore);

generate = (orig => function(st, plan){
  if(st.mode !== 10 || !plan || plan.kind !== "gym") return orig(st, plan);
  const m = Object.assign({}, st, {mode:2, level:plan.lv, cefr:0});
  m.syllabus = syllabusFor(m); m.done = m.syllabus.map(() => false);
  const idx = Math.min(plan.idx, m.syllabus.length - 1);
  // some generators fall back to a translation round when the asked-for game doesn't fit the sentence: try another game
  let res = orig(m, {kind:"syllabus", idx, game:plan.game, boss:false});
  const others = shuffle(gymGames(st).filter(g => g !== plan.game));
  for(let k = 0; k < others.length && res && res.challenge && GYM_SKIP.has(res.challenge.game); k++) res = orig(m, {kind:"syllabus", idx, game:others[k], boss:false});
  if(res && res.lesson) res.lesson = Object.assign({}, res.lesson, {title:"📐 " + plan.lv + " · " + (res.lesson.title || plan.t)});
  return res;
})(generate);

applyResult = (orig => function(st, correct, plan){
  // grammar results from the other modes feed the weak-spot list (not in two-player games).
  // runTurn also applies the result to a throwaway copy to plan the next round: record only for the live state
  const tp = (typeof TP !== "undefined" && TP.on) || st !== S;
  if(st.mode !== 10){
    try{
      if(!tp && plan){
        let lv = null, idx = -1;
        if(plan.kind === "syllabus" && (st.mode === 1 || st.mode === 2 || st.mode === 3)){
          const c = conceptAt(st, plan.idx), L = COURSE[LANG_CODE[st.target]][st.level] || [];
          lv = st.level; idx = L.indexOf(c);
        } else if(plan.kind === "srs" && plan.key && (st.mode === 1 || st.mode === 2 || st.mode === 3)){
          lv = st.level; idx = (COURSE[LANG_CODE[st.target]][st.level] || []).findIndex(c => c.t.toLowerCase() === plan.key.toLowerCase());
        } else if(st.mode === 9 && plan.kind === "mix" && plan.mode === 2){ lv = plan.lv; idx = plan.idx; }
        const hit = lv && idx >= 0 && gymLessons(st.target, lv).find(x => x.idx === idx);
        if(hit){ gymRecord(st.target, lv, hit.t, correct); saveProfile(); }
      }
    }catch(e){}
    return orig(st, correct, plan);
  }
  orig(st, correct, plan && plan.kind === "gym" ? {kind:"gym"} : plan);
  if(!plan || plan.kind !== "gym") return;
  const g = st.gym, k = gymKey(plan.lv, plan.t), s = g.per[k] || (g.per[k] = {r:0, w:0});
  if(correct) s.r++; else s.w++;
  st.level = plan.lv;
  const same = x => x.lv === plan.lv && x.idx === plan.idx;
  if(!correct) g.redo = (g.redo || []).filter(x => !same(x)).concat([{lv:plan.lv, idx:plan.idx, t:plan.t}]).slice(-12);
  else if(plan.redo) g.redo = (g.redo || []).filter(x => !same(x));
  if(!tp){ gymRecord(st.target, plan.lv, plan.t, correct); saveProfile(); }
  if(st.status === "playing" && st.stats.answered >= g.rounds) st.status = "conquered";
})(applyResult);

progress = (orig => function(){
  if(!S || S.mode !== 10) return orig();
  const d = S.gym.rounds, n = S.stats.answered;
  return {n, d, label:t("cRound", {n:Math.min(n + 1, d), d})};
})(progress);

renderHud = (orig => function(){
  orig();
  if(!S || S.mode !== 10) return;
  $("hudHearts").hidden = true;
  const lv = [...new Set(S.gym.picks.map(p => p.lv))];
  $("hudBadge").textContent = "📐 " + (lv.length > 1 ? lv[0] + "–" + lv[lv.length - 1] : lv[0] || S.level);
})(renderHud);

showOver = (orig => function(){
  orig();
  if(!S || S.mode !== 10) return;
  const done = S.status === "conquered", n = S.stats.answered, c = S.stats.correct, p = n ? Math.round(100 * c / n) : 0;
  $("overTitle").textContent = done ? t("gDoneT") : t("gameOver");
  $("overEmoji").textContent = done ? "📐" : "💀";
  const rows = S.gym.picks.map(pk => {
    const s = S.gym.per[gymKey(pk.lv, pk.t)] || {r:0, w:0}, tot = s.r + s.w;
    const m = gymMastery(gymRec(S.target, gymKey(pk.lv, pk.t)));
    return `<li><span class="gmi" aria-hidden="true">${m.ico}</span><span class="gmt"><b>${esc(pk.t)}</b><small>${esc(pk.lv)} · ${esc(t(m.id))}</small></span><span class="gms">${esc(t("gOf", {r:s.r, n:tot}))}</span></li>`;
  }).join("");
  $("overText").innerHTML = esc(t("gDoneB", {c, n, p})) + (rows ? `<div class="gover"><b>${esc(t("gOverT"))}</b><ul>${rows}</ul></div>` : "");
  $("overIsland").hidden = true;
  if(done) $("overRestart").hidden = false;
})(showOver);

/* ---------- Setup panel in the menu ---------- */
(() => {
  const css = document.createElement("style");
  css.textContent = `
#gymBody .glist{display:flex;flex-direction:column;gap:6px}
#gymBody .gl{display:flex;align-items:center;gap:8px;text-align:left;width:100%;padding:8px 10px;border-radius:12px;border:2px solid var(--line);background:var(--card);color:var(--ink);font:inherit;cursor:pointer}
#gymBody .gl.on{border-color:var(--violet);background:var(--violet-soft)}
#gymBody .gl .gck{flex:none;width:1.3em;text-align:center;font-weight:800;color:var(--violet)}
#gymBody .gl .gtx{flex:1;min-width:0;overflow-wrap:anywhere}
#gymBody .gl .gm{flex:none}
#gymBody .grow{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px}
#gymBody .crules{margin-top:10px}
.gover{margin-top:10px;text-align:left}
.gover ul{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}
.gover li{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:10px;background:var(--bg2)}
.gover .gmt{flex:1;min-width:0;display:flex;flex-direction:column;overflow-wrap:anywhere}
.gover .gmt small{color:var(--muted)}
.gover .gms{flex:none;font-weight:700}`;
  document.head.appendChild(css);
  const sec = document.createElement("section");
  sec.className = "group"; sec.id = "gymGroup"; sec.hidden = true;
  sec.innerHTML = `<h2 data-i18n="gTitle">${esc(t("gTitle"))}</h2><div id="gymBody" class="cbody"></div>`;
  $("customGroup").after(sec);
})();
let gymLv = null;
function renderGym(){
  const el = $("gymBody"); if(!el) return;
  const tgt = setup.target, levels = gymLevels(tgt);
  if(!levels.includes(gymLv)) gymLv = levels.includes(setup.level) ? setup.level : levels[0];
  const sel = new Set(gymSel(tgt)), list = gymLv ? gymLessons(tgt, gymLv) : [];
  const weak = gymWeak(tgt, 3), rounds = profile.gymRounds || 15;
  const chip = (on, attrs, label, dis) => `<button type="button" class="chip ${on ? "on" : ""}" ${attrs} ${dis ? "disabled" : ""} aria-pressed="${on}">${label}</button>`;
  el.innerHTML = `
    <p class="note">${esc(t("gIntro"))}</p>
    <div class="grow">${chip(false, `data-gweak="1"`, "🎯 " + esc(t("gWeak")), !weak.length)}${sel.size ? chip(false, `data-gclear="1"`, "✕ " + esc(t("gClear"))) : ""}</div>
    ${weak.length ? "" : `<p class="note">${esc(t("gWeakNone"))}</p>`}
    <h3>${esc(t("cLevels"))}</h3>
    <div class="chips">${levels.map(l => { const c = [...sel].filter(k => k.startsWith(l + "|")).length; return chip(l === gymLv, `data-glv="${l}"`, l + (c ? ` · ${c}` : "")); }).join("")}</div>
    <h3>${esc(gymLv || "")}</h3>
    <div class="glist">${list.length ? list.map(x => {
      const k = gymKey(x.lv, x.t), on = sel.has(k), m = gymMastery(gymRec(tgt, k));
      return `<button type="button" class="gl ${on ? "on" : ""}" data-gk="${esc(k)}" aria-pressed="${on}"><span class="gck" aria-hidden="true">${on ? "✓" : "+"}</span><span class="gtx">${esc(x.label)}</span><span class="gm" title="${esc(t(m.id))}" aria-label="${esc(t(m.id))}">${m.ico}</span></button>`;
    }).join("") : `<p class="note">${esc(t("gNone"))}</p>`}</div>
    <p class="note">${esc(t("gKey"))}</p>
    <div class="crules"><label>🔁 ${esc(t("gRoundsL"))} <select data-grounds="1">${[10, 15, 20, 30].map(v => `<option value="${v}" ${rounds === v ? "selected" : ""}>${v}</option>`).join("")}</select></label></div>
    <p class="note ${sel.size ? "" : "warn"}" id="gymSum">${esc(sel.size ? t("gSel", {n:sel.size}) : t("gSelNone"))}</p>`;
}
$("gymBody").addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b || b.disabled) return;
  try{ Sound.unlock(); Sound.tap(); }catch(err){}
  const tgt = setup.target, sel = gymSel(tgt);
  if(b.dataset.glv){ gymLv = b.dataset.glv; renderGym(); return; }
  if(b.dataset.gk){ const k = b.dataset.gk; gymSetSel(tgt, sel.includes(k) ? sel.filter(x => x !== k) : sel.concat([k])); renderGym(); return; }
  if(b.dataset.gclear){ gymSetSel(tgt, []); renderGym(); return; }
  if(b.dataset.gweak){
    const w = gymWeak(tgt, 3); if(!w.length) return;
    gymSetSel(tgt, w); gymLv = w[0].split("|")[0]; renderGym();
    toast("🎯 " + t("gWeakPicked", {n:w.length}));
  }
});
$("gymBody").addEventListener("change", e => {
  if(e.target.dataset.grounds){ profile.gymRounds = +e.target.value; saveProfile(); }
});
// block Start when nothing is picked
document.addEventListener("click", e => {
  if(!e.target.closest || !e.target.closest("#startBtn") || setup.mode !== 10) return;
  if(!gymSel(setup.target).length){ e.stopImmediatePropagation(); e.preventDefault(); $("startNote").textContent = t("gSelNone"); }
}, true);
renderMenu = (orig => function(){
  orig();
  $("gymGroup").hidden = setup.mode !== 10;
  if(setup.mode === 10){
    $("levelGroup").hidden = true;
    if($("clockGroup")) $("clockGroup").hidden = true;
    renderGym();
  }
})(renderMenu);
document.addEventListener("change", e => { if(e.target && e.target.id === "targetSel" && setup.mode === 10){ gymLv = null; setTimeout(renderGym, 0); } });

if(window.__PGM_TEST) window.__gym = {gymLessons, gymLevels, gymSel, gymSetSel, gymWeak, gymMastery, gymRec, gymGames, gymFind, gymKey};
