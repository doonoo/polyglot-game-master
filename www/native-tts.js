/* Android/iOS app only: the system WebView has no working speechSynthesis, so this
   provides one backed by the phone's own text-to-speech engine
   (@capacitor-community/text-to-speech). In a normal browser it does nothing. */
(function(){
  const C = window.Capacitor;
  if(!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  const TTS = (C.Plugins && C.Plugins.TextToSpeech) || (C.registerPlugin && C.registerPlugin("TextToSpeech"));
  if(!TTS) return;
  let voices = [], queue = [], busy = false, gen = 0;
  const listeners = {};
  const fire = type => { (listeners[type] || []).forEach(f => { try{ f({type}); }catch(e){} }); const h = synth["on" + type]; if(h) try{ h({type}); }catch(e){} };
  function Utterance(text){ this.text = String(text || ""); this.lang = ""; this.voice = null; this.rate = 1; this.pitch = 1; this.volume = 1; this.onend = this.onerror = this.onstart = null; }
  function call(u, k){ const f = u["on" + k]; if(f) try{ f({type:k, utterance:u}); }catch(e){} }
  async function pump(){
    if(busy || !queue.length) return;
    busy = true; synth.speaking = true;
    const u = queue.shift(), my = gen;
    const o = {text:u.text, lang:(u.voice && u.voice.lang) || u.lang || "en-US", rate:u.rate || 1, pitch:u.pitch || 1, volume:u.volume == null ? 1 : u.volume, category:"playback"};
    if(u.voice && u.voice._i != null) o.voice = u.voice._i;
    call(u, "start");
    try{ await TTS.speak(o); if(my === gen) call(u, "end"); }
    catch(e){ if(my === gen) call(u, "error"); }
    busy = false; synth.speaking = queue.length > 0;
    if(my === gen) pump();
  }
  const synth = {
    speaking:false, pending:false, paused:false, onvoiceschanged:null,
    speak(u){ queue.push(u); pump(); },
    cancel(){ gen++; queue = []; busy = false; synth.speaking = false; TTS.stop().catch(() => {}); },
    pause(){}, resume(){},
    getVoices(){ return voices; },
    addEventListener(t, f){ (listeners[t] = listeners[t] || []).push(f); },
    removeEventListener(t, f){ listeners[t] = (listeners[t] || []).filter(x => x !== f); }
  };
  try{ Object.defineProperty(window, "speechSynthesis", {value:synth, configurable:true}); }catch(e){ window.speechSynthesis = synth; }
  window.SpeechSynthesisUtterance = Utterance;
  TTS.getSupportedVoices().then(r => {
    voices = ((r && r.voices) || []).map((v, i) => ({name:v.name || v.voiceURI || ("Voice " + i), lang:String(v.lang || "").replace("_", "-"), voiceURI:v.voiceURI || v.name || String(i), localService:v.localService !== false, default:!!v.default, _i:i}));
    fire("voiceschanged");
  }).catch(() => {});
})();
