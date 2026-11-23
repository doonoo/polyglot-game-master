/* ===================== Two players (hot seat) =====================
   Part of the normal game, not a separate mode: switch the menu to 👥 2 players and every
   mode is played by two people taking turns on one phone or one computer.
   Each player has a full game state of their own (course, level, hearts, streak, XP, boss
   fights, island, clock), kept in TP.states. After a player answers they see their feedback;
   then the turn passes and the other player's state is swapped into S. Their next question
   was generated with their answer, so the engine runs unchanged.
   Modes: rounds-based for practice-style modes; Survivor, Island Hopper and Time Attack run
   until both players are out. Nothing is saved over the single-player game or counted in the
   single-player stats. */
Object.assign(I18N.en, {
  tp_players:"Players", tp_one:"1 player", tp_two:"2 players", tp_p1:"Player 1", tp_p2:"Player 2", tp_name:"Name",
  tp_p1note:"Uses the course and level chosen above.", tp_learning:"Learning", tp_level:"Level", tp_rounds:"Turns each", tp_untilOut:"Until both are out",
  tp_handoff:"Hide the next question between turns (pass-the-phone screen)", tp_turnOf:"{name}'s turn", tp_pass:"Pass to", tp_passKb:"Your turn,",
  tp_ready:"I'm ready", tp_next:"Next: {name}", tp_again:"Next turn", tp_results:"See who won", tp_out:"{name} is out!", tp_wins:"{name} wins!", tp_tie:"It's a tie!",
  tp_rematch:"Rematch", tp_menu:"Menu", tp_leave:"Tap ☰ again to leave the 2-player game", tp_turn:"Turn {n} of {m}", tp_turnInf:"Turn {n}",
  tp_xp:"XP", tp_right:"right", tp_best:"best streak", tp_reached:"reached", tp_badMode:"{name}'s language can't play this mode yet.", tp_first:"{name} goes first",
  tp_keys:"Enter ↵"
});
Object.assign(I18N.es, {
  tp_players:"Jugadores", tp_one:"1 jugador", tp_two:"2 jugadores", tp_p1:"Jugador 1", tp_p2:"Jugador 2", tp_name:"Nombre",
  tp_p1note:"Usa el curso y el nivel elegidos arriba.", tp_learning:"Aprende", tp_level:"Nivel", tp_rounds:"Turnos cada uno", tp_untilOut:"Hasta que los dos queden fuera",
  tp_handoff:"Ocultar la siguiente pregunta entre turnos (pantalla para pasar el teléfono)", tp_turnOf:"Turno de {name}", tp_pass:"Pasa a", tp_passKb:"Te toca,",
  tp_ready:"Estoy listo", tp_next:"Ahora: {name}", tp_again:"Siguiente turno", tp_results:"Ver quién ganó", tp_out:"¡{name} queda fuera!", tp_wins:"¡Gana {name}!", tp_tie:"¡Empate!",
  tp_rematch:"Revancha", tp_menu:"Menú", tp_leave:"Toca ☰ otra vez para salir de la partida a dos", tp_turn:"Turno {n} de {m}", tp_turnInf:"Turno {n}",
  tp_xp:"XP", tp_right:"aciertos", tp_best:"mejor racha", tp_reached:"llegó a", tp_badMode:"El idioma de {name} aún no tiene este modo.", tp_first:"Empieza {name}",
  tp_keys:"Intro ↵"
});

const TP_COLORS = ["#2B7FFF", "#FF4D6D"], TP_ICON = ["🔵", "🔴"];
const tpFinePointer = (() => { try{ return matchMedia("(pointer: fine)").matches && !matchMedia("(pointer: coarse)").matches; }catch(e){ return false; } })();
let TPS = {on:false, names:["", ""], p2:{target:"English", level:"A1"}, rounds:10, handoff:!tpFinePointer};
try{ const sv = JSON.parse(localStorage.getItem("pgm-2p") || "null"); if(sv && sv.names) TPS = Object.assign(TPS, sv, {p2:Object.assign({}, TPS.p2, sv.p2 || {})}); }catch(e){}
const tpSaveSet = () => { try{ localStorage.setItem("pgm-2p", JSON.stringify(TPS)); }catch(e){} };
let TP = {on:false};

const tpNative = target => target === "English" ? "Spanish" : "English";
const tpEndless = mode => mode === 3 || mode === 6 || (typeof setup !== "undefined" && setup.clock === "attack");
const tpName = i => (TPS.names[i] || "").trim() || t(i ? "tp_p2" : "tp_p1");
function tpModeOk(target, mode){ return !(typeof xlIs === "function" && xlIs(target) && !XL_MODES.includes(mode)); }

/* ---------- menu ---------- */
(() => {
  const css = document.createElement("style");
  css.textContent = `
.tpbox{background:var(--card);border-radius:18px;padding:14px;box-shadow:var(--shadow);margin:0 0 14px}
.tpseg{display:grid;grid-template-columns:1fr 1fr;gap:6px;background:var(--field);border-radius:14px;padding:4px}
.tpseg button{border:0;border-radius:11px;padding:10px;font-weight:800;background:transparent;color:var(--ink)}
.tpseg button[aria-pressed=true]{background:var(--violet);color:#fff;box-shadow:0 3px 0 var(--violet-deep)}
.tpcfg{display:grid;gap:10px;margin-top:12px}
.tprow{border-left:5px solid var(--pc);padding:6px 0 6px 10px}
.tprow h4{margin:0 0 6px;color:var(--pc)}
.tprow .two{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}
.tprow input,.tprow select,.tpcfg select{width:100%}
.tpcfg label.tog{display:flex;gap:10px;align-items:flex-start;font-size:.92rem}
.tpwarn{color:var(--red);font-weight:700;font-size:.9rem}
#tpBar{position:sticky;top:calc(var(--hud-h, 58px) + 4px);z-index:5;display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin:0 0 12px}
.tppill{background:var(--card);border-radius:14px;padding:7px 10px;box-shadow:var(--shadow);border:3px solid transparent;text-align:center;transition:transform .2s,border-color .2s,opacity .2s;min-width:0}
.tppill.on{border-color:var(--pc);transform:scale(1.04)}
.tppill.out{opacity:.45;filter:grayscale(.6)}
.tppill .nm{display:block;font-weight:800;color:var(--pc);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tppill .sc{display:block;font:800 1.35rem/1.1 "Bricolage Grotesque",sans-serif}
.tppill .sub{display:block;font-size:.75rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tppill .dots{display:flex;gap:3px;justify-content:center;margin-top:3px;min-height:8px}
.tppill .dots i{width:7px;height:7px;border-radius:50%;background:var(--line)}
.tppill .dots i.y{background:var(--green)}.tppill .dots i.n{background:var(--red)}
.tpmid{font-size:.78rem;color:var(--muted);text-align:center;font-weight:700;line-height:1.2}
.tpmid b{display:block;font:800 1rem "Bricolage Grotesque",sans-serif;color:var(--ink)}
body.tp-on #feed{box-shadow:inset 0 0 0 0 transparent}
body.tp-on[data-tp="0"] .hud{box-shadow:0 3px 0 ${TP_COLORS[0]}}
body.tp-on[data-tp="1"] .hud{box-shadow:0 3px 0 ${TP_COLORS[1]}}
body.tp-on[data-tp="0"] #challengeCard{border-top:5px solid ${TP_COLORS[0]}}
body.tp-on[data-tp="1"] #challengeCard{border-top:5px solid ${TP_COLORS[1]}}
#tpNext{display:block;width:100%;margin:12px 0 18px;font-size:1.1rem;background:var(--pc);box-shadow:0 5px 0 rgba(0,0,0,.25)}
#tpNext kbd,.tpready kbd{font:inherit;font-size:.75em;font-weight:700;color:inherit;background:rgba(255,255,255,.18);margin-left:10px;border:1px solid currentColor;border-radius:6px;padding:1px 7px;box-shadow:none}
.tpwho{position:relative}
.tpov{position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--pc);color:#fff;animation:aFade .2s ease-out}
.tpov[hidden]{display:none}
.tpov .in{text-align:center;max-width:460px}
.tpov .big{font:800 clamp(2.2rem,9vw,3.6rem)/1.05 "Bricolage Grotesque",sans-serif;margin:10px 0 8px}
.tpov .lang{opacity:.92;margin-bottom:26px;font-size:1.05rem}
.tpov .tpready{background:#fff;color:#1C1A33;border:0;border-radius:16px;padding:15px 34px;font:800 1.25rem "Bricolage Grotesque",sans-serif;box-shadow:0 6px 0 rgba(0,0,0,.22)}
.tpov .tpready kbd{border-color:#1C1A33}
.tpres{position:fixed;inset:0;z-index:30;overflow:auto;background:var(--bg);padding:24px 16px calc(24px + env(safe-area-inset-bottom,0px))}
.tpres[hidden]{display:none}
.tpres .in{max-width:640px;margin:0 auto;text-align:center}
.tpres .crown{font-size:4.5rem;line-height:1;display:inline-block;animation:jxDropL .7s cubic-bezier(.2,1.4,.4,1) backwards}
.tpres h2{font-size:2.1rem;margin:8px 0 16px}
.tpres .cols{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
.tpres .col{background:var(--card);border-radius:18px;padding:14px;box-shadow:var(--shadow);border-top:6px solid var(--pc)}
.tpres .col.win{box-shadow:0 0 0 3px var(--pc),var(--shadow);transform:scale(1.03)}
.tpres .col b{display:block;color:var(--pc);font-size:1.15rem}
.tpres .col .big{display:block;font:800 2.2rem/1.1 "Bricolage Grotesque",sans-serif}
.tpres .col small{display:block;color:var(--muted);margin-top:2px}
.tpres .btns{display:grid;gap:10px}
@media (min-width:1100px){
  body.tp-on #tpBar{position:fixed;top:120px;left:0;right:0;display:block;pointer-events:none;margin:0;z-index:4}
  body.tp-on #tpBar .tppill{position:absolute;width:210px;padding:16px 14px;pointer-events:auto}
  body.tp-on #tpBar .tppill:first-child{left:max(16px, calc(50% - 320px - 250px))}
  body.tp-on #tpBar .tppill:last-child{right:max(16px, calc(50% - 320px - 250px))}
  body.tp-on #tpBar .tppill .sc{font-size:2.2rem}
  body.tp-on #tpBar .tppill .nm{font-size:1.15rem}
  body.tp-on #tpBar .tppill .dots i{width:9px;height:9px}
  body.tp-on #tpBar .tpmid{position:absolute;left:50%;top:-56px;transform:translateX(-50%);display:none}
  body.tp-on #tpBar .tppill.on{transform:scale(1.06)}
}
`;
  document.head.appendChild(css);
  const box = document.createElement("div");
  box.className = "tpbox"; box.id = "tpBox";
  $("startBtn").before(box);
  const ov = document.createElement("div"); ov.className = "tpov"; ov.id = "tpOv"; ov.hidden = true; document.body.appendChild(ov);
  const rs = document.createElement("div"); rs.className = "tpres"; rs.id = "tpRes"; rs.hidden = true; document.body.appendChild(rs);
})();

function tpMenu(){
  const box = $("tpBox"); if(!box) return;
  const mode = setup.mode, lv = levelsFor(mode, TPS.p2.target);
  if(!lv.includes(TPS.p2.level)) TPS.p2.level = lv.includes(setup.level) ? setup.level : lv[0];
  const bad = [setup.target, TPS.p2.target].map((tg, i) => !tpModeOk(tg, mode) ? tpName(i) : null).filter(Boolean);
  const endless = tpEndless(mode);
  box.innerHTML = `<div class="f" style="margin-bottom:6px">👥 ${esc(t("tp_players"))}</div>
    <div class="tpseg" role="group" aria-label="${esc(t("tp_players"))}"><button type="button" data-tpn="1" aria-pressed="${!TPS.on}">👤 ${esc(t("tp_one"))}</button><button type="button" data-tpn="2" aria-pressed="${TPS.on}">👥 ${esc(t("tp_two"))}</button></div>
    ${TPS.on ? `<div class="tpcfg">
      <div class="tprow" style="--pc:${TP_COLORS[0]}"><h4>${TP_ICON[0]} ${esc(t("tp_p1"))}</h4><input id="tpName0" data-tpname="0" maxlength="16" value="${esc(TPS.names[0])}" placeholder="${esc(t("tp_p1"))}" aria-label="${esc(t("tp_name"))}" autocomplete="off"><small class="note">${esc(t("tp_p1note"))} ${esc(langLabel(setup.target))}</small></div>
      <div class="tprow" style="--pc:${TP_COLORS[1]}"><h4>${TP_ICON[1]} ${esc(t("tp_p2"))}</h4><input id="tpName1" data-tpname="1" maxlength="16" value="${esc(TPS.names[1])}" placeholder="${esc(t("tp_p2"))}" aria-label="${esc(t("tp_name"))}" autocomplete="off">
        <div class="two"><div><label class="f" for="tpLang">${esc(t("tp_learning"))}</label><select id="tpLang">${LANGS.map(l => `<option value="${esc(l)}" ${l === TPS.p2.target ? "selected" : ""}>${esc(langLabel(l))}</option>`).join("")}</select></div>
        <div><label class="f" for="tpLv">${esc(t("tp_level"))}</label><select id="tpLv" ${mode === 3 || mode === 6 ? "disabled" : ""}>${lv.map(l => `<option ${l === TPS.p2.level ? "selected" : ""}>${l}</option>`).join("")}</select></div></div></div>
      ${endless ? `<small class="note">⏳ ${esc(t("tp_untilOut"))}</small>` : `<div><label class="f" for="tpRounds">${esc(t("tp_rounds"))}</label><select id="tpRounds">${[5, 10, 15, 20, 30].map(n => `<option ${n === TPS.rounds ? "selected" : ""}>${n}</option>`).join("")}</select></div>`}
      <label class="tog"><input type="checkbox" id="tpHand" ${TPS.handoff ? "checked" : ""}> ${esc(t("tp_handoff"))}</label>
      ${bad.length ? `<div class="tpwarn">⚠️ ${esc(t("tp_badMode", {name:bad.join(", ")}))}</div>` : ""}</div>` : ""}`;
  $("startBtn").disabled = TPS.on && bad.length > 0;
}
renderMenu = (orig => function(){ const r = orig.apply(this, arguments); try{ tpMenu(); }catch(e){} return r; })(renderMenu);
document.addEventListener("click", e => {
  const b = e.target.closest("[data-tpn]");
  if(b){ TPS.on = b.dataset.tpn === "2"; tpSaveSet(); Sound.tap(); renderMenu(); }
});
document.addEventListener("change", e => {
  const el = e.target;
  if(el.id === "tpLang"){ TPS.p2.target = el.value; tpSaveSet(); renderMenu(); }
  if(el.id === "tpLv"){ TPS.p2.level = el.value; tpSaveSet(); }
  if(el.id === "tpRounds"){ TPS.rounds = +el.value; tpSaveSet(); }
  if(el.id === "tpHand"){ TPS.handoff = el.checked; tpSaveSet(); }
});
document.addEventListener("input", e => { const el = e.target; if(el.dataset && el.dataset.tpname !== undefined){ TPS.names[+el.dataset.tpname] = el.value; tpSaveSet(); } });

/* ---------- starting a 2-player game ---------- */
$("startBtn").addEventListener("click", e => {
  if(!TPS.on) return;
  e.stopImmediatePropagation(); e.preventDefault();
  tpStart();
}, true);
function tpStart(){
  if(!tpModeOk(setup.target, setup.mode) || !tpModeOk(TPS.p2.target, setup.mode)){ renderMenu(); return; }
  const mode = setup.mode;
  const cfg = [
    {target:setup.target, native:setup.native, level:mode === 3 ? "A1" : setup.level},
    {target:TPS.p2.target, native:tpNative(TPS.p2.target), level:mode === 3 ? "A1" : TPS.p2.level}
  ];
  if(typeof xlIs === "function") cfg.forEach(c => { if(xlIs(c.target)) c.native = "English"; });
  TP = {on:true, cur:0, states:[null, null], turns:[0, 0], out:[false, false], names:[tpName(0), tpName(1)], cfg, mode,
    rounds:tpEndless(mode) ? Infinity : TPS.rounds, handoff:TPS.handoff, phase:"play", hist:[[], []], inTurn:false};
  $("startNote").textContent = "";
  for(const i of [1, 0]){
    S = freshState({mode, target:cfg[i].target, native:cfg[i].native, level:cfg[i].level, islandId:i === 0 ? setup.island : ""});
    S.tp = i; TP.states[i] = S;
    if(i === 0) showGame();
    TP.inTurn = true; try{ runTurn(null); } finally { TP.inTurn = false; }
    TP.states[i] = S;
  }
  S = TP.states[0];
  document.body.classList.add("tp-on");
  Sound.start();
  tpShowTurn(0, true);
}

/* ---------- hooks into the engine ---------- */
ckPaused = (orig => function(){ return orig.apply(this, arguments) || (TP.on && (!$("tpOv").hidden || !$("tpRes").hidden || TP.phase !== "play")); })(ckPaused);
save = (orig => function(){ if(TP.on) return; return orig.apply(this, arguments); })(save);
recordAnswer = (orig => function(){ if(TP.on) return; return orig.apply(this, arguments); })(recordAnswer);
runTurn = (orig => function(answer, force){
  if(!TP.on || TP.inTurn) return orig.apply(this, arguments);
  const answering = !!(S && S.current && S.current.plan), me = TP.cur;
  TP.inTurn = true;
  try{ orig.apply(this, arguments); } finally { TP.inTurn = false; }
  undo = null;
  TP.states[me] = S;
  if(!answering) return;
  TP.turns[me]++;
  if(S.judgement) TP.hist[me].push(!!S.judgement.correct);
  if(S.status !== "playing") TP.out[me] = true;
  tpAfterAnswer();
})(runTurn);
showOver = (orig => function(){
  if(!TP.on) return orig.apply(this, arguments);
  TP.out[TP.cur] = true;
  if(!TP.inTurn){ TP.states[TP.cur] = S; tpAfterAnswer(); }   // e.g. Time Attack ran out of time
})(showOver);
renderGame = (orig => function(){
  const r = orig.apply(this, arguments);
  if(TP.on) try{ tpDecorate(); }catch(e){}
  return r;
})(renderGame);
showMenu = (orig => function(){
  if(TP.on) tpEnd(false);
  return orig.apply(this, arguments);
})(showMenu);
// leaving a 2-player game takes two taps on ☰
$("menuBtn").addEventListener("click", e => {
  if(!TP.on || TP.phase === "done") return;
  if(!TP.leaveArmed){ e.stopImmediatePropagation(); TP.leaveArmed = true; toast(t("tp_leave")); setTimeout(() => { TP.leaveArmed = false; }, 2500); }
}, true);
syncMood = (orig => function(){
  if(TP.on && !$("tpRes").hidden){ Music.setMood("title"); return; }
  return orig.apply(this, arguments);
})(syncMood);

/* ---------- turn flow ---------- */
const tpKind = () => TP.mode === 3 || (TP.states[0] && TP.states[0].clock === "attack") ? "elim" : TP.mode === 6 ? "race" : "score";
function tpNextIdx(){
  const me = TP.cur, other = 1 - me, st = TP.states;
  const doneFor = i => TP.out[i] || TP.turns[i] >= TP.rounds;
  if(doneFor(0) && doneFor(1)) return -1;
  const kind = tpKind(), won = i => st[i].status === "conquered";
  // last one standing: once someone is out, the other wins as soon as they pass them
  if(kind === "elim") for(const i of [0, 1]) if(TP.out[i] && !TP.out[1 - i] && st[1 - i].stats.correct > st[i].stats.correct) return -1;
  // race: the first to finish wins, once both have had the same number of turns
  if(kind === "race" && (won(0) || won(1)) && TP.turns[0] === TP.turns[1]) return -1;
  if(!doneFor(other)) return other;
  return me;
}
function tpAfterAnswer(){
  TP.next = tpNextIdx();
  TP.phase = TP.next < 0 ? "done" : "wait";
  if(TP.out[TP.cur]) setTimeout(() => { try{ juBanner(t("tp_out", {name:TP.names[TP.cur]}), "boss"); }catch(e){} }, 500);
  renderGame();
  const b = $("tpNext"); if(b) setTimeout(() => b.scrollIntoView({block:"nearest", behavior:"smooth"}), 120);
}
function tpGo(){
  if(TP.phase === "done") return tpResults();
  if(TP.phase !== "wait") return;
  const me = TP.cur, nx = TP.next;
  TP.states[me] = S;
  S = TP.states[nx]; TP.cur = nx;
  S.judgement = null; S.event = null;
  TP.phase = "play";
  tpShowTurn(nx, nx !== me);
}
function tpShowTurn(i, switched){
  const pl = TP.cfg[i];
  if(switched && TP.handoff){
    const ov = $("tpOv");
    ov.style.setProperty("--pc", TP_COLORS[i]);
    ov.innerHTML = `<div class="in"><div>${esc(t(tpFinePointer ? "tp_passKb" : "tp_pass"))}</div><div class="big">${TP_ICON[i]} ${esc(TP.names[i])}</div>
      <div class="lang">${esc(langLabel(pl.target))} · ${esc(S.level || pl.level)}${TP.rounds !== Infinity ? " · " + esc(t("tp_turn", {n:TP.turns[i] + 1, m:TP.rounds})) : ""}</div>
      <button class="tpready" id="tpReady">${esc(t("tp_ready"))} ▶${tpFinePointer ? `<kbd>${esc(t("tp_keys"))}</kbd>` : ""}</button></div>`;
    ov.hidden = false;
    $("game").setAttribute("aria-hidden", "true");
    renderGame(true);
    setTimeout(() => { const r = $("tpReady"); if(r) r.focus(); }, 30);
    return;
  }
  renderGame(true);
  try{ syncMood(); }catch(e){}
  if(switched) setTimeout(() => { try{ juBanner(t("tp_turnOf", {name:TP.names[i]}), i ? "boss" : "lvl"); }catch(e){} }, 60);
  tpFocus();
}
function tpReady(){
  $("tpOv").hidden = true; $("game").removeAttribute("aria-hidden");
  Sound.select();
  renderGame(true);
  try{ syncMood(); }catch(e){}
  tpFocus();
}
function tpFocus(){ setTimeout(() => { const a = $("answer"); if(a && !a.closest("[hidden]") && a.offsetParent) a.focus(); window.scrollTo({top:0}); }, 40); }

function tpDecorate(){
  document.body.dataset.tp = TP.cur;
  let bar = $("tpBar");
  if(!bar){ bar = document.createElement("div"); bar.id = "tpBar"; $("feed").prepend(bar); }
  const pill = i => {
    const st = TP.states[i] || {}, s = st.stats || {}, hp = st.mode === 3 ? " · " + "❤️".repeat(Math.max(0, st.hp || 0)) : "";
    const dots = TP.hist[i].slice(-10).map(v => `<i class="${v ? "y" : "n"}"></i>`).join("");
    return `<div class="tppill ${TP.cur === i && TP.phase !== "done" ? "on" : ""} ${TP.out[i] ? "out" : ""}" style="--pc:${TP_COLORS[i]}">
      <span class="nm">${TP_ICON[i]} ${esc(TP.names[i])}</span><span class="sc">${st.xp || 0}</span>
      <span class="sub">${esc(t("tp_xp"))} · ${s.correct || 0}/${s.answered || 0}${hp}</span><span class="sub">${esc(langLabel(TP.cfg[i].target))} · ${esc(st.level || "")}</span><span class="dots">${dots}</span></div>`;
  };
  const n = Math.max(TP.turns[0], TP.turns[1]) + (TP.phase === "play" ? 1 : 0);
  bar.innerHTML = pill(0) + `<div class="tpmid"><b>VS</b>${esc(TP.rounds === Infinity ? t("tp_turnInf", {n:Math.max(1, n)}) : t("tp_turn", {n:Math.min(Math.max(1, n), TP.rounds), m:TP.rounds}))}</div>` + pill(1);
  // waiting for the hand-off: show only this player's feedback, keep the next question hidden
  let nb = $("tpNext");
  const wait = TP.phase === "wait" || TP.phase === "done";
  if(wait){
    for(const id of ["lessonCard", "challengeCard", "cheatPanel", "thinkCard"]){ const el = $(id); if(el) el.hidden = true; }
    $("tiles") && ($("tiles").hidden = true);
    if(!nb){ nb = document.createElement("button"); nb.id = "tpNext"; nb.className = "primary"; }
    const jc = $("judgeCard"), anchor = jc && !jc.hidden ? jc : $("eventCard");
    (anchor && !anchor.hidden ? anchor : bar).after(nb);
    const nx = TP.next;
    nb.style.setProperty("--pc", TP_COLORS[nx < 0 ? TP.cur : nx]);
    nb.innerHTML = esc(TP.phase === "done" ? "🏆 " + t("tp_results") : nx === TP.cur ? t("tp_again") : t("tp_next", {name:TP.names[nx]})) + " ▶" + (tpFinePointer ? `<kbd>${esc(t("tp_keys"))}</kbd>` : "");
    nb.hidden = false;
  } else if(nb) nb.hidden = true;
}

/* ---------- results ---------- */
function tpResults(){
  TP.phase = "done";
  const P = TP.states.map((st, i) => ({i, name:TP.names[i], xp:st.xp || 0, right:st.stats.correct, n:st.stats.answered, best:st.stats.best, level:st.level, target:TP.cfg[i].target}));
  const kind = tpKind();
  P.forEach(p => { p.won = TP.states[p.i].status === "conquered"; });
  const cmp = kind === "elim" ? (a, b) => b.right - a.right || b.xp - a.xp
    : kind === "race" ? (a, b) => (b.won - a.won) || b.xp - a.xp
    : (a, b) => b.xp - a.xp || b.right - a.right;
  const sorted = P.slice().sort(cmp), tie = cmp(P[0], P[1]) === 0, w = tie ? null : sorted[0];
  const rs = $("tpRes");
  rs.innerHTML = `<div class="in"><div class="crown">${tie ? "🤝" : "👑"}</div><h2 class="display" style="${w ? `color:${TP_COLORS[w.i]}` : ""}">${esc(tie ? t("tp_tie") : t("tp_wins", {name:w.name}))}</h2>
    <div class="cols">${P.map(p => `<div class="col ${w && w.i === p.i ? "win" : ""}" style="--pc:${TP_COLORS[p.i]}"><b>${TP_ICON[p.i]} ${esc(p.name)}</b><span class="big">${p.xp}</span><small>${esc(t("tp_xp"))}</small>
      <small>✅ ${p.right}/${p.n} ${esc(t("tp_right"))}${p.n ? ` · ${Math.round(100 * p.right / p.n)}%` : ""}</small><small>🔥 ${esc(t("tp_best"))} ${p.best}</small><small>${esc(langLabel(p.target))} · ${esc(p.level)}</small></div>`).join("")}</div>
    <div class="btns"><button class="primary" id="tpRematch">🔁 ${esc(t("tp_rematch"))}${tpFinePointer ? `<kbd style="font:inherit;font-size:.75em;margin-left:8px;opacity:.8">${esc(t("tp_keys"))}</kbd>` : ""}</button><button class="ghost" id="tpMenuBtn">${esc(t("tp_menu"))}</button></div></div>`;
  rs.hidden = false;
  try{ syncMood(); }catch(e){}
  if(tie) Sound.levelUp(); else { Sound.stageClear(); try{ confetti(180); }catch(e){} }
  setTimeout(() => { const b = $("tpRematch"); if(b) b.focus(); }, 50);
}
function tpEnd(toMenu){
  TP = {on:false};
  document.body.classList.remove("tp-on"); delete document.body.dataset.tp;
  $("tpOv").hidden = true; $("tpRes").hidden = true; $("game").removeAttribute("aria-hidden");
  const bar = $("tpBar"); if(bar) bar.remove();
  const nb = $("tpNext"); if(nb) nb.remove();
  S = loadSave();   // the single-player game comes back untouched
  if(toMenu) showMenu();
}

document.addEventListener("click", e => {
  if(e.target.closest("#tpNext")){ Sound.tap(); return tpGo(); }
  if(e.target.closest("#tpReady")) return tpReady();
  if(e.target.closest("#tpRematch")){ Sound.start(); tpEnd(false); return tpStart(); }
  if(e.target.closest("#tpMenuBtn")){ Sound.tap(); return tpEnd(true); }
});
// keyboard (PC): Enter moves the game along between turns; the normal game keys work during a turn.
// Between turns every other key is held back so nobody can answer the hidden question.
window.addEventListener("keydown", e => {
  if(!TP.on || e.isComposing) return;
  const between = !$("tpRes").hidden || !$("tpOv").hidden || TP.phase === "wait" || TP.phase === "done";
  if(!between) return;
  if(e.key !== "Enter"){ if(e.key !== "Tab" && !(e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && e.target.closest(".tpres"))) e.stopImmediatePropagation(); return; }
  if(!$("tpRes").hidden){ e.preventDefault(); e.stopImmediatePropagation(); Sound.start(); tpEnd(false); return tpStart(); }
  if(!$("tpOv").hidden){ e.preventDefault(); e.stopImmediatePropagation(); return tpReady(); }
  if(TP.phase === "wait" || TP.phase === "done"){ e.preventDefault(); e.stopImmediatePropagation(); Sound.tap(); return tpGo(); }
}, true);
setTimeout(() => { try{ tpMenu(); }catch(e){} }, 0);
if(window.__PGM_TEST) window.__tp = {get TP(){ return TP; }, TPS, tpStart, tpGo, tpReady, tpResults, tpEnd};
