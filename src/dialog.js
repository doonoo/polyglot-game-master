/* ===================== Dialogues (mode 12, 2.18) =====================
   Short conversations from dialog_data.js: the other person speaks, you answer. Each of your replies
   is a round: the conversation so far shows as chat bubbles, the prompt says what to answer in your own
   language, and you type it (or tap it in multiple choice; Mandarin / Arabic typing gets word tiles).
   A wrong reply costs a heart, the right version joins the chat and the talk goes on.
   A run plays the level's scenes in order; finish them all to win. 5 hearts. Two players works as usual. */
MODES.push({id:12, name:"Dialogues", ico:"💬", color:"#B9E8A0", desc:"Real conversations: answer each line to keep the talk going."});
if(typeof XL_MODES !== "undefined" && !XL_MODES.includes(12)) XL_MODES.push(12);
GAME_ICO["Dialogue"] = "💬";
Object.assign(I18N.en, {
  m12n:"Dialogues", m12d:"Real conversations: a café, a hotel, a job interview… Answer each line to keep the talk going.",
  "game.Dialogue":"Dialogue", dTask:"Your turn. Say it in {l}:", dScene:"Scene {n}/{d}", dLv:"Level",
  dWinT:"Conversation complete!", dLoseT:"Out of hearts", dOver:"Scenes finished: {n} of {d} · replies right: {r} of {a}",
  dHow:"Each scene is a short conversation. Read what the other person says, then answer in the language you're learning: the line under the chat tells you what to say. Tap a bubble to hear it. 5 hearts.",
  dMeaning:"Show meaning", dYou:"You"
});
Object.assign(I18N.es, {
  m12n:"Diálogos", m12d:"Conversaciones reales: una cafetería, un hotel, una entrevista… Responde cada frase para seguir la charla.",
  "game.Dialogue":"Diálogo", dTask:"Te toca. Dilo en {l}:", dScene:"Escena {n}/{d}", dLv:"Nivel",
  dWinT:"¡Conversación completa!", dLoseT:"Sin corazones", dOver:"Escenas terminadas: {n} de {d} · respuestas correctas: {r} de {a}",
  dHow:"Cada escena es una conversación corta. Lee lo que dice la otra persona y responde en el idioma que aprendes: la línea bajo el chat te dice qué decir. Toca una burbuja para oírla. 5 corazones.",
  dMeaning:"Ver significado", dYou:"Tú"
});
const DLG_HEARTS = 5;
const dlgYs = sc => sc.lines.map((l, i) => l.w === "y" ? i : -1).filter(i => i >= 0);
const dlgTx = (l, code) => canon(String(l[code] || ""));
const dlgRom = (l, code) => (code === "zh" ? l.zr : code === "ar" ? l.an : "") || "";
const dlgUi = () => (typeof UI !== "undefined" && UI && UI.code === "es") ? "es" : "en";
function dlgScenes(lv){ const s = DLG.filter(d => d.lv === lv); return s.length ? s : DLG.filter(d => d.lv === "A1"); }
const dlgFind = id => DLG.find(d => d.id === id);
/* readings for Mandarin / Arabic: the answer card's reading line and the tiles' romanization (langs.js maps) */
(() => {
  for(const sc of DLG) for(const l of sc.lines) for(const code of ["zh", "ar"]){
    const r = dlgRom(l, code); if(!r || l.w !== "y") continue;
    const tk = dlgTx(l, code).split(" "), rk = r.split(" ");
    try{ XL_ROM[xlKey(dlgTx(l, code))] = r; tk.forEach((x, i) => { if(rk[i] && !XL_TOKROM[code][x]) XL_TOKROM[code][x] = rk[i]; }); }catch(e){}
  }
})();

/* ---------- engine hooks ---------- */
freshState = wrap("freshState", "dialog", freshState, orig => function(o){
  const st = orig(o);
  if(o.mode === 12){
    st.hp = st.maxHp = DLG_HEARTS; st.clock = "off";
    st.dlg = {order:dlgScenes(st.level).map(d => d.id), si:0, ti:0, right:0, asked:0};
    st.syllabus = [t("m12n")]; st.done = [false];
  }
  return st;
});
makePlanCore = wrap("makePlanCore", "dialog", makePlanCore, orig => function(st, rolls, exclude){
  if(st.mode !== 12) return orig(st, rolls, exclude);
  if(st.status !== "playing" || !st.dlg) return null;
  const d = st.dlg;
  return {kind:"dlg", sid:d.order[Math.min(d.si, d.order.length - 1)], ti:d.ti};
});
generate = wrap("generate", "dialog", generate, orig => function(st, plan){
  if(st.mode !== 12 || !plan || plan.kind !== "dlg") return orig(st, plan);
  const code = LANG_CODE[st.target], nat = LANG_CODE[st.native] || "en", ui = dlgUi();
  const sc = dlgFind(plan.sid) || DLG[0], ys = dlgYs(sc), ti = Math.min(plan.ti, ys.length - 1), y = sc.lines[ys[ti]];
  const rom = dlgRom(y, code), ans = dlgTx(y, code);
  const hist = sc.lines.slice(0, ys[ti]).map(l => ({w:l.w, tx:dlgTx(l, code), tr:dlgTx(l, nat), r:dlgRom(l, code)}));
  const L = GMT[nat] || GMT.en, first = ans.split(" ")[0].replace(/^[¿¡]/, "");
  const ch = {game:"Dialogue", al:code, k:"s", acc:[String(y[code]) + (rom ? "|" + rom : "")], answerKey:ans, target:dlgTx(y, nat),
    task:t("dTask", {l:langLabel(st.target)}), hint:code === "zh" || code === "ar" ? "" : L.hStart(first, ans.split(" ").length),
    cw:[], why:"", speak:"",
    dlg:{sid:sc.id, ti, n:ys.length, hist, ico:sc.ico, t:sc.t[ui] || sc.t.en, lv:sc.lv}};
  // wrong options for multiple choice: the planted mistake, then this scene's and the level's other replies
  const others = [];
  for(const s2 of [sc].concat(dlgScenes(sc.lv).filter(s => s !== sc))) for(const i of dlgYs(s2)) if(!(s2 === sc && i === ys[ti])) others.push(dlgTx(s2.lines[i], code));
  ch.mcx = {s:[y.x && y.x[code] ? canon(y.x[code]) : ""].filter(Boolean).concat(others), w:[]};
  if(st.mc) try{ mcBuild(st, ch); }catch(e){} else delete ch.mcx;
  const lesson = ti === 0 ? {title:sc.ico + " " + (sc.t[ui] || sc.t.en), body:(sc.note && (sc.note[ui] || sc.note.en)) || "", words:[]} : null;
  return {challenge:ch, lesson, spotlight:null, _k:"dlg|" + sc.id + "|" + ti, plan};
});
/* Mandarin / Arabic typing: word tiles (the reply's words plus a couple of decoys) */
tileItems = wrap("tileItems", "dialog", tileItems, orig => function(ch){
  if(S && S.mode === 12 && ch && ch.dlg && (ch.al === "zh" || ch.al === "ar") && !Array.isArray(ch.opts)){
    const words = canon(ch.acc[0]).split(" ").filter(Boolean), have = new Set(words), dec = [];
    const sc = dlgFind(ch.dlg.sid), y = sc && sc.lines[dlgYs(sc)[ch.dlg.ti]];
    if(y && y.x && y.x[ch.al]) for(const w of canon(y.x[ch.al]).split(" ")) if(!have.has(w) && !dec.includes(w)){ dec.push(w); break; }
    for(const s2 of dlgScenes(ch.dlg.lv)) for(const i of dlgYs(s2)) for(const w of dlgTx(s2.lines[i], ch.al).split(" "))
      if(dec.length < 3 && w && !have.has(w) && !dec.includes(w) && Math.random() < 0.3) dec.push(w);
    return {mode:"words", items:shuffle(words.concat(dec)), keepScreen:true};
  }
  return orig.apply(this, arguments);
});
applyResult = wrap("applyResult", "dialog", applyResult, orig => function(st, correct, plan){
  if(st.mode !== 12) return orig(st, correct, plan);
  orig(st, correct, plan && plan.kind === "dlg" ? {kind:"dlg"} : plan);
  const d = st.dlg;
  if(!d || st.status !== "playing") return;
  d.asked++;
  if(correct) d.right++;
  else { st.hp--; if(st.hp <= 0){ st.status = "gameover"; return; } }
  d.ti++;
  const sc = dlgFind(d.order[d.si]);
  if(!sc || d.ti >= dlgYs(sc).length){ d.si++; d.ti = 0; if(d.si >= d.order.length) st.status = "conquered"; }
});
progress = wrap("progress", "dialog", progress, orig => function(){
  if(!S || S.mode !== 12 || !S.dlg) return orig();
  const d = S.dlg, n = d.order.length;
  return {n:d.si, d:n, label:t("dScene", {n:Math.min(d.si + 1, n), d:n})};
});
renderHud = wrap("renderHud", "dialog", renderHud, orig => function(){
  orig();
  if(!S || S.mode !== 12) return;
  const h = $("hudHearts");
  h.hidden = false;
  h.textContent = "❤️".repeat(Math.max(0, S.hp)) + "🖤".repeat(Math.max(0, DLG_HEARTS - S.hp));
  h.setAttribute("aria-label", t("hearts", {hp:S.hp}));
  $("hudBadge").textContent = "💬 " + S.level;
});

/* ---------- the chat ---------- */
function renderDlg(){
  let box = $("dlgBox");
  const ch = S && S.mode === 12 && S.current && S.current.challenge, d = ch && ch.dlg;
  if(!d){ if(box) box.hidden = true; return; }
  if(!box){ box = document.createElement("div"); box.id = "dlgBox"; box.className = "dlgbox"; box.setAttribute("aria-live", "polite"); $("chTarget").parentElement.before(box); }
  const zh = ch.al === "zh", show = d.lv === "A1" || d.lv === "A2";
  const tx = s => zh && typeof xlSpace === "function" ? xlSpace(s) : s;
  box.hidden = false;
  box.innerHTML = `<div class="dlg-head"><span aria-hidden="true">${d.ico}</span> <b>${esc(d.t)}</b> <small>${d.ti + 1}/${d.n}</small></div>` +
    d.hist.map((l, i) => `<button class="db ${l.w}" data-dlgsay="${i}" dir="auto"><span class="dt">${esc(tx(l.tx))}</span>` +
      (l.r ? `<small class="dr" dir="ltr">${esc(l.r)}</small>` : "") +
      (l.w === "n" ? `<small class="dm${show ? "" : " hide"}" dir="auto">${esc(l.tr)}</small>` : "") + `</button>`).join("");
  $("chIco").textContent = "💬"; $("chGame").textContent = t("m12n");
  $("chTarget").parentElement.hidden = false;
}
renderExtras = wrap("renderExtras", "dialog", renderExtras, orig => function(fresh){
  orig(fresh);
  renderDlg();
});
document.addEventListener("click", e => {
  const b = e.target.closest("[data-dlgsay]");
  if(!b) return;
  const ch = S && S.current && S.current.challenge, l = ch && ch.dlg && ch.dlg.hist[+b.dataset.dlgsay];
  if(!l) return;
  const m = b.querySelector(".dm.hide"); if(m) m.classList.remove("hide");
  try{ Sound.unlock(); Narrator.say([{text:l.tx.replace(/ (?=[㐀-鿿])|(?<=[㐀-鿿]) /g, ""), lang:ch.al}]); }catch(err){}
});
showOver = wrap("showOver", "dialog", showOver, orig => function(){
  orig();
  if(!S || S.mode !== 12 || !S.dlg) return;
  const d = S.dlg, won = S.status === "conquered";
  $("overTitle").textContent = won ? t("dWinT") : t("dLoseT");
  $("overEmoji").textContent = won ? "💬" : "💀";
  $("overText").textContent = t("dOver", {n:Math.min(d.si, d.order.length), d:d.order.length, r:d.right, a:d.asked});
  $("overIsland").hidden = true;
  if(won) $("overRestart").hidden = false;
  if($("dlgBox")) $("dlgBox").hidden = true;
});
(() => {
  const css = document.createElement("style");
  css.textContent = `
.dlgbox{display:flex;flex-direction:column;gap:8px;padding:10px 14px 4px}
.dlgbox[hidden]{display:none}
.dlg-head{font-size:.9rem;color:var(--muted)}
.dlg-head b{color:var(--ink)}
.db{max-width:86%;text-align:start;font:inherit;border:0;padding:9px 13px;border-radius:18px;cursor:pointer;display:flex;flex-direction:column;gap:2px;line-height:1.35}
.db.n{align-self:flex-start;background:var(--line);color:var(--ink);border-bottom-left-radius:6px}
.db.y{align-self:flex-end;background:#D7F5C4;color:#163A10;border-bottom-right-radius:6px}
.db .dt{font-weight:700;font-size:1.05rem}
.db small{font-size:.8rem;opacity:.75}
.db .dm.hide{display:none}
#dlgHow{margin-top:8px}`;
  document.head.appendChild(css);
})();
renderMenu = wrap("renderMenu", "dialog", renderMenu, orig => function(){
  orig();
  let how = $("dlgHow");
  if(setup.mode === 12){
    if($("clockGroup")) $("clockGroup").hidden = true;
    $("levelTitle").textContent = t("dLv"); $("levelNote").textContent = "";
    if(!how){ how = document.createElement("p"); how.id = "dlgHow"; how.className = "note"; $("levelGroup").appendChild(how); }
    how.hidden = false; how.textContent = t("dHow");
  } else if(how) how.hidden = true;
});
if(window.__PGM_TEST) window.__dlg = {DLG, dlgYs, dlgTx, dlgScenes};
