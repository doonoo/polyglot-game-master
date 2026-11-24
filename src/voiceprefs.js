/* ===================== Voice & audio quick settings =====================
   One place, reachable from the main menu, to switch off the
   rounds you can't do right now: listening (Echo Chamber)
   and speaking (Speak Up, 🎤 dictation). Both switches drive the existing settings
   (pgm-echo via #echoChk and pgm-voice via .voiceChk), so the in-game 🎛️ panel stays in sync. */
Object.assign(I18N.en, {va_short:"Audio", va_btn:"Voice & audio", va_title:"Voice & audio", va_listen:"Listening challenges", va_listenSub:"Rounds where you hear a word or sentence and answer.",
  va_speak:"Dictation button", va_speakSub:"A 🎤 button to say your answers instead of typing them.", va_speakNA:"Not available on this device.",
  va_listenNA:"No voice on this device, so there are no listening rounds.",
  va_note:"There are no listening or speaking rounds. You can still hear any sentence with 🔊 and dictate answers with 🎤.",
  va_quiet:"Quiet mode: turn both off", va_done:"Done", va_quietOn:"🤫 Quiet mode on: no listening or speaking rounds"});
Object.assign(I18N.es, {va_short:"Audio", va_btn:"Voz y audio", va_title:"Voz y audio", va_listen:"Retos de escucha", va_listenSub:"Rondas en las que oyes una palabra o frase y respondes.",
  va_speak:"Botón de dictado", va_speakSub:"Un botón 🎤 para decir tus respuestas en vez de escribirlas.", va_speakNA:"No disponible en este dispositivo.",
  va_listenNA:"Este dispositivo no tiene voz, así que no hay rondas de escucha.",
  va_note:"No hay rondas de escucha ni de voz. Puedes oír cualquier frase con 🔊 y dictar respuestas con 🎤.",
  va_quiet:"Modo silencio: apagar los dos", va_done:"Listo", va_quietOn:"🤫 Modo silencio: sin rondas de escucha ni de voz"});

(() => {
  const css = document.createElement("style");
  css.textContent = `
.vaback{position:fixed;inset:0;z-index:20;background:rgba(28,26,51,.45);display:flex;align-items:flex-end;justify-content:center;animation:aFade .2s ease-out}
.vaback[hidden]{display:none}
.vasheet{background:var(--card);width:100%;max-width:520px;border-radius:24px 24px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));box-shadow:0 -10px 40px rgba(0,0,0,.25);animation:vaUp .28s cubic-bezier(.2,.9,.3,1)}
@keyframes vaUp{from{transform:translateY(100%)}to{transform:none}}
.vasheet h2{margin:0 0 6px;font-size:1.35rem}
.vasheet .note{margin:0 0 12px}
.varow{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:2px solid var(--line)}
.varow .txt{flex:1}
.varow b{display:block}
.varow small{display:block;color:var(--muted)}
.varow input{width:24px;height:24px;flex:none}
.varow.na{opacity:.55}
.vabtns{display:grid;gap:8px;margin-top:12px}
.chip.va-off{background:var(--red-soft);border-color:var(--red)}
`;
  document.head.appendChild(css);
  const back = document.createElement("div");
  back.className = "vaback"; back.id = "vaSheet"; back.hidden = true;
  back.innerHTML = `<div class="vasheet" role="dialog" aria-modal="true" aria-labelledby="vaTitle">
    <h2 class="display" id="vaTitle"></h2><p class="note" id="vaNote"></p>
    <label class="varow" id="vaListenRow"><span class="txt"><b>🎧 <span id="vaListenL"></span></b><small id="vaListenS"></small></span><input type="checkbox" id="vaListen"></label>
    <label class="varow" id="vaSpeakRow"><span class="txt"><b>🎤 <span id="vaSpeakL"></span></b><small id="vaSpeakS"></small></span><input type="checkbox" id="vaSpeak" class="voiceChk"></label>
    <div class="vabtns"><button class="ghost" id="vaQuiet"></button><button class="primary" id="vaDone"></button></div></div>`;
  document.body.appendChild(back);
  // menu button, next to the music chip
  const btn = document.createElement("button");
  btn.className = "chip mus"; btn.id = "menuAudioBtn"; btn.type = "button";
  $("menuMusicBtn").after(btn);
})();

const vaListenNA = () => typeof Narrator === "undefined" || !Narrator.available();
const vaSpeakNA = () => typeof VOICE === "undefined" || !VOICE.supported() || (typeof voiceBlocked !== "undefined" && voiceBlocked);
function vaRefresh(){
  // 2.10.1: listening and speaking rounds are gone, so only the dictation switch is left
  $("vaListenRow").hidden = true; $("vaQuiet").hidden = true;
  const er = $("echoRow"); if(er) er.hidden = true;
  $("vaTitle").textContent = "🔈 " + t("va_title");
  $("vaNote").textContent = t("va_note");
  $("vaListenL").textContent = t("va_listen");
  $("vaListenS").textContent = vaListenNA() ? t("va_listenNA") : t("va_listenSub");
  $("vaSpeakL").textContent = t("va_speak");
  $("vaSpeakS").textContent = vaSpeakNA() ? t("va_speakNA") : t("va_speakSub");
  $("vaQuiet").textContent = "🤫 " + t("va_quiet");
  $("vaDone").textContent = t("va_done");
  $("vaListen").checked = !!echoOn && !vaListenNA(); $("vaListen").disabled = vaListenNA();
  $("vaSpeak").checked = !!voiceOn && !vaSpeakNA(); $("vaSpeak").disabled = vaSpeakNA();
  $("vaListenRow").classList.toggle("na", vaListenNA());
  $("vaSpeakRow").classList.toggle("na", vaSpeakNA());
  // the menu chip shows at a glance when something is switched off
  const off = !voiceOn && !vaSpeakNA();
  const b = $("menuAudioBtn");
  b.textContent = (off ? "🔇 " : "🔈 ") + t("va_short");
  b.setAttribute("aria-label", t("va_btn")); b.title = t("va_btn");
  b.classList.toggle("va-off", off);
}
function vaSetListen(on){
  const chk = $("echoChk");
  if(chk){ chk.checked = on; chk.dispatchEvent(new Event("change", {bubbles:true})); }
  else { echoOn = on; try{ localStorage.setItem("pgm-echo", on ? "on" : "off"); }catch(e){} }
}
function vaSetSpeak(on){
  const chk = $("vaSpeak"); chk.checked = on;
  chk.dispatchEvent(new Event("change", {bubbles:true}));   // voice.js listens for .voiceChk changes
}
function vaOpen(){ vaRefresh(); $("vaSheet").hidden = false; setTimeout(() => { const f = $("vaSpeak").disabled ? $("vaDone") : $("vaSpeak"); f.focus(); }, 30); }
function vaClose(){ $("vaSheet").hidden = true; vaRefresh(); }
document.addEventListener("click", e => {
  if(e.target.closest("#menuAudioBtn")){ Sound.tap(); return vaOpen(); }
  if(e.target.id === "vaSheet" || e.target.closest("#vaDone")) return vaClose();
  if(e.target.closest("#vaQuiet")){
    if(!vaListenNA()) vaSetListen(false);
    if(!vaSpeakNA()) vaSetSpeak(false);
    vaRefresh(); toast(t("va_quietOn")); setTimeout(vaClose, 350);
  }
});
document.addEventListener("change", e => {
  if(e.target && e.target.id === "vaListen") vaSetListen(e.target.checked);
  if(e.target && (e.target.id === "echoChk" || (e.target.classList && e.target.classList.contains("voiceChk")))) setTimeout(vaRefresh, 0);
});
document.addEventListener("keydown", e => { if(e.key === "Escape" && !$("vaSheet").hidden) vaClose(); });
applyI18n = (orig => function(){ const r = orig.apply(this, arguments); try{ vaRefresh(); }catch(e){} return r; })(applyI18n);

setTimeout(vaRefresh, 0);
if(window.__PGM_TEST) window.__va = {vaOpen, vaClose, vaRefresh, get echoOn(){ return echoOn; }, get voiceOn(){ return voiceOn; }};
