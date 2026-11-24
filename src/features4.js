/* ===================== Story player and daily quests ===================== */
profile.path = {}; profile.mastered = 0; profile.stories = {}; profile.quests = {d:"", list:[]}; profile.questsDone = 0; profile.combo = 0;

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
  {id:"master", g:2}, {id:"story", g:1}, {id:"daily", g:1}, {id:"fix", g:3},
  {id:"conj", g:10}, {id:"tricky", g:8}, {id:"vocab", g:10}, {id:"listen", g:5, ear:1}
];
const QREWARD = 30, QBONUS = 50;
function ensureQuests(){
  rollDay();
  if(profile.quests && profile.quests.d === profile.today && profile.quests.list.length && profile.quests.list.every(q => QUESTS.some(x => x.id === q.id))) return;
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

/* ---------- Stories ---------- */
let SP = null;
const spk = (s, tgt) => Array.isArray(s) ? s[tgt === "es" ? 0 : 1] : s;
// stories for the language being learned (Spanish and English stories have no lang)
function storiesFor(tgt){ return STORIES.filter(s => s.lang ? s.lang === tgt : (tgt === "es" || tgt === "en")); }
function openStories(){ showOnly("storiesPage"); renderStories(); }
function renderStories(){
  const tgt = TL(), nat = NL();
  $("storiesList").innerHTML = storiesFor(tgt).map(s => `<button class="word story ${profile.stories[s.id] ? "sdone" : ""}" data-sid="${s.id}"><span class="sico">${s.ico}</span><span><b>${esc(s.t[tgt])}</b><small>${esc(s.t[nat])} · ${s.lv}</small></span>${profile.stories[s.id] ? `<em>✓</em>` : ""}</button>`).join("");
}
function openStory(id){
  const s = STORIES.find(x => x.id === id); if(!s) return;
  SP = {s, i:0, right:0, total:s.p.filter(p => p.q).length, tgt:TL(), nat:NL(), xp:0};
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
  div.innerHTML = `${who ? `<small class="who">${esc(who)}</small>` : ""}<span class="stext" dir="auto">${esc(text)}</span>${p.r ? `<small class="srom" dir="ltr">${esc(p.r)}</small>` : ""}<button class="say" data-say-line="${esc(text)}" aria-label="${esc(t("listen"))}">🔊</button><span class="str" hidden>${esc(tr)}</span>`;
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
  profile.xp += bonus;
  saveProfile();
  questAdd("story");
  Sound.levelUp(); confetti(100);
  const div = document.createElement("div");
  div.className = "sdone";
  div.innerHTML = `<div class="qscore">${SP.right}/${SP.total}</div><p><b>${esc(t("storyDone"))}</b></p><p class="note">${esc(t("storyScore", {r:SP.right, n:SP.total, x:SP.xp + bonus}))}</p>`;
  $("storyFeed").appendChild(div);
  $("storyBar").style.width = "100%";
  $("storyCtl").innerHTML = `<button class="primary" id="storyDoneBtn">${esc(t("backMenu"))}</button>`;
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
  else if(e.target.closest("#storyDoneBtn")){ SP = null; Narrator.stop(); showMenu(); }
});
$("storyBack").addEventListener("click", () => { SP = null; Narrator.stop(); openStories(); });
$("storiesBtn").addEventListener("click", openStories);
$("storiesBack").addEventListener("click", () => showMenu());
$("storiesList").addEventListener("click", e => { const b = e.target.closest("[data-sid]"); if(b){ Sound.unlock(); openStory(b.dataset.sid); } });

renderDaily = (orig => function(){ orig(); try{ renderQuests(); }catch(e){} })(renderDaily);
