/* ===================== Learning path, story player, daily quests ===================== */
profile.path = {}; profile.stories = {}; profile.quests = {d:"", list:[]}; profile.questsDone = 0; profile.combo = 0;

const TL = () => LANG_CODE[setup.target] || "es";
const NL = () => LANG_CODE[setup.native] || "en";
function compactCh(ch, mode){
  const c = {mode};
  for(const f of ["game","task","target","acc","al","k","nn","answerKey","why","opts","wk","wm","hint"]) if(ch[f] !== undefined && ch[f] !== null) c[f] = ch[f];
  return c;
}

/* ---------- Daily quests ---------- */
const QUESTS = [
  {id:"correct", g:20, core:1}, {id:"xp", g:150, core:1}, {id:"combo", g:5, core:1},
  {id:"lesson", g:2}, {id:"perfect", g:1}, {id:"story", g:1}, {id:"daily", g:1}, {id:"fix", g:3},
  {id:"conj", g:10}, {id:"tricky", g:8}, {id:"vocab", g:10}, {id:"listen", g:5, ear:1}
];
const QREWARD = 30, QBONUS = 50;
function ensureQuests(){
  rollDay();
  if(profile.quests && profile.quests.d === profile.today && profile.quests.list.length) return;
  const orig = Math.random;
  Math.random = seeded(hashStr(profile.today + "|quests"));
  let list;
  try{
    const core = pick(QUESTS.filter(q => q.core));
    const rest = shuffle(QUESTS.filter(q => !q.core && (!q.ear || canEcho()))).slice(0, 2);
    list = [core].concat(rest).map(q => ({id:q.id, g:q.g, n:0, done:false}));
  } finally { Math.random = orig; }
  profile.quests = {d:profile.today, list, bonus:false};
}
function questAdd(id, amount, absolute){
  ensureQuests();
  let changed = false;
  for(const q of profile.quests.list){
    if(q.id !== id || q.done) continue;
    q.n = absolute ? Math.max(q.n, amount) : q.n + (amount == null ? 1 : amount);
    changed = true;
    if(q.n >= q.g){
      q.n = q.g; q.done = true; profile.questsDone++;
      profile.xp += QREWARD;
      setTimeout(() => { try{ Sound.loot(); }catch(e){} toast("🎁 " + t("questDone", {x:QREWARD}), "badge"); }, 900);
    }
  }
  if(changed && !profile.quests.bonus && profile.quests.list.every(q => q.done)){
    profile.quests.bonus = true; profile.xp += QBONUS;
    setTimeout(() => { try{ Sound.levelUp(); }catch(e){} confetti(140); toast("🏆 " + t("questsAll", {x:QBONUS}), "badge"); }, 1800);
  }
  if(changed){ saveProfile(); renderQuests(); }
}
function renderQuests(){
  const el = $("questCard"); if(!el) return;
  ensureQuests();
  el.innerHTML = `<div class="qtitle"><b>🎯 ${esc(t("questsTitle"))}</b><small>${esc(t("questsReset"))}</small></div>` +
    profile.quests.list.map(q => `<div class="quest ${q.done ? "done" : ""}"><span class="qi">${q.done ? "✅" : "🎁"}</span><span class="qt">${esc(t("q_" + q.id, {g:q.g}))}<span class="bar"><i style="width:${Math.round(100 * q.n / q.g)}%"></i></span></span><b>${q.n}/${q.g}</b></div>`).join("");
}
// hooks into existing tracking
recordAnswer = (orig => function(correct, xp, forced){
  orig(correct, xp, forced);
  if(forced) return;
  profile.combo = correct ? profile.combo + 1 : 0;
  if(correct){ questAdd("correct"); questAdd("combo", profile.combo, true); }
  if(xp > 0) questAdd("xp", xp);
})(recordAnswer);
recordTurn = (orig => function(prevCh, j){
  orig(prevCh, j);
  if(!prevCh || !j || !j.correct || j.gaveUp || !S) return;
  if(prevCh.k === "c") questAdd("conj");
  if(S.mode === 8) questAdd("tricky");
  if(S.mode === 5) questAdd("vocab");
  if(prevCh.game === "Echo Chamber") questAdd("listen");
})(recordTurn);

/* ---------- Learning path ---------- */
function pathUnits(tgt){
  return LEVELS.map((lv, u) => {
    const lessons = (COURSE[tgt][lv] || []).map((c, i) => ({key:`${lv}:L${i}`, type:"lesson", idx:i, title:c.t}));
    const sts = STORIES.filter(s => s.lv === lv);
    const nodes = [];
    lessons.forEach((n, i) => { nodes.push(n); if(sts.length && (i === 4 || i === 9)){ const s = sts.shift(); nodes.push({key:`${lv}:S:${s.id}`, type:"story", id:s.id, title:s.t[tgt]}); } });
    for(const s of sts) nodes.push({key:`${lv}:S:${s.id}`, type:"story", id:s.id, title:s.t[tgt]});
    nodes.push({key:`${lv}:T`, type:"test", title:t("unitTest")});
    return {lv, u, nodes};
  });
}
const pathProg = tgt => profile.path[tgt] = profile.path[tgt] || {};
function pathFlat(tgt){ return pathUnits(tgt).flatMap(u => u.nodes.map(n => Object.assign({lv:u.lv, u:u.u}, n))); }
function pathState(tgt){
  const flat = pathFlat(tgt), P = pathProg(tgt);
  let cur = -1;
  flat.forEach((n, i) => {
    n.done = !!P[n.key]; n.gold = P[n.key] === 2;
    n.open = i === 0 || !!P[flat[i - 1].key] || n.done;
    if(cur < 0 && n.open && !n.done) cur = i;
  });
  if(cur >= 0) flat[cur].cur = true;
  return flat;
}
const ZIG = [0, 46, 72, 46, 0, -46, -72, -46];
function openPath(){ showOnly("pathPage"); renderPath(); const c = document.querySelector(".pnode.cur"); if(c) c.scrollIntoView({block:"center"}); }
function renderPath(){
  const tgt = TL(), flat = pathState(tgt), units = pathUnits(tgt);
  const done = flat.filter(n => n.done).length;
  $("pathSub").textContent = t("pathSub", {lang:langLabel(setup.target), d:done, n:flat.length});
  let i = 0, h = "";
  for(const u of units){
    const un = flat.filter(n => n.lv === u.lv), ud = un.filter(n => n.done).length;
    h += `<div class="punit lv-${u.lv}"><small>${esc(t("unit", {n:u.u + 1}))} · ${u.lv}</small><b>${esc(t("u_" + u.lv))}</b><span>${ud}/${un.length}</span></div>`;
    u.nodes.forEach((n0, k) => {
      const n = flat[i++];
      const ico = n.type === "story" ? (STORIES.find(s => s.id === n.id) || {}).ico || "📚" : n.type === "test" ? "🏆" : n.gold ? "👑" : n.done ? "⭐" : "📘";
      const cls = ["pnode", n.type, n.done ? "done" : "", n.gold ? "gold" : "", n.cur ? "cur" : "", n.open ? "" : "lock"].join(" ");
      h += `<div class="${cls}" style="--x:${ZIG[k % ZIG.length]}px">${n.cur ? `<span class="pstart">${esc(t("start"))}</span>` : ""}<button class="pc" data-pk="${esc(n.key)}" aria-label="${esc(n.title)}">${n.open || n.type === "test" ? ico : "🔒"}</button><small>${esc(n.title)}</small></div>`;
    });
  }
  $("pathUnits").innerHTML = h;
}
function pathSheet(key){
  const tgt = TL(), flat = pathState(tgt), n = flat.find(x => x.key === key);
  if(!n) return;
  let info = "", btns = "";
  if(n.type === "lesson"){
    info = t("lessonInfo", {i:n.idx + 1});
    btns = n.open ? `<button class="primary" data-pa="lesson">${esc(t(n.done ? "practiceAgain" : "startLesson"))}</button>` : `<p class="note">${esc(t("locked"))}</p>`;
  } else if(n.type === "story"){
    const s = STORIES.find(x => x.id === n.id);
    info = t("storyInfo", {q:s.p.filter(p => p.q).length});
    btns = n.open ? `<button class="primary" data-pa="story">${esc(t("readStory"))}</button>` : `<p class="note">${esc(t("locked"))}</p>`;
  } else {
    info = n.open ? t("testInfo") : t("jumpInfo");
    btns = `<button class="primary" data-pa="test">${esc(t(n.open ? "startTest" : "jumpHere"))}</button>`;
  }
  $("pathSheet").innerHTML = `<div class="sheetbox"><small>${esc(n.lv)}</small><h2>${esc(n.title)}</h2><p class="note">${esc(info)}</p>${btns}<button class="ghost" data-pa="close">${esc(t("close"))}</button></div>`;
  $("pathSheet").dataset.key = key;
  $("pathSheet").hidden = false;
}
function lessonItems(tgt, lv, idxs, count){
  const target = tgt === "es" ? "Spanish" : "English", native = tgt === "es" ? "English" : "Spanish";
  const st = freshState({mode:1, target, native, level:lv});
  st.syllabus = syllabusFor(st); st.done = st.syllabus.map(() => false);
  const was = echoOn, out = [], games = ["Classic Mine","Reverse Mine","Syntax Scramble","Cloze Combat","Error Hunter","Classic Mine"];
  echoOn = false;
  try{
    for(let k = 0; k < count * 3 && out.length < count; k++){
      const idx = idxs[out.length % idxs.length];
      let res = null;
      try{ res = generate(st, {kind:"syllabus", idx, game:games[(out.length + k) % games.length]}); }catch(e){}
      const ch = res && res.challenge;
      if(!ch || !ch.target || out.some(x => x.ch.target === ch.target)) continue;
      st.recentK = (st.recentK || []).concat(res._k || []).slice(-12); st.lastGame = ch.game;
      out.push({ch:compactCh(ch, 1), native, target});
    }
  } finally { echoOn = was; }
  return out;
}
function startPathNode(key){
  const tgt = TL(), n = pathState(tgt).find(x => x.key === key);
  $("pathSheet").hidden = true;
  if(!n) return;
  if(n.type === "story"){ openStory(n.id, true); return; }
  if(n.type === "lesson"){
    const c = COURSE[tgt][n.lv][n.idx];
    openQuiz("lesson", lessonItems(tgt, n.lv, [n.idx], 6), "📘 " + c.t, {path:true, tgt, key, type:"lesson"}, {title:c.t, body:c.b, words:c.w || []});
    return;
  }
  const all = (COURSE[tgt][n.lv] || []).map((_, i) => i);
  openQuiz("test", lessonItems(tgt, n.lv, shuffle(all), 10), "🏆 " + t("unitTest") + " · " + n.lv, {path:true, tgt, key, type:"test", lv:n.lv});
}
function pathFinish(score, n){
  const m = Q.meta, P = pathProg(m.tgt);
  let pass, note;
  if(m.type === "lesson"){
    pass = score >= Math.ceil(n * 2 / 3);
    if(pass){
      P[m.key] = Math.max(P[m.key] || 0, score === n ? 2 : 1);
      questAdd("lesson"); if(score === n) questAdd("perfect");
    }
    note = pass ? t(score === n ? "pathPerfect" : "pathPassed") : t("pathRetry");
  } else {
    pass = score >= Math.ceil(n * 0.8);
    if(pass){
      const upto = LEVELS.indexOf(m.lv);
      for(const x of pathFlat(m.tgt)) if(LEVELS.indexOf(x.lv) <= upto && !P[x.key]) P[x.key] = 1;
    }
    note = t(pass ? "testPassed" : "testRetry");
  }
  saveProfile();
  if(pass){ Sound.levelUp(); confetti(score === n ? 160 : 80); } else Sound.wrong();
  $("quizScore").textContent = `${score}/${n}`;
  $("quizMarks").textContent = Q.marks.map(x => x ? "🟩" : "🟥").join("");
  $("quizNote").textContent = note;
  $("shareBox").hidden = true;
  $("quizHome").textContent = t("backPath");
}
$("pathBtn").addEventListener("click", openPath);
$("pathBack").addEventListener("click", () => showMenu());
$("pathUnits").addEventListener("click", e => { const b = e.target.closest("[data-pk]"); if(b){ Sound.unlock(); Sound.tap(); pathSheet(b.dataset.pk); } });
$("pathSheet").addEventListener("click", e => {
  if(e.target === $("pathSheet")){ $("pathSheet").hidden = true; return; }
  const b = e.target.closest("[data-pa]"); if(!b) return;
  if(b.dataset.pa === "close"){ $("pathSheet").hidden = true; return; }
  startPathNode($("pathSheet").dataset.key);
});

/* ---------- Stories ---------- */
let SP = null;
const spk = (s, tgt) => Array.isArray(s) ? s[tgt === "es" ? 0 : 1] : s;
function openStories(){ showOnly("storiesPage"); renderStories(); }
function renderStories(){
  const tgt = TL(), nat = NL();
  $("storiesList").innerHTML = STORIES.map(s => `<button class="word story ${profile.stories[s.id] ? "sdone" : ""}" data-sid="${s.id}"><span class="sico">${s.ico}</span><span><b>${esc(s.t[tgt])}</b><small>${esc(s.t[nat])} · ${s.lv}</small></span>${profile.stories[s.id] ? `<em>✓</em>` : ""}</button>`).join("");
}
function openStory(id, fromPath){
  const s = STORIES.find(x => x.id === id); if(!s) return;
  SP = {s, i:0, right:0, total:s.p.filter(p => p.q).length, fromPath:!!fromPath, tgt:TL(), nat:NL(), xp:0};
  showOnly("storyPage");
  $("storyTitle").textContent = s.ico + " " + s.t[SP.tgt];
  $("storyFeed").innerHTML = `<p class="note">${esc(t("tapTranslate"))}</p>`;
  $("storyCtl").innerHTML = "";
  advanceStory();
}
function storyBar(){ $("storyBar").style.width = Math.round(100 * SP.i / SP.s.p.length) + "%"; }
function advanceStory(){
  if(!SP) return;
  if(SP.i >= SP.s.p.length){ finishStory(); return; }
  const p = SP.s.p[SP.i];
  if(p.q){ renderStoryQ(p); storyBar(); return; }
  const who = spk(p.s, SP.tgt), text = p[SP.tgt], tr = p[SP.nat];
  const div = document.createElement("div");
  div.className = "sline " + (who ? "talk" : "narr");
  div.innerHTML = `${who ? `<small class="who">${esc(who)}</small>` : ""}<span class="stext">${esc(text)}</span><button class="say" data-say-line="${esc(text)}" aria-label="${esc(t("listen"))}">🔊</button><span class="str" hidden>${esc(tr)}</span>`;
  $("storyFeed").appendChild(div);
  if(typeof autoRead !== "undefined" && autoRead) Narrator.say([{text, lang:SP.tgt}]);
  SP.i++; storyBar();
  $("storyCtl").innerHTML = `<button class="primary" id="storyNext">${esc(t(SP.i >= SP.s.p.length ? "finish" : "continue"))}</button>`;
  div.scrollIntoView({block:"nearest"});
}
function renderStoryQ(p){
  const lang = p.ol === "t" ? SP.tgt : SP.nat;
  const opts = shuffle(p.o.map((o, k) => ({k, txt:o[lang]})));
  const div = document.createElement("div");
  div.className = "sq";
  div.innerHTML = `<b>❓ ${esc(p.q[SP.nat])}</b>` + opts.map(o => `<button class="sopt" data-k="${o.k}">${esc(o.txt)}</button>`).join("");
  $("storyFeed").appendChild(div);
  $("storyCtl").innerHTML = "";
  div.scrollIntoView({block:"nearest"});
}
function answerStoryQ(btn){
  const box = btn.closest(".sq"); if(!box || box.dataset.done) return;
  box.dataset.done = "1";
  const p = SP.s.p[SP.i], ok = +btn.dataset.k === p.a;
  box.querySelectorAll(".sopt").forEach(b => { b.disabled = true; if(+b.dataset.k === p.a) b.classList.add("right"); });
  if(!ok) btn.classList.add("wrong");
  if(ok){ SP.right++; SP.xp += 10; Sound.correct(); } else Sound.wrong();
  recordAnswer(ok, ok ? 10 : 0, false);
  SP.i++; storyBar();
  $("storyCtl").innerHTML = `<button class="primary" id="storyNext">${esc(t(SP.i >= SP.s.p.length ? "finish" : "continue"))}</button>`;
}
function finishStory(){
  const s = SP.s, bonus = 20;
  profile.stories[s.id] = true;
  const P = pathProg(SP.tgt); P[`${s.lv}:S:${s.id}`] = Math.max(P[`${s.lv}:S:${s.id}`] || 0, 1);
  profile.xp += bonus;
  saveProfile();
  questAdd("story");
  Sound.levelUp(); confetti(100);
  const div = document.createElement("div");
  div.className = "sdone";
  div.innerHTML = `<div class="qscore">${SP.right}/${SP.total}</div><p><b>${esc(t("storyDone"))}</b></p><p class="note">${esc(t("storyScore", {r:SP.right, n:SP.total, x:SP.xp + bonus}))}</p>`;
  $("storyFeed").appendChild(div);
  $("storyBar").style.width = "100%";
  $("storyCtl").innerHTML = `<button class="primary" id="storyDoneBtn">${esc(t(SP.fromPath ? "backPath" : "backMenu"))}</button>`;
  div.scrollIntoView({block:"nearest"});
  SP.finished = true;
}
$("storyFeed").addEventListener("click", e => {
  const say = e.target.closest("[data-say-line]");
  if(say){ Sound.unlock(); Narrator.say([{text:say.dataset.sayLine, lang:SP.tgt}]); return; }
  const opt = e.target.closest(".sopt");
  if(opt){ answerStoryQ(opt); return; }
  const line = e.target.closest(".sline");
  if(line){ const tr = line.querySelector(".str"); if(tr) tr.hidden = !tr.hidden; }
});
$("storyCtl").addEventListener("click", e => {
  if(e.target.closest("#storyNext")){ Sound.unlock(); Sound.tap(); advanceStory(); }
  else if(e.target.closest("#storyDoneBtn")){ const fp = SP && SP.fromPath; SP = null; Narrator.stop(); if(fp) openPath(); else showMenu(); }
});
$("storyBack").addEventListener("click", () => { const fp = SP && SP.fromPath; SP = null; Narrator.stop(); if(fp) openPath(); else openStories(); });
$("storiesBtn").addEventListener("click", openStories);
$("storiesBack").addEventListener("click", () => showMenu());
$("storiesList").addEventListener("click", e => { const b = e.target.closest("[data-sid]"); if(b){ Sound.unlock(); openStory(b.dataset.sid, false); } });

renderDaily = (orig => function(){ orig(); try{ renderQuests(); }catch(e){} })(renderDaily);
function updatePathBtn(){
  const flat = pathState(TL()), cur = flat.find(n => n.cur);
  $("pathBtnSub").textContent = cur ? t("pathBtn", {x:cur.lv + " · " + cur.title}) : t("pathAllDone");
}
renderDaily = (orig => function(){ orig(); try{ updatePathBtn(); }catch(e){} })(renderDaily);
