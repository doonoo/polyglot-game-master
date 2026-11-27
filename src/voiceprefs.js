/* ===================== Voice & audio quick settings =====================
   One place, reachable from the main menu, for the 🎤 dictation switch. It drives the
   existing setting (pgm-voice via .voiceChk), so the in-game 🎛️ panel stays in sync.
   (The listening switch and Quiet mode went with the listening / speaking rounds.) */
Object.assign(I18N.en, {va_short:"Audio", va_btn:"Voice & audio", va_title:"Voice & audio",
  va_speak:"Dictation button", va_speakSub:"A 🎤 button to say your answers instead of typing them.", va_speakNA:"Not available on this device.",
  va_note:"You can hear any sentence with 🔊 and dictate answers with 🎤.", va_done:"Done"});
Object.assign(I18N.es, {va_short:"Audio", va_btn:"Voz y audio", va_title:"Voz y audio",
  va_speak:"Botón de dictado", va_speakSub:"Un botón 🎤 para decir tus respuestas en vez de escribirlas.", va_speakNA:"No disponible en este dispositivo.",
  va_note:"Puedes oír cualquier frase con 🔊 y dictar respuestas con 🎤.", va_done:"Listo"});

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
    <label class="varow" id="vaSpeakRow"><span class="txt"><b>🎤 <span id="vaSpeakL"></span></b><small id="vaSpeakS"></small></span><input type="checkbox" id="vaSpeak" class="voiceChk"></label>
    <div class="vabtns"><button class="primary" id="vaDone"></button></div></div>`;
  document.body.appendChild(back);
  // menu button, next to the music chip
  const btn = document.createElement("button");
  btn.className = "chip mus"; btn.id = "menuAudioBtn"; btn.type = "button";
  $("menuMusicBtn").after(btn);
})();

const vaSpeakNA = () => typeof VOICE === "undefined" || !VOICE.supported() || (typeof voiceBlocked !== "undefined" && voiceBlocked);
function vaRefresh(){
  $("vaTitle").textContent = "🔈 " + t("va_title");
  $("vaNote").textContent = t("va_note");
  $("vaSpeakL").textContent = t("va_speak");
  $("vaSpeakS").textContent = vaSpeakNA() ? t("va_speakNA") : t("va_speakSub");
  $("vaDone").textContent = t("va_done");
  $("vaSpeak").checked = !!voiceOn && !vaSpeakNA(); $("vaSpeak").disabled = vaSpeakNA();
  $("vaSpeakRow").classList.toggle("na", vaSpeakNA());
  // the menu chip shows at a glance when something is switched off
  const off = !voiceOn && !vaSpeakNA();
  const b = $("menuAudioBtn");
  b.textContent = (off ? "🔇 " : "🔈 ") + t("va_short");
  b.setAttribute("aria-label", t("va_btn")); b.title = t("va_btn");
  b.classList.toggle("va-off", off);
}
function vaOpen(){ vaRefresh(); $("vaSheet").hidden = false; setTimeout(() => { const f = $("vaSpeak").disabled ? $("vaDone") : $("vaSpeak"); f.focus(); }, 30); }
function vaClose(){ $("vaSheet").hidden = true; vaRefresh(); }
document.addEventListener("click", e => {
  if(e.target.closest("#menuAudioBtn")){ Sound.tap(); return vaOpen(); }
  if(e.target.id === "vaSheet" || e.target.closest("#vaDone")) return vaClose();
});
document.addEventListener("change", e => {
  if(e.target && e.target.classList && e.target.classList.contains("voiceChk")) setTimeout(vaRefresh, 0);
});
document.addEventListener("keydown", e => { if(e.key === "Escape" && !$("vaSheet").hidden) vaClose(); });
applyI18n = (orig => function(){ const r = orig.apply(this, arguments); try{ vaRefresh(); }catch(e){} return r; })(applyI18n);

setTimeout(vaRefresh, 0);
if(window.__PGM_TEST) window.__va = {vaOpen, vaClose, vaRefresh, get voiceOn(){ return voiceOn; }};
