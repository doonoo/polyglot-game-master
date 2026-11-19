/* ===================== Boss battles that actually fight back ===================== */
Object.assign(I18N.en, {
  bfIntro:"{name} attacks! Hit it {hp} times before it hits you twice. No hints, accents count, and the clock is running.",
  bfPhase:"Hit {n} of {max}. Shield: {s}.", bfFinal:"Final blow! Translate both sentences, one after the other.",
  bfHit:"💥 Hit! {name}: {hp} left", bfBlock:"🛡️ {name} hits back! One shield left.", bfLost:"👹 {name} wins this round. It will be back soon…",
  bfWon:"🏆 {name} defeated! +{xp} XP", bfHp:"Boss health", bfShield:"Your shield", bfRematch:"Rematch!",
  bfDouble:"Translate both, separated by a space:"
});
Object.assign(I18N.es, {
  bfIntro:"¡{name} ataca! Dale {hp} golpes antes de que te dé dos. Sin pistas, los acentos cuentan y el reloj corre.",
  bfPhase:"Golpe {n} de {max}. Escudo: {s}.", bfFinal:"¡Golpe final! Traduce las dos frases, una detrás de otra.",
  bfHit:"💥 ¡Golpe! {name}: le quedan {hp}", bfBlock:"🛡️ ¡{name} contraataca! Te queda un escudo.", bfLost:"👹 {name} gana esta vez. Volverá pronto…",
  bfWon:"🏆 ¡{name} derrotado! +{xp} XP", bfHp:"Vida del jefe", bfShield:"Tu escudo", bfRematch:"¡Revancha!",
  bfDouble:"Traduce las dos, separadas por un espacio:"
});
const BOSS_MODES = [1, 2, 3, 4, 5, 6, 8];
const BOSS_SHIELD = 2, BOSS_PHASE_XP = 20, BOSS_KILL_XP = 100;
const bossMax = st => st.mode === 4 ? 3 : (LEVELS.indexOf(st.level) >= 2 ? 4 : 3);
const bossName = st => { const L = GMT[LANG_CODE[st.native]] || GMT.en; return L.bosses[(st.bossFight && st.bossFight.n || 0) % L.bosses.length]; };

/* What has this player already learned? Bosses only use that. */
function bossPool(st){
  const out = new Set((st.srs || []).map(x => x.k));
  if(st.mode === 5) for(const w of (st.seenW || []).slice(-60)) out.add(w);
  else if(st.syllabus && st.done) st.syllabus.forEach((k, i) => { if(st.done[i]) out.add(k); });
  return [...out];
}

/* ---------- Planning: start a fight, keep it going, point it at learned material ---------- */
makePlan = (orig => function(st, rolls, exclude){
  const p = orig(st, rolls, exclude);
  if(!p) return p;
  if(!BOSS_MODES.includes(st.mode)){ p.boss = false; return p; }
  // a fight every ~15 answers (first one after 8); a lost fight comes back after 4
  const due = st.stats.answered >= (st.bossNext || 8), rematch = !!st.bossRematch && due;
  if(!st.bossFight && due && (st.mode === 4 || bossPool(st).length)){
    const max = bossMax(st);
    st.bossFight = {n:Math.floor(rolls.c * 97), hp:max, max, shield:BOSS_SHIELD, hits:0, rematch:!!rematch};
    st.bossRematch = 0;
  }
  if(!st.bossFight){ p.boss = false; return p; }
  p.boss = true; p.bossPhase = st.bossFight.hits;
  if(st.mode !== 4){
    const pool = bossPool(st);
    if(pool.length){
      const key = pool[Math.floor(((rolls.s || 0) * 7919 + st.bossFight.hits * 31) % pool.length)];
      Object.assign(p, st.mode === 5 ? {kind:"vocab", key, swarm:false} : {kind:"srs", key});
      p.bossAlt = pool.length > 1 ? pool[(pool.indexOf(key) + 1 + Math.floor((rolls.g || 0) * (pool.length - 1))) % pool.length] : null;
    }
  }
  return p;
})(makePlan);

/* ---------- Results: hits, shield, win or lose ---------- */
applyResult = (orig => function(st, correct, plan){
  st.bossJust = "";
  orig(st, correct, plan);
  const f = st.bossFight;
  if(!f || !plan || !plan.boss) return;
  if(correct){ f.hp--; f.hits++; st.bossJust = f.hp <= 0 ? "won" : "hit"; }
  else { f.shield--; st.bossJust = f.shield <= 0 ? "lost" : "block"; }
  if(st.bossJust === "won"){ st.bossFight = null; st.bossKills = (st.bossKills || 0) + 1; st.bossLastName = f.n; st.bossNext = st.stats.answered + 15; st.bossRematch = 0; }
  if(st.bossJust === "lost"){ st.bossFight = null; st.bossNext = st.stats.answered + 4; st.bossRematch = 1; st.bossLastName = f.n; }
  if(st.bossJust !== "won" && st.bossJust !== "lost") st.bossLastName = f.n;
})(applyResult);

/* ---------- Generation: no peeking, strict accents, a double final blow ---------- */
function bossCombine(a, b){
  const A = a.acc.flatMap(expand).slice(0, 12), B = b.acc.flatMap(expand).slice(0, 10), out = [];
  for(const x of A) for(const y of B){ out.push(x + " " + y); if(out.length >= 120) return out; }
  return out;
}
generate = (orig => function(st, plan){
  const res = orig(st, plan);
  if(!plan || !plan.boss || !st.bossFight || !res || !res.challenge) return res;
  const f = st.bossFight, name = bossName(st), L = GMT[LANG_CODE[st.native]] || GMT.en;
  let ch = res.challenge;
  const last = f.hp === 1 && st.mode !== 4 && st.mode !== 5 && plan.bossAlt;
  if(last){
    // Final blow: two learned sentences at once, both native → target
    let a = ch;
    for(let i = 0; i < 6 && a.game !== "Classic Mine"; i++) a = orig(st, plan).challenge;
    let b = null;
    for(let i = 0; i < 8; i++){ const r = orig(st, Object.assign({}, plan, {key:plan.bossAlt})); if(r && r.challenge && r.challenge.game === "Classic Mine" && r.challenge.target !== a.target){ b = r.challenge; break; } }
    if(a.game === "Classic Mine" && b){
      ch = Object.assign({}, a, {target:a.target + "  ➕  " + b.target, acc:bossCombine(a, b), answerKey:a.answerKey + " " + b.answerKey, double:true,
        parts:[{acc:a.acc, key:a.answerKey}, {acc:b.acc, key:b.answerKey}],
        why:(a.why || "") + "\n\n" + (b.why || ""), cw:[]});
      ch.task = `👹 ${name}: ${t("bfFinal")}`;
    }
  }
  ch.boss = name; ch.strict = true; ch.hint = "";
  if(!ch.double){
    let tk = String(ch.task || "");
    for(const b of L.bosses){ const pre = "👹 " + b + " " + L.bossTask + " "; if(tk.startsWith(pre)){ tk = tk.slice(pre.length); break; } }
    ch.task = `👹 ${name}: ` + tk;
  }
  res.challenge = ch;
  res.lesson = {title:"👹 " + name + (f.rematch ? " · " + t("bfRematch") : ""), body: f.hits === 0 ? t("bfIntro", {name, hp:f.max}) : t("bfPhase", {n:f.hits + 1, max:f.max, s:"🛡️".repeat(f.shield)}), words:[]};
  res.spotlight = null;
  return res;
})(generate);

gradeLocal = (orig => function(st, ch, answer, force){
  const g = ch && ch.strict && st && st.mode !== 3 ? Object.assign({}, st, {mode:3}) : st;
  // Final blow: try every split point and grade each sentence against its own answers,
  // so any valid wording of either sentence counts (the combined list is only a sample)
  if(ch && ch.double && Array.isArray(ch.parts) && ch.parts.length === 2 && typeof answer === "string" && answer.trim()){
    const ws = answer.replace(/[➕+]/g, " ").replace(/\s+/g, " ").trim().split(" ");
    for(let i = 1; i < ws.length; i++){
      const one = (k, txt) => orig(g, Object.assign({}, ch, {acc:ch.parts[k].acc, answerKey:ch.parts[k].key, double:false, parts:null}), txt, false);
      if(one(0, ws.slice(0, i).join(" ")).correct && one(1, ws.slice(i).join(" ")).correct){
        const clean = ws.join(" ");
        return orig(g, Object.assign({}, ch, {acc:[clean], double:false, parts:null}), clean, force);
      }
    }
  }
  return orig(g, ch, answer, force);
})(gradeLocal);

/* ---------- Rewards and feedback ---------- */
grantRewards = (orig => function(plan, correct){
  const isBoss = !!(S && plan && plan.boss), adj = isBoss && correct;
  // the old rule paid +50 and counted a kill for any boss answer; now hits pay a little and only the kill counts
  if(adj && S.bossJust !== "won") S.bosses = (S.bosses || 0) - 1;
  const fx = orig(plan, correct);
  if(!isBoss) return fx;
  if(adj){ fx.xp -= 50; S.xp -= 50; }
  fx.boss = false;
  const BL = (GMT[LANG_CODE[S.native]] || GMT.en).bosses, name = BL[(S.bossLastName || 0) % BL.length];
  const just = S.bossJust;
  if(just === "hit"){ fx.xp += BOSS_PHASE_XP; S.xp += BOSS_PHASE_XP; setTimeout(() => toast(t("bfHit", {name, hp:S.bossFight ? S.bossFight.hp : 0}), "boss"), 500); }
  else if(just === "won"){ const x = BOSS_PHASE_XP + BOSS_KILL_XP; fx.xp += x; S.xp += x; setTimeout(() => { confetti(150); toast(t("bfWon", {name, xp:x}), "boss"); }, 900); }
  else if(just === "block"){ setTimeout(() => toast(t("bfBlock", {name}), "boss"), 500); }
  else if(just === "lost"){ setTimeout(() => { Sound.wrong(); toast(t("bfLost", {name}), "boss"); }, 500); }
  for(const b of BADGES) if(!S.badges.includes(b.id) && b.test(S)){ S.badges.push(b.id); fx.badges.push(b); }
  return fx;
})(grantRewards);

/* ---------- The boss bar ---------- */
function renderBossBar(){
  let bar = $("bossBar");
  const f = S && S.status === "playing" && S.current && S.current.plan && S.current.plan.boss ? S.bossFight : null;
  if(!f){ if(bar) bar.hidden = true; return; }
  if(!bar){ bar = document.createElement("div"); bar.id = "bossBar"; bar.className = "bossbar"; $("challengeCard").querySelector(".ch-head").after(bar); }
  bar.hidden = false;
  bar.innerHTML = `<span class="bb-hp" aria-label="${esc(t("bfHp"))}">👹 ${"<i class=\"on\"></i>".repeat(f.hp)}${"<i></i>".repeat(f.max - f.hp)}</span>` +
    `<span class="bb-sh" aria-label="${esc(t("bfShield"))}">${"🛡️".repeat(f.shield)}${"<b>✖</b>".repeat(BOSS_SHIELD - f.shield)}</span>`;
}
renderExtras = (orig => function(fresh){ orig(fresh); renderBossBar(); if(fresh && S && S.current && S.current.challenge && S.current.challenge.double) $("answer").setAttribute("rows", "3"); })(renderExtras);

/* The big "BOSS BATTLE!" fanfare plays once per fight, not on every hit */
bossIntro = (orig => function(){
  const f = S && S.bossFight;
  if(f && (f.hits > 0 || f.shield < BOSS_SHIELD)) return;
  orig();
})(bossIntro);
