/* ===================== Menu: one Practice card, More modes (2.18) =====================
   - Practice and Level Select were the same lessons; Level Select only stopped you from moving up.
     Now there is one Practice card with a "Stay on this level" switch: on = mode 2, off = mode 1.
     Mode 2 still exists inside (old saves, stats, and Grammar Gym / Card Clash / Custom build rounds as mode 2).
   - Custom Game (mode 9) moves to a "More modes" section under the list, open when you ask or when it's picked. */
Object.assign(I18N.en, {
  stayLv:"📌 Stay on this level", stayLvSub:"Keep practising the level you pick instead of moving up when you finish it.",
  m2n:"Practice · this level", moreModes:"More modes ▾", lessModes:"Fewer modes ▴"
});
Object.assign(I18N.es, {
  stayLv:"📌 Quedarme en este nivel", stayLvSub:"Sigue practicando el nivel que elijas en vez de subir al terminarlo.",
  m2n:"Práctica · este nivel", moreModes:"Más modos ▾", lessModes:"Menos modos ▴"
});
const MORE_MODES = [9];
let moreOpen = (() => { try{ return localStorage.getItem("pgm-more") === "on"; }catch(e){ return false; } })();
(() => {
  const css = document.createElement("style");
  css.textContent = `
#moreBtn{display:block;width:100%;margin-top:10px}
#modesMore{margin-top:10px}
#modesMore[hidden]{display:none}
#stayRow{display:flex;align-items:center;gap:12px;margin-top:10px;padding:10px 12px;border:2px solid var(--line);border-radius:14px;cursor:pointer}
#stayRow input{width:24px;height:24px;flex:none}
#stayRow b{display:block}
#stayRow small{display:block;color:var(--muted)}`;
  document.head.appendChild(css);
})();
renderMenu = wrap("renderMenu", "menumerge", renderMenu, orig => function(){
  orig.apply(this, arguments);
  const grid = $("modes"), m = setup.mode;
  // one Practice card, selected for mode 1 and mode 2
  const lv = grid.querySelector('[data-mode="2"]'); if(lv) lv.remove();
  const pr = grid.querySelector('[data-mode="1"]'); if(pr) pr.setAttribute("aria-checked", String(m === 1 || m === 2));
  // More modes
  let more = $("modesMore"), btn = $("moreBtn");
  if(!more){
    more = document.createElement("div"); more.id = "modesMore"; more.className = "modes"; more.setAttribute("role", "radiogroup");
    btn = document.createElement("button"); btn.id = "moreBtn"; btn.className = "ghost"; btn.type = "button";
    grid.after(btn); btn.after(more);
    more.addEventListener("click", e => { const b = e.target.closest("[data-mode]"); if(b){ setup.mode = +b.dataset.mode; renderMenu(); } });
  }
  more.innerHTML = "";
  for(const id of MORE_MODES){ const c = grid.querySelector(`[data-mode="${id}"]`); if(c) more.appendChild(c); }
  const open = moreOpen || MORE_MODES.includes(m);
  more.hidden = !open || !more.children.length;
  btn.hidden = !more.children.length;
  btn.textContent = t(open ? "lessModes" : "moreModes");
  btn.setAttribute("aria-expanded", String(open));
  // the switch under the level picker
  let row = $("stayRow");
  if(m === 1 || m === 2){
    if(!row){
      row = document.createElement("label"); row.id = "stayRow";
      row.innerHTML = `<input type="checkbox" id="stayChk"><span><b id="stayL"></b><small id="stayS"></small></span>`;
      $("levelGroup").appendChild(row);
      row.querySelector("input").addEventListener("change", e => { setup.mode = e.target.checked ? 2 : 1; renderMenu(); });
    }
    row.hidden = false;
    $("stayChk").checked = m === 2; $("stayL").textContent = t("stayLv"); $("stayS").textContent = t("stayLvSub");
  } else if(row) row.hidden = true;
});
document.addEventListener("click", e => {
  if(!e.target.closest("#moreBtn")) return;
  moreOpen = !(moreOpen || MORE_MODES.includes(setup.mode));
  if(!moreOpen && MORE_MODES.includes(setup.mode)) setup.mode = 1;
  try{ localStorage.setItem("pgm-more", moreOpen ? "on" : "off"); }catch(err){}
  renderMenu();
});
// tests pick any mode the way the menu does now (mode 2 = Practice + the switch, mode 9 = More modes)
if(window.__PGM_TEST) window.__pickMode = m => { if(MORE_MODES.includes(m)) moreOpen = true; setup.mode = m; renderMenu(); };
