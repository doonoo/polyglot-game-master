/* ===================== More languages in the main game =====================
   French, Portuguese, Mandarin Chinese and Arabic as full courses next to Spanish and English,
   always taught through English. Their content lives in lang_*.js (WL.<code> packs) and is
   turned here into ordinary CEFR lessons, so Practice, Level Select, Survivor, bosses, the
   daily challenge and mistake review all work the same way.
   Mandarin and Arabic: answers can be tapped from word tiles (with pinyin / transliteration
   under each tile) or typed in pinyin / transliteration; Chinese ignores spaces and tones
   when typed, Arabic ignores short-vowel marks. Arabic is laid out right to left. */
var WL = WL || {};
const XL = ["fr", "pt", "zh", "ar"];
const XL_NAME = {fr:"French", pt:"Portuguese", zh:"Mandarin Chinese", ar:"Arabic"};
const XL_BY_NAME = {French:"fr", Portuguese:"pt", "Mandarin Chinese":"zh", Arabic:"ar"};
const XL_MODES = [1, 2, 3, 4, 5, 6, 7, 8, 9];     // every mode now has content in the new languages (langmodes.js)
const XL_AUTO_WRONG = new Set();                  // Error Hunter slips made by swapping two words (not real learner mistakes)
const XL_ROM = {};                                // target sentence or word -> romanization
const XL_TOKROM = {zh:{}, ar:{}};                 // single word -> romanization
const XL_TOKENS = {};                             // every word in a course, for tile distractors
Object.assign(LN.en, {French:"French", Portuguese:"Portuguese", "Mandarin Chinese":"Mandarin Chinese", Arabic:"Arabic"});
Object.assign(LN.es, {French:"francés", Portuguese:"portugués", "Mandarin Chinese":"chino mandarín", Arabic:"árabe"});
Object.assign(I18N.en, {xl_onlyEn:"Taught through English", xl_soon:"Not available in {lang} yet", xl_modesNote:"{lang} is taught through English.",
  xl_storiesNA:"Stories are in Spanish and English for now."});
Object.assign(I18N.es, {xl_onlyEn:"Se enseña en inglés", xl_soon:"Aún no está disponible en {lang}", xl_modesNote:"{lang} se enseña a través del inglés.",
  xl_storiesNA:"Por ahora las historias están en español e inglés."});

const xlCode = name => XL_BY_NAME[name] || null;
const xlIs = name => !!xlCode(name);
const xlKey = s => String(s).replace(/[.,!?¿¡;:。，！？、،؟"«»“”…]/g, "").replace(/\s+/g, " ").trim();
const xlSpace = s => String(s).replace(/([㐀-鿿，。])\s+(?=[㐀-鿿，。])/g, "$1");

/* ---------- packs -> lessons ---------- */
(() => {
  const PUN = /[.,!?¿¡;:。，！？、،؟"«»“”…]/g;
  const toks = s => String(s).split(/\s+/).map(x => x.replace(PUN, "")).filter(Boolean);
  const GRAMMAR = /Me and you|Everyday verbs|Daily routine|past/i;
  for(const code of XL){
    const P = WL[code]; if(!P) continue;
    const course = {}, all = new Set();
    P.units.forEach(u => {
      const lv = u.lv || "A1";
      const unitWords = new Set(u.w.map(w => w[0]));
      const it = u.s.map(([en, tgt, rom, planted]) => {
        const disp = /[|[\]()]/.test(tgt) ? canon(tgt) : tgt;   // a pattern with alternatives: words come from its first reading
        const tk = toks(disp);
        tk.forEach(x => all.add(x));
        if(rom){
          const rk = String(rom).split(/ +/).map(x => x.replace(PUN, ""));
          XL_ROM[xlKey(tgt)] = rom.replace(/ /g, " ");
          tk.forEach((x, i) => { if(rk[i]) XL_TOKROM[code][x] = rk[i].replace(/ /g, " "); });
        }
        // the cloze word: a word taught in this unit if there is one, else the longest word
        let cz = tk.find(x => unitWords.has(x)) || tk.slice().sort((a, b) => b.length - a.length)[0];
        // Mandarin and Arabic also accept the romanization typed with plain letters
        let pat = tgt.replace(/\s*[.!?。！？]$/, "");
        if(rom) pat += "|" + rom.replace(/ /g, " ").replace(/[.!?]$/, "");
        // a word-order slip for Error Hunter: two neighbouring words swapped
        let wrong = planted || null;
        if(!wrong && tk.length >= 3){
          const i = Math.max(0, Math.floor(tk.length / 2) - 1), w2 = tk.slice(); [w2[i], w2[i + 1]] = [w2[i + 1], w2[i]];
          if(w2.join(" ").toLowerCase() !== tk.join(" ").toLowerCase()){ wrong = w2.join(" "); XL_AUTO_WRONG.add(wrong); }
        }
        return wrong ? [en, pat, cz, wrong] : [en, pat, cz];
      });
      u.w.forEach(([t, en, r]) => { if(r){ XL_ROM[t] = r; if(!/\s/.test(t)) XL_TOKROM[code][t] = r; } });
      (course[lv] = course[lv] || []).push({
        t:u.t, k:GRAMMAR.test(u.t) ? "g" : /Greetings/.test(u.t) ? "f" : "t", b:u.b, ico:u.ico,
        w:u.w.map(([t, en, r]) => [r ? `${t} (${r})` : t, en]), it, xl:code
      });
    });
    COURSE[code] = course;
    XL_TOKENS[code] = [...all];
    LANGS.push(XL_NAME[code]);
  }
})();

/* ---------- menu: who can learn what ---------- */
const XL_NATIVES = ["English", "Spanish"];
fillLangSelects = function(){
  const tgt = setup.target, nat = setup.native;
  $("targetSel").innerHTML = LANGS.map(l => `<option value="${esc(l)}" ${l === tgt ? "selected" : ""}>${esc(langLabel(l))}</option>`).join("");
  $("nativeSel").innerHTML = XL_NATIVES.map(l => `<option value="${esc(l)}" ${l === nat ? "selected" : ""} ${xlIs(tgt) && l !== "English" ? "disabled" : ""}>${esc(langLabel(l))}</option>`).join("");
  $("uiSel").innerHTML = UI_LANGS.map(l => `<option value="${l.code}" ${l.code === UI.code ? "selected" : ""}>${l.label}</option>`).join("");
  $("nativeSel").title = xlIs(tgt) ? t("xl_onlyEn") : "";
};
renderMenu = (orig => function(){
  const r = orig.apply(this, arguments);
  const x = xlIs(setup.target);
  if(x && !XL_MODES.includes(setup.mode)){ setup.mode = 1; return renderMenu(); }
  document.querySelectorAll("#modes [data-mode]").forEach(b => {
    const off = x && !XL_MODES.includes(+b.dataset.mode);
    b.disabled = off; b.classList.toggle("xl-off", off);
    b.title = off ? t("xl_soon", {lang:LN[LANG_CODE[setup.native] || "en"][setup.target]}) : "";
  });
  let note = $("xlNote");
  if(!note){ note = document.createElement("p"); note.id = "xlNote"; note.className = "note"; $("modes").after(note); }
  note.hidden = !x;
  if(x) note.textContent = "🌍 " + t("xl_modesNote", {lang:LN[LANG_CODE[setup.native] || "en"][setup.target]});
  const sb = $("storiesBtn"); if(sb){ const none = x && !storiesFor(LANG_CODE[setup.target]).length; sb.disabled = none; sb.title = none ? t("xl_storiesNA") : ""; }
  return r;
})(renderMenu);
startNew = (orig => function(){
  if(xlIs(setup.target)){ setup.native = "English"; if(!XL_MODES.includes(setup.mode)) setup.mode = 1; }
  return orig.apply(this, arguments);
})(startNew);
document.addEventListener("change", e => {
  if(e.target && e.target.id === "targetSel" && xlIs(e.target.value)){ setup.target = e.target.value; setup.native = "English"; }
}, true);

mixSources = (orig => function(st){ return xlIs(st.target) ? [] : orig.apply(this, arguments); })(mixSources);

/* ---------- grading: spaces, tones and vowel marks don't count ---------- */
norm = (orig => function(s, lang, strict){
  if(lang === "zh") return deacc(orig(s, lang, false)).replace(/[\s，。！？、]/g, "");
  if(lang === "ar") return orig(String(s).replace(/[ً-ْٰʾʿ]/g, ""), lang, false).replace(/[ʿʾ'’]/g, "").replace(/\s+/g, " ").trim();
  return orig.apply(this, arguments);
})(norm);

/* ---------- tiles: tap the words instead of typing a new script ---------- */
const xlShuf = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function xlExtra(code, not, n){
  const pool = (XL_TOKENS[code] || []).filter(x => !not.includes(x));
  return xlShuf(pool).slice(0, n);
}
tileItems = (orig => function(ch){
  const base = orig.apply(this, arguments);
  if(base || !ch || !(ch.al === "zh" || ch.al === "ar")) return base;
  const first = canon(ch.acc[ch.game === "Cloze Combat" ? 1 : 0]);
  if(ch.game === "Classic Mine" || ch.game === "Echo Chamber" || ch.game === "Error Hunter"){
    const words = first.split(" ");
    const items = xlShuf(words.concat(xlExtra(ch.al, words, Math.min(3, Math.max(2, 7 - words.length)))));
    return {mode:"words", items, keepScreen:true};
  }
  if(ch.game === "Cloze Combat"){
    const cz = ch.acc[0];
    return {mode:"pick", items:xlShuf([cz].concat(xlExtra(ch.al, [cz], 3))), keepScreen:true};
  }
  return base;
})(tileItems);
renderExtras = (orig => function(fresh){
  const r = orig.apply(this, arguments);
  try{ xlDecorate(); }catch(e){}
  return r;
})(renderExtras);
function xlDecorate(){
  const c = S && S.current, code = S && xlCode(S.target);
  const tiles = $("tiles");
  tiles.dir = code === "ar" ? "rtl" : "ltr";
  if(!c || !code) return;
  const ch = c.challenge, ti = tileItems(ch);
  if(ti && ti.keepScreen) $("chTarget").parentElement.hidden = false;
  // pinyin / transliteration under each tile
  if(code === "zh" || code === "ar") tiles.querySelectorAll(".tile[data-i]").forEach(b => { const r = XL_TOKROM[code][b.textContent]; if(r) b.dataset.r = r; else delete b.dataset.r; });
  // Chinese is written without spaces
  const tgtEl = $("chTarget");
  if(code === "zh" && ch.game !== "Syntax Scramble") tgtEl.childNodes.forEach(n => { if(n.nodeType === 3) n.textContent = xlSpace(n.textContent); });
  tgtEl.dir = code === "ar" && ch.al === "ar" ? (ch.k === "c" && ch.game === "Verb Forge" ? "ltr" : "rtl") : "auto";
  if((code === "zh" || code === "ar") && ch.game === "Reverse Mine" && !tgtEl.querySelector(".xlrom")){
    const r = XL_ROM[xlKey(ch.target)];
    if(r){ const s = document.createElement("div"); s.className = "xlrom"; s.textContent = r; s.dir = "ltr"; tgtEl.appendChild(s); }
  }
  // answer card: show the answer the way it is written, plus how to read it
  const jc = $("judgeCard");
  if(jc && !jc.hidden){
    jc.querySelectorAll(".ans > div").forEach(d => { if(code === "zh") d.childNodes.forEach(n => { if(n.nodeType === 3) n.textContent = xlSpace(n.textContent); }); });
    const best = jc.querySelectorAll(".ans > div")[jc.querySelectorAll(".ans > div").length - 1];
    if(best && (code === "zh" || code === "ar") && !jc.querySelector(".xlrom")){
      const key = xlKey(ch.answerKey || "");
      const r = XL_ROM[key];
      if(r && ch.al === code){ const s = document.createElement("div"); s.className = "xlrom"; s.textContent = r; s.dir = "ltr"; best.after(s); }
    }
    if(code === "ar") jc.querySelectorAll(".ans > div").forEach(d => d.dir = "auto");
  }
}
(() => {
  const css = document.createElement("style");
  css.textContent = `
.tile[data-r]::after{content:attr(data-r);display:block;font-size:.68em;font-weight:500;color:var(--violet);margin-top:2px}
.xlrom{font-size:.85rem;color:var(--violet);margin-top:4px;font-weight:500}
.mode.xl-off{opacity:.4;filter:grayscale(.8)}
.mode.xl-off:hover{transform:none}
#tiles[dir=rtl]{direction:rtl}
#answer{unicode-bidi:plaintext}
`;
  document.head.appendChild(css);
  $("answer").dir = "auto";
})();

/* ---------- each language plays its own tune ---------- */
syncMood = (orig => function(){
  const r = orig.apply(this, arguments);
  try{
    const code = S && xlCode(S.target), g = $("game");
    if(code && g && !g.hidden && WL[code] && WL[code].music && S.mode !== 3 && !(S.current && S.current.plan && S.current.plan.boss) && S.clock !== "attack") Music.setMood(WL[code].music);
  }catch(e){}
  return r;
})(syncMood);
setTimeout(() => { try{ fillLangSelects(); renderMenu(); }catch(e){} }, 0);
if(window.__PGM_TEST) window.__xl = {XL, XL_ROM, XL_TOKROM, XL_TOKENS, XL_AUTO_WRONG, xlSpace, xlCode};
