/* ===================== Keyboard play: everything without a mouse ===================== */
Object.assign(I18N.en, {
  kbTitle:"Keyboard play", kbToggle:"Keyboard play", kbToggleSub:"Keep the answer box ready so you can just type.", kbHelpBtn:"Keyboard shortcuts",
  kbGiveUp:"Press Shift+Enter again to give up.", kbClose:"Close",
  kbAnswer:"Answer", kbEnter:"Submit, continue, start", kbShiftEnter:"I don't know (press twice)", kbTiles:"Pick tile or option 1–9",
  kbMatch:"Match Madness: number for the left column, letter for the right", kbBack:"Undo the last tile", kbHint:"Show hint",
  kbListen:"Listen again", kbSlow:"Listen slowly", kbAccents:"Accents: á é í ó ú ñ ü ¿ ¡", kbType:"Just start typing: the answer box catches it",
  kbHelpKey:"Open or close this help", kbEsc:"Close panels, or go to the menu from the results screen", kbTab:"Move between buttons"
});
Object.assign(I18N.es, {
  kbTitle:"Jugar con teclado", kbToggle:"Jugar con teclado", kbToggleSub:"El cuadro de respuesta queda listo para que solo escribas.", kbHelpBtn:"Atajos de teclado",
  kbGiveUp:"Pulsa Mayús+Intro otra vez para rendirte.", kbClose:"Cerrar",
  kbAnswer:"Responder", kbEnter:"Enviar, continuar, empezar", kbShiftEnter:"No lo sé (pulsa dos veces)", kbTiles:"Elegir ficha u opción 1–9",
  kbMatch:"Parejas: número para la columna izquierda, letra para la derecha", kbBack:"Deshacer la última ficha", kbHint:"Ver pista",
  kbListen:"Escuchar otra vez", kbSlow:"Escuchar despacio", kbAccents:"Acentos: á é í ó ú ñ ü ¿ ¡", kbType:"Empieza a escribir: el cuadro de respuesta lo recoge",
  kbHelpKey:"Abrir o cerrar esta ayuda", kbEsc:"Cerrar paneles, o ir al menú desde los resultados", kbTab:"Moverse entre botones"
});

let kbOn = (() => {
  try{ const v = localStorage.getItem("pgm-kb"); if(v) return v === "on"; }catch(e){}
  try{ return window.matchMedia("(pointer: fine)").matches; }catch(e){ return true; }
})();
function setKb(v){
  kbOn = !!v;
  try{ localStorage.setItem("pgm-kb", kbOn ? "on" : "off"); }catch(e){}
  document.querySelectorAll(".kbChk").forEach(x => x.checked = kbOn);
  document.body.classList.toggle("kb", kbOn);
  if(kbOn) kbFocus();
}

/* Is this element actually on screen (no hidden ancestor)? */
const kbShown = el => { if(!el) return false; for(let x = el; x; x = x.parentElement) if(x.hidden) return false; return true; };
const kbTyping = el => !!el && (el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable ||
  (el.tagName === "INPUT" && !/^(checkbox|radio|range|button|submit)$/i.test(el.type)));
const kbClickable = el => !!el && el !== document.body && /^(BUTTON|A|SUMMARY|LABEL|INPUT|SELECT)$/.test(el.tagName);

/* Keep the answer box focused between turns */
function kbFocus(){
  if(!kbOn || !S || !S.current) return;
  const a = $("answer");
  if(!kbShown(a) || !kbShown($("challengeCard")) || !$("settingsPanel").hidden) return;
  const act = document.activeElement;
  if(act && act !== a && kbTyping(act)) return;
  try{ a.focus({preventScroll:true}); }catch(e){}
}

/* Number / letter labels on tiles and match pairs */
function kbLabel(){
  const tiles = [...$("tiles").querySelectorAll(".tile[data-i]")];
  const digits = tiles.some(b => /\d/.test(b.textContent));
  tiles.forEach((b, i) => { if(i < 9 && !digits) b.dataset.kb = i + 1; else delete b.dataset.kb; });
  const L = [...$("pairs").querySelectorAll('.pr[data-side="l"]')], R = [...$("pairs").querySelectorAll('.pr[data-side="r"]')];
  L.forEach((b, i) => { if(i < 9) b.dataset.kb = i + 1; });
  R.forEach((b, i) => { if(i < 9) b.dataset.kb = "ABCDEFGHI"[i]; });
}
renderExtras = (orig => function(fresh){ orig(fresh); kbLabel(); kbFocus(); })(renderExtras);

/* Typed text and tapped tiles must not fight: typing resets the tile picks */
$("answer").addEventListener("input", () => {
  const box = $("tiles");
  if(box.hidden || box.dataset.mode === "pick" || !picked.length) return;
  const all = [...box.querySelectorAll(".tile[data-i]")];
  const joined = picked.map(i => all[i].textContent).join(box.dataset.mode === "letters" ? "" : " ");
  if($("answer").value !== joined){ picked = []; all.forEach(x => x.classList.remove("used")); }
});

function kbInsert(el, ch){
  const s = el.selectionStart == null ? el.value.length : el.selectionStart, en = el.selectionEnd == null ? s : el.selectionEnd;
  el.value = el.value.slice(0, s) + ch + el.value.slice(en);
  try{ el.setSelectionRange(s + ch.length, s + ch.length); }catch(e){}
  el.dispatchEvent(new Event("input", {bubbles:true}));
}
const KB_ACC = {KeyA:"á", KeyE:"é", KeyI:"í", KeyO:"ó", KeyU:"ú", KeyN:"ñ", KeyY:"ü"};

let kbGiveUpAt = 0;
function kbNth(sel, n){ const list = [...document.querySelectorAll(sel)].filter(kbShown); return list[n] || null; }
function kbFirst(ids){ for(const id of ids){ const el = $(id); if(kbShown(el) && !el.disabled) return el; } return null; }

/* ---------- Help overlay ---------- */
function kbHelpHtml(){
  const row = (k, d) => `<tr><td>${k.split(" / ").map(x => `<kbd>${esc(x)}</kbd>`).join(" / ")}</td><td>${esc(t(d))}</td></tr>`;
  return `<div class="kbbox" role="dialog" aria-modal="true" aria-labelledby="kbH"><h2 id="kbH">⌨️ ${esc(t("kbTitle"))}</h2>
    <label class="toggle"><input type="checkbox" class="kbChk" ${kbOn ? "checked" : ""}><div><b>${esc(t("kbToggle"))}</b><small>${esc(t("kbToggleSub"))}</small></div></label>
    <table class="kbt">${[
      ["A–Z", "kbType"], ["Enter", "kbEnter"], ["Shift+Enter", "kbShiftEnter"], ["1 – 9", "kbTiles"], ["1 – 9 / A – I", "kbMatch"],
      ["Backspace", "kbBack"], ["Alt+H", "kbHint"], ["Alt+L", "kbListen"], ["Alt+S", "kbSlow"],
      ["Alt+A E I O U N Y", "kbAccents"], ["Tab", "kbTab"], ["Esc", "kbEsc"], ["?", "kbHelpKey"]
    ].map(r => row(r[0], r[1])).join("")}</table>
    <p class="note">Alt+Shift+? → ¿ · Alt+Shift+1 → ¡ · Alt+Shift+A → Á</p>
    <button class="primary" id="kbClose">${esc(t("kbClose"))}</button></div>`;
}
function kbHelp(open){
  let ov = $("kbHelp");
  if(open === undefined) open = !ov;
  if(!open){ if(ov){ ov.remove(); kbFocus(); } return; }
  if(ov) return;
  ov = document.createElement("div"); ov.id = "kbHelp"; ov.className = "kbov";
  ov.innerHTML = kbHelpHtml();
  document.body.appendChild(ov);
  try{ $("kbClose").focus({preventScroll:true}); }catch(e){}
  ov.firstChild.scrollTop = 0;
}
document.addEventListener("click", e => {
  if(e.target.closest("#kbClose") || e.target.id === "kbHelp") kbHelp(false);
  if(e.target.closest(".kbHelpBtn")) kbHelp(true);
});
document.addEventListener("change", e => { if(e.target.classList && e.target.classList.contains("kbChk")) setKb(e.target.checked); });

/* ---------- The key handler ---------- */
document.addEventListener("keydown", e => {
  if(e.defaultPrevented || e.isComposing) return;
  const tg = e.target, typing = kbTyping(tg), mod = e.ctrlKey || e.metaKey;

  // Help overlay
  if($("kbHelp")){
    if(e.key === "Escape" || (e.key === "?" && !typing)){ e.preventDefault(); kbHelp(false); }
    return;
  }
  if(e.key === "?" && !typing && !mod){ e.preventDefault(); kbHelp(true); return; }

  // Accents in any text box: Alt + letter (Ctrl+Alt is AltGr, left alone)
  if(typing && tg.tagName !== "SELECT" && e.altKey && !mod){
    let ch = KB_ACC[e.code];
    if(ch && e.shiftKey) ch = ch.toUpperCase();
    if(e.shiftKey && e.code === "Slash") ch = "¿";
    if(e.shiftKey && e.code === "Digit1") ch = "¡";
    if(ch){ e.preventDefault(); kbInsert(tg, ch); return; }
  }
  if(mod) return;

  const inGame = kbShown($("game")) && S && S.current && kbShown($("challengeCard"));
  const inQuiz = kbShown($("quiz")) && kbShown($("quizCard"));

  // Alt shortcuts while playing
  if(e.altKey && (inGame || inQuiz)){
    const k = e.code;
    if(k === "KeyH"){ const b = inGame ? $("hintBtn") : null; if(kbShown(b)){ e.preventDefault(); b.click(); } return; }
    if(k === "KeyL" || k === "KeyS"){
      const b = k === "KeyS" ? document.querySelector('#chTarget [data-echo="slow"]') :
        (document.querySelector('#chTarget [data-echo="1"]') || document.querySelector('[data-say="challenge"]:not([hidden])') || document.querySelector('#chTarget [data-say="target"]'));
      if(b && kbShown(b)){ e.preventDefault(); b.click(); }
      return;
    }
    return;
  }
  if(e.altKey) return;

  // Shift+Enter: give up (twice, so it can't happen by accident)
  if(e.key === "Enter" && e.shiftKey && (tg.id === "answer" || tg.id === "quizAnswer")){
    e.preventDefault();
    const now = Date.now();
    if(now - kbGiveUpAt < 2500){
      kbGiveUpAt = 0;
      if(tg.id === "answer") submit(true); else $("quizSkip").click();
    } else { kbGiveUpAt = now; toast(t("kbGiveUp")); }
    return;
  }

  // Tiles, options and match pairs by number / letter
  const tileBox = inGame ? $("tiles") : inQuiz ? (kbShown($("quizOpts")) ? $("quizOpts") : $("quizBuild")) : null;
  if(/^[1-9]$/.test(e.key) && tileBox && kbShown(tileBox)){
    const list = [...tileBox.querySelectorAll(inGame ? ".tile[data-i]" : ".tile[data-qo], .tile[data-bi]")];
    if(!list.some(b => /\d/.test(b.textContent))){
      e.preventDefault();
      const b = list[+e.key - 1];
      if(b && !b.disabled){ b.click(); if(tileBox.id === "tiles" || tileBox.id === "quizOpts") (inGame ? $("answer") : $("quizAnswer")).focus({preventScroll:true}); }
      return;
    }
  }
  if(inGame && kbShown($("pairs")) && !typing){
    const k = e.key.toUpperCase();
    let b = null;
    if(/^[1-9]$/.test(k)) b = $("pairs").querySelector(`.pr[data-side="l"][data-kb="${k}"]`);
    else if(/^[A-I]$/.test(k)) b = $("pairs").querySelector(`.pr[data-side="r"][data-kb="${k}"]`);
    if(b){ e.preventDefault(); b.click(); return; }
  }
  // Backspace undoes the last tapped tile (only while the box still shows exactly the tiles)
  if(e.key === "Backspace" && inGame && tg.id === "answer" && kbShown($("tiles")) && $("tiles").dataset.mode !== "pick" && picked.length){
    const all = [...$("tiles").querySelectorAll(".tile[data-i]")];
    const joined = picked.map(i => all[i].textContent).join($("tiles").dataset.mode === "letters" ? "" : " ");
    const a = $("answer");
    if(a.value === joined && a.selectionStart === a.value.length){ e.preventDefault(); $("tiles").querySelector("[data-undo]").click(); return; }
  }

  // Stories: number picks an answer
  if(kbShown($("storyPage")) && /^[1-9]$/.test(e.key) && !typing){
    const q = [...document.querySelectorAll("#storyFeed .sq")].pop();
    if(q && !q.dataset.done){ const b = q.querySelectorAll(".sopt")[+e.key - 1]; if(b){ e.preventDefault(); b.click(); } return; }
  }

  if(typing) return;
  const act = document.activeElement;

  // Enter / Space: the main button of whatever is on screen
  const story = kbShown($("storyPage"));
  if(e.key === "Enter" || (story && (e.key === " " || e.key === "ArrowRight"))){
    if(kbClickable(act) && e.key !== "ArrowRight") return;     // a focused button clicks itself
    if(inGame){
      const gate = $("islHide");
      if(kbShown(gate)){ e.preventDefault(); gate.click(); return; }
      if(kbShown($("answer"))){ e.preventDefault(); $("answer").focus({preventScroll:true}); return; }
    }
    const b = kbFirst(["storyNext", "storyDoneBtn", "quizNext", "introGo", "quizHome", "restartBtn", "sailBtn", "startBtn"].filter(id =>
      id !== "quizHome" || kbShown($("quizDone"))).filter(id => id !== "startBtn" || kbShown($("menu"))));
    if(b){ e.preventDefault(); b.click(); }
    return;
  }

  // Esc: leave the results screen
  if(e.key === "Escape" && kbShown($("over"))){ e.preventDefault(); $("overMenuBtn").click(); return; }

  // Any letter while playing goes straight into the answer box
  if(inGame && e.key.length === 1 && /\S/.test(e.key) && kbShown($("answer"))){
    try{ $("answer").focus({preventScroll:true}); }catch(err){}
    return;   // the key itself lands in the box
  }
  if(inQuiz && e.key.length === 1 && /\S/.test(e.key)){ try{ $("quizAnswer").focus({preventScroll:true}); }catch(err){} }
});

/* ---------- Entry points: a toggle in the sound panel, a chip on the menu ---------- */
(() => {
  const row = document.createElement("label");
  row.className = "srow";
  row.innerHTML = `<span>⌨️ <span data-i18n="kbToggle">${esc(t("kbToggle"))}</span></span><input type="checkbox" class="kbChk">`;
  $("settingsPanel").appendChild(row);
  const hb = document.createElement("button");
  hb.type = "button"; hb.className = "ghost kbHelpBtn srowbtn";
  hb.innerHTML = `⌨️ <span data-i18n="kbHelpBtn">${esc(t("kbHelpBtn"))}</span> <kbd>?</kbd>`;
  $("settingsPanel").appendChild(hb);
  const chip = document.createElement("button");
  chip.type = "button"; chip.className = "chip kbHelpBtn"; chip.id = "menuKbBtn";
  chip.setAttribute("data-i18n-aria", "kbHelpBtn"); chip.setAttribute("aria-label", t("kbHelpBtn"));
  chip.textContent = "⌨️";
  $("menuMusicBtn").after(chip);
  document.querySelectorAll(".kbChk").forEach(x => x.checked = kbOn);
  document.body.classList.toggle("kb", kbOn);
})();
