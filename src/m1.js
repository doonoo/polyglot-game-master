/* ===================== Persistence (this device only) ===================== */
const SAVE_KEY = "pgm-pb-save";
function save(){
  if(!S) return;
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){}
}
function loadSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(raw){ const b = JSON.parse(raw); if(b && b.v === 2 && LANG_CODE[b.target] && LANG_CODE[b.native]) return b; }
  }catch(e){}
  return null;
}

/* ===================== Menu ===================== */
const otherLang = l => l === "English" ? "Spanish" : "English";
function levelsFor(mode, target){
  if(mode === 4) return Object.keys(NUMSYL);
  if(mode === 5) return Object.keys(VOCAB);
  if(mode === 6) return ["A2"];
  return Object.keys(COURSE[LANG_CODE[target]] || COURSE.es);
}
function hasLevel(mode, target, lvl){ return levelsFor(mode, target).includes(lvl); }

function renderMenu(){
  $("modes").innerHTML = MODES.map(m => `
    <button class="mode" role="radio" aria-checked="${setup.mode===m.id}" data-mode="${m.id}" style="--c:${m.color}">
      <span class="ico" aria-hidden="true">${m.ico}</span>
      <span><b>${esc(t("m"+m.id+"n"))}</b><small>${esc(t("m"+m.id+"d"))}</small></span>
    </button>`).join("");
  const m = setup.mode;
  const avail = levelsFor(m, setup.target);
  if(!avail.includes(setup.level)) setup.level = avail[0];
  $("levels").innerHTML = LEVELS.map(l => `<button class="lv" role="radio" aria-checked="${setup.level===l}" data-lv="${l}" ${avail.includes(l) ? "" : "disabled"}>${l}</button>`).join("");
  $("islandGroup").hidden = m !== 6;
  $("levelGroup").hidden = m === 3 || m === 6;
  $("levelTitle").textContent = m === 2 ? t("lvLocked") : t("lvStart");
  $("levelNote").textContent = (m === 2 ? t("lvNoteLocked") + " " : "") + (avail.length < LEVELS.length ? t("lvSoon") : "");
  renderIslandChips();
  renderDaily();
}
// each course has its own islands (the new languages' islands carry lang)
function islandsFor(target){ const c = typeof xlCode === "function" ? xlCode(target) : null; return ISLANDS.filter(i => (i.lang || null) === c); }
function renderIslandChips(){
  const nat = LANG_CODE[setup.native] || "en";
  $("islandChips").innerHTML = `<button class="chip ${setup.island === "" ? "on" : ""}" data-isl="">🎲 ${esc(t("surpriseMe"))}</button>` +
    islandsFor(setup.target).map(i => `<button class="chip ${setup.island === i.id ? "on" : ""}" data-isl="${i.id}">${esc(i[nat])}</button>`).join("");
}
function renderNextChips(){
  const nat = LANG_CODE[S.native] || "en";
  $("nextChips").innerHTML = islandsFor(S.target).filter(i => i.id !== S.islandId).map(i => `<button class="chip" data-isl="${i.id}">${esc(i[nat])}</button>`).join("");
}
function initMenu(){
  fillLangSelects();
  $("uiSel").addEventListener("change", () => {
    const l = UI_LANGS.find(x => x.code === $("uiSel").value) || UI_LANGS[0];
    setup.native = l.name; setup.target = otherLang(l.name);
    setUiLang(l.code, l.name);
  });
  $("modes").addEventListener("click", e => { const b = e.target.closest("[data-mode]"); if(b){ setup.mode = +b.dataset.mode; renderMenu(); }});
  $("levels").addEventListener("click", e => { const b = e.target.closest("[data-lv]"); if(b && !b.disabled){ setup.level = b.dataset.lv; renderMenu(); }});
  $("islandChips").addEventListener("click", e => { const b = e.target.closest("[data-isl]"); if(b){ setup.island = b.dataset.isl; renderIslandChips(); }});
  $("targetSel").addEventListener("change", () => { setup.target = $("targetSel").value; setup.native = otherLang(setup.target); fillLangSelects(); renderMenu(); });
  $("nativeSel").addEventListener("change", () => { setup.native = $("nativeSel").value; setup.target = otherLang(setup.native); fillLangSelects(); renderMenu(); });
  $("startBtn").addEventListener("click", startNew);
  $("continueBtn").addEventListener("click", () => { showGame(); if(!S.current) runTurn(null); });
  renderMenu();
}
function fillLangSelects(){
  $("targetSel").innerHTML = LANGS.map(l => `<option value="${l}" ${l === setup.target ? "selected" : ""}>${esc(langLabel(l))}</option>`).join("");
  $("nativeSel").innerHTML = LANGS.map(l => `<option value="${l}" ${l === setup.native ? "selected" : ""}>${esc(langLabel(l))}</option>`).join("");
  $("uiSel").innerHTML = UI_LANGS.map(l => `<option value="${l.code}" ${l.code === UI.code ? "selected" : ""}>${l.label}</option>`).join("");
}
function setUiLang(code, name){
  try{ localStorage.setItem("pgm-ui", JSON.stringify({code, name})); }catch(e){}
  UI = {code, name, dict: I18N[code] || I18N.en};
  applyI18n();
}
function applyI18n(){
  const html = document.documentElement;
  html.lang = UI.code;
  html.dir = "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  fillLangSelects();
  renderMenu();
  refreshContinue();
  if(typeof renderSoundBtn === "function") renderSoundBtn();
  if(typeof renderReadUi === "function") renderReadUi();
  if(S && !$("game").hidden) renderGame();
  if(S && !$("over").hidden) showOver();
}

function startNew(){
  $("startNote").textContent = "";
  S = freshState({mode:setup.mode, target:setup.target, native:setup.native, level: setup.mode === 3 ? "A1" : setup.level, islandId:setup.island});
  save();
  Sound.start();
  showGame();
  runTurn(null);
}
function freshState(o){
  const st = {
    v:2, savedAt:Date.now(),
    mode:o.mode, target:o.target, native:o.native, level:o.level, island:"", islandId:"", fast:false,
    syllabus:null, done:[], hp:3, vocabCleared:0, cycles:0,
    srs:[], cheat:[], spotlight:null, history:[], recentK:[], seenW:[], lastGame:"", pastIslands:(o.pastIslands || []).slice(),
    current:null, judgement:null, event:null, status:"playing",
    stats:{answered:0, correct:0, streak:0, best:0}
  };
  if(!hasLevel(st.mode, st.target, st.level)) st.level = levelsFor(st.mode, st.target)[0];
  if(o.mode === 6){
    let id = o.islandId;
    const mine = islandsFor(o.target);
    if(!mine.some(i => i.id === id)){
      let pool = mine.filter(i => !st.pastIslands.includes(i.id));
      if(!pool.length){ pool = mine; st.pastIslands = []; }
      id = pool[Math.floor(Math.random() * pool.length)].id;
    }
    st.islandId = id;
    st.island = ISLANDS.find(i => i.id === id)[LANG_CODE[o.native] || "en"];
  }
  return st;
}
