/* ===================== Voice exercises (v2.0) =====================
   Only where the device can do speech recognition: Chrome/Edge/Safari on the web
   (Web Speech API) or the Android app (phone's own recognizer, via
   @capacitor-community/speech-recognition). Everywhere else it stays hidden.
   - "Speak Up": read a sentence out loud, or hear it in your language and say it.
   - 🎤 button next to the answer box: dictate any typed answer. */
Object.assign(I18N.en, {
  "game.Speak Up":"Speak Up", vToggle:"🎤 Dictation", vToggleSub:"A 🎤 button to say your answers instead of typing them. Uses your device's speech recognition (may need internet).",
  vTap:"Tap and speak", vListening:"Listening… speak now", vStop:"Tap to stop", vHear:"Hear it", vSkip:"Can't talk now", vMic:"Dictate your answer",
  vHeard:"I heard: {s}", vClose:"Close enough! I heard: {s}", vNoSpeech:"I didn't catch that. Tap the mic and try again.",
  vDenied:"Microphone access is blocked, so voice exercises are off for now. You can allow it in your browser or phone settings.",
  vNet:"Speech recognition needs an internet connection right now.", vErr:"Speech recognition didn't work. You can type your answer instead.",
  vSkipped:"No problem, here's a typing round instead.", kbMic:"Speak (voice exercises)"
});
Object.assign(I18N.es, {
  "game.Speak Up":"¡Habla!", vToggle:"🎤 Dictado", vToggleSub:"Un botón 🎤 para decir tus respuestas en vez de escribirlas. Usa el reconocimiento de voz de tu dispositivo (puede necesitar internet).",
  vTap:"Toca y habla", vListening:"Escuchando… habla ahora", vStop:"Toca para parar", vHear:"Escuchar", vSkip:"No puedo hablar ahora", vMic:"Dicta tu respuesta",
  vHeard:"Escuché: {s}", vClose:"¡Casi perfecto! Escuché: {s}", vNoSpeech:"No te entendí. Toca el micrófono e inténtalo otra vez.",
  vDenied:"El micrófono está bloqueado, así que los ejercicios de voz se desactivan por ahora. Puedes permitirlo en los ajustes del navegador o del teléfono.",
  vNet:"El reconocimiento de voz necesita conexión a internet ahora mismo.", vErr:"El reconocimiento de voz no funcionó. Puedes escribir tu respuesta.",
  vSkipped:"Sin problema, aquí tienes una ronda escrita.", kbMic:"Hablar (ejercicios de voz)"
});
GAME_ICO["Speak Up"] = "🎤";
const VTASK = {
  en:{read:T => `Read this out loud in ${T}:`, talk:T => `Say this out loud in ${T}:`},
  es:{read:T => `Lee esto en voz alta en ${T}:`, talk:T => `Dilo en voz alta en ${T}:`}
};

const VOICE = (() => {
  const C = window.Capacitor;
  const native = !!(C && C.isNativePlatform && C.isNativePlatform());
  let plug = null;
  if(native){ try{ plug = (C.Plugins && C.Plugins.SpeechRecognition) || (C.registerPlugin && C.registerPlugin("SpeechRecognition")); }catch(e){} }
  const WebSR = native ? null : (window.SpeechRecognition || window.webkitSpeechRecognition || null);
  let ok = !!(plug || WebSR), busy = false, rec = null;
  if(plug) Promise.resolve().then(() => plug.available()).then(r => { ok = !!(r && r.available); voiceRefresh(); }).catch(() => { ok = false; voiceRefresh(); });
  function locale(code){
    const mine = (navigator.languages || [navigator.language || ""]).find(l => l && l.toLowerCase().startsWith(code + "-"));
    return mine || (code === "es" ? "es-MX" : "en-US");
  }
  async function listenNative(code){
    let p = await plug.checkPermissions().catch(() => ({}));
    if(!p || p.speechRecognition !== "granted") p = await plug.requestPermissions().catch(() => ({}));
    if(!p || p.speechRecognition !== "granted") throw {code:"denied"};
    let r;
    try{ r = await plug.start({language:locale(code), maxResults:5, partialResults:false, popup:false}); }
    catch(e){ throw {code: /permission/i.test(String(e && e.message)) ? "denied" : "nospeech"}; }
    const m = ((r && r.matches) || []).filter(Boolean);
    if(!m.length) throw {code:"nospeech"};
    return m;
  }
  function listenWeb(code){
    return new Promise((resolve, reject) => {
      const r = new WebSR(); rec = r;
      r.lang = locale(code); r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
      let got = null, err = null;
      r.onresult = e => { const res = e.results[0]; got = []; for(let i = 0; i < res.length; i++) if(res[i].transcript) got.push(res[i].transcript); };
      r.onerror = e => { err = e.error || "error"; };
      r.onend = () => {
        rec = null;
        if(got && got.length) resolve(got);
        else reject({code: err === "not-allowed" || err === "service-not-allowed" ? "denied" : !err || err === "no-speech" || err === "aborted" ? "nospeech" : err === "network" ? "network" : "error"});
      };
      try{ r.start(); }catch(e){ rec = null; reject({code:"error"}); }
    });
  }
  async function listen(code){
    if(busy) throw {code:"busy"};
    busy = true;
    try{ return plug ? await listenNative(code) : await listenWeb(code); }
    finally{ busy = false; }
  }
  function stop(){ try{ if(rec) rec.stop(); }catch(e){} try{ if(plug && busy) plug.stop().catch(() => {}); }catch(e){} }
  return {supported:() => ok, listen, stop, busy:() => busy, locale, native};
})();

let voiceOn = true, voiceBlocked = false, voiceSuppress = false;
try{ voiceOn = localStorage.getItem("pgm-voice") !== "off"; }catch(e){}
const canSpeak = () => voiceOn && !voiceBlocked && !voiceSuppress && VOICE.supported();
const SPEAK_MODES = new Set([1, 2, 3, 6]);
profile.voice = profile.voice || 0;

/* ---------- Rotation: Speak Up joins the sentence games ---------- */
gamesFor = (orig => function(st){
  // 2.10.1: Speak Up rounds were removed at Emmanuel's request; the 🎤 dictation button stays
  return orig(st).filter(g => g !== "Speak Up");
})(gamesFor);

genSentence = (orig => function(st, plan, c, review, res){
  if(!plan || plan.game !== "Speak Up" || plan.boss || !canSpeak()) return orig(st, plan, c, review, res);
  const out = orig(st, Object.assign({}, plan, {game:"Classic Mine"}), c, review, res);
  const ch = out && out.challenge;
  if(!ch || ch.game !== "Classic Mine") return out;
  const nat = LANG_CODE[st.native], lv = Math.max(0, LEVELS.indexOf(st.level));
  const talk = Math.random() < ([0, 0.3, 0.5, 0.6][lv] ?? 0.6);
  const Tn = LN[nat][st.target], V = VTASK[nat] || VTASK.en;
  ch.game = "Speak Up";
  if(talk) ch.task = V.talk(Tn);
  else { ch.task = V.read(Tn); ch.target = ch.answerKey; ch.hint = ""; }
  if(out._k) out._k = out._k.replace(/^Classic Mine/, "Speak Up");
  return out;
})(genSentence);

/* ---------- Matching what was heard ---------- */
function voiceDigits(s, lang){
  return String(s).replace(/\d+(?:[.,]\d+)?/g, d => {
    const n = Number(d.replace(",", "."));
    if(!Number.isInteger(n) || n < 0 || n > 999999999) return d;
    try{ return lang === "es" ? esNum(n) : enNum(n); }catch(e){ return d; }
  });
}
// Pick the closest transcript; an exact (or, when reading aloud, nearly exact) match
// is submitted as the expected sentence so speech-to-text punctuation/accents don't count against you.
function speakMatch(alts, ch){
  const vars = variantsOf(ch), cands = [];
  for(const a of alts){ cands.push(a); const w = voiceDigits(a, ch.al); if(w !== a) cands.push(w); }
  let best = null;
  for(const a of cands){
    const aw = nrm(a, ch, false).split(" ").filter(Boolean);
    for(const v of vars){
      const vw = nrm(v, ch, false).split(" ").filter(Boolean), d = lev(aw, vw);
      if(!best || d < best.d) best = {d, a, v, n:vw.length};
    }
  }
  const heard = String(alts[0] || "");
  if(!best) return {answer:heard, heard, close:false, exact:false};
  const reading = ch.target === ch.answerKey;
  const tol = reading ? Math.floor(best.n / 6) : 0;
  if(best.d === 0) return {answer:best.v, heard:best.a, close:false, exact:true};
  if(best.d <= tol) return {answer:best.v, heard:best.a, close:true, exact:false};
  return {answer:best.a, heard:best.a, close:false, exact:false};
}

/* ---------- UI ---------- */
function voiceEls(){
  if(!$("speakBox")){
    const box = document.createElement("div");
    box.id = "speakBox"; box.className = "speak"; box.hidden = true;
    $("chTarget").parentElement.after(box);
  }
  if(!$("micBtn")){
    const b = document.createElement("button");
    b.type = "button"; b.id = "micBtn"; b.className = "ghost mic"; b.hidden = true;
    b.textContent = "🎤"; b.setAttribute("aria-label", t("vMic")); b.title = t("vMic");
    const a = $("answer"), wrap = document.createElement("div");
    wrap.className = "answrap"; a.before(wrap); wrap.appendChild(a); wrap.appendChild(b);
  }
}
function isSpeakUp(ch){ return !!(ch && ch.game === "Speak Up" && canSpeak()); }
function voiceUI(fresh){
  voiceEls();
  const box = $("speakBox"), mic = $("micBtn"), c = S && S.current, ch = c && c.challenge;
  if(!ch){ box.hidden = true; mic.hidden = true; return; }
  const sp = isSpeakUp(ch);
  if(ch.game === "Speak Up" && !sp && S.status === "playing"){ setTimeout(() => voiceSkip(true), 0); }
  box.hidden = !sp;
  if(sp && (fresh || box.dataset.key !== ch.target + "|" + ch.task)){
    box.dataset.key = ch.target + "|" + ch.task;
    const reading = ch.target === ch.answerKey;
    box.innerHTML = `<button class="mic-big" type="button" data-vmic="speak"><span class="mic-ico" aria-hidden="true">🎤</span><span class="mic-lbl">${esc(t("vTap"))}</span></button>
      <div class="speak-row">${reading && typeof canEcho === "function" && canEcho() ? `<button class="chip" type="button" data-vhear="1">🔊 ${esc(t("vHear"))}</button>` : ""}<button class="chip" type="button" data-vskip="1">🔇 ${esc(t("vSkip"))}</button></div>
      <p class="note speak-heard" id="speakHeard" aria-live="polite"></p>`;
  }
  const textAns = !$("answer").hidden && !(ch.game === "Match Madness") && $("tiles").hidden;
  mic.hidden = !(canSpeak() && textAns && !sp);
  document.body.classList.toggle("micok", !mic.hidden);
  if(!mic.hidden){ mic.setAttribute("aria-label", t("vMic")); mic.title = t("vMic"); }
  document.body.classList.toggle("speaking", sp);
}
renderExtras = (orig => function(fresh){ orig(fresh); voiceUI(fresh); })(renderExtras);

function setListening(on){
  document.body.classList.toggle("listening", on);
  const big = document.querySelector("#speakBox .mic-lbl");
  if(big) big.textContent = t(on ? "vListening" : "vTap");
  const mic = $("micBtn"); if(mic) mic.classList.toggle("on", on);
}
function voiceSay(msg){ const h = $("speakHeard"); if(h && !$("speakBox").hidden) h.textContent = msg; else toast(msg); }
function voiceErr(code){
  if(code === "busy") return;
  if(code === "denied"){
    voiceBlocked = true; toast("🎤 " + t("vDenied"));
    const c = S && S.current;
    if(c && c.challenge.game === "Speak Up") voiceSkip(true); else renderGame(false);
    voiceRefresh();
    return;
  }
  voiceSay(code === "nospeech" ? t("vNoSpeech") : code === "network" ? t("vNet") : t("vErr"));
}
async function voiceGo(kind){
  const c = S && S.current; if(!c || S.status !== "playing") return;
  if(VOICE.busy()){ VOICE.stop(); return; }
  if($("submitBtn").disabled) return;
  const ch = c.challenge;
  try{ Narrator.stop(); }catch(e){}
  try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){}
  Sound.unlock();
  setListening(true);
  let alts;
  try{ alts = await VOICE.listen(ch.al); }
  catch(e){ setListening(false); if(S && S.current === c) voiceErr(e && e.code); return; }
  setListening(false);
  if(!S || S.current !== c || S.status !== "playing") return;
  if(kind === "speak"){
    const r = speakMatch(alts, ch);
    voiceSay(t(r.close ? "vClose" : "vHeard", {s:r.heard}));
    if(r.close) toast("🎤 " + t("vClose", {s:r.heard}));
    $("answer").value = r.answer;
    submit(false);
  } else {
    const a = $("answer"), add = String(alts[0] || "").trim();
    a.value = (a.value.trim() ? a.value.trim() + " " : "") + add;
    try{ a.focus({preventScroll:true}); a.setSelectionRange(a.value.length, a.value.length); }catch(e){}
  }
}
// Swap a Speak Up round for a typing round (no penalty), like skipping a listening round
function voiceSkip(quiet){
  const c = S && S.current;
  if(!c || c.challenge.game !== "Speak Up" || S.status !== "playing") return;
  VOICE.stop();
  const plan = Object.assign({}, c.plan, {game:"Classic Mine", swarm:false});
  let res = null;
  voiceSuppress = true;
  try{ res = generate(Object.assign({}, S, {lastGame:"Speak Up"}), plan); }catch(e){}
  finally{ voiceSuppress = false; }
  const ch = res && res.challenge;
  if(!ch || !ch.target) return;
  c.challenge = {game:String(ch.game), boss:"", task:String(ch.task || ""), target:String(ch.target),
    hint: S.mode === 3 ? "" : String(ch.hint || ""), answerKey:String(ch.answerKey || ""), speak:"", acc:ch.acc || [], al:ch.al || "", k:ch.k || "s",
    nn:!!ch.nn, why:String(ch.why || ""), cw:ch.cw || [], wk:ch.wk || "", wm:ch.wm || "", pairs:null, opts:Array.isArray(ch.opts) ? ch.opts : null, strict:!!ch.strict, double:!!ch.double, parts:null};
  S.lastGame = c.challenge.game;
  save();
  $("answer").value = "";
  renderGame(true);
  if(!quiet) toast("🔇 " + t("vSkipped"));
}
document.addEventListener("click", e => {
  const m = e.target.closest("[data-vmic]"); if(m){ voiceGo("speak"); return; }
  if(e.target.closest("#micBtn")){ voiceGo("dictate"); return; }
  if(e.target.closest("[data-vhear]")){ Sound.unlock(); echoPlay(false); return; }
  if(e.target.closest("[data-vskip]")) voiceSkip(false);
});
document.addEventListener("keydown", e => {
  if(!e.altKey || e.ctrlKey || e.metaKey || e.code !== "KeyM") return;
  const big = document.querySelector("#speakBox:not([hidden]) [data-vmic]"), mic = $("micBtn");
  if(big){ e.preventDefault(); voiceGo("speak"); }
  else if(mic && !mic.hidden){ e.preventDefault(); voiceGo("dictate"); }
}, true);
if(typeof kbHelpHtml === "function") kbHelpHtml = (orig => function(){
  const h = orig();
  return canSpeak() ? h.replace("<tr><td><kbd>Alt+A E I O U N Y</kbd>", `<tr><td><kbd>Alt+M</kbd></td><td>${esc(t("kbMic"))}</td></tr>$&`) : h;
})(kbHelpHtml);

// Stats: count good spoken answers
recordTurn = (orig => function(prevCh, j){
  if(prevCh && j && j.correct && !j.gaveUp && prevCh.game === "Speak Up") profile.voice = (profile.voice || 0) + 1;
  return orig(prevCh, j);
})(recordTurn);

/* ---------- Settings toggle (only shown where voice works) ---------- */
(() => {
  const row = document.createElement("label");
  row.className = "srow"; row.id = "voiceExRow";
  row.innerHTML = `<span>🎤 <span data-i18n="vToggle">${esc(t("vToggle"))}</span></span><input type="checkbox" class="voiceChk">`;
  row.title = t("vToggleSub");
  $("settingsPanel").appendChild(row);
})();
function voiceRefresh(){
  const row = $("voiceExRow"); if(!row) return;
  row.hidden = !VOICE.supported() || voiceBlocked;
  document.querySelectorAll(".voiceChk").forEach(x => x.checked = voiceOn);
  if(S && S.current && $("game") && !$("game").hidden) voiceUI(false);
}
document.addEventListener("change", e => {
  if(!e.target.classList || !e.target.classList.contains("voiceChk")) return;
  voiceOn = e.target.checked;
  try{ localStorage.setItem("pgm-voice", voiceOn ? "on" : "off"); }catch(err){}
  if(!voiceOn){ VOICE.stop(); const c = S && S.current; if(c && c.challenge.game === "Speak Up") voiceSkip(true); }
  voiceRefresh();
});
voiceRefresh();
