/* ===================== Typo allowance =====================
   A small slip in a typed answer still counts, except in Survivor, Tricky Pairs, boss
   fights and Custom games with strict accents on.
   Rules (Spanish, English, French, Portuguese answers):
   - same number of words as an accepted answer; 1 word may be off (2 in answers of 6+ words);
   - each off word is 4+ letters and 1 letter off (2 for words of 8+ letters: a missing,
     extra, wrong or swapped letter);
   - the typed word must not be a real word (hablo → habla is grammar, not a typo), so it is
     checked against a lexicon built from all course content and verb tables;
   - the typed word must not appear in the question itself (Error Hunter: leaving the
     mistake in is not a typo).
   Conjugation drills and letter-scramble rounds are about spelling, so they stay exact. */
Object.assign(GMT.en, {typo:"Counted! Small typo, here's the spelling:"});
Object.assign(GMT.es, {typo:"¡Vale! Pequeño error de escritura, así se escribe:"});
const TYPO_LANGS = new Set(["es", "en", "fr", "pt"]);
const TYPO_LEX = {}, TYPO_BAD = {};
function typoLex(al){
  if(TYPO_LEX[al]) return TYPO_LEX[al];
  const set = new Set(), add = (s, lang) => { if(lang !== al || !s) return; for(const w of norm(String(s).replace(/[()[\]{}|/]/g, " "), al, false).split(" ")) if(w) set.add(w); };
  const NAT = {es:"en", en:"es"};
  try{
    for(const code of Object.keys(COURSE)) for(const lv of Object.keys(COURSE[code] || {})) for(const L of (COURSE[code][lv] || [])){
      const nat = NAT[code] || "en";
      for(const it of (L.it || [])){
        if(it[3]) typoBadAdd(code, it[3]);
        add(it[1], code);
        add(it[0], nat);
        if(it[2]) add(it[2], code);
        if(it[4]) for(const o of it[4]) add(o, code);
      }
      for(const w of (L.w || [])){ add(w[0], code); add(w[1], nat); }
      if(L.o) for(const o of L.o) add(o, code);
    }
  }catch(e){}
  try{ for(const lv of Object.keys(VLIST)) for(const e of VLIST[lv]){ add(e.es, "es"); add(e.en, "en"); } }catch(e){}
  try{
    if(al === "es") for(const inf of Object.keys(ESV)) for(const ten of Object.keys(CT_NAME.es)) for(let p = 0; p < 5; p++){ try{ add(esForm(inf, ten, p)[0], "es"); }catch(e){} }
    if(al === "en") for(const inf of Object.keys(ENV)) for(const ten of Object.keys(CT_NAME.en)) for(let p = 0; p < 5; p++){ try{ for(const f of enForm(inf, ten, p, "")) add(f, "en"); }catch(e){} }
  }catch(e){}
  try{
    if(typeof TRICKY !== "undefined") for(const code of Object.keys(TRICKY)) for(const lv of Object.keys(TRICKY[code] || {})) for(const c of TRICKY[code][lv]){
      for(const it of (c.it || [])){ if(it[3]) typoBadAdd(code, it[3]); add(it[1], code); add(it[0], NAT[code] || "en"); if(it[4]) for(const o of it[4]) add(o, code); }
      if(c.o) for(const o of c.o) add(o, code);
    }
  }catch(e){}
  return TYPO_LEX[al] = set;
}
// words from the planted mistakes (Error Hunter): typing one of those is the mistake itself
function typoBadAdd(code, s){ const set = TYPO_BAD[code] = TYPO_BAD[code] || new Set(); for(const w of norm(String(s).replace(/^~/, "").replace(/[()[\]{}|/]/g, " "), code, false).split(" ")) if(w) set.add(w); }
function typoDist(a, b){ return lev([...a], [...b]) - ([...a].length === [...b].length && typoSwap(a, b) ? 1 : 0); }
function typoSwap(a, b){   // two neighbouring letters traded places counts as one slip
  const x = [...a], y = [...b]; if(x.length !== y.length) return false;
  const d = x.map((c, i) => c !== y[i] ? i : -1).filter(i => i >= 0);
  return d.length === 2 && d[1] === d[0] + 1 && x[d[0]] === y[d[1]] && x[d[1]] === y[d[0]];
}
function typoMatch(st, ch, answer){
  if(!answer || !TYPO_LANGS.has(ch.al) || !(ch.k === "s" || ch.k === "w" || ch.k === "n")) return null;
  if(st.mode === 3 || st.mode === 8 || ch.boss || ch.strict || (st.custom && st.custom.strict)) return null;
  if(ch.game === "Syntax Scramble" && ch.k === "w") return null;
  const a = nrm(answer, ch, false).split(" ").filter(Boolean);
  if(!a.length) return null;
  const inQ = new Set(nrm(String(ch.target || ""), ch, false).split(" "));
  const lex = typoLex(ch.al);
  for(const v of variantsOf(ch)){
    const b = nrm(v, ch, false).split(" ").filter(Boolean);
    if(b.length !== a.length) continue;
    const diff = b.map((w, i) => w !== a[i] ? i : -1).filter(i => i >= 0);
    if(!diff.length || diff.length > (b.length >= 6 ? 2 : 1)) continue;
    const fine = diff.every(i => {
      const want = b[i], got = a[i], n = [...want].length;
      if(n < 4 || /\d/.test(want)) return false;
      if(typoDist(got, want) > (n >= 8 ? 2 : 1)) return false;
      // a slip in the last two letters is usually grammar (gender, plural, verb ending), not a typo
      let pre = 0; const gw = [...got], ww = [...want]; while(pre < gw.length && pre < ww.length && gw[pre] === ww[pre]) pre++;
      if(pre >= n - 2) return false;
      return !lex.has(got) && !inQ.has(got) && !(TYPO_BAD[ch.al] && TYPO_BAD[ch.al].has(got));
    });
    if(fine) return v;
  }
  return null;
}
gradeLocal = wrap("gradeLocal", "typo", gradeLocal, orig => function(st, ch, answer, force){
  const j = orig.apply(this, arguments);
  try{
    if(j.correct || answer === null || !st || !ch) return j;
    const v = typoMatch(st, ch, answer);
    if(!v) return j;
    const L = GMT[LANG_CODE[st.native]] || GMT.en;
    const isCloze = ch.game === "Cloze Combat" || ch.game === "Word Duel";
    const best = ch.k === "s" ? tidy(v) : v;
    return Object.assign({}, j, {correct:true, typo:true, headline:pick(L.ok), feedback:`${L.typo} ${boldDiff(best, answer, ch, false)}`,
      answer:isCloze ? ch.answerKey : best, struggled:[]});
  }catch(e){ return j; }
});
if(window.__PGM_TEST) window.__typo = {typoMatch, typoLex};
