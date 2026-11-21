/* ===================== Two-player duel (pass the phone) =====================
   Two players on one device take turns. Each player picks their own course and level, so a
   Spanish learner and an English learner can play each other. Rounds mix four challenge
   types built from the regular lessons: pick the translation, what does it mean, build the
   sentence from tiles and type it. Points for right answers, a speed bonus with the timer on,
   and a streak bonus. Nothing here touches the single-player save or stats. */
Object.assign(I18N.en, {
  dl_btn:"2 Players", dl_btnSub:"Pass-the-phone duel", dl_title:"Two-player duel", dl_sub:"Take turns on one phone. Each player can learn a different language.",
  dl_p:"Player {n}", dl_name:"Name", dl_learning:"Learning", dl_level:"Level", dl_rounds:"Rounds each", dl_timer:"20-second timer",
  dl_start:"Start duel", dl_pass:"Pass the phone to", dl_ready:"I'm ready", dl_turn:"{name}'s turn", dl_round:"Round {r} of {n}",
  dl_pick:"Pick the {lang} translation", dl_rev:"What does this mean?", dl_build:"Build it in {lang}", dl_type:"Type it in {lang}",
  dl_check:"Check", dl_next:"Next: {name}", dl_results:"See who won", dl_right:"Right!", dl_wrong:"Not quite", dl_answer:"Answer:",
  dl_pts:"+{n}", dl_wins:"{name} wins!", dl_tie:"It's a tie!", dl_rematch:"Rematch", dl_menu:"Menu", dl_quit:"Quit duel",
  dl_timeUp:"Time's up!", dl_speed:"speed", dl_streak:"streak", dl_correct:"{n} right", dl_best:"best streak {n}", dl_quitAsk:"Tap ✕ again to quit the duel"
});
Object.assign(I18N.es, {
  dl_btn:"2 jugadores", dl_btnSub:"Duelo pasando el teléfono", dl_title:"Duelo de dos jugadores", dl_sub:"Turnaos en un mismo teléfono. Cada jugador puede aprender un idioma distinto.",
  dl_p:"Jugador {n}", dl_name:"Nombre", dl_learning:"Aprende", dl_level:"Nivel", dl_rounds:"Rondas cada uno", dl_timer:"Temporizador de 20 segundos",
  dl_start:"Empezar duelo", dl_pass:"Pasa el teléfono a", dl_ready:"Estoy listo", dl_turn:"Turno de {name}", dl_round:"Ronda {r} de {n}",
  dl_pick:"Elige la traducción en {lang}", dl_rev:"¿Qué significa?", dl_build:"Constrúyelo en {lang}", dl_type:"Escríbelo en {lang}",
  dl_check:"Comprobar", dl_next:"Ahora: {name}", dl_results:"Ver quién ganó", dl_right:"¡Bien!", dl_wrong:"No exactamente", dl_answer:"Respuesta:",
  dl_pts:"+{n}", dl_wins:"¡Gana {name}!", dl_tie:"¡Empate!", dl_rematch:"Revancha", dl_menu:"Menú", dl_quit:"Salir del duelo",
  dl_timeUp:"¡Se acabó el tiempo!", dl_speed:"rapidez", dl_streak:"racha", dl_correct:"{n} aciertos", dl_best:"mejor racha {n}", dl_quitAsk:"Toca ✕ otra vez para salir"
});

const DL_COLORS = ["#2B7FFF", "#FF4D6D"];
let DLS = {players:[{name:"", target:"Spanish", level:"A1"}, {name:"", target:"English", level:"A1"}], rounds:5, timer:false};
try{ const sv = JSON.parse(localStorage.getItem("pgm-duel") || "null"); if(sv && sv.players && sv.players.length === 2) DLS = Object.assign(DLS, sv); }catch(e){}
const dlSaveSetup = () => { try{ localStorage.setItem("pgm-duel", JSON.stringify(DLS)); }catch(e){} };
let DL = null;   // the running duel

const dlNative = target => target === "English" ? "Spanish" : "English";
const dlLangName = name => (LN[LANG_CODE[UI.code === "es" ? "Spanish" : "English"]] || LN.en)[name] || name;
const dlLevels = target => Object.keys(COURSE[LANG_CODE[target]] || {});
const dlShuf = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const dlShow = (code, s) => code === "zh" && typeof xlSpace === "function" ? xlSpace(s) : s;
const dlRom = (code, s) => (code === "zh" || code === "ar") && typeof XL_ROM !== "undefined" ? XL_ROM[xlKey(s)] || "" : "";
function dlPool(target, level){
  const code = LANG_CODE[target], lessons = (COURSE[code] || {})[level] || [];
  const out = [], seen = new Set();
  for(const c of lessons) for(const it of (c.it || [])){
    const t = canon(it[1]), n = canon(it[0]), len = t.split(" ").length;
    if(!t || !n || len < 2 || len > 9 || seen.has(t)) continue;
    seen.add(t); out.push({t, n, p:it[1]});
  }
  return out;
}
function dlQuestion(pl){
  const code = LANG_CODE[pl.target], nonLatin = code === "zh" || code === "ar";
  if(!pl.bag || pl.bag.length < 4) pl.bag = dlShuf(dlPool(pl.target, pl.level));
  const item = pl.bag.pop(), others = pl.pool.filter(x => x.t !== item.t);
  const kinds = nonLatin ? ["pick", "rev", "build", "build"] : ["pick", "rev", "build", "type"];
  let k = kinds[(pl.qn + Math.floor(Math.random() * 2)) % kinds.length];
  if(k === pl.lastK) k = kinds[(kinds.indexOf(k) + 1) % kinds.length];
  pl.lastK = k; pl.qn++;
  const q = {k, item, code};
  if(k === "pick") q.opts = dlShuf([item.t, ...dlShuf(others).slice(0, 3).map(x => x.t)]);
  if(k === "rev") q.opts = dlShuf([item.n, ...dlShuf(others).slice(0, 3).map(x => x.n)]);
  if(k === "build"){
    const words = item.t.split(" "), extra = dlShuf([...new Set(others.flatMap(x => x.t.split(" ")))].filter(w => !words.includes(w))).slice(0, 3);
    q.tiles = dlShuf(words.concat(extra)); q.picked = [];
  }
  return q;
}

/* ---------- page and menu button ---------- */
(() => {
  const css = document.createElement("style");
  css.textContent = `
.duelcard{display:flex;align-items:center;gap:14px;width:100%;text-align:left;border:0;border-radius:20px;padding:14px 18px;margin:0 0 18px;color:#fff;cursor:pointer;
  background:linear-gradient(110deg,${DL_COLORS[0]} 0%,#7B5CFF 50%,${DL_COLORS[1]} 100%);box-shadow:0 5px 0 #3A2A8A,0 14px 30px -18px rgba(91,75,214,.9);position:relative;overflow:hidden}
.duelcard:active{transform:translateY(3px);box-shadow:0 2px 0 #3A2A8A}
.duelcard .ic{font-size:2.1rem;line-height:1}
.duelcard b{display:block;font:800 1.2rem/1.15 "Bricolage Grotesque",sans-serif}
.duelcard small{display:block;opacity:.92}
.duelcard .vs{margin-left:auto;font:800 1.1rem "Bricolage Grotesque",sans-serif;background:rgba(0,0,0,.2);border-radius:10px;padding:4px 9px}
#duelPage .dtop{display:flex;align-items:center;gap:10px;margin:4px 0 12px}
#duelPage .dtop h1{margin:0;font-size:1.5rem;flex:1}
.dsetup{display:grid;gap:12px}
.dplayer{background:var(--card);border-radius:18px;padding:14px;box-shadow:var(--shadow);border-left:6px solid var(--pc)}
.dplayer h3{margin:0 0 8px;color:var(--pc);font-size:1.05rem}
.dplayer .row2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.dplayer input,.dplayer select,.dopts select{width:100%}
.dopts{background:var(--card);border-radius:18px;padding:14px;box-shadow:var(--shadow);display:grid;gap:10px}
.dopts label.tog{display:flex;align-items:center;gap:10px}
.dscore{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin-bottom:12px}
.dpill{background:var(--card);border-radius:14px;padding:8px 10px;box-shadow:var(--shadow);border:3px solid transparent;text-align:center;transition:transform .2s,border-color .2s}
.dpill.on{border-color:var(--pc);transform:scale(1.04)}
.dpill .nm{display:block;font-weight:800;color:var(--pc);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dpill .sc{display:block;font:800 1.5rem/1.1 "Bricolage Grotesque",sans-serif}
.dpill .sc.bump{animation:jxBeatBig .4s ease-out}
.dvs{font:800 1rem "Bricolage Grotesque",sans-serif;color:var(--muted)}
.dround{text-align:center;color:var(--muted);font-size:.9rem;margin:-4px 0 10px}
.dready{text-align:center;padding:40px 18px;border-radius:24px;color:#fff;background:var(--pc);box-shadow:0 8px 0 rgba(0,0,0,.18)}
.dready .who{font:800 2.2rem/1.1 "Bricolage Grotesque",sans-serif;margin:8px 0 6px}
.dready .lang{opacity:.92;margin-bottom:22px}
.dready button{background:#fff;color:#1C1A33;border:0;border-radius:14px;padding:14px 30px;font:800 1.2rem "Bricolage Grotesque",sans-serif;box-shadow:0 5px 0 rgba(0,0,0,.2)}
.dq{background:var(--card);border-radius:20px;padding:18px;box-shadow:var(--shadow);border-top:6px solid var(--pc)}
.dq .ask{font:800 1.1rem/1.3 "Bricolage Grotesque",sans-serif;margin:0 0 10px}
.dq .prompt{font-size:1.5rem;font-weight:700;text-align:center;margin:6px 0 4px}
.dq .rom{text-align:center;color:var(--violet);margin-bottom:8px}
.dq .timer{height:8px;border-radius:9px;background:var(--violet-soft);overflow:hidden;margin-bottom:12px}
.dq .timer i{display:block;height:100%;background:var(--pc);transition:width 1s linear}
.dopt{display:flex;gap:10px;align-items:center;width:100%;text-align:left;background:var(--card);border:2px solid var(--line);border-bottom-width:4px;border-radius:14px;padding:12px 14px;font-size:1.05rem;margin-top:8px}
.dopt .k{flex:none;width:24px;height:24px;border-radius:7px;border:2px solid var(--line);display:grid;place-items:center;font-size:.75rem;color:var(--muted)}
.dopt.ok{border-color:var(--green);background:var(--green-soft)}
.dopt.bad{border-color:var(--red);background:var(--red-soft);animation:jxShake .42s}
.dans{min-height:52px;border-bottom:2px solid var(--line);display:flex;flex-wrap:wrap;gap:6px;padding:6px 0;margin-bottom:12px}
.dtiles{display:flex;flex-wrap:wrap;gap:7px;justify-content:center}
.dtile{background:var(--card);border:2px solid var(--line);border-bottom-width:4px;border-radius:12px;padding:7px 12px;font-size:1.1rem}
.dtile.used{visibility:hidden}
.dtype{width:100%;font-size:1.15rem;padding:12px;border-radius:12px;border:2px solid var(--line);background:var(--field)}
.dfeed{margin-top:12px;padding:14px;border-radius:16px}
.dfeed.ok{background:var(--green-soft)}.dfeed.bad{background:var(--red-soft)}
.dfeed .msg{font-weight:800;font-size:1.1rem;margin-bottom:6px}
.dfeed.ok .msg{color:var(--green)}.dfeed.bad .msg{color:var(--red)}
.dfeed .bon{color:var(--muted);font-size:.9rem}
.dbtn{width:100%;margin-top:12px}
.dend{text-align:center;padding:10px 0}
.dend .crown{font-size:4.5rem;line-height:1;display:inline-block;animation:jxDropL .7s cubic-bezier(.2,1.4,.4,1) backwards}
.dend h2{font-size:2rem;margin:8px 0 14px}
.dend .cols{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.dend .col{background:var(--card);border-radius:16px;padding:12px;box-shadow:var(--shadow);border-top:6px solid var(--pc)}
.dend .col b{display:block;color:var(--pc);font-size:1.1rem}
.dend .col .big{font:800 2rem/1.1 "Bricolage Grotesque",sans-serif}
.dend .col small{display:block;color:var(--muted)}
.dend .col.win{transform:scale(1.04);box-shadow:0 0 0 3px var(--pc),var(--shadow)}
[dir=rtl].dtiles,[dir=rtl].dans{direction:rtl}
`;
  document.head.appendChild(css);
  const page = document.createElement("main");
  page.id = "duelPage"; page.className = "wrap"; page.hidden = true;
  $("menu").after(page);
  const card = document.createElement("button");
  card.id = "duelBtn"; card.className = "duelcard";
  card.innerHTML = `<span class="ic" aria-hidden="true">👥</span><span><b data-i18n="dl_btn">${esc(t("dl_btn"))}</b><small data-i18n="dl_btnSub">${esc(t("dl_btnSub"))}</small></span><span class="vs" aria-hidden="true">VS</span>`;
  $("continueBtn").after(card);
  card.addEventListener("click", () => { Sound.unlock(); Sound.start(); dlOpen(); });
})();

showOnly = (orig => function(id){
  const pg = $("duelPage"); if(pg) pg.hidden = id !== "duelPage";
  const r = orig.apply(this, arguments);
  if(id === "duelPage") try{ syncMood(); }catch(e){}
  return r;
})(showOnly);
showMenu = (orig => function(){ const pg = $("duelPage"); if(pg) pg.hidden = true; dlStopTimer(); return orig.apply(this, arguments); })(showMenu);
syncMood = (orig => function(){
  const pg = $("duelPage");
  if(pg && !pg.hidden){ Music.setMood(DL && DL.view === "end" ? "title" : "brawl"); return; }
  return orig.apply(this, arguments);
})(syncMood);

function dlOpen(){ DL = null; showOnly("duelPage"); dlRender(); window.scrollTo(0, 0); }
function dlStart(){
  DLS.players.forEach((p, i) => { if(!p.name.trim()) p.name = t("dl_p", {n:i + 1}); if(!dlLevels(p.target).includes(p.level)) p.level = dlLevels(p.target)[0]; });
  dlSaveSetup();
  DL = {view:"ready", turn:0, round:1, players:DLS.players.map((p, i) => ({name:p.name.trim(), target:p.target, level:p.level, color:DL_COLORS[i], score:0, right:0, streak:0, best:0, qn:0,
    pool:dlPool(p.target, p.level), bag:null})), q:null, timer:DLS.timer, rounds:DLS.rounds};
  dlRender(); try{ syncMood(); }catch(e){}
}
function dlSetupView(){
  const lvOpts = p => dlLevels(p.target).map(l => `<option ${l === p.level ? "selected" : ""}>${l}</option>`).join("");
  const langOpts = p => LANGS.map(l => `<option value="${esc(l)}" ${l === p.target ? "selected" : ""}>${esc(langLabel(l))}</option>`).join("");
  return `<div class="dtop"><button class="iconbtn" data-dgo="menu" aria-label="${esc(t("dl_menu"))}">←</button><div><h1 class="display">👥 ${esc(t("dl_title"))}</h1></div></div>
  <p class="lede" style="margin-top:0">${esc(t("dl_sub"))}</p>
  <div class="dsetup">${DLS.players.map((p, i) => `<div class="dplayer" style="--pc:${DL_COLORS[i]}"><h3>${i ? "🔴" : "🔵"} ${esc(t("dl_p", {n:i + 1}))}</h3>
    <label class="f" for="dlName${i}">${esc(t("dl_name"))}</label><input id="dlName${i}" data-dp="${i}" data-df="name" maxlength="16" value="${esc(p.name)}" placeholder="${esc(t("dl_p", {n:i + 1}))}" autocomplete="off">
    <div class="row2"><div><label class="f" for="dlLang${i}">${esc(t("dl_learning"))}</label><select id="dlLang${i}" data-dp="${i}" data-df="target">${langOpts(p)}</select></div>
    <div><label class="f" for="dlLv${i}">${esc(t("dl_level"))}</label><select id="dlLv${i}" data-dp="${i}" data-df="level">${lvOpts(p)}</select></div></div></div>`).join("")}
    <div class="dopts"><div><label class="f" for="dlRounds">${esc(t("dl_rounds"))}</label><select id="dlRounds">${[3, 5, 10, 15].map(n => `<option ${n === DLS.rounds ? "selected" : ""}>${n}</option>`).join("")}</select></div>
    <label class="tog"><input type="checkbox" id="dlTimer" ${DLS.timer ? "checked" : ""}> ⏱️ ${esc(t("dl_timer"))}</label></div>
    <button class="primary" id="dlStart">⚔️ ${esc(t("dl_start"))}</button></div>`;
}
function dlScore(){
  return `<div class="dscore">${DL.players.map((p, i) => `<div class="dpill ${DL.turn === i && DL.view !== "end" ? "on" : ""}" style="--pc:${p.color}"><span class="nm">${i ? "🔴" : "🔵"} ${esc(p.name)}</span><span class="sc" id="dlSc${i}">${p.score}</span></div>`).join(`<span class="dvs">VS</span>`)}</div>
    <div class="dround">${esc(t("dl_round", {r:Math.min(DL.round, DL.rounds), n:DL.rounds}))}</div>`;
}
function dlRender(){
  const el = $("duelPage");
  if(!DL){ el.innerHTML = dlSetupView(); return; }
  const top = `<div class="dtop"><button class="iconbtn" data-dgo="quit" aria-label="${esc(t("dl_quit"))}">✕</button><div><h1 class="display">👥 ${esc(t("dl_title"))}</h1></div></div>`;
  const pl = DL.players[DL.turn];
  if(DL.view === "ready"){
    el.innerHTML = top + dlScore() + `<div class="dready" style="--pc:${pl.color}"><div>${esc(t("dl_pass"))}</div><div class="who">${DL.turn ? "🔴" : "🔵"} ${esc(pl.name)}</div>
      <div class="lang">${esc(langLabel(pl.target))} · ${esc(pl.level)}</div><button id="dlReady">${esc(t("dl_ready"))} ▶</button></div>`;
    return;
  }
  if(DL.view === "end") return dlEnd(el, top);
  const q = DL.q, code = q.code, L = dlLangName(pl.target), dirA = code === "ar" ? ` dir="rtl" lang="ar"` : code ? ` lang="${code}"` : "";
  let body = "";
  const opt = (o, i, tgt) => `<button class="dopt" data-dopt="${i}"><span class="k">${i + 1}</span><span${tgt ? dirA : ""}>${esc(tgt ? dlShow(code, o) : o)}</span></button>`;
  if(q.k === "pick") body = `<p class="ask">${esc(t("dl_pick", {lang:L}))}</p><div class="prompt">“${esc(q.item.n)}”</div>${q.opts.map((o, i) => opt(o, i, true)).join("")}`;
  else if(q.k === "rev") body = `<p class="ask">${esc(t("dl_rev"))}</p><div class="prompt"${dirA}>${esc(dlShow(code, q.item.t))}</div>${dlRom(code, q.item.t) ? `<div class="rom">${esc(dlRom(code, q.item.t))}</div>` : ""}${q.opts.map((o, i) => opt(o, i, false)).join("")}`;
  else if(q.k === "build") body = `<p class="ask">${esc(t("dl_build", {lang:L}))}</p><div class="prompt">“${esc(q.item.n)}”</div>
    <div class="dans"${dirA}>${q.picked.map(i => `<button class="dtile" data-dun="${i}">${esc(q.tiles[i])}</button>`).join("")}</div>
    <div class="dtiles"${dirA}>${q.tiles.map((w, i) => `<button class="dtile ${q.picked.includes(i) ? "used" : ""}" data-dtile="${i}">${esc(w)}${code && (code === "zh" || code === "ar") && XL_TOKROM[code][w] ? `<small style="display:block;font-size:.68em;color:var(--violet)" dir="ltr">${esc(XL_TOKROM[code][w])}</small>` : ""}</button>`).join("")}</div>`;
  else body = `<p class="ask">${esc(t("dl_type", {lang:L}))}</p><div class="prompt">“${esc(q.item.n)}”</div><input class="dtype" id="dlType" autocomplete="off" autocapitalize="off" spellcheck="false" lang="${code}" value="${esc(q.typed || "")}">`;
  let foot = "";
  if(q.done){
    const ok = q.ok, sol = q.k === "rev" ? q.item.n : dlShow(code, q.item.t), rom = q.k !== "rev" ? dlRom(code, q.item.t) : "";
    const last = DL.turn === 1 && DL.round >= DL.rounds, nextName = DL.players[1 - DL.turn].name;
    foot = `<div class="dfeed ${ok ? "ok" : "bad"}"><div class="msg">${ok ? "✅ " + esc(t("dl_right")) + " " + esc(t("dl_pts", {n:q.pts})) : "❌ " + esc(q.timeUp ? t("dl_timeUp") : t("dl_wrong"))}</div>
      ${ok && q.bonus ? `<div class="bon">${esc(q.bonus)}</div>` : ""}
      ${!ok || q.k === "build" || q.k === "type" ? `<div>${ok ? "" : esc(t("dl_answer")) + " "}<b${q.k !== "rev" ? dirA : ""}>${esc(sol)}</b>${rom ? `<br><small style="color:var(--violet)">${esc(rom)}</small>` : ""}</div>` : ""}</div>
      <button class="primary dbtn" id="dlNext">${esc(last ? t("dl_results") : t("dl_next", {name:nextName}))} ▶</button>`;
  } else if(q.k === "build" || q.k === "type"){
    foot = `<button class="primary dbtn" id="dlCheck" ${q.k === "build" && !q.picked.length ? "disabled" : ""}>${esc(t("dl_check"))}</button>`;
  }
  el.innerHTML = top + dlScore() + `<div class="dq" id="dlCard" style="--pc:${pl.color}">${DL.timer && !q.done ? `<div class="timer"><i id="dlBar" style="width:${Math.round(100 * q.left / 20)}%"></i></div>` : ""}${body}${foot}</div>`;
  if(q.k === "type" && !q.done){ const inp = $("dlType"); inp.focus(); inp.addEventListener("input", () => { q.typed = inp.value; }); }
}
function dlEnd(el, top){
  const [a, b] = DL.players, tie = a.score === b.score, w = tie ? null : a.score > b.score ? a : b;
  el.innerHTML = top + `<div class="dend"><div class="crown">${tie ? "🤝" : "👑"}</div><h2 class="display" style="${w ? `color:${w.color}` : ""}">${esc(tie ? t("dl_tie") : t("dl_wins", {name:w.name}))}</h2>
    <div class="cols">${DL.players.map(p => `<div class="col ${p === w ? "win" : ""}" style="--pc:${p.color}"><b>${esc(p.name)}</b><span class="big">${p.score}</span>
      <small>${esc(t("dl_correct", {n:p.right}))} / ${DL.rounds}</small><small>🔥 ${esc(t("dl_best", {n:p.best}))}</small><small>${esc(langLabel(p.target))} · ${esc(p.level)}</small></div>`).join("")}</div>
    <button class="primary dbtn" id="dlRematch">🔁 ${esc(t("dl_rematch"))}</button><button class="ghost dbtn" data-dgo="setup">⚙️ ${esc(t("dl_title"))}</button><button class="ghost dbtn" data-dgo="menu">${esc(t("dl_menu"))}</button></div>`;
}

/* ---------- turn flow ---------- */
function dlAsk(){
  const pl = DL.players[DL.turn];
  DL.q = dlQuestion(pl); DL.q.left = 20; DL.q.t0 = Date.now();
  DL.view = "q"; dlRender();
  if(DL.timer) dlRunTimer();
  if(DL.q.k === "rev" && typeof canEcho === "function" && canEcho()) try{ Narrator.say([{text:dlShow(DL.q.code, DL.q.item.t), lang:DL.q.code}]); }catch(e){}
}
function dlRunTimer(){
  dlStopTimer();
  DL.tick = setInterval(() => {
    if(!DL || !DL.q || DL.q.done || DL.view !== "q"){ dlStopTimer(); return; }
    DL.q.left--;
    const bar = $("dlBar"); if(bar) bar.style.width = Math.max(0, Math.round(100 * DL.q.left / 20)) + "%";
    if(DL.q.left <= 3 && DL.q.left > 0) Sound.tick();
    if(DL.q.left <= 0){ DL.q.timeUp = true; Sound.timeUp(); dlGrade(false); }
  }, 1000);
}
function dlStopTimer(){ if(DL && DL.tick){ clearInterval(DL.tick); DL.tick = null; } }
function dlGrade(ok){
  const q = DL.q, pl = DL.players[DL.turn];
  if(q.done) return;
  dlStopTimer();
  q.done = true; q.ok = ok;
  if(ok){
    pl.right++; pl.streak++; pl.best = Math.max(pl.best, pl.streak);
    let pts = 100; const bon = [];
    if(DL.timer){ const sp = Math.max(0, Math.round(q.left * 2.5)); if(sp){ pts += sp; bon.push(`⚡ +${sp} ${t("dl_speed")}`); } }
    if(pl.streak >= 2){ const sb = Math.min(50, (pl.streak - 1) * 10); pts += sb; bon.push(`🔥 +${sb} ${t("dl_streak")}`); }
    q.pts = pts; q.bonus = bon.join(" · "); pl.score += pts;
    if(pl.streak === 3 || pl.streak === 5) Sound.combo(pl.streak); else Sound.correct();
    try{ const p = juHere(); juBurst(p.x, p.y, 16, [pl.color, "#FFD45C", "#FFFFFF"]); juFloat(p.x, p.y - 10, "+" + pts, pl.color); }catch(e){}
  } else {
    pl.streak = 0;
    if(!q.timeUp) Sound.wrong();
    try{ juVignette(); }catch(e){}
  }
  dlRender();
  const sc = $("dlSc" + DL.turn); if(sc && ok) sc.classList.add("bump");
  if(!ok) try{ juShake($("dlCard")); }catch(e){}
}
function dlNext(){
  if(DL.turn === 1){
    if(DL.round >= DL.rounds){ DL.view = "end"; dlRender(); dlCelebrate(); try{ syncMood(); }catch(e){} return; }
    DL.round++;
  }
  DL.turn = 1 - DL.turn; DL.view = "ready"; DL.q = null; dlRender();
  window.scrollTo(0, 0);
}
function dlCelebrate(){
  const [a, b] = DL.players;
  if(a.score === b.score){ Sound.levelUp(); return; }
  Sound.stageClear();
  try{ confetti(180); juBanner(t("dl_wins", {name:(a.score > b.score ? a : b).name}), "ok"); }catch(e){}
}
function dlCheck(){
  const q = DL.q; if(!q || q.done) return;
  const pl = DL.players[DL.turn], code = q.code;
  let ans = "";
  if(q.k === "build") ans = q.picked.map(i => q.tiles[i]).join(" ");
  if(q.k === "type") ans = (($("dlType") || {}).value || q.typed || "").trim();
  if(!ans) return;
  const res = gradeLocal({target:pl.target, native:dlNative(pl.target)}, {k:"s", al:code, acc:[q.item.p], game:"Classic Mine"}, ans);
  dlGrade(!!(res && res.correct));
}

document.addEventListener("click", e => {
  const pg = $("duelPage"); if(!pg || pg.hidden || !pg.contains(e.target)) return;
  const go = e.target.closest("[data-dgo]");
  if(go){
    const v = go.dataset.dgo; Sound.tap();
    if(v === "menu"){ dlStopTimer(); DL = null; return showMenu(); }
    if(v === "setup"){ DL = null; dlRender(); try{ syncMood(); }catch(e){} return; }
    if(v === "quit"){
      if(DL && DL.view !== "end" && !DL.quitArmed){ DL.quitArmed = true; toast(t("dl_quitAsk")); setTimeout(() => { if(DL) DL.quitArmed = false; }, 2500); return; }
      dlStopTimer(); DL = null; dlRender(); try{ syncMood(); }catch(e){} return;
    }
  }
  if(e.target.closest("#dlStart")){ Sound.unlock(); Sound.start(); return dlStart(); }
  if(e.target.closest("#dlReady")){ Sound.unlock(); Sound.select(); return dlAsk(); }
  if(e.target.closest("#dlNext")){ Sound.tap(); return dlNext(); }
  if(e.target.closest("#dlRematch")){ Sound.start(); return dlStart(); }
  if(!DL || !DL.q) return;
  const q = DL.q;
  const op = e.target.closest("[data-dopt]");
  if(op && !q.done){
    const i = +op.dataset.dopt, want = q.k === "pick" ? q.item.t : q.item.n, ok = q.opts[i] === want;
    dlGrade(ok);
    document.querySelectorAll("#duelPage [data-dopt]").forEach(b => { b.disabled = true; const o = q.opts[+b.dataset.dopt]; if(o === want) b.classList.add("ok"); else if(+b.dataset.dopt === i) b.classList.add("bad"); });
    return;
  }
  const tl = e.target.closest("[data-dtile]");
  if(tl && !q.done){ const i = +tl.dataset.dtile; if(!q.picked.includes(i)){ q.picked.push(i); Sound.tile(); dlRender(); } return; }
  const ut = e.target.closest("[data-dun]");
  if(ut && !q.done){ q.picked = q.picked.filter(x => x !== +ut.dataset.dun); Sound.untile(); return dlRender(); }
  if(e.target.closest("#dlCheck")) return dlCheck();
});
document.addEventListener("change", e => {
  const pg = $("duelPage"); if(!pg || pg.hidden || DL) return;
  const el = e.target, i = el.dataset ? el.dataset.dp : undefined;
  if(i !== undefined){
    const p = DLS.players[+i], f = el.dataset.df; p[f] = el.value;
    if(f === "target"){ const lv = dlLevels(p.target); if(!lv.includes(p.level)) p.level = lv[0]; dlSaveSetup(); return dlRender(); }
    dlSaveSetup(); return;
  }
  if(el.id === "dlRounds"){ DLS.rounds = +el.value; dlSaveSetup(); }
  if(el.id === "dlTimer"){ DLS.timer = el.checked; dlSaveSetup(); }
});
document.addEventListener("input", e => {
  const el = e.target; if(!el.dataset || el.dataset.df !== "name") return;
  DLS.players[+el.dataset.dp].name = el.value; dlSaveSetup();
});
document.addEventListener("keydown", e => {
  const pg = $("duelPage"); if(!pg || pg.hidden || !DL) return;
  if(e.key === "Enter"){
    if(DL.view === "ready"){ e.preventDefault(); return dlAsk(); }
    if(DL.view === "q" && DL.q.done){ e.preventDefault(); return dlNext(); }
    if(DL.view === "q"){ e.preventDefault(); return dlCheck(); }
  }
  if(e.target && e.target.id === "dlType") return;
  const n = parseInt(e.key, 10);
  if(DL.view === "q" && DL.q && !DL.q.done && n >= 1 && n <= 9){
    const b = document.querySelector(DL.q.opts ? `#duelPage [data-dopt="${n - 1}"]` : null);
    if(b){ e.preventDefault(); b.click(); return; }
    if(DL.q.k === "build"){ const free = DL.q.tiles.map((x, i) => i).filter(i => !DL.q.picked.includes(i)); if(free[n - 1] !== undefined){ e.preventDefault(); DL.q.picked.push(free[n - 1]); dlRender(); } }
  }
});
if(window.__PGM_TEST) window.__duel = {get DL(){ return DL; }, DLS, dlStart, dlAsk, dlGrade, dlNext, dlCheck, dlPool, dlQuestion, dlOpen};
