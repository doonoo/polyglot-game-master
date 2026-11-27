/* ===================== Display size =====================
   Scales the whole app from 70% to 150% by setting the root font size (all type is in rem,
   so text, buttons and cards grow or shrink together, on top of the phone's own text size).
   Saved in localStorage pgm-size. Reachable from the menu (🔍 chip opens a sheet with a live
   preview) and from the in-game 🎛️ panel (A− / A+ row). */
Object.assign(I18N.en, {sz_title:"Display size", sz_note:"Make everything bigger or smaller. This adds to your device's own text size.", sz_small:"Smaller", sz_big:"Bigger", sz_reset:"Reset to 100%", sz_done:"Done", sz_row:"Size"});
Object.assign(I18N.es, {sz_title:"Tamaño de pantalla", sz_note:"Haz todo más grande o más pequeño. Se suma al tamaño de texto de tu dispositivo.", sz_small:"Más pequeño", sz_big:"Más grande", sz_reset:"Volver a 100%", sz_done:"Listo", sz_row:"Tamaño"});

const SZ_MIN = 70, SZ_MAX = 150, SZ_STEP = 10;
let SZ = 100;
try{ const v = +localStorage.getItem("pgm-size"); if(v >= SZ_MIN && v <= SZ_MAX) SZ = v; }catch(e){}
function szApply(v, keep){
  SZ = Math.max(SZ_MIN, Math.min(SZ_MAX, Math.round(v / SZ_STEP) * SZ_STEP));
  document.documentElement.style.fontSize = SZ === 100 ? "" : SZ + "%";
  if(!keep){ try{ localStorage.setItem("pgm-size", String(SZ)); }catch(e){} }
  szRefresh();
}
function szRefresh(){
  document.querySelectorAll("[data-szval]").forEach(el => el.textContent = SZ + "%");
  document.querySelectorAll("[data-sz]").forEach(b => { const d = +b.dataset.sz; b.disabled = (d < 0 && SZ <= SZ_MIN) || (d > 0 && SZ >= SZ_MAX); });
  const r = $("szRange"); if(r && +r.value !== SZ) r.value = SZ;
  const chip = $("menuSizeBtn"); if(chip){ chip.textContent = "🔍 " + SZ + "%"; chip.setAttribute("aria-label", t("sz_title") + ": " + SZ + "%"); }
}

(() => {
  const css = document.createElement("style");
  css.textContent = `
.szstep{display:flex;align-items:center;gap:8px}
.szstep button{min-width:48px;padding:8px 10px;font-weight:800}
.szstep b{min-width:3.4em;text-align:center}
.szsheet .szstep{justify-content:center;margin:6px 0 10px}
.szsheet .szstep button{min-width:64px;font-size:1.1rem}
.szsheet .szstep b{font-size:1.4rem}
.szsheet input[type=range]{width:100%;accent-color:var(--violet);margin:4px 0 8px}
.szsheet .szprev{border:2px dashed var(--line);border-radius:14px;padding:10px 12px;margin:4px 0 4px}
.szsheet .szprev .tile{pointer-events:none}
.srow.szrow{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
`;
  document.head.appendChild(css);
  // menu chip, after the other top bar chips
  const chip = document.createElement("button");
  chip.type = "button"; chip.className = "chip"; chip.id = "menuSizeBtn";
  const bar = document.querySelector(".topbar"), lab = bar && bar.querySelector('label[for="uiSel"]');
  if(lab) lab.before(chip); else $("menuMusicBtn").after(chip);
  // bottom sheet
  const back = document.createElement("div");
  back.className = "vaback"; back.id = "szSheet"; back.hidden = true;
  back.innerHTML = `<div class="vasheet szsheet" role="dialog" aria-modal="true" aria-labelledby="szTitle">
    <h2 class="display" id="szTitle"></h2><p class="note" id="szNote"></p>
    <div class="szstep"><button type="button" class="ghost" data-sz="-1" id="szDown">A−</button><b data-szval></b><button type="button" class="ghost" data-sz="1" id="szUp">A+</button></div>
    <input type="range" id="szRange" min="${SZ_MIN}" max="${SZ_MAX}" step="${SZ_STEP}" aria-labelledby="szTitle">
    <div class="szprev" aria-hidden="true"><b>¡Hola! ¿Cómo estás?</b><div class="note">Hello! How are you?</div></div>
    <div class="vabtns"><button class="ghost" id="szReset"></button><button class="primary" id="szDone"></button></div></div>`;
  document.body.appendChild(back);
  // in-game settings row
  const row = document.createElement("div");
  row.className = "srow szrow";
  row.innerHTML = `<span>🔍 <span data-i18n="sz_row">${esc(t("sz_row"))}</span></span><span class="szstep"><button type="button" class="ghost" data-sz="-1" aria-label="${esc(t("sz_small"))}">A−</button><b data-szval></b><button type="button" class="ghost" data-sz="1" aria-label="${esc(t("sz_big"))}">A+</button></span>`;
  const kb = $("settingsPanel").querySelector(".kbHelpBtn");
  $("settingsPanel").insertBefore(row, kb || null);
  szApply(SZ, true);
})();
function szTexts(){
  $("szTitle").textContent = "🔍 " + t("sz_title");
  $("szNote").textContent = t("sz_note");
  $("szDown").setAttribute("aria-label", t("sz_small"));
  $("szUp").setAttribute("aria-label", t("sz_big"));
  $("szReset").textContent = "↺ " + t("sz_reset");
  $("szDone").textContent = t("sz_done");
  szRefresh();
}
function szOpen(){ szTexts(); $("szSheet").hidden = false; try{ $("szUp").focus({preventScroll:true}); }catch(e){} }
function szClose(){ $("szSheet").hidden = true; try{ $("menuSizeBtn").focus({preventScroll:true}); }catch(e){} }
renderMenu = wrap("renderMenu", "uisize", renderMenu, orig => function(){ const r = orig.apply(this, arguments); try{ szRefresh(); }catch(e){} return r; });
document.addEventListener("click", e => {
  const b = e.target.closest("[data-sz]");
  if(b){ e.preventDefault(); Sound.tap(); szApply(SZ + SZ_STEP * +b.dataset.sz); return; }
  if(e.target.closest("#menuSizeBtn")){ Sound.tap(); szOpen(); return; }
  if(e.target.closest("#szReset")){ Sound.tap(); szApply(100); return; }
  if(e.target.closest("#szDone") || e.target.id === "szSheet"){ Sound.tap(); szClose(); }
});
document.addEventListener("input", e => { if(e.target.id === "szRange") szApply(+e.target.value); });
document.addEventListener("keydown", e => { if(e.key === "Escape" && !$("szSheet").hidden){ e.preventDefault(); szClose(); } });
if(window.__PGM_TEST) window.__sz = {szApply, get v(){ return SZ; }};
