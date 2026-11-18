/* ===================== Deeper lesson banks =====================
   DEEP[lang][level][lesson title] = extra items in the usual lesson format.
   Added on top of each lesson so every round draws from a bigger pool. */
const DEEP = {es:{A1:{}, A2:{}, B1:{}, B2:{}}, en:{A1:{}, A2:{}, B1:{}, B2:{}}};
function deep(lang, lv, packs){ for(const t in packs) DEEP[lang][lv][t] = (DEEP[lang][lv][t] || []).concat(packs[t]); }
const DEEP_T = {es:{}, en:{}};
function deepTricky(lang, packs){ for(const t in packs) DEEP_T[lang][t] = (DEEP_T[lang][t] || []).concat(packs[t]); }
function applyDeep(){
  for(const lang in DEEP_T) for(const t in DEEP_T[lang]){
    let c = null;
    for(const lv in TRICKY[lang] || {}) for(const x of TRICKY[lang][lv]) if(x.t === t) c = x;
    if(!c){ if(typeof console !== "undefined") console.warn("deep: no tricky", lang, t); continue; }
    const seen = new Set(c.it.map(i => i[1]));
    for(const it of DEEP_T[lang][t]) if(!seen.has(it[1])){ c.it.push(it); seen.add(it[1]); }
  }
  for(const lang in DEEP) for(const lv in DEEP[lang]){
    const lessons = (COURSE[lang] || {})[lv] || [];
    for(const t in DEEP[lang][lv]){
      const l = lessons.find(x => x.t === t);
      if(!l){ if(typeof console !== "undefined") console.warn("deep: no lesson", lang, lv, t); continue; }
      const seen = new Set(l.it.map(i => i[1]));
      for(const it of DEEP[lang][lv][t]) if(!seen.has(it[1])){ l.it.push(it); seen.add(it[1]); }
    }
  }
}
