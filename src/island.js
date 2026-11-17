/* ===================== Island Hopper: study, hide, recall ===================== */
// A new phrase never counts on the turn it is taught. It joins the review queue and is
// conquered only after two correct recalls in later rounds, with no phrase card on screen.
const islKey = (st, k) => String(k || "").toLowerCase();
const inIslSrs = (st, k) => st.srs.some(x => x.k.toLowerCase() === islKey(st, k));
applyResult = (orig => function(st, correct, plan){
  if(st.mode !== 6 || !plan || !st.syllabus) return orig(st, correct, plan);
  if(plan.kind === "syllabus"){
    orig(st, correct, Object.assign({}, plan, {kind:"teach"}));
    if(st.status === "playing") addSrs(st, st.syllabus[plan.idx], "concept");
    return;
  }
  const key = islKey(st, plan.key);
  orig(st, correct, plan);
  if(correct && st.status === "playing" && plan.kind === "srs" && !inIslSrs(st, key)){
    const i = st.syllabus.findIndex(x => x.toLowerCase() === key);
    if(i >= 0) st.done[i] = true;
    if(st.done.length === st.syllabus.length && st.done.every(Boolean)) st.status = "conquered";
  }
})(applyResult);
makePlanCore = (orig => function(st, rolls, exclude){
  const p = orig(st, rolls, exclude);
  if(!p || st.mode !== 6 || !st.syllabus || p.newSyllabus) return p;
  const exKey = exclude ? islKey(st, exclude.kind === "syllabus" && st.syllabus ? st.syllabus[exclude.idx] : exclude.key) : "";
  const exIdx = exclude && exclude.kind === "syllabus" ? exclude.idx : -1;
  const fresh = st.syllabus.map((_, i) => i).filter(i => !st.done[i] && !inIslSrs(st, st.syllabus[i]) && i !== exIdx);
  const due = st.srs.filter(x => x.k.toLowerCase() !== exKey);
  // review when phrases are waiting: always once three are queued, otherwise about half the time
  if(due.length && (!fresh.length || st.srs.length >= 3 || rolls.r < 0.5)){
    due.sort((a, b) => a.c - b.c);
    const pool = due.slice(0, Math.max(1, Math.ceil(due.length / 2)));
    return {kind:"srs", key:pool[Math.floor(rolls.s * pool.length)].k, game:p.game};
  }
  if(fresh.length){ const nx = fresh.find(i => i > exIdx); return {kind:"syllabus", idx:nx !== undefined ? nx : fresh[0], game:p.game}; }
  if(st.srs.length) return {kind:"srs", key:st.srs[0].k, game:p.game};
  return p;
})(makePlanCore);

// Study gate: on a teach turn the question stays hidden until the player hides the phrase.
function islandGate(fresh){
  const c = S && S.current, gate = S && S.mode === 6 && S.status === "playing" && c && c.plan && c.plan.kind === "syllabus" && c.lesson.words.length;
  const old = $("islGate"); if(old) old.remove();
  if(!gate) return;
  if(c.studied){ $("lessonCard").hidden = true; return; }
  $("challengeCard").hidden = true;
  const b = document.createElement("div");
  b.id = "islGate"; b.className = "islgate";
  b.innerHTML = `<button class="primary" id="islHide">🙈 ${esc(t("islHide"))}</button><p class="note">${esc(t("islHideNote"))}</p>`;
  $("lessonCard").querySelector(".in").appendChild(b);
}
renderExtras = (orig => function(fresh){ orig(fresh); islandGate(fresh); })(renderExtras);
$("lessonCard").addEventListener("click", e => {
  if(!e.target.closest("#islHide") || !S || !S.current) return;
  Sound.unlock(); Sound.tap(); Narrator.stop();
  S.current.studied = true; save();
  $("lessonCard").hidden = true; $("challengeCard").hidden = false;
  if($("islGate")) $("islGate").remove();
  renderExtras(true);
  $("challengeCard").scrollIntoView({block:"start"});
  try{ $("answer").focus({preventScroll:true}); }catch(err){}
});
