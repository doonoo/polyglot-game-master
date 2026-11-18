/* ===================== Custom game (mode 9) =====================
   Build your own run: pick what to practise (grammar, topics, communication, verbs,
   tricky pairs, numbers, vocabulary), which levels, which mini-games, and the rules
   (hearts, rounds, timer, strict accents, hints, re-asking misses). Every round draws
   one allowed combination and generates it with the engine of the matching mode. */
MODES.push({id:9, name:"Custom Game", ico:"🎛️", color:"#7AD3C0", desc:"Build your own run."});
GAME_ICO["Odd One Out"] = GAME_ICO["Odd One Out"] || "🧩";

const CSRC = [
  {id:"g", mode:2, strand:"g", ico:"📐"}, {id:"t", mode:2, strand:"t", ico:"🏷️"}, {id:"f", mode:2, strand:"f", ico:"💬"},
  {id:"verbs", mode:7, ico:"🔨"}, {id:"tricky", mode:8, ico:"⚖️"}, {id:"numbers", mode:4, ico:"🔢"}, {id:"vocab", mode:5, ico:"📚"}
];
const VOCAB_GAMES = ["Classic Mine","Reverse Mine","Syntax Scramble","Odd One Out","Match Madness","Echo Chamber"];
function srcGames(src){
  if(src.mode === 5) return VOCAB_GAMES.filter(g => g !== "Echo Chamber" || canEcho());
  return gamesFor({mode:src.mode});
}
const ALL_CGAMES = () => [...new Set(CSRC.flatMap(srcGames))];
const CDEF = () => ({sources:{g:true, t:true, f:true, verbs:true, tricky:true, numbers:true, vocab:true}, levels:["A1"], games:Object.fromEntries(ALL_CGAMES().map(g => [g, true])),
  hearts:0, rounds:0, timer:0, strict:false, hints:true, review:true});
profile.custom = null; profile.customPresets = [];
const curCfg = () => { const d = CDEF(); const c = profile.custom || {}; return Object.assign(d, c, {sources:Object.assign(d.sources, c.sources || {}), games:Object.assign(d.games, c.games || {})}); };

// every (source, level) pair that has content and at least one chosen mini-game
function customCombos(cfg, target){
  const tgt = LANG_CODE[target], out = [];
  for(const s of CSRC){
    if(!cfg.sources[s.id]) continue;
    const games = srcGames(s).filter(g => cfg.games[g]);
    if(!games.length) continue;
    for(const lv of cfg.levels){
      let idxs = [];
      if(s.mode === 2) idxs = (COURSE[tgt][lv] || []).map((c, i) => (c.k || "g") === s.strand ? i : -1).filter(i => i >= 0);
      else if(s.mode === 7) idxs = ((CONJ[tgt] || {})[lv] || []).map((_, i) => i);
      else if(s.mode === 8) idxs = ((TRICKY[tgt] || {})[lv] || []).map((_, i) => i);
      else if(s.mode === 4) idxs = (NUMSYL[lv] || []).map((_, i) => i);
      else if(s.mode === 5) idxs = (VLIST[lv] || []).map((_, i) => i);
      if(idxs.length) out.push({src:s.id, mode:s.mode, lv, idxs, games});
    }
  }
  return out;
}

/* ---------- engine hooks ---------- */
freshState = (orig => function(o){
  const st = orig(o);
  if(o.mode === 9){
    const cfg = curCfg();
    st.custom = JSON.parse(JSON.stringify(cfg));
    st.level = cfg.levels[0] || "A1";
    st.hp = st.maxHp = cfg.hearts || 99;
    st.redo = [];
    st.syllabus = [t("m9n")]; st.done = [false];
  }
  return st;
})(freshState);

makePlanCore = (orig => function(st, rolls, exclude){
  if(st.mode !== 9) return orig(st, rolls, exclude);
  const cfg = st.custom;
  if(cfg.review && st.redo && st.redo.length && (st.redo.length >= 4 || rolls.r < 0.35)){
    const p = st.redo[Math.floor(rolls.s * st.redo.length)];
    return Object.assign({}, p, {redo:true});
  }
  const combos = customCombos(cfg, st.target);
  if(!combos.length) return {kind:"mix", src:"g", mode:2, lv:"A1", idx:0, game:"Classic Mine"};
  const cb = combos[Math.floor(rolls.s * combos.length)];
  const games = cb.games.filter(g => g !== st.lastGame).length > 1 ? cb.games.filter(g => g !== st.lastGame) : cb.games;
  return {kind:"mix", src:cb.src, mode:cb.mode, lv:cb.lv, idx:cb.idxs[Math.floor(rolls.c * cb.idxs.length)], game:games[Math.floor(rolls.g * games.length)]};
})(makePlanCore);

generate = (orig => function(st, plan){
  if(st.mode !== 9 || !plan || plan.kind !== "mix") return orig(st, plan);
  const m = Object.assign({}, st, {mode:plan.mode, level:plan.lv, cefr:0});
  let res;
  if(plan.mode === 5){
    // pretend a handful of the level's words were already taught so Odd One Out and
    // Match Madness have material, and retry until the chosen mini-game fits a word
    const list = VLIST[plan.lv] || VLIST.A1, tgt = LANG_CODE[st.target];
    m.seenW = list.slice(0, 240).map(e => first(e[tgt]));
    let e = list[plan.idx] || pick(list);
    for(let k = 0; k < 15; k++){
      res = orig(m, {kind:"vocab", key:first(e[tgt]), game:plan.game});
      if(res && res.challenge && res.challenge.game === plan.game) break;
      e = pick(list);
    }
  } else {
    m.syllabus = syllabusFor(m); m.done = m.syllabus.map(() => false);
    res = orig(m, {kind:"syllabus", idx:Math.min(plan.idx, m.syllabus.length - 1), game:plan.game, boss:false});
  }
  const src = CSRC.find(s => s.id === plan.src) || CSRC[0];
  if(res && res.lesson) res.lesson = Object.assign({}, res.lesson, {title:src.ico + " " + plan.lv + " · " + (res.lesson.title || t("cs_" + src.id))});
  if(res && !st.custom.hints){
    if(res.lesson) res.lesson = Object.assign({}, res.lesson, {words:[], body:t("cNoHints")});
    if(res.challenge) res.challenge.hint = "";
    res.spotlight = null;
  }
  if(res && res.challenge) res.challenge.cplan = plan;
  return res;
})(generate);

applyResult = (orig => function(st, correct, plan){
  if(st.mode !== 9) return orig(st, correct, plan);
  orig(st, correct, plan && plan.kind === "mix" ? {kind:"mix"} : plan);
  if(st.status !== "playing") return;
  const cfg = st.custom;
  st.level = plan && plan.lv ? plan.lv : st.level;
  if(plan && plan.kind === "mix"){
    const same = x => x.src === plan.src && x.lv === plan.lv && x.idx === plan.idx;
    if(!correct && cfg.review){ st.redo = (st.redo || []).filter(x => !same(x)).concat([{kind:"mix", src:plan.src, mode:plan.mode, lv:plan.lv, idx:plan.idx, game:plan.game}]).slice(-20); }
    else if(correct && plan.redo) st.redo = (st.redo || []).filter(x => !same(x));
  }
  if(!correct && cfg.hearts){ st.hp--; if(st.hp <= 0){ st.status = "gameover"; return; } }
  if(cfg.rounds && st.stats.answered >= cfg.rounds) st.status = "conquered";
})(applyResult);

gradeLocal = (orig => function(st, ch, answer, force){
  if(st && st.mode === 9 && st.custom && st.custom.strict) return orig(Object.assign({}, st, {mode:3}), ch, answer, force);
  return orig(st, ch, answer, force);
})(gradeLocal);

progress = (orig => function(){
  if(!S || S.mode !== 9) return orig();
  const c = S.custom, n = S.stats.answered;
  if(c.rounds) return {n, d:c.rounds, label:t("cRound", {n:Math.min(n + 1, c.rounds), d:c.rounds})};
  return {n:S.stats.correct, d:Math.max(1, n), label:t("cScore", {c:S.stats.correct, n})};
})(progress);

showOver = (orig => function(){
  orig();
  if(!S || S.mode !== 9) return;
  const done = S.status === "conquered";
  $("overTitle").textContent = done ? t("cDoneT") : t("gameOver");
  $("overEmoji").textContent = done ? "🏁" : "💀";
  const acc = S.stats.answered ? Math.round(100 * S.stats.correct / S.stats.answered) : 0;
  const j = S.judgement;
  $("overText").innerHTML = (j && j.headline && !done ? `<b>${esc(j.headline)}</b><br>` : "") + esc(t(done ? "cDoneB" : "cOverB", {c:S.stats.correct, n:S.stats.answered, p:acc})) +
    (!done && j && j.answer ? `<br>${esc(t("answerWas"))} <b>${esc(j.answer)}</b>` : "");
  $("overIsland").hidden = true;
  const best = profile.customBest || 0;
  if(done && S.stats.correct > best){ profile.customBest = S.stats.correct; saveProfile(); }
})(showOver);

/* ---------- HUD: hearts and timer ---------- */
renderHud = (orig => function(){
  orig();
  if(!S || S.mode !== 9) return;
  const max = S.custom.hearts;
  $("hudHearts").hidden = !max;
  if(max){ $("hudHearts").textContent = "❤️".repeat(Math.max(0, S.hp)) + "🖤".repeat(Math.max(0, max - S.hp)); $("hudHearts").setAttribute("aria-label", t("cHearts", {hp:S.hp, max})); }
  $("hudBadge").textContent = "🎛️ " + (S.custom.levels.length > 1 ? S.custom.levels[0] + "–" + S.custom.levels[S.custom.levels.length - 1] : S.custom.levels[0]);
})(renderHud);
let cTimer = {cur:null, end:0};
function timerTick(){
  let el = $("hudTimer");
  const on = S && S.mode === 9 && S.custom && S.custom.timer && S.status === "playing" && S.current && !$("game").hidden;
  if(!on){ if(el) el.hidden = true; cTimer.cur = null; return; }
  if(!el){ el = document.createElement("span"); el.id = "hudTimer"; el.className = "ctimer"; $("hudHearts").after(el); }
  if(cTimer.cur !== S.current){ cTimer.cur = S.current; cTimer.end = Date.now() + S.custom.timer * 1000; }
  if($("submitBtn").disabled){ cTimer.end += 250; }   // pause while a turn is being processed
  const left = Math.max(0, Math.ceil((cTimer.end - Date.now()) / 1000));
  el.hidden = false; el.textContent = "⏱️ " + left; el.classList.toggle("low", left <= 5);
  if(left <= 0 && !$("giveUpBtn").disabled){ cTimer.cur = null; $("giveUpBtn").click(); }
}
setInterval(timerTick, 250);

/* ---------- Setup panel in the menu ---------- */
const CPRESETS = [
  {id:"all", ico:"🔀", cfg:{}},
  {id:"verbs", ico:"🔨", cfg:{sources:{g:false, t:false, f:false, verbs:true, tricky:false, numbers:false, vocab:false}}},
  {id:"talk", ico:"💬", cfg:{sources:{g:false, t:true, f:true, verbs:false, tricky:false, numbers:false, vocab:false}}},
  {id:"tricky", ico:"⚖️", cfg:{sources:{g:false, t:false, f:false, verbs:false, tricky:true, numbers:false, vocab:false}, rounds:20, strict:true}},
  {id:"ear", ico:"👂", cfg:{onlyGame:"Echo Chamber"}},
  {id:"speed", ico:"⏱️", cfg:{timer:15, rounds:20}},
  {id:"hard", ico:"💀", cfg:{hearts:1, strict:true, hints:false, review:false}}
];
function applyPreset(p){
  const d = CDEF(), c = p.cfg;
  const cfg = Object.assign(d, JSON.parse(JSON.stringify(c)), {sources:Object.assign(d.sources, c.sources || {}), levels:(profile.custom && profile.custom.levels) || d.levels});
  if(c.onlyGame){ for(const g in cfg.games) cfg.games[g] = g === c.onlyGame; delete cfg.onlyGame; }
  if(c.games) cfg.games = Object.assign(Object.fromEntries(ALL_CGAMES().map(g => [g, false])), c.games);
  profile.custom = cfg; saveProfile(); renderCustom();
}
function renderCustom(){
  const el = $("customBody"); if(!el) return;
  const cfg = curCfg(), nat = LANG_CODE[setup.native] || "en";
  const chip = (on, attrs, label, dis) => `<button type="button" class="chip ${on ? "on" : ""}" ${attrs} ${dis ? "disabled" : ""} aria-pressed="${on}">${label}</button>`;
  const usable = new Set(CSRC.filter(s => cfg.sources[s.id]).flatMap(srcGames));
  const combos = customCombos(cfg, setup.target);
  const opt = (k, vals, fmt) => `<select data-ck="${k}">${vals.map(v => `<option value="${v}" ${cfg[k] === v ? "selected" : ""}>${esc(fmt(v))}</option>`).join("")}</select>`;
  el.innerHTML = `
    <p class="note">${esc(t("cIntro"))}</p>
    <h3>${esc(t("cPresets"))}</h3>
    <div class="chips">${CPRESETS.map(p => chip(false, `data-cpre="${p.id}"`, p.ico + " " + esc(t("cp_" + p.id)))).join("")}
      ${(profile.customPresets || []).map((p, i) => `<span class="cpre">${chip(false, `data-cmine="${i}"`, "⭐ " + esc(p.name))}<button type="button" class="cdel" data-cdel="${i}" aria-label="${esc(t("cDelete"))}">✕</button></span>`).join("")}</div>
    <h3>${esc(t("cWhat"))}</h3>
    <div class="chips">${CSRC.map(s => chip(cfg.sources[s.id], `data-csrc="${s.id}"`, s.ico + " " + esc(t("cs_" + s.id)))).join("")}</div>
    <h3>${esc(t("cLevels"))}</h3>
    <div class="chips">${LEVELS.map(l => chip(cfg.levels.includes(l), `data-clv="${l}"`, l)).join("")}</div>
    <h3>${esc(t("cGames"))} <small><button type="button" class="linkbtn" data-call="1">${esc(t("cAll"))}</button> · <button type="button" class="linkbtn" data-call="0">${esc(t("cNone"))}</button></small></h3>
    <div class="chips">${ALL_CGAMES().map(g => chip(cfg.games[g] && usable.has(g), `data-cg="${esc(g)}"`, (GAME_ICO[g] || "🎮") + " " + esc(gameLabel(g)), !usable.has(g))).join("")}</div>
    <h3>${esc(t("cRules"))}</h3>
    <div class="crules">
      <label>❤️ ${esc(t("cHeartsL"))} ${opt("hearts", [0, 5, 3, 1], v => v ? String(v) : t("cUnlimited"))}</label>
      <label>🔁 ${esc(t("cRoundsL"))} ${opt("rounds", [0, 10, 20, 50], v => v ? String(v) : t("cEndless"))}</label>
      <label>⏱️ ${esc(t("cTimerL"))} ${opt("timer", [0, 30, 15, 10], v => v ? t("cSecs", {n:v}) : t("cOff"))}</label>
      <label class="ctog"><input type="checkbox" data-cb="strict" ${cfg.strict ? "checked" : ""}> ${esc(t("cStrict"))}</label>
      <label class="ctog"><input type="checkbox" data-cb="hints" ${cfg.hints ? "checked" : ""}> ${esc(t("cHints"))}</label>
      <label class="ctog"><input type="checkbox" data-cb="review" ${cfg.review ? "checked" : ""}> ${esc(t("cReview"))}</label>
    </div>
    <p class="note ${combos.length ? "" : "warn"}">${esc(combos.length ? t("cSummary", {g:ALL_CGAMES().filter(g => cfg.games[g] && usable.has(g)).length, s:CSRC.filter(s => cfg.sources[s.id]).length, l:cfg.levels.join(", ")}) : t("cEmpty"))}</p>
    <div class="csave"><input type="text" id="cNameIn" maxlength="24" placeholder="${esc(t("cMine", {n:(profile.customPresets || []).length + 1}))}" aria-label="${esc(t("cName"))}"><button type="button" class="ghost" id="cSave">💾 ${esc(t("cSave"))}</button></div>
    ${profile.customBest ? `<p class="note">🏁 ${esc(t("cBest", {n:profile.customBest}))}</p>` : ""}`;
}

function customSet(fn){ const cfg = curCfg(); fn(cfg); profile.custom = cfg; saveProfile(); renderCustom(); }
$("customBody").addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b || b.disabled) return;
  Sound.unlock(); Sound.tap();
  if(b.dataset.cpre){ applyPreset(CPRESETS.find(p => p.id === b.dataset.cpre)); toast("🎛️ " + t("cp_" + b.dataset.cpre)); return; }
  if(b.dataset.cmine){ const p = profile.customPresets[+b.dataset.cmine]; profile.custom = JSON.parse(JSON.stringify(p.cfg)); saveProfile(); renderCustom(); toast("⭐ " + p.name); return; }
  if(b.dataset.cdel){ profile.customPresets.splice(+b.dataset.cdel, 1); saveProfile(); renderCustom(); return; }
  if(b.dataset.csrc) return customSet(c => { c.sources[b.dataset.csrc] = !c.sources[b.dataset.csrc]; });
  if(b.dataset.clv) return customSet(c => { const l = b.dataset.clv; c.levels = c.levels.includes(l) ? (c.levels.length > 1 ? c.levels.filter(x => x !== l) : c.levels) : LEVELS.filter(x => x === l || c.levels.includes(x)); });
  if(b.dataset.cg) return customSet(c => { c.games[b.dataset.cg] = !c.games[b.dataset.cg]; });
  if(b.dataset.call) return customSet(c => { for(const g of ALL_CGAMES()) c.games[g] = b.dataset.call === "1"; });
  if(b.id === "cSave"){
    const name = ($("cNameIn").value || "").trim() || t("cMine", {n:(profile.customPresets || []).length + 1});
    profile.customPresets = (profile.customPresets || []).concat([{name:name.slice(0, 24), cfg:curCfg()}]).slice(-8);
    saveProfile(); renderCustom(); toast("💾 " + t("cSaved"));
  }
});
$("customBody").addEventListener("change", e => {
  const s = e.target;
  if(s.dataset.ck) customSet(c => { c[s.dataset.ck] = +s.value; });
  else if(s.dataset.cb) customSet(c => { c[s.dataset.cb] = s.checked; });
});
// block Start when nothing can be generated
document.addEventListener("click", e => {
  if(!e.target.closest || !e.target.closest("#startBtn") || setup.mode !== 9) return;
  if(!customCombos(curCfg(), setup.target).length){ e.stopImmediatePropagation(); e.preventDefault(); $("startNote").textContent = t("cEmpty"); }
}, true);
renderMenu = (orig => function(){
  orig();
  $("customGroup").hidden = setup.mode !== 9;
  if(setup.mode === 9){ $("levelGroup").hidden = true; renderCustom(); }
})(renderMenu);
