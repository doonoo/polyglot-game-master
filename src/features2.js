/* ===================== Number Cruncher B2 ===================== */
NUMSYL.B2 = [
 {ty:"int",a:1000000,b:999999000,step:1000,en:"Millions with thousands",es:"Millones con miles"},
 {ty:"dec",b:1000,en:"Decimals over 100",es:"Decimales mayores de 100"},
 {ty:"pct",a:1,b:99,dec:1,en:"Interest rates",es:"Tasas de interés"},
 {ty:"price",a:1000,b:999999,en:"Cars and houses",es:"Carros y casas"},
 {ty:"year",a:1001,b:1499,en:"Medieval years",es:"Años medievales"},
 {ty:"frac",en:"Fractions review",es:"Repaso de fracciones"},
 {ty:"math",ops:"+-",b:1000,en:"Math up to 1,000",es:"Cuentas hasta 1,000"},
 {ty:"shop",b:99,change:1,n:3,en:"Bigger receipts",es:"Recibos más grandes"},
 {ty:"time",m:"24",en:"Train timetables",es:"Horarios de tren"},
 {ty:"int",a:100000000,b:999000000,step:1000000,en:"Hundreds of millions",es:"Cientos de millones"},
 {ty:"math",ops:"x/",b:12,en:"Times tables at speed",es:"Tablas a toda velocidad"},
 {ty:"year",a:1500,b:2099,en:"Any year",es:"Cualquier año"},
 {ty:"pct",a:101,b:999,en:"Growth over 100%",es:"Crecimiento de más del 100%"},
 {ty:"price",a:100,b:9999,cents:1,en:"Exact prices",es:"Precios exactos"},
 {ty:"int",a:1,b:999999999,en:"Final boss: any number",es:"Jefe final: cualquier número"}
];

/* ===================== Listening game (Echo Chamber) ===================== */
let echoOn = true;
try{ echoOn = localStorage.getItem("pgm-echo") !== "off"; }catch(e){}
const canEcho = () => echoOn && typeof Narrator !== "undefined" && Narrator.available();
function echoPlay(slow){
  const c = S && S.current; if(!c) return;
  const text = c.challenge.target, lang = LANG_CODE[S.target];
  try{
    const ss = window.speechSynthesis;
    if(ss && window.SpeechSynthesisUtterance){
      ss.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      const v = bestVoice(lang);
      if(v) u.voice = v;
      u.rate = slow ? 0.65 : 1;
      ss.speak(u);
      return;
    }
  }catch(e){}
  Narrator.say([{text, lang}]);
}
$("echoChk").addEventListener("change", () => {
  echoOn = $("echoChk").checked;
  try{ localStorage.setItem("pgm-echo", echoOn ? "on" : "off"); }catch(e){}
});

/* ===================== Match Madness ===================== */
let pairState = null;
const PAIR_DELAY = window.__PGM_TEST ? 0 : 450;
function renderPairs(ch, fresh){
  const box = $("pairs");
  if(!fresh && box.dataset.key === ch.target && pairState) return;
  const left = shuffle(ch.pairs.map((p, i) => ({t:p[0], i}))), right = shuffle(ch.pairs.map((p, i) => ({t:p[1], i})));
  pairState = {sel:null, done:new Set(), miss:0, n:ch.pairs.length};
  box.dataset.key = ch.target;
  let h = "";
  for(let r = 0; r < left.length; r++)
    h += `<button class="pr" data-side="l" data-pi="${left[r].i}">${esc(left[r].t)}</button><button class="pr" data-side="r" data-pi="${right[r].i}">${esc(right[r].t)}</button>`;
  box.innerHTML = h + `<p class="note pmiss" id="pairMiss"></p>`;
}
$("pairs").addEventListener("click", e => {
  const b = e.target.closest(".pr");
  if(!b || !pairState || b.classList.contains("done")) return;
  Sound.unlock();
  const sel = pairState.sel;
  if(!sel || sel.dataset.side === b.dataset.side){
    if(sel) sel.classList.remove("sel");
    b.classList.add("sel"); pairState.sel = b; Sound.tap();
    return;
  }
  sel.classList.remove("sel"); pairState.sel = null;
  if(sel.dataset.pi === b.dataset.pi){
    sel.classList.add("done"); b.classList.add("done");
    pairState.done.add(b.dataset.pi);
    Sound.tap();
    if(pairState.done.size === pairState.n){
      $("answer").value = pairState.miss <= 1 ? "✓" : "✗ " + t("pairMisses", {n:pairState.miss});
      Sound.correct();
      if(PAIR_DELAY) setTimeout(() => submit(false), PAIR_DELAY); else submit(false);
    }
  } else {
    pairState.miss++;
    for(const x of [sel, b]){ x.classList.remove("bad"); void x.offsetWidth; x.classList.add("bad"); }
    Sound.wrong();
    $("pairMiss").textContent = t("pairMisses", {n:pairState.miss});
  }
});

/* ===================== Challenge extras (tiles, listening, pairs) ===================== */
function renderExtras(fresh){
  const tiles = $("tiles"), keys = $("accentKeys"), screen = $("chTarget").parentElement, pairs = $("pairs");
  const ansLabel = document.querySelector('label[for="answer"]');
  const c = S && S.current;
  if(!c){ tiles.hidden = true; keys.hidden = true; pairs.hidden = true; return; }
  const ch = c.challenge, isPairs = ch.game === "Match Madness" && Array.isArray(ch.pairs), ti = isPairs ? null : tileItems(ch);
  pairs.hidden = !isPairs;
  $("answer").hidden = isPairs; ansLabel.hidden = isPairs; $("submitBtn").hidden = isPairs;
  keys.hidden = isPairs || !(ch.al === "es" && S.native !== "Spanish");
  screen.hidden = (!!ti && ch.game !== "Word Duel") || isPairs;
  if(isPairs){ tiles.hidden = true; renderPairs(ch, fresh); }
  else pairState = null;
  if(ch.game === "Echo Chamber"){
    if(canEcho()){
      $("chTarget").innerHTML = `<div class="echo"><button class="echo-btn" data-echo="1">🔊 ${esc(t("playAudio"))}</button><button class="echo-btn slow" data-echo="slow">🐢 ${esc(t("slowAudio"))}</button><button class="echo-skip" data-echoskip="1">🔇 ${esc(t("cantListen"))}</button></div>`;
      if(fresh) setTimeout(() => echoPlay(false), 500);
    } else $("chTarget").textContent = ch.target;
  }
  if(!ti){ tiles.hidden = true; tiles.innerHTML = ""; tiles.dataset.key = ""; return; }
  tiles.hidden = false;
  if(fresh || tiles.dataset.key !== ch.target){
    picked = [];
    tiles.dataset.key = ch.target; tiles.dataset.mode = ti.mode;
    tiles.innerHTML = ti.items.map((w, i) => `<button class="tile" data-i="${i}">${esc(w)}</button>`).join("") +
      (ti.mode !== "pick" ? `<button class="tile undo" data-undo="1" aria-label="${esc(t("undoTile"))}">⌫</button>` : "");
  }
}
$("chTarget").addEventListener("click", e => { const b = e.target.closest("[data-echo]"); if(b){ Sound.unlock(); echoPlay(b.dataset.echo === "slow"); } });

/* ===================== Phrasebook ===================== */
profile.bank = {}; profile.echo = 0; profile.match = 0; profile.conj = 0;
const bankCount = () => Object.keys(profile.bank).length;
function bankAdd(lang, w, m){
  if(!w || !lang) return;
  const k = lang + "|" + w.toLowerCase();
  if(!profile.bank[k]) profile.bank[k] = {w, m:m || "", l:lang, x:0, s:Date.now()};
}
function bankMiss(lang, w, m){
  if(!w) return;
  bankAdd(lang, w, m);
  const e = profile.bank[lang + "|" + w.toLowerCase()]; if(e) e.x++;
}
function recordTurn(prevCh, j){
  if(!S) return;
  const tgt = LANG_CODE[S.target];
  if(prevCh && j && j.correct && !j.gaveUp){
    if(prevCh.game === "Echo Chamber") profile.echo++;
    if(prevCh.game === "Match Madness") profile.match++;
    if(prevCh.k === "c") profile.conj++;
  }
  trackMistake(prevCh, j);
  if(j && Array.isArray(j.struggled) && S.mode !== 4 && S.mode !== 7) for(const w of j.struggled) bankMiss(tgt, w.w, w.m);
  const c = S.current;
  if(c && S.mode !== 4 && S.mode !== 7) for(const w of c.lesson.words) bankAdd(tgt, w.w, w.m);
  saveProfile();
}
let bookFilter = "all";
function openBook(){
  $("menu").hidden = true; $("game").hidden = true; $("over").hidden = true; $("book").hidden = false;
  $("bookSearch").value = "";
  renderBook(); window.scrollTo(0, 0);
}
function bookEntries(){
  const lang = LANG_CODE[setup.target], q = norm($("bookSearch").value || "", "es", false);
  return Object.values(profile.bank).filter(e => e.l === lang && (bookFilter !== "tricky" || e.x > 0) &&
    (!q || norm(e.w + " " + e.m, "es", false).includes(q)))
    .sort((a, b) => bookFilter === "tricky" ? b.x - a.x : a.w.localeCompare(b.w, lang));
}
let bookShown = [];
function renderBook(){
  const lang = LANG_CODE[setup.target], all = Object.values(profile.bank).filter(e => e.l === lang);
  $("bookInfo").textContent = t("bookInfo", {n:all.length, lang:langLabel(setup.target)});
  $("bookChips").innerHTML = ["all", "tricky"].map(f => `<button class="chip ${bookFilter === f ? "on" : ""}" data-bf="${f}">${esc(t(f === "all" ? "bookAll" : "bookTricky"))}</button>`).join("");
  const list = bookEntries();
  bookShown = list.slice(0, 300);
  $("bookList").innerHTML = !all.length ? `<p class="empty">${esc(t("bookEmpty"))}</p>` :
    !list.length ? `<p class="empty">${esc(t("bookNone"))}</p>` :
    bookShown.map((e, i) => `<button class="word bw" data-bw="${i}">${Narrator.available() ? `<span class="say" aria-hidden="true">🔊</span>` : ""}<b>${esc(e.w)}</b><span>${esc(e.m)}</span>${e.x ? `<em class="miss">⚠️ ${e.x}</em>` : ""}</button>`).join("") +
    (list.length > bookShown.length ? `<p class="note">${esc(t("bookMore", {n:bookShown.length, d:list.length}))}</p>` : "");
}
$("bookBtn").addEventListener("click", openBook);
$("bookBack").addEventListener("click", () => { Narrator.stop(); $("book").hidden = true; showMenu(); });
$("bookSearch").addEventListener("input", renderBook);
$("bookChips").addEventListener("click", e => { const b = e.target.closest("[data-bf]"); if(b){ bookFilter = b.dataset.bf; renderBook(); } });
$("bookList").addEventListener("click", e => {
  const b = e.target.closest("[data-bw]"); if(!b) return;
  const en = bookShown[+b.dataset.bw]; if(!en) return;
  const other = en.l === "es" ? "en" : "es";
  Narrator.say([{text:en.w, lang:en.l}].concat(en.m ? [{text:en.m, lang:other}] : []));
});

/* ===================== Backup code: move progress between devices ===================== */
const b64e = s => btoa(unescape(encodeURIComponent(s)));
const b64d = s => decodeURIComponent(escape(atob(s)));
function exportCode(){
  let save = null, ui = null;
  try{ save = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }catch(e){}
  try{ ui = JSON.parse(localStorage.getItem("pgm-ui") || "null"); }catch(e){}
  if(!save && S) save = S;
  return "PGM1:" + b64e(JSON.stringify({s:save, p:profile, u:ui}));
}
function importCode(code){
  code = String(code || "").replace(/\s+/g, "");
  if(!code.startsWith("PGM1:")) return false;
  let d;
  try{ d = JSON.parse(b64d(code.slice(5))); }catch(e){ return false; }
  if(!d || typeof d !== "object" || !d.p || typeof d.p !== "object") return false;
  if(d.s && !(d.s.v === 2 && LANG_CODE[d.s.target] && LANG_CODE[d.s.native])) return false;
  try{
    localStorage.setItem(PROFILE_KEY, JSON.stringify(d.p));
    if(d.s) localStorage.setItem(SAVE_KEY, JSON.stringify(d.s)); else localStorage.removeItem(SAVE_KEY);
    if(d.u && I18N[d.u.code]) localStorage.setItem("pgm-ui", JSON.stringify(d.u));
  }catch(e){}
  for(const k in d.p) if(k in profile && typeof d.p[k] === typeof profile[k]) profile[k] = d.p[k];
  rollDay();
  S = d.s || null;
  if(d.u && I18N[d.u.code]){ setup.native = d.u.name; setup.target = otherLang(d.u.name); setUiLang(d.u.code, d.u.name); }
  refreshContinue(); renderDaily();
  return true;
}
$("exportBtn").addEventListener("click", () => {
  $("backupCode").value = exportCode();
  $("backupMsg").textContent = t("backupMade");
});
$("copyBtn").addEventListener("click", () => {
  const ta = $("backupCode");
  if(!ta.value) ta.value = exportCode();
  const done = () => { $("backupMsg").textContent = t("copied"); };
  try{
    navigator.clipboard.writeText(ta.value).then(done, () => { ta.select(); $("backupMsg").textContent = t("copyFail"); });
  }catch(e){ ta.select(); $("backupMsg").textContent = t("copyFail"); }
});
$("importBtn").addEventListener("click", () => {
  const ok = importCode($("backupCode").value);
  $("backupMsg").textContent = t(ok ? "importOk" : "importBad");
  if(ok){ Sound.unlock(); Sound.levelUp(); toast("💾 " + t("importOk"), "badge"); }
});

/* ===================== Natural voice picking ===================== */
const VOICE_KEY = l => "pgm-voice-" + l;
function voiceScore(v, lang){
  const n = (v.name || "") + " " + (v.voiceURI || ""), vl = (v.lang || "").toLowerCase().replace("_", "-");
  let s = 0;
  if(/natural|neural|online/i.test(n)) s += 100;          // Edge "Online (Natural)" voices
  if(/premium|enhanced|siri/i.test(n)) s += 90;           // Apple downloadable voices
  if(/google/i.test(n)) s += 60;                          // Chrome network voices
  if(v.localService === false) s += 20;
  if(/espeak|compact|eloquence|fred|albert|zarvox/i.test(n)) s -= 60;
  if(lang === "es" && /^es-(us|mx|419)/.test(vl)) s += 8;
  if(lang === "en" && /^en-us/.test(vl)) s += 8;
  if(v.default) s += 1;
  return s;
}
function voicesFor(lang){
  let all = [];
  try{ all = window.speechSynthesis ? window.speechSynthesis.getVoices() || [] : []; }catch(e){}
  return all.filter(v => (v.lang || "").toLowerCase().startsWith(lang)).sort((a, b) => voiceScore(b, lang) - voiceScore(a, lang));
}
function bestVoice(lang){
  lang = String(lang || "").toLowerCase().slice(0, 2);
  const list = voicesFor(lang);
  let pref = "";
  try{ pref = localStorage.getItem(VOICE_KEY(lang)) || ""; }catch(e){}
  return (pref && list.find(v => v.voiceURI === pref)) || list[0] || null;
}
const VOICE_SAMPLE = {es:"Hola, ¿cómo estás? Vamos a aprender juntos.", en:"Hi, how are you? Let's learn together."};
function renderVoices(){
  const row = $("voiceRow"); if(!row) return;
  const ok = typeof Narrator !== "undefined" && Narrator.available();
  row.hidden = !ok; if(!ok) return;
  for(const lang of ["es", "en"]){
    const sel = $("voice-" + lang), list = voicesFor(lang);
    let pref = ""; try{ pref = localStorage.getItem(VOICE_KEY(lang)) || ""; }catch(e){}
    sel.innerHTML = `<option value="">${esc(t("voiceAuto"))}${list[0] ? " · " + esc(list[0].name) : ""}</option>` +
      list.map((v, i) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === pref ? "selected" : ""}>${voiceScore(v, lang) >= 60 ? "⭐ " : ""}${esc(v.name)} (${esc(v.lang)})</option>`).join("");
    sel.disabled = !list.length;
  }
}
function testVoice(lang){
  try{
    const ss = window.speechSynthesis; ss.cancel();
    const u = new SpeechSynthesisUtterance(VOICE_SAMPLE[lang]);
    u.lang = lang; const v = bestVoice(lang); if(v) u.voice = v;
    ss.speak(u);
  }catch(e){}
}
$("voiceRow").addEventListener("change", e => {
  const sel = e.target.closest("select"); if(!sel) return;
  const lang = sel.id.slice(-2);
  try{ if(sel.value) localStorage.setItem(VOICE_KEY(lang), sel.value); else localStorage.removeItem(VOICE_KEY(lang)); }catch(err){}
  testVoice(lang);
});
$("voiceRow").addEventListener("click", e => { const b = e.target.closest("[data-vtest]"); if(b){ Sound.unlock(); testVoice(b.dataset.vtest); } });
try{ if(window.speechSynthesis) window.speechSynthesis.addEventListener("voiceschanged", renderVoices); }catch(e){}

/* ===================== Skip a listening round (no penalty) ===================== */
function skipEcho(){
  const c = S && S.current;
  if(!c || c.challenge.game !== "Echo Chamber" || S.status !== "playing") return;
  Narrator.stop();
  try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){}
  const plan = Object.assign({}, c.plan, {game:"Classic Mine", swarm:false});
  if(S.mode === 5) plan.key = c.plan.key || c.challenge.wk;
  const was = echoOn; echoOn = false;
  let res = null;
  try{ res = generate(Object.assign({}, S, {lastGame:"Echo Chamber"}), plan); }catch(e){}
  finally{ echoOn = was; }
  const ch = res && res.challenge;
  if(!ch || !ch.target) return;
  c.challenge = {game:String(ch.game), boss: plan.boss ? String(ch.boss || "") : "", task:String(ch.task || ""), target:String(ch.target),
    hint: S.mode === 3 ? "" : String(ch.hint || ""), answerKey:String(ch.answerKey || ""), speak:"", acc:ch.acc || [], al:ch.al || "", k:ch.k || "s",
    nn:!!ch.nn, why:String(ch.why || ""), cw:ch.cw || [], wk:ch.wk || "", wm:ch.wm || "", pairs:Array.isArray(ch.pairs) ? ch.pairs : null};
  S.lastGame = c.challenge.game;
  save();
  $("answer").value = "";
  renderGame(true);
  toast("🔇 " + t("echoSkipped"));
}
$("chTarget").addEventListener("click", e => { if(e.target.closest("[data-echoskip]")) skipEcho(); });
