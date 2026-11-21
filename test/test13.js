/* Voice & audio quick settings: menu sheet, listening and speaking switches, quiet mode, World Languages respects them */
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; console.log("FAIL", ...a); };
function boot(withVoice){
  const errors = [];
  const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
    beforeParse(w){
      w.__PGM_TEST = true; w.matchMedia = () => ({matches:true, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function(){};
      if(withVoice){
        w.speechSynthesis = {speak(){}, cancel(){}, getVoices(){ return []; }, addEventListener(){}, removeEventListener(){}, speaking:false, pending:false};
        w.SpeechSynthesisUtterance = function(t){ this.text = t; };
        w.SpeechRecognition = w.webkitSpeechRecognition = function(){ this.start = () => {}; this.stop = () => {}; this.abort = () => {}; };
      }
      w.addEventListener("error", e => errors.push(e.error || e.message));
    }});
  dom.errors = errors; return dom;
}
(async () => {
  /* ---------- device with voice ---------- */
  let dom = boot(true), w = dom.window, d = w.document, $ = id => d.getElementById(id);
  await new Promise(r => setTimeout(r, 300));
  const btn = $("menuAudioBtn");
  if(!btn) { console.log("FAIL no menu button"); process.exit(1); }
  if(!/Audio/.test(btn.textContent) || btn.getAttribute("aria-label") !== "Voice & audio") fail("menu button label", btn.textContent);
  btn.click();
  if($("vaSheet").hidden) fail("sheet did not open");
  if($("vaListen").disabled || !$("vaListen").checked) fail("listening switch should be on and enabled");
  if($("vaSpeak").disabled || !$("vaSpeak").checked) fail("speaking switch should be on and enabled");
  // listening off
  $("vaListen").checked = false; $("vaListen").dispatchEvent(new w.Event("change", {bubbles:true}));
  if(w.localStorage.getItem("pgm-echo") !== "off") fail("listening off not saved");
  if($("echoChk").checked) fail("in-game listening switch not synced");
  // speaking off
  $("vaSpeak").checked = false; $("vaSpeak").dispatchEvent(new w.Event("change", {bubbles:true}));
  await new Promise(r => setTimeout(r, 10));
  if(w.localStorage.getItem("pgm-voice") !== "off") fail("speaking off not saved");
  if(d.querySelector("#voiceExRow .voiceChk").checked) fail("in-game voice switch not synced");
  if(!btn.classList.contains("va-off") || !/🔇/.test(btn.textContent)) fail("menu button should show something is off");
  $("vaDone").click();
  if(!$("vaSheet").hidden) fail("sheet did not close");
  // both back on through the in-game switches, the sheet follows
  $("echoChk").checked = true; $("echoChk").dispatchEvent(new w.Event("change", {bubbles:true}));
  const vc = d.querySelector("#voiceExRow .voiceChk"); vc.checked = true; vc.dispatchEvent(new w.Event("change", {bubbles:true}));
  await new Promise(r => setTimeout(r, 10));
  btn.click();
  if(!$("vaListen").checked || !$("vaSpeak").checked) fail("sheet out of sync with in-game switches");
  if(btn.classList.contains("va-off")) fail("menu button still shows off");
  // quiet mode
  $("vaQuiet").click();
  await new Promise(r => setTimeout(r, 400));
  if(w.localStorage.getItem("pgm-echo") !== "off" || w.localStorage.getItem("pgm-voice") !== "off") fail("quiet mode did not turn both off");
  if(!$("vaSheet").hidden) fail("quiet mode should close the sheet");
  // Spanish UI
  const sel = $("uiSel"); sel.value = "es"; sel.dispatchEvent(new w.Event("change", {bubbles:true}));
  await new Promise(r => setTimeout(r, 20));
  if(btn.getAttribute("aria-label") !== "Voz y audio") fail("menu button not translated", btn.getAttribute("aria-label"));
  // 8-bit sound effects are wired up
  const SX = w.__sfx;
  if(!SX) fail("no sfx module");
  else for(const n of ["tap","correct","wrong","heart","combo","levelUp","stageClear","stageFail","star","unlocked","badge","loot","tile","untile","pick","match","bossIntro","bossHit","bossAttack","bossBlock","finalBlow","bossDefeat","page"])
    if(typeof SX.Sound[n] !== "function") fail("missing sound", n); else { try{ SX.Sound[n](1); }catch(e){ fail("sound threw", n, e.message); } }
  if(dom.errors.length) fail("page errors", dom.errors.slice(0, 3).map(String));

  /* ---------- device without voice ---------- */
  dom = boot(false); w = dom.window; d = w.document;
  await new Promise(r => setTimeout(r, 300));
  d.getElementById("menuAudioBtn").click();
  if(!d.getElementById("vaListen").disabled || !d.getElementById("vaSpeak").disabled) fail("switches should be disabled without voice support");
  if(!/Not available|No voice/.test(d.getElementById("vaSheet").textContent)) fail("no explanation when unsupported");
  if(dom.errors.length) fail("page errors (no voice)", dom.errors.slice(0, 3).map(String));

  if(fails){ console.log(fails, "FAILURES"); process.exit(1); }
  console.log("ALL TESTS PASSED");
  process.exit(0);
})();
