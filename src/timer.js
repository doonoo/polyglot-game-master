/* ===================== The Clock: optional timers for every mode ===================== */
Object.assign(I18N.en, {
  clock:"Clock", ck_off:"Off", ck_relax:"Relaxed", ck_brisk:"Brisk", ck_blitz:"Blitz", ck_attack:"Time Attack",
  ckn_off:"No timer. Take your time.",
  ckn_relax:"About 30 seconds a question, more for long answers. Answer in the first half for bonus XP.",
  ckn_brisk:"About 18 seconds a question. Quick answers earn bonus XP; three in a row sets you on fire.",
  ckn_blitz:"About 10 seconds a question. Run out and it counts as a miss.",
  ckn_attack:"One clock for the whole run: 60 seconds. Right answers add 5 seconds, misses take 3. How many can you get?",
  timeUp:"⏰ Time's up!", quick:"⚡ Quick! +{xp} XP", lightning:"⚡ Lightning! +{xp} XP", onFire:"🔥 On fire! +{xp} XP",
  atkOverT:"Time!", atkOverB:"{c} right answers out of {n} in Time Attack.", atkBest:"Best: {b}", atkNew:"🏆 New best!",
  stFast:"fast answers", ckBestShort:"best {b}"
});
Object.assign(I18N.es, {
  clock:"Reloj", ck_off:"Sin reloj", ck_relax:"Tranquilo", ck_brisk:"Ágil", ck_blitz:"Relámpago", ck_attack:"Contrarreloj",
  ckn_off:"Sin temporizador. Tómate tu tiempo.",
  ckn_relax:"Unos 30 segundos por pregunta, más si la respuesta es larga. Responde en la primera mitad para ganar XP extra.",
  ckn_brisk:"Unos 18 segundos por pregunta. Las respuestas rápidas dan XP extra; tres seguidas y estás que ardes.",
  ckn_blitz:"Unos 10 segundos por pregunta. Si se acaba el tiempo, cuenta como fallo.",
  ckn_attack:"Un solo reloj para toda la partida: 60 segundos. Cada acierto suma 5 segundos y cada fallo resta 3. ¿Cuántas aciertas?",
  timeUp:"⏰ ¡Se acabó el tiempo!", quick:"⚡ ¡Rápido! +{xp} XP", lightning:"⚡ ¡Relámpago! +{xp} XP", onFire:"🔥 ¡Estás que ardes! +{xp} XP",
  atkOverT:"¡Tiempo!", atkOverB:"{c} aciertos de {n} en Contrarreloj.", atkBest:"Récord: {b}", atkNew:"🏆 ¡Nuevo récord!",
  stFast:"respuestas rápidas", ckBestShort:"récord {b}"
});
const CLOCKS = ["off", "relax", "brisk", "blitz", "attack"];
const CK_ICO = {off:"🕊️", relax:"🐢", brisk:"🐇", blitz:"⚡", attack:"⏱️"};
const CK_BASE = {relax:30, brisk:18, blitz:10, boss:24}, CK_PER = {relax:6, brisk:9, blitz:12, boss:7}, CK_PAIR = {relax:4, brisk:3, blitz:2, boss:3};
/* Bosses always fight on the clock: their own timer, or yours if it is tighter */
const ckBossNow = () => !!(S && S.current && S.current.plan && S.current.plan.boss && S.current.challenge && S.current.challenge.boss);
const ckMode = () => S.clock === "attack" ? "attack" : ckBossNow() ? (S.clock === "blitz" ? "blitz" : S.clock === "brisk" ? "brisk" : "boss") : S.clock;
const ATK_START = 60000, ATK_PLUS = 5000, ATK_MINUS = 3000;
profile.clock = profile.clock || "off"; profile.attackBest = profile.attackBest || {};

/* ---------- Menu: pick a clock ---------- */
(() => {
  const sec = document.createElement("section");
  sec.className = "group"; sec.id = "clockGroup";
  sec.innerHTML = `<h2>⏱️ <span data-i18n="clock">${esc(t("clock"))}</span></h2><div class="levels clocks" role="radiogroup" id="clockChips"></div><p class="note" id="clockNote"></p>`;
  $("levelGroup").after(sec);
})();
function renderClock(){
  const c = CLOCKS.includes(profile.clock) ? profile.clock : "off";
  $("clockChips").innerHTML = CLOCKS.map(k => `<button class="lv ck" role="radio" aria-checked="${c === k}" data-clock="${k}"><span aria-hidden="true">${CK_ICO[k]}</span> ${esc(t("ck_" + k))}</button>`).join("");
  const best = profile.attackBest[setup.mode];
  $("clockNote").textContent = t("ckn_" + c) + (c === "attack" && best ? " " + t("atkBest", {b:best}) + "." : "");
  $("clockGroup").hidden = setup.mode === 9;   // Custom Game has its own timer
}
renderMenu = (orig => function(){ orig(); renderClock(); })(renderMenu);
$("clockChips").addEventListener("click", e => {
  const b = e.target.closest("[data-clock]"); if(!b) return;
  Sound.unlock(); Sound.tap();
  profile.clock = b.dataset.clock; saveProfile(); renderClock();
});
document.addEventListener("click", e => { if(e.target.closest("[data-mode]")) setTimeout(renderClock, 0); });

/* ---------- Every new run carries the chosen clock ---------- */
freshState = (orig => function(o){
  const st = orig(o);
  st.clock = o.mode === 9 ? "off" : (CLOCKS.includes(profile.clock) ? profile.clock : "off");
  if(st.clock === "attack") st.atk = {left:ATK_START};
  return st;
})(freshState);

/* ---------- HUD chip and the draining bar ---------- */
function ckEls(){
  let chip = $("hudClock");
  if(!chip){ chip = document.createElement("span"); chip.id = "hudClock"; chip.className = "ckchip"; chip.hidden = true; $("hudStreak").before(chip); }
  let bar = $("clockBar");
  if(!bar){ bar = document.createElement("div"); bar.id = "clockBar"; bar.className = "clockbar"; bar.hidden = true; bar.innerHTML = "<i></i>"; $("challengeCard").querySelector(".ch-body").prepend(bar); }
  return {chip, bar};
}
function ckFloat(text, good){
  const chip = $("hudClock"); if(!chip) return;
  const f = document.createElement("span");
  f.className = "ckfloat " + (good ? "up" : "down"); f.textContent = text;
  chip.appendChild(f); setTimeout(() => f.remove(), 1000);
}

/* ---------- The ticking ---------- */
const CK = {cur:null, left:0, budget:0, last:Date.now(), run:0, lastSec:-1};
function ckBudget(ch){
  const k = ckMode(), len = String(ch.answerKey || ch.target || "").length;
  let s = CK_BASE[k] + Math.round(len / CK_PER[k]);
  if(Array.isArray(ch.pairs)) s += ch.pairs.length * CK_PAIR[k];
  return s * 1000;
}
function ckPaused(){
  return document.hidden || document.body.classList.contains("listening") || !$("settingsPanel").hidden || !!$("kbHelp") || $("challengeCard").hidden || $("submitBtn").disabled || $("giveUpBtn").disabled;
}
function ckEnd(){
  S.status = "gameover"; S.timeUp = true; S.current = null; S.savedAt = Date.now();
  Sound.wrong(); toast(t("timeUp"));
  save(); showOver();
}
function ckTick(){
  const now = Date.now(), dt = Math.min(1000, now - CK.last); CK.last = now;
  const on = S && S.status === "playing" && S.current && !$("game").hidden && ((S.clock && S.clock !== "off") || ckBossNow());
  const {chip, bar} = ckEls();
  if(!on){
    if(CK.cur && S && S.status === "playing") save();   // keep the time left when leaving the game
    chip.hidden = true; bar.hidden = true; CK.cur = null; return;
  }
  const paused = ckPaused();
  let left, full;
  if(ckMode() === "attack"){
    if(!S.atk) S.atk = {left:ATK_START};
    if(!paused) S.atk.left -= dt;
    left = S.atk.left; full = Math.max(ATK_START, left);
    if(CK.cur !== S.current){ CK.cur = S.current; CK.budget = 0; }
    if(left <= 0){ chip.hidden = true; bar.hidden = true; ckEnd(); return; }
  } else {
    if(CK.cur !== S.current){
      CK.cur = S.current; CK.budget = ckBudget(S.current.challenge); CK.lastSec = -1;
      const kept = +S.current.ckLeft;
      CK.left = kept > 0 && kept <= CK.budget ? kept : CK.budget;
    }
    if(!paused) CK.left -= dt;
    S.current.ckLeft = Math.max(1, Math.round(CK.left));
    left = CK.left; full = CK.budget;
    if(left <= 0){
      CK.cur = null; CK.run = 0;
      toast(t("timeUp"));
      if(!$("giveUpBtn").disabled) $("giveUpBtn").click();
      return;
    }
  }
  const sec = Math.ceil(left / 1000), frac = Math.max(0, Math.min(1, left / full));
  chip.hidden = false; bar.hidden = false;
  if(chip.firstChild && chip.firstChild.nodeType === 3) chip.firstChild.nodeValue = "⏱️ " + sec; else chip.prepend(document.createTextNode("⏱️ " + sec));
  chip.classList.toggle("low", sec <= 5);
  const i = bar.firstChild;
  i.style.width = (frac * 100).toFixed(1) + "%";
  bar.classList.toggle("warn", frac < 0.5); bar.classList.toggle("low", sec <= 5);
  if(sec <= 3 && sec !== CK.lastSec && !paused){ Sound.tap(); }
  CK.lastSec = sec;
}
setInterval(ckTick, 100);
document.addEventListener("visibilitychange", () => { CK.last = Date.now(); });

/* ---------- Rewards: speed bonus, or time in Time Attack ---------- */
grantRewards = (orig => function(plan, correct){
  const fx = orig(plan, correct);
  if(!S || ((!S.clock || S.clock === "off") && !(plan && plan.boss))) return fx;
  if(ckMode() === "attack"){
    if(!S.atk) S.atk = {left:ATK_START};
    S.atk.left += correct ? ATK_PLUS : -ATK_MINUS;
    ckFloat(correct ? "+" + ATK_PLUS / 1000 + "s" : "−" + ATK_MINUS / 1000 + "s", correct);
    return fx;
  }
  if(!correct || !CK.budget){ CK.run = 0; return fx; }
  const f = CK.left / CK.budget;
  let bonus = f >= 0.75 ? 10 : f >= 0.5 ? 5 : 0;
  if(!bonus){ CK.run = 0; return fx; }
  CK.run++; S.stats.fast = (S.stats.fast || 0) + 1;
  let msg = t(bonus >= 10 ? "lightning" : "quick", {xp:bonus});
  if(CK.run % 3 === 0){ bonus += 20; msg = t("onFire", {xp:bonus}); setTimeout(() => confetti(60), 300); }
  fx.xp += bonus; S.xp = (S.xp || 0) + bonus;
  setTimeout(() => toast(msg, "badge"), 350);
  return fx;
})(grantRewards);

/* ---------- Results ---------- */
showOver = (orig => function(){
  orig();
  if(!S) return;
  if(S.clock && S.clock !== "off" && S.clock !== "attack" && S.stats.fast)
    $("overStats").insertAdjacentHTML("beforeend", `<div class="wide"><b>⚡ ${S.stats.fast}</b><small>${esc(t("stFast"))} · ${esc(t("ck_" + S.clock))}</small></div>`);
  if(!S.timeUp) return;
  const best = profile.attackBest[S.mode] || 0, isNew = S.stats.correct > best;
  if(isNew){ profile.attackBest[S.mode] = S.stats.correct; saveProfile(); setTimeout(() => { Sound.levelUp(); confetti(120); }, 400); }
  $("overTitle").textContent = t("atkOverT");
  $("overEmoji").textContent = "⏱️";
  $("overText").innerHTML = `${esc(t("atkOverB", {c:S.stats.correct, n:S.stats.answered}))}<br><b>${esc(isNew ? t("atkNew") : t("atkBest", {b:best}))}</b>`;
  $("overIsland").hidden = true; $("overRestart").hidden = false;
})(showOver);
