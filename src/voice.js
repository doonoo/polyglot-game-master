/* ===================== 🎤 Dictation =====================
   Only where the device can do speech recognition: Chrome/Edge/Safari on the web
   (Web Speech API) or the Android app (phone's own recognizer, via
   @capacitor-community/speech-recognition). Everywhere else it stays hidden.
   A 🎤 button next to the answer box dictates any typed answer.
   (The Speak Up rounds were removed in 2.10.1 and their code in 2.15.) */
Object.assign(I18N.en, {
  vToggle:"🎤 Dictation", vToggleSub:"A 🎤 button to say your answers instead of typing them. Uses your device's speech recognition (may need internet).",
  vMic:"Dictate your answer", vNoSpeech:"I didn't catch that. Tap the mic and try again.",
  vDenied:"Microphone access is blocked, so dictation is off for now. You can allow it in your browser or phone settings.",
  vNet:"Speech recognition needs an internet connection right now.", vErr:"Speech recognition didn't work. You can type your answer instead.",
  kbMic:"Dictate your answer"
});
Object.assign(I18N.es, {
  vToggle:"🎤 Dictado", vToggleSub:"Un botón 🎤 para decir tus respuestas en vez de escribirlas. Usa el reconocimiento de voz de tu dispositivo (puede necesitar internet).",
  vMic:"Dicta tu respuesta", vNoSpeech:"No te entendí. Toca el micrófono e inténtalo otra vez.",
  vDenied:"El micrófono está bloqueado, así que el dictado se desactiva por ahora. Puedes permitirlo en los ajustes del navegador o del teléfono.",
  vNet:"El reconocimiento de voz necesita conexión a internet ahora mismo.", vErr:"El reconocimiento de voz no funcionó. Puedes escribir tu respuesta.",
  kbMic:"Dictar tu respuesta"
});

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

let voiceOn = true, voiceBlocked = false;
try{ voiceOn = localStorage.getItem("pgm-voice") !== "off"; }catch(e){}
const canSpeak = () => voiceOn && !voiceBlocked && VOICE.supported();

/* ---------- UI ---------- */
function voiceEls(){
  if(!$("micBtn")){
    const b = document.createElement("button");
    b.type = "button"; b.id = "micBtn"; b.className = "ghost mic"; b.hidden = true;
    b.textContent = "🎤"; b.setAttribute("aria-label", t("vMic")); b.title = t("vMic");
    const a = $("answer"), wrap = document.createElement("div");
    wrap.className = "answrap"; a.before(wrap); wrap.appendChild(a); wrap.appendChild(b);
  }
}
function voiceUI(){
  voiceEls();
  const mic = $("micBtn"), c = S && S.current, ch = c && c.challenge;
  if(!ch){ mic.hidden = true; return; }
  const textAns = !$("answer").hidden && !(ch.game === "Match Madness") && $("tiles").hidden;
  mic.hidden = !(canSpeak() && textAns);
  document.body.classList.toggle("micok", !mic.hidden);
  if(!mic.hidden){ mic.setAttribute("aria-label", t("vMic")); mic.title = t("vMic"); }
}
renderExtras = wrap("renderExtras", "voice", renderExtras, orig => function(fresh){ orig(fresh); voiceUI(); });

function setListening(on){
  document.body.classList.toggle("listening", on);
  const mic = $("micBtn"); if(mic) mic.classList.toggle("on", on);
}
function voiceErr(code){
  if(code === "busy") return;
  if(code === "denied"){ voiceBlocked = true; toast("🎤 " + t("vDenied")); renderGame(false); voiceRefresh(); return; }
  toast(code === "nospeech" ? t("vNoSpeech") : code === "network" ? t("vNet") : t("vErr"));
}
async function voiceGo(){
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
  const a = $("answer"), add = String(alts[0] || "").trim();
  a.value = (a.value.trim() ? a.value.trim() + " " : "") + add;
  try{ a.focus({preventScroll:true}); a.setSelectionRange(a.value.length, a.value.length); }catch(e){}
}
document.addEventListener("click", e => { if(e.target.closest("#micBtn")) voiceGo(); });
document.addEventListener("keydown", e => {
  if(!e.altKey || e.ctrlKey || e.metaKey || e.code !== "KeyM") return;
  const mic = $("micBtn");
  if(mic && !mic.hidden){ e.preventDefault(); voiceGo(); }
}, true);
if(typeof kbHelpHtml === "function") kbHelpHtml = (orig => function(){
  const h = orig();
  return canSpeak() ? h.replace("<tr><td><kbd>Alt+A E I O U N Y</kbd>", `<tr><td><kbd>Alt+M</kbd></td><td>${esc(t("kbMic"))}</td></tr>$&`) : h;
})(kbHelpHtml);

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
  if(S && S.current && $("game") && !$("game").hidden) voiceUI();
}
document.addEventListener("change", e => {
  if(!e.target.classList || !e.target.classList.contains("voiceChk")) return;
  voiceOn = e.target.checked;
  try{ localStorage.setItem("pgm-voice", voiceOn ? "on" : "off"); }catch(err){}
  if(!voiceOn) VOICE.stop();
  voiceRefresh();
});
voiceRefresh();
