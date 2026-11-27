/* ===================== Motion: animate everything (with an off switch) ===================== */
Object.assign(I18N.en, {animToggle:"Animations"});
Object.assign(I18N.es, {animToggle:"Animaciones"});
let animOn = (() => { try{ return localStorage.getItem("pgm-anim") !== "off"; }catch(e){ return true; } })();
function setAnim(v){
  animOn = !!v;
  try{ localStorage.setItem("pgm-anim", animOn ? "on" : "off"); }catch(e){}
  document.body.classList.toggle("noanim", !animOn);
  document.querySelectorAll(".animChk").forEach(x => x.checked = animOn);
}

/* Replay an entrance animation on an element that stays on screen */
function replay(el, cls){
  if(!el || !animOn) return;
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
}
function animOnce(el, cls, ms){
  if(!el || !animOn) return;
  replay(el, cls);
  setTimeout(() => el.classList.remove(cls), ms || 700);
}

/* Stagger: give every child of these containers its place in line */
const STAGGER = ["#modes", "#levels", "#tiles", "#pairs", ".words", ".sq", "#quizOpts", "#quizBuild", "#overStats", "#storiesList",
  "#bookList", "#questBox", ".quests", "#customBody .chips", "#stTiles", "#stModes", ".trophies", "#islandChips", ".kbt tbody"];
function stagger(root){
  for(const sel of STAGGER){
    const boxes = root.matches && root.matches(sel) ? [root] : [...(root.querySelectorAll ? root.querySelectorAll(sel) : [])];
    for(const box of boxes){
      let i = 0;
      for(const c of box.children){ if(c.nodeType === 1){ c.style.setProperty("--i", Math.min(i, 14)); c.classList.add("a-st"); i++; } }
    }
  }
}
if(window.MutationObserver && !window.__PGM_TEST){   // tests play thousands of turns in one synchronous loop: queued records would keep every old node alive
  new MutationObserver(list => {
    if(!animOn) return;
    const roots = new Set();
    for(const m of list) if(m.type === "childList" && m.addedNodes.length) roots.add(m.target);
    for(const r of roots){ stagger(r); let p = r.parentElement; for(let k = 0; k < 3 && p; k++, p = p.parentElement) if(STAGGER.some(s => p.matches(s))){ stagger(p); break; } }
  }).observe(document.body, {childList:true, subtree:true});
}

/* Each new turn: cards slide in again, the verdict lands with a glow */
renderExtras = wrap("renderExtras", "anim", renderExtras, orig => function(fresh){
  orig(fresh);
  if(!fresh || !animOn) return;
  replay($("challengeCard"), "a-in");
  if(!$("lessonCard").hidden) replay($("lessonCard"), "a-in");
  const j = $("judgeCard");
  if(!j.hidden){ replay(j, "a-pop"); animOnce($("challengeCard"), j.classList.contains("ok") ? "a-okglow" : "a-badglow", 900); }
});

/* HUD: hearts break, streak bumps, level badge pops */
let animPrev = {hp:null, streak:0, badge:"", prog:""};
renderHud = wrap("renderHud", "anim", renderHud, orig => function(){
  orig();
  if(!S) return;
  if(animPrev.hp !== null && S.hp < animPrev.hp) animOnce($("hudHearts"), "a-hurt", 700);
  if(S.stats.streak > animPrev.streak && S.stats.streak > 1) animOnce($("hudStreak"), "a-bump", 500);
  const badge = $("hudBadge").textContent;
  if(animPrev.badge && badge !== animPrev.badge) animOnce($("hudBadge"), "a-levelup", 900);
  const prog = $("hudProg").textContent;
  if(animPrev.prog && prog !== animPrev.prog) animOnce($("hudProg"), "a-tick", 400);
  animPrev = {hp:S.hp, streak:S.stats.streak, badge, prog};
});

/* Results: numbers count up */
function countUp(el){
  const m = /^(\d+)(.*)$/.exec(el.textContent.trim()); if(!m) return;
  const end = +m[1], tail = m[2], t0 = performance.now(), dur = Math.min(1200, 300 + end * 25);
  if(end < 2) return;
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(end * e) + tail;
    if(k < 1) requestAnimationFrame(step);
  };
  el.textContent = "0" + tail; requestAnimationFrame(step);
}
showOver = wrap("showOver", "anim", showOver, orig => function(){
  animPrev.hp = null;
  orig();
  if(!animOn || window.__PGM_TEST) return;
  $("overStats").querySelectorAll("b").forEach((b, i) => setTimeout(() => countUp(b), 250 + i * 90));
  replay($("overEmoji"), "a-drop");
});

/* Match Madness: a satisfying snap when a pair locks in */
$("pairs").addEventListener("click", e => {
  const b = e.target.closest(".pr"); if(!b || !animOn) return;
  setTimeout(() => { if(b.classList.contains("done")) $("pairs").querySelectorAll(".pr.done:not(.a-matched)").forEach(x => x.classList.add("a-matched")); }, 0);
});
/* Tiles squash when tapped */
document.addEventListener("click", e => { const t = e.target.closest(".tile, .key, .sopt, .lv, .chip"); if(t) animOnce(t, "a-tap", 250); });

/* Settings row */
(() => {
  const row = document.createElement("label");
  row.className = "srow";
  row.innerHTML = `<span>✨ <span data-i18n="animToggle">${esc(t("animToggle"))}</span></span><input type="checkbox" class="animChk">`;
  const kbBtn = $("settingsPanel").querySelector(".kbHelpBtn");
  $("settingsPanel").insertBefore(row, kbBtn || null);
  document.addEventListener("change", e => { if(e.target.classList && e.target.classList.contains("animChk")) setAnim(e.target.checked); });
  setAnim(animOn);
  stagger(document.body);
})();
