/* ===================== Daily challenge, Fix my mistakes, Stats ===================== */
profile.days = {}; profile.modes = {}; profile.mistakes = []; profile.fixed = 0;
profile.daily = {}; profile.dailyCount = 0; profile.dailyBest = 0;

const gname = g => { const k = "game." + g, v = t(k); return v === k ? g : v; };
const mstat = (a, c) => a ? Math.round(100 * c / a) + "%" : "–";

/* ---------- Tracking ---------- */
function trackDay(correct, forced){
  const d = profile.days[profile.today] = profile.days[profile.today] || {a:0, c:0};
  if(!forced) d.a++;
  if(correct) d.c++;
  const keys = Object.keys(profile.days).sort();
  while(keys.length > 60) delete profile.days[keys.shift()];
}
const mistakeKey = ch => ch.game + "|" + ch.target;
function trackMistake(prevCh, j){
  if(!S || !prevCh || !j) return;
  const m = S.mode, mm = profile.modes[m] = profile.modes[m] || {a:0, c:0};
  if(!j.gaveUp) mm.a++;
  if(j.correct) mm.c++;
  if(prevCh.k === "p") return;
  const key = mistakeKey(prevCh);
  profile.mistakes = profile.mistakes.filter(x => mistakeKey(x.ch) !== key);
  if(!j.correct){
    const ch = {};
    for(const f of ["game","task","target","acc","al","k","nn","answerKey","why","opts","wk","wm"]) if(prevCh[f] !== undefined && prevCh[f] !== null) ch[f] = prevCh[f];
    ch.mode = m;
    profile.mistakes.push({ch, native:S.native, target:S.target, at:Date.now()});
    if(profile.mistakes.length > 150) profile.mistakes.shift();
  }
}

/* ---------- Seeded daily set ---------- */
function seeded(seed){
  let a = seed >>> 0;
  return () => { a = a + 0x6D2B79F5 | 0; let x = Math.imul(a ^ a >>> 15, 1 | a); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
}
function hashStr(s){ let h = 2166136261; for(let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function dailyKey(){ return `${dayStr(new Date())}|${setup.target}|${dailyLevel()}`; }
const dailyLevel = () => LEVELS.includes(setup.level) ? setup.level : "A1";
function buildDaily(){
  const target = setup.target, native = setup.native, level = dailyLevel();
  const orig = Math.random, out = [];
  Math.random = seeded(hashStr(dailyKey()));
  try{
    for(const m of shuffle([1,1,1,7,7,8,8,4,5,5])){
      const st = freshState({mode:m, target, native, level});
      let plan;
      if(m === 5) plan = {kind:"vocab", swarm:true, game:pick(["Classic Mine","Reverse Mine","Syntax Scramble"])};
      else {
        st.syllabus = syllabusFor(st); st.done = st.syllabus.map(() => false);
        const games = gamesFor(st).filter(g => g !== "Match Madness" && !MCG.has(g));
        plan = {kind:"syllabus", idx:Math.floor(Math.random() * st.syllabus.length), game:pick(games)};
      }
      let res = null;
      try{ res = generate(st, plan); }catch(e){}
      const ch = res && res.challenge;
      if(ch && ch.target && ch.k !== "p"){
        const c = {mode:m};
        for(const f of ["game","task","target","acc","al","k","nn","answerKey","why","opts","wk","wm"]) if(ch[f] !== undefined && ch[f] !== null) c[f] = ch[f];
        out.push({ch:c, native, target});
      }
    }
  } finally { Math.random = orig; }
  return out;
}

/* ---------- Quiz runner (daily and mistakes) ---------- */
let Q = null;
function showOnly(id){
  for(const x of ["menu","game","over","book","quiz","statsPage","storiesPage","storyPage","notifyPage"]) if($(x)) $(x).hidden = x !== id;
  window.scrollTo(0, 0);
}
function openQuiz(kind, items, title, meta, intro){
  Q = {kind, items, i:0, marks:[], start:Date.now(), fixed:0, done:false, meta:meta || {}};
  $("quizTitle").textContent = title;
  showOnly("quiz");
  $("quizDone").hidden = true;
  $("quizHome").textContent = t("backMenu");
  if(!items.length){ finishQ(); return; }
  if(intro){
    $("quizCard").hidden = true; $("quizFeedback").hidden = true;
    $("quizProg").textContent = ""; $("quizBar").style.width = "0%";
    $("quizIntro").innerHTML = `<h2>${esc(intro.title)}</h2>${intro.body ? `<div class="note">${md(intro.body)}</div>` : ""}` +
      (intro.words.length ? `<div class="iwords">${intro.words.slice(0, 8).map(w => `<span><b>${esc(canon(w[0]))}</b> · ${esc(canon(w[1]))}</span>`).join("")}</div>` : "") +
      `<button class="primary" id="introGo">${esc(t("start"))}</button>`;
    $("quizIntro").hidden = false;
    return;
  }
  $("quizIntro").hidden = true;
  renderQ();
}
let QP = [];
function renderQTiles(ch){
  const box = $("quizBuild");
  const ti = ch.game === "Syntax Scramble" ? tileItems(ch) : null;
  box.hidden = !ti; QP = [];
  if(!ti){ box.innerHTML = ""; return; }
  box.dataset.mode = ti.mode;
  box.innerHTML = ti.items.map((x, i) => `<button class="tile" type="button" data-bi="${i}">${esc(x)}</button>`).join("") + `<button class="tile undo" type="button" data-bu="1">↩</button>`;
}
function syncBuild(){
  const box = $("quizBuild"), tiles = [...box.querySelectorAll("[data-bi]")];
  tiles.forEach(x => x.disabled = QP.includes(+x.dataset.bi));
  $("quizAnswer").value = QP.map(i => tiles[i].textContent).join(box.dataset.mode === "letters" ? "" : " ");
}
function renderQ(){
  const it = Q.items[Q.i], ch = it.ch;
  $("quizProg").textContent = `${Q.i + 1} / ${Q.items.length}`;
  $("quizBar").style.width = Math.round(100 * Q.i / Q.items.length) + "%";
  $("quizGame").textContent = (GAME_ICO[ch.game] || "🎯") + " " + gname(ch.game);
  $("quizTask").innerHTML = md(String(ch.task || "").replace(/^👹[^!.]*[!.]\s*/, ""));
  $("quizTarget").textContent = ch.game === "Syntax Scramble" && ch.k === "w" ? ch.target.split(" ").join(" · ") : ch.target;
  const opts = ch.game === "Word Duel" && Array.isArray(ch.opts) ? ch.opts : ch.game === "Odd One Out" ? ch.target.split("  ·  ") : null;
  $("quizOpts").hidden = !opts;
  $("quizOpts").innerHTML = opts ? opts.map(o => `<button class="tile" data-qo="${esc(o)}">${esc(o)}</button>`).join("") : "";
  $("quizKeys").hidden = !(ch.al === "es" && it.native !== "Spanish");
  $("quizHint").textContent = ch.hint ? "💡 " + ch.hint : ""; $("quizHint").hidden = !ch.hint;
  renderQTiles(ch);
  $("quizAnswer").value = "";
  $("quizCard").hidden = false; $("quizFeedback").hidden = true;
  try{ $("quizAnswer").focus({preventScroll:true}); }catch(e){}
}
function checkQ(giveUp){
  if(!Q || Q.done) return;
  const it = Q.items[Q.i], ch = it.ch;
  const ans = giveUp ? null : $("quizAnswer").value.trim();
  if(!giveUp && !ans){ $("quizAnswer").focus(); return; }
  Sound.unlock();
  const j = gradeLocal({native:it.native, mode: ch.mode === 8 ? 8 : 1}, ch, ans, false);
  Q.marks.push(j.correct);
  recordAnswer(j.correct, j.correct ? 10 : 0, false);
  if(Q.kind === "mistakes" && j.correct){
    profile.mistakes = profile.mistakes.filter(x => mistakeKey(x.ch) !== mistakeKey(ch));
    profile.fixed++; Q.fixed++;
    if(typeof questAdd === "function") questAdd("fix");
  }
  saveProfile();
  if(j.correct){ Sound.correct(); confetti(40); } else Sound.wrong();
  $("quizVerdict").className = "qverdict " + (j.correct ? "ok" : "bad");
  $("quizVerdict").textContent = (j.correct ? "✓ " : "✕ ") + j.headline;
  $("quizFb").innerHTML = md(j.feedback);
  $("quizNext").textContent = t(Q.i + 1 >= Q.items.length ? "seeResults" : "next");
  $("quizCard").hidden = true; $("quizFeedback").hidden = false;
}
function nextQ(){
  if(!Q) return;
  if(Q.i + 1 < Q.items.length){ Q.i++; renderQ(); return; }
  finishQ();
}
const mmss = ms => { const s = Math.round(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
function shareText(r){
  return `Polyglot Game Master · ${t("daily")} ${r.d}\n${langLabel(r.target)} ${r.level}\n${r.marks.map(m => m ? "🟩" : "🟥").join("")} ${r.score}/${r.marks.length} · ${r.time}`;
}
function finishQ(){
  Q.done = true;
  const score = Q.marks.filter(Boolean).length, n = Q.marks.length;
  $("quizBar").style.width = "100%";
  $("quizCard").hidden = true; $("quizFeedback").hidden = true; $("quizDone").hidden = false;
  if(Q.kind === "daily"){
    const r = {key:dailyKey(), d:dayStr(new Date()), target:setup.target, level:dailyLevel(), marks:Q.marks, score, time:mmss(Date.now() - Q.start)};
    profile.daily = r; profile.dailyCount++; profile.dailyBest = Math.max(profile.dailyBest, score);
    saveProfile();
    renderDailyResult(r);
    if(typeof questAdd === "function") questAdd("daily");
    if(score === n){ Sound.levelUp(); confetti(160); }
  } else {
    $("quizScore").textContent = `${score}/${n}`;
    $("quizMarks").textContent = Q.marks.map(m => m ? "🟩" : "🟥").join("");
    $("quizNote").textContent = t("mistakesResult", {f:Q.fixed, n, left:profile.mistakes.length});
    $("shareBox").hidden = true;
  }
}
function renderDailyResult(r){
  $("quizScore").textContent = `${r.score}/${r.marks.length}`;
  $("quizMarks").textContent = r.marks.map(m => m ? "🟩" : "🟥").join("");
  $("quizNote").textContent = t("dailyCome", {lang:langLabel(r.target), lvl:r.level}) + " ⏱ " + r.time;
  $("shareBox").hidden = false;
  $("shareText").value = shareText(r);
  $("shareMsg").textContent = "";
}
function openDaily(){
  const done = profile.daily && profile.daily.key === dailyKey();
  if(done){
    Q = {kind:"daily", done:true, items:[], marks:profile.daily.marks};
    $("quizTitle").textContent = "📅 " + t("daily") + " · " + profile.daily.level;
    showOnly("quiz");
    $("quizProg").textContent = ""; $("quizBar").style.width = "100%";
    $("quizCard").hidden = true; $("quizFeedback").hidden = true; $("quizDone").hidden = false;
    renderDailyResult(profile.daily);
    return;
  }
  const items = buildDaily();
  openQuiz("daily", items, "📅 " + t("daily") + " · " + dailyLevel());
}
function openMistakes(){
  if(!profile.mistakes.length){
    Q = {kind:"mistakes", done:true, items:[], marks:[]};
    $("quizTitle").textContent = "🩹 " + t("fixMistakes");
    showOnly("quiz");
    $("quizProg").textContent = ""; $("quizBar").style.width = "0%";
    $("quizCard").hidden = true; $("quizFeedback").hidden = true; $("quizDone").hidden = false;
    $("quizScore").textContent = "🎉"; $("quizMarks").textContent = ""; $("quizNote").textContent = t("noMistakes"); $("shareBox").hidden = true;
    return;
  }
  const items = shuffle(profile.mistakes).slice(0, 10);
  openQuiz("mistakes", items, "🩹 " + t("fixMistakes"));
}
$("quizSubmit").addEventListener("click", () => checkQ(false));
$("quizSkip").addEventListener("click", () => checkQ(true));
$("quizNext").addEventListener("click", nextQ);
$("quizAnswer").addEventListener("keydown", e => { if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); checkQ(false); } });
$("quizOpts").addEventListener("click", e => {
  const b = e.target.closest("[data-qo]"); if(!b) return;
  Sound.unlock(); Sound.tap();
  $("quizOpts").querySelectorAll(".tile").forEach(x => x.classList.toggle("sel", x === b));
  $("quizAnswer").value = b.dataset.qo;
});
$("quizKeys").innerHTML = "áéíóúñ¿¡".split("").map(c => `<button class="key" type="button" data-k="${c}">${c}</button>`).join("");
$("quizKeys").addEventListener("click", e => {
  const b = e.target.closest(".key"); if(!b) return;
  const a = $("quizAnswer"), s = a.selectionStart == null ? a.value.length : a.selectionStart, en = a.selectionEnd == null ? s : a.selectionEnd;
  a.value = a.value.slice(0, s) + b.dataset.k + a.value.slice(en); a.focus();
  try{ a.setSelectionRange(s + 1, s + 1); }catch(err){}
});
const quizExit = () => { Q = null; showMenu(); };
$("quizBack").addEventListener("click", quizExit);
$("quizHome").addEventListener("click", quizExit);
$("quizIntro").addEventListener("click", e => { if(e.target.closest("#introGo")){ Sound.unlock(); Sound.tap(); $("quizIntro").hidden = true; Q.start = Date.now(); renderQ(); } });
$("quizBuild").addEventListener("click", e => {
  const b = e.target.closest(".tile"); if(!b) return;
  Sound.unlock(); Sound.tap();
  if(b.dataset.bu) QP.pop(); else if(!QP.includes(+b.dataset.bi)) QP.push(+b.dataset.bi);
  syncBuild();
});
$("shareCopy").addEventListener("click", () => {
  const ta = $("shareText");
  try{ navigator.clipboard.writeText(ta.value).then(() => { $("shareMsg").textContent = t("shareCopied"); }, () => { ta.select(); $("shareMsg").textContent = t("copyFail"); }); }
  catch(e){ ta.select(); $("shareMsg").textContent = t("copyFail"); }
});

/* ---------- Stats ---------- */
function openStats(){ showOnly("statsPage"); renderStats(); }
function renderStats(){
  rollDay();
  const acc = profile.answered ? Math.round(100 * profile.correct / profile.answered) + "%" : "–";
  $("stTiles").innerHTML = [
    ["📝", profile.answered.toLocaleString("en-US"), t("stAnswered")], ["🎯", acc, t("stAccuracy")],
    ["🔥", profile.bestStreak, t("stBestStreak")], ["⭐", profile.xp.toLocaleString("en-US"), t("stXp")]
  ].map(([i, v, l]) => `<div class="sttile"><span>${i}</span><b>${esc(String(v))}</b><small>${esc(l)}</small></div>`).join("");
  // last 14 days
  const days = [];
  for(let k = 13; k >= 0; k--){ const d = new Date(); d.setDate(d.getDate() - k); days.push(d); }
  const vals = days.map(d => (profile.days[dayStr(d)] || {c:0}).c), max = Math.max(1, ...vals);
  const wd = UI.code === "es" ? ["D","L","M","X","J","V","S"] : ["S","M","T","W","T","F","S"];
  $("stChart").innerHTML = days.map((d, i) => `<div class="stcol" title="${dayStr(d)}: ${vals[i]}"><i style="height:${Math.round(100 * vals[i] / max)}%"></i><small>${wd[d.getDay()]}</small><em>${vals[i] || ""}</em></div>`).join("");
  // by mode
  const rows = MODES.map(m => ({m, s:profile.modes[m.id] || {a:0, c:0}})).filter(x => x.s.a);
  $("stModes").innerHTML = rows.length ? rows.map(({m, s}) => `<div class="strow"><span>${m.ico} ${esc(t("m" + m.id + "n"))}</span><span class="stbar"><i style="width:${Math.round(100 * s.c / s.a)}%"></i></span><b>${mstat(s.a, s.c)}</b><small>${s.c}/${s.a}</small></div>`).join("") : `<p class="empty">${esc(t("stNone"))}</p>`;
  // tricky words
  const tricky = Object.values(profile.bank).filter(e => e.x > 0).sort((a, b) => b.x - a.x).slice(0, 6);
  $("stTricky").innerHTML = tricky.length ? tricky.map(e => `<div class="strow"><span><b>${esc(e.w)}</b> · ${esc(e.m)}</span><em class="miss">⚠️ ${e.x}</em></div>`).join("") : `<p class="empty">${esc(t("stNone"))}</p>`;
  $("stDaily").textContent = t("stDailyLine", {n:profile.dailyCount, b:profile.dailyBest});
  $("stMist").textContent = t("stMistLine", {w:profile.mistakes.length, f:profile.fixed});
}
$("statsBtn").addEventListener("click", openStats);
$("statsBack").addEventListener("click", () => showMenu());
$("dailyBtn").addEventListener("click", openDaily);
$("mistakesBtn").addEventListener("click", openMistakes);

/* ---------- Menu buttons ---------- */
function updateMenuExtras(){
  const done = profile.daily && profile.daily.key === dailyKey();
  $("dailyBtn").innerHTML = `📅 <span>${esc(t("daily"))}</span>${done ? ` <small>✓ ${profile.daily.score}/10</small>` : ""}`;
  $("mistakesBtn").innerHTML = `🩹 <span>${esc(t("fixMistakes"))}</span>${profile.mistakes.length ? ` <small class="pill">${profile.mistakes.length}</small>` : ""}`;
}
renderDaily = wrap("renderDaily", "features3", renderDaily, orig => function(){ orig(); try{ updateMenuExtras(); }catch(e){} });
