/* ===================== First run: "start here" (2.17) =====================
   A brand-new player (nothing answered yet, no game to resume, never seen this) gets one sheet over the menu:
   pick a course, then one big "Start with Practice" button (A1, mode 1) or "Show me the menu".
   Until a first game ends, the Practice card carries a "Start here" badge.
   Flags in localStorage: pgm-firstrun = "done" once the sheet is closed, pgm-firstgame = "done" after a first game.
   Off under __PGM_TEST unless __FIRSTRUN_FORCE. */
Object.assign(I18N.en, {
  fr_title:"Welcome! What do you want to learn?", fr_note:"You can change the course or the app language from the menu any time.",
  fr_go_title:"Start with Practice", fr_go_note:"Each lesson explains one rule, then you practise it with quick games. When you want more, there are 10 other modes in the menu.",
  fr_go:"▶ Start with Practice", fr_menu:"Show me the menu", fr_back:"← Pick another course", fr_badge:"Start here",
  fr_es:"Learn Spanish", fr_en:"Aprender inglés (en español)", fr_xl:"Learn {l} (taught in English)"
});
Object.assign(I18N.es, {
  fr_title:"¡Bienvenido! ¿Qué quieres aprender?", fr_note:"Puedes cambiar el curso o el idioma de la app desde el menú cuando quieras.",
  fr_go_title:"Empieza con Práctica", fr_go_note:"Cada lección explica una regla y luego la practicas con juegos rápidos. Cuando quieras más, hay otros 10 modos en el menú.",
  fr_go:"▶ Empezar con Práctica", fr_menu:"Ver el menú", fr_back:"← Elegir otro curso", fr_badge:"Empieza aquí",
  fr_es:"Learn Spanish (in English)", fr_en:"Aprender inglés", fr_xl:"Aprender {l} (en inglés)"
});
const FR_KEY = "pgm-firstrun", FR_GAME = "pgm-firstgame";
const frGet = k => { try{ return localStorage.getItem(k); }catch(e){ return null; } };
const frSet = k => { try{ localStorage.setItem(k, "done"); }catch(e){} };
(() => {
  const css = document.createElement("style");
  css.textContent = `
.frsheet{max-height:92vh;overflow:auto}
.frhead{display:flex;align-items:center;gap:12px;margin-bottom:6px}
.frhead svg{width:72px;height:72px;flex:none}
.frhead h2{margin:0;font-size:1.3rem;line-height:1.2}
.frcourses{display:grid;gap:8px;margin:10px 0 4px}
.frcourse{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px 14px;border:2px solid var(--line);border-radius:16px;background:var(--card);color:var(--ink);font:inherit;font-weight:700;cursor:pointer;min-height:52px}
.frcourse:hover,.frcourse:focus-visible{border-color:var(--accent,#5B3FD9)}
.frcourse .flag{font-size:1.5rem;line-height:1}
.frcourse small{display:block;font-weight:500;color:var(--muted)}
.frcourse .tx{flex:1;min-width:0}
.mode .frbadge{position:absolute;top:-9px;right:10px;background:#FFD43B;color:#2D1B69;font-weight:800;font-size:.72rem;padding:3px 9px;border-radius:999px;box-shadow:0 2px 0 rgba(0,0,0,.15);animation:frPulse 1.8s ease-in-out infinite}
.mode{position:relative}
html.noanim .mode .frbadge{animation:none}
@keyframes frPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
`;
  document.head.appendChild(css);
  const back = document.createElement("div");
  back.className = "vaback"; back.id = "frSheet"; back.hidden = true;
  back.innerHTML = `<div class="vasheet frsheet" role="dialog" aria-modal="true" aria-labelledby="frTitle">
    <div class="frhead"><span id="frLeo"></span><h2 class="display" id="frTitle"></h2></div>
    <p class="note" id="frNote"></p>
    <div class="frcourses" id="frCourses"></div>
    <div class="vabtns" id="frBtns"></div></div>`;
  document.body.appendChild(back);
})();
const FR_FLAG = {Spanish:"🇪🇸", English:"🇺🇸", French:"🇫🇷", Portuguese:"🇧🇷", "Mandarin Chinese":"🇨🇳", Arabic:"🇸🇦"};
// the course this player most likely wants comes first: Spanish for an English app, English for a Spanish one
function frCourses(){
  const all = [...$("targetSel").options].map(o => o.value).filter(v => FR_FLAG[v]);
  const top = frUi() === "es" ? "English" : "Spanish";
  return all.includes(top) ? [top].concat(all.filter(v => v !== top)) : all;
}
const FR_NAME = {en:{French:"French", Portuguese:"Portuguese", "Mandarin Chinese":"Chinese (Mandarin)", Arabic:"Arabic"},
                 es:{French:"francés", Portuguese:"portugués", "Mandarin Chinese":"chino mandarín", Arabic:"árabe"}};
function frLabel(v){
  if(v === "Spanish") return t("fr_es");
  if(v === "English") return t("fr_en");
  return t("fr_xl", {l:(FR_NAME[frUi() === "es" ? "es" : "en"] || {})[v] || v});
}
function frLevels(v){
  const L = Object.keys(COURSE[LANG_CODE[v]] || {});
  return L.length ? L[0] + "–" + L[L.length - 1] : "";
}
const frUi = () => (typeof UI !== "undefined" && UI && UI.code) || "en";
let frPick = null;
function frRender(){
  try{ $("frLeo").innerHTML = lionSVG(frPick ? "cheer" : "happy", {title:t("leo_name")}); }catch(e){}
  if(!frPick){
    $("frTitle").textContent = t("fr_title"); $("frNote").textContent = t("fr_note");
    $("frCourses").hidden = false;
    $("frCourses").innerHTML = frCourses().map(v => `<button class="frcourse" data-frcourse="${esc(v)}"><span class="flag">${FR_FLAG[v]}</span><span class="tx">${esc(frLabel(v))}<small>${esc(frLevels(v))}</small></span></button>`).join("");
    $("frBtns").innerHTML = `<button class="ghost" id="frSkip">${esc(t("fr_menu"))}</button>`;
  } else {
    $("frTitle").textContent = t("fr_go_title"); $("frNote").textContent = t("fr_go_note");
    $("frCourses").hidden = true; $("frCourses").innerHTML = "";
    $("frBtns").innerHTML = `<button class="primary" id="frGo">${esc(t("fr_go"))}</button><button class="ghost" id="frSkip">${esc(t("fr_menu"))}</button><button class="ghost" id="frBack">${esc(t("fr_back"))}</button>`;
  }
}
function frOpen(){ frPick = null; frRender(); $("frSheet").hidden = false; setTimeout(() => { const b = document.querySelector("#frSheet .frcourse"); if(b) b.focus(); }, 30); }
function frClose(){ $("frSheet").hidden = true; frSet(FR_KEY); renderMenu(); }
function frChoose(v){
  const s = $("targetSel"); s.value = v; s.dispatchEvent(new Event("change", {bubbles:true}));
  setup.mode = 1; setup.level = "A1"; renderMenu();
  frPick = v; frRender();
  setTimeout(() => { const g = $("frGo"); if(g) g.focus(); }, 30);
}
function frStart(){
  $("frSheet").hidden = true; frSet(FR_KEY);
  setup.mode = 1; setup.level = "A1"; renderMenu();
  try{ Sound.unlock(); }catch(e){}
  $("startBtn").click();
}
document.addEventListener("click", e => {
  if($("frSheet").hidden) return;
  const c = e.target.closest("[data-frcourse]");
  if(c) return frChoose(c.dataset.frcourse);
  if(e.target.closest("#frGo")) return frStart();
  if(e.target.closest("#frBack")){ frPick = null; return frRender(); }
  if(e.target.closest("#frSkip") || e.target.id === "frSheet") return frClose();
});
document.addEventListener("keydown", e => { if(e.key === "Escape" && !$("frSheet").hidden) frClose(); });
$("uiSel").addEventListener("change", () => { if(!$("frSheet").hidden) setTimeout(frRender, 0); });
function frIsNew(){
  if(frGet(FR_KEY)) return false;
  if(profile.answered > 0 || profile.xp > 0) return false;
  try{ if(loadSave()) return false; }catch(e){}
  return true;
}
// "Start here" on the Practice card until a first game has ended
renderMenu = wrap("renderMenu", "firstrun", renderMenu, orig => function(){
  orig.apply(this, arguments);
  const card = document.querySelector('#modes [data-mode="1"]');
  if(!card) return;
  let b = card.querySelector(".frbadge");
  const show = !frGet(FR_GAME) && profile.answered < 10;
  if(show && !b){ b = document.createElement("span"); b.className = "frbadge"; card.appendChild(b); }
  if(b){ b.hidden = !show; b.textContent = t("fr_badge"); }
});
showOver = wrap("showOver", "firstrun", showOver, orig => function(){
  orig.apply(this, arguments);
  if(!(typeof TP !== "undefined" && TP.on)) frSet(FR_GAME);
});
function frMaybe(){
  if(window.__PGM_TEST && !window.__FIRSTRUN_FORCE) return;
  if(!$("menu") || $("menu").hidden || !frIsNew()) return;
  frOpen();
}
setTimeout(frMaybe, window.__PGM_TEST ? 0 : 700);
if(window.__PGM_TEST) window.__fr = {frOpen, frClose, frMaybe, frIsNew, frChoose, frStart, over:() => showOver()};
