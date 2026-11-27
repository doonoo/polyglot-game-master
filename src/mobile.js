/* ===================== Phone layout (2.11.1) =====================
   On a phone (narrow screen), especially with a big system text size, the answer box used to sit
   far below the fold: the last answer's card, the lesson card and the question all stack up.
   - The answer area (box, accent keys, Submit / I don't know) becomes a bar fixed to the bottom of
     the screen whenever a question is up, so it is always one tap away. (It moves out of the
     question card into #game, because the cards' animations would break a fixed element inside them.)
   - After a right answer the answer card shrinks to its verdict (tap "Details" to open it), and
     the screen goes straight to the next question. After a wrong answer it stays open as before.
   - A lesson card that was already shown (same lesson, or a review refresher) folds to one line,
     and with a clock running every lesson folds (tap it to open), so the question and the answer
     bar fit on one screen.
   - With a clock running (Brisk, Blitz, Time Attack), the answer box gets the focus after a right
     answer, so the keyboard is already up for the next question. */
const MOB_Q = "(max-width: 760px)";
const mobOn = () => { try{ return matchMedia(MOB_Q).matches; }catch(e){ return false; } };
Object.assign(I18N.en, {mobDet:"Details", mobHide:"Hide", mobLesson:"Lesson"});
Object.assign(I18N.es, {mobDet:"Detalles", mobHide:"Ocultar", mobLesson:"Lección"});
const mobT = k => t("mob" + k.charAt(0).toUpperCase() + k.slice(1));
let mobLastLesson = "", mobOpenJ = false;
(() => {
  const c = document.createElement("style");
  c.textContent = `@media ${MOB_Q}{
  #game > #ansDock{position:fixed;left:0;right:0;bottom:0;z-index:6;background:var(--card);padding:8px 14px calc(10px + env(safe-area-inset-bottom,0px));box-shadow:0 -8px 18px -10px rgba(28,26,51,.45);border-top:3px solid var(--ink)}
  #game > #ansDock > *{max-width:720px;margin-left:auto;margin-right:auto}
  #game.mobdock #feed{padding-bottom:var(--mob-dock,0px)}
  #ansDock > label.f{display:none}
  #ansDock #answer{min-height:2.6em;max-height:30vh}
  #ansDock .keys{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}
  #ansDock .actions{margin-top:6px}
  #feed > section{scroll-margin-top:calc(var(--mob-hud,64px) + 6px)}
  .judge.jmini .ans, .judge.jmini .fbnotes{display:none}
  .judge.jmini{padding-top:10px;padding-bottom:10px}
  .lesson.lmini .in > :not(h3){display:none}
  .lesson.lmini .in h3{margin:0;font-size:1rem}
  .lesson.lmini .in{padding-top:6px;padding-bottom:8px}
  .mobtog{display:inline-block;margin-top:6px;border:0;background:none;color:var(--violet);font:inherit;font-size:.85rem;font-weight:700;padding:4px 0;cursor:pointer}
  }
  .mobtog{display:none}
  @media ${MOB_Q}{ .mobtog{display:inline-block} }`;
  document.head.appendChild(c);
})();
// the dock: label, answer box (with its mic), accent keys and the Submit row
let mobHome = null;
function mobDock(){
  const had = document.activeElement, back = () => { if(had && had !== document.activeElement && had.isConnected && (had.id === "answer" || had.closest && had.closest("#ansDock"))) try{ had.focus({preventScroll:true}); }catch(e){} };
  try{ return mobDockIn(); } finally { back(); }   // moving a focused box drops its focus
}
function mobDockIn(){
  let dock = $("ansDock");
  if(!dock){
    const lab = document.querySelector('#challengeCard label.f[for="answer"]'), acts = $("submitBtn") && $("submitBtn").closest(".actions");
    if(!lab || !acts || lab.parentNode !== acts.parentNode) return;
    dock = document.createElement("div"); dock.id = "ansDock";
    lab.parentNode.insertBefore(dock, lab);
    let n = lab;
    while(n){ const next = n.nextSibling; dock.appendChild(n); if(n === acts) break; n = next; }
    mobHome = document.createComment("ansDock");
    dock.parentNode.insertBefore(mobHome, dock);
  }
  const on = mobOn(), g = $("game");
  if(on && dock.parentNode !== g) g.appendChild(dock);
  else if(!on && mobHome && dock.previousSibling !== mobHome) mobHome.after(dock);
  // in the bar only while a question is up
  const was = dock.hidden;
  dock.hidden = on ? $("challengeCard").hidden : false;
  if(was && !dock.hidden && typeof kbFocus === "function") try{ kbFocus(); }catch(e){}   // keyboard play skipped the box while the bar was hidden
  g.classList.toggle("mobdock", on && !dock.hidden);
  if(on) requestAnimationFrame(() => { document.documentElement.style.setProperty("--mob-dock", dock.hidden ? "0px" : Math.round(dock.getBoundingClientRect().height + 12) + "px"); });
}
function mobHud(){ const h = document.querySelector("#game .hud"); if(h) document.documentElement.style.setProperty("--mob-hud", Math.round(h.getBoundingClientRect().height) + "px"); }
renderGame = wrap("renderGame", "mobile", renderGame, orig => function(fresh){
  const r = orig.apply(this, arguments);
  try{
    mobDock();
    if(!mobOn() || !S) return r;
    mobHud();
    const j = S.judgement, jc = $("judgeCard"), lc = $("lessonCard"), c = S.current;
    // answer card: verdict only after a right answer
    if(j && !jc.hidden){
      if(fresh) mobOpenJ = false;
      // an also-right answer stays open so the lesson's own phrase is visible
      const mini = j.correct && !j.alt && !mobOpenJ;
      jc.classList.toggle("jmini", mini);
      if(j.correct && jc.querySelector(".ans") && !jc.querySelector(".mobtog")){
        const b = document.createElement("button"); b.className = "mobtog"; b.type = "button";
        b.textContent = (mini ? "▾ " + mobT("det") : "▴ " + mobT("hide"));
        b.addEventListener("click", () => { mobOpenJ = !mobOpenJ; jc.classList.toggle("jmini", !mobOpenJ); b.textContent = mobOpenJ ? "▴ " + mobT("hide") : "▾ " + mobT("det"); });
        const v = jc.querySelector(".fb") || jc.querySelector(".verdict"); v.after(b);
      }
    }
    // lesson card: one line once it has been seen
    let lessonNew = false;
    if(lc && !lc.hidden && c && c.lesson){
      const key = (c.lesson.title || "") + "|" + (c.lesson.body || "").slice(0, 80);
      const timed = ["brisk", "blitz", "attack"].includes(S.clock);
      if(fresh){ lessonNew = !timed && key !== mobLastLesson && !(c.plan && c.plan.kind === "srs"); mobLastLesson = key; lc.dataset.mobOpen = lessonNew ? "1" : ""; }
      const mini = lc.dataset.mobOpen !== "1";
      lc.classList.toggle("lmini", mini);
      const h = lc.querySelector(".in h3");
      if(h && !lc.querySelector(".mobtog")){
        const b = document.createElement("button"); b.className = "mobtog"; b.type = "button";
        const set = () => { b.textContent = lc.classList.contains("lmini") ? "▾ " + mobT("lesson") : "▴ " + mobT("hide"); };
        b.addEventListener("click", () => { lc.dataset.mobOpen = lc.classList.contains("lmini") ? "1" : ""; lc.classList.toggle("lmini"); set(); });
        set(); h.after(b);
      }
    }
    // where the turn starts: the answer after a miss, else the new lesson, else the question
    if(fresh && !S.event && (!j || j.correct) && c && !$("challengeCard").hidden){
      const target = lessonNew ? lc : $("challengeCard");
      target.scrollIntoView({block:"start"});
      const timed = ["brisk", "blitz", "attack"].includes(S.clock);
      const a = $("answer");
      if(timed && j && a && a.offsetParent && !a.closest("[hidden]")) try{ a.focus({preventScroll:true}); }catch(e){}
    }
  }catch(e){}
  return r;
});
addEventListener("resize", () => { try{ if(mobOn()) mobHud(); }catch(e){} });
