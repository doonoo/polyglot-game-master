/* ===================== Player profile: daily streak, daily goal, lifetime totals ===================== */
const PROFILE_KEY = "pgm-pb-profile";
const profile = {xp:0, correct:0, answered:0, streak:0, bestStreak:0, last:"", today:"", todayCorrect:0, goal:20};
const dayStr = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const yesterdayStr = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); };
function rollDay(){ const t = dayStr(new Date()); if(profile.today !== t){ profile.today = t; profile.todayCorrect = 0; } }
function loadProfile(){
  try{ const p = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"); if(p && typeof p === "object") for(const k in profile) if(typeof p[k] === typeof profile[k]) profile[k] = p[k]; }catch(e){}
  rollDay();
}
function saveProfile(){ try{ localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }catch(e){} }
const liveStreak = () => profile.last === profile.today || profile.last === yesterdayStr() ? profile.streak : 0;
function recordAnswer(correct, xp, forced){
  rollDay();
  if(!forced) profile.answered++;
  trackDay(correct, forced);
  if(correct){
    profile.correct++; profile.todayCorrect++; profile.xp += Math.max(0, xp || 0);
    if(profile.last !== profile.today){
      profile.streak = profile.last === yesterdayStr() ? profile.streak + 1 : 1;
      profile.last = profile.today;
      profile.bestStreak = Math.max(profile.bestStreak, profile.streak);
    }
    if(profile.todayCorrect === profile.goal) setTimeout(() => { Sound.levelUp(); confetti(120); toast("🎯 " + t("goalDone"), "badge"); }, 1500);
  }
  saveProfile();
}
function renderDaily(){
  const el = $("dailyCard"); if(!el) return;
  rollDay();
  const pct = Math.min(100, Math.round(100 * profile.todayCorrect / profile.goal));
  el.innerHTML = `<div class="row3"><span>🔥 ${liveStreak()}<small>${esc(t("dayStreak"))}</small></span><span>⭐ ${profile.xp.toLocaleString("en-US")}<small>${esc(t("totalXp"))}</small></span><span>🎯 ${Math.min(profile.todayCorrect, 999)}/${profile.goal}<small>${esc(t("todayGoal"))}</small></span></div><div class="bar"><i style="width:${pct}%"></i></div>`;
}

/* ===================== Tap tiles and accent keys ===================== */
let picked = [];
function tileItems(ch){
  if(ch.game === "Syntax Scramble") return ch.k === "w" ? {mode:"letters", items:ch.target.split(" ")} : {mode:"words", items:ch.target.split(" / ")};
  if(ch.game === "Odd One Out") return {mode:"pick", items:ch.target.split("  ·  ")};
  if(ch.game === "Word Duel" && Array.isArray(ch.opts)) return {mode:"pick", items:ch.opts};
  return null;
}
$("tiles").addEventListener("click", e => {
  const b = e.target.closest(".tile"); if(!b) return;
  const box = $("tiles"), mode = box.dataset.mode, all = [...box.querySelectorAll(".tile[data-i]")];
  Sound.unlock(); Sound.tap();
  if(mode === "pick"){
    all.forEach(x => x.classList.toggle("sel", x === b));
    $("answer").value = b.textContent;
    return;
  }
  if(b.dataset.undo) picked.pop();
  else if(!picked.includes(+b.dataset.i)) picked.push(+b.dataset.i);
  all.forEach(x => x.classList.toggle("used", picked.includes(+x.dataset.i)));
  $("answer").value = picked.map(i => all[i].textContent).join(mode === "letters" ? "" : " ");
});
$("accentKeys").innerHTML = "áéíóúñ¿¡".split("").map(c => `<button class="key" type="button" data-k="${c}">${c}</button>`).join("");
$("accentKeys").addEventListener("click", e => {
  const b = e.target.closest(".key"); if(!b) return;
  const a = $("answer"), s = a.selectionStart == null ? a.value.length : a.selectionStart, en = a.selectionEnd == null ? s : a.selectionEnd;
  a.value = a.value.slice(0, s) + b.dataset.k + a.value.slice(en);
  a.focus();
  try{ a.setSelectionRange(s + 1, s + 1); }catch(err){}
});
