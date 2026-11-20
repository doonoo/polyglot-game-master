/* ===================== World Languages =====================
   A separate, self-contained course for languages beyond Spanish and English, always taught
   through English. Packs live in lang_*.js as WL.<code> = {name, self, flag, tts, dir, typing,
   rom, seg, music, units:[{t, ico, b, w:[[target, english, rom?]], s:[[english, target, rom?]]}]}.
   Sentence targets are split into words with spaces (they become tiles); for Chinese (seg:true)
   the spaces are hidden when shown. rom (pinyin / transliteration) has one entry per word.
   Answers feed the shared XP, day streak and daily quests through recordAnswer. */
var WL = WL || {};
Object.assign(I18N.en, {
  wl_title:"World Languages", wl_sub:"Learn through English", wl_back:"Back", wl_units:"{n} of {m} units", wl_start:"Start",
  wl_practice:"Practice", wl_practiceSub:"Review what you've learned", wl_locked:"Finish the unit before to unlock",
  wl_rom:"Show {r}", wl_check:"Check", wl_continue:"Continue", wl_correct:"Correct!", wl_wrong:"Not quite.", wl_answer:"Answer:",
  wl_pick:"How do you say this?", wl_rev:"What does this mean?", wl_listen:"What do you hear?", wl_build:"Translate this sentence",
  wl_fill:"Fill in the blank", wl_match:"Tap the matching pairs", wl_type:"Type this in {lang}", wl_tone:"Which tones are right?",
  wl_read:"How do you read this?", wl_done:"Unit complete!", wl_fail:"Out of hearts", wl_failSub:"Each miss costs a heart. Try again: you'll get it.",
  wl_retry:"Try again", wl_next:"Next unit", wl_xp:"+{n} XP", wl_accents:"Right! Watch the accents: {a}", wl_new:"NEW",
  wl_comingSoon:"More units coming soon", wl_tip:"Tip", wl_hear:"Listen", wl_skip:"Can't listen now",
  wl_level:"Level {lv}", wl_boss:"Boss", wl_bossLocked:"Finish the units before the boss", wl_bossGate:"Beat the boss to unlock",
  wl_bossRules:"A test of units {a}–{b}. No {r}, no hints. You have 2 hearts; every right answer hits the boss, and the final blow is a full sentence.",
  wl_bossRulesPlain:"A test of units {a}–{b}. No hints, accents count. You have 2 hearts; every right answer hits the boss, and the final blow is a full sentence.",
  wl_fight:"Fight!", wl_bossWin:"Boss defeated!", wl_bossLose:"The boss won this round", wl_bossLoseSub:"Review the units and come back for a rematch.", wl_final:"FINAL BLOW!", wl_beaten:"Defeated"
});
Object.assign(I18N.es, {
  wl_title:"Idiomas del mundo", wl_sub:"Se aprenden en inglés", wl_back:"Atrás", wl_units:"{n} de {m} unidades", wl_start:"Empezar",
  wl_practice:"Practicar", wl_practiceSub:"Repasa lo que aprendiste", wl_locked:"Termina la unidad anterior para abrirla",
  wl_rom:"Mostrar {r}", wl_check:"Comprobar", wl_continue:"Continuar", wl_correct:"¡Correcto!", wl_wrong:"No exactamente.", wl_answer:"Respuesta:",
  wl_pick:"¿Cómo se dice?", wl_rev:"¿Qué significa?", wl_listen:"¿Qué oyes?", wl_build:"Traduce esta frase",
  wl_fill:"Completa el hueco", wl_match:"Toca las parejas", wl_type:"Escríbelo en {lang}", wl_tone:"¿Qué tonos son correctos?",
  wl_read:"¿Cómo se lee?", wl_done:"¡Unidad completada!", wl_fail:"Sin corazones", wl_failSub:"Cada fallo cuesta un corazón. Inténtalo otra vez.",
  wl_retry:"Reintentar", wl_next:"Siguiente unidad", wl_xp:"+{n} XP", wl_accents:"¡Bien! Ojo con los acentos: {a}", wl_new:"NUEVO",
  wl_comingSoon:"Pronto habrá más unidades", wl_tip:"Consejo", wl_hear:"Escuchar", wl_skip:"No puedo escuchar ahora",
  wl_level:"Nivel {lv}", wl_boss:"Jefe", wl_bossLocked:"Termina las unidades antes del jefe", wl_bossGate:"Vence al jefe para seguir",
  wl_bossRules:"Examen de las unidades {a}–{b}. Sin {r} y sin pistas. Tienes 2 corazones; cada acierto golpea al jefe y el golpe final es una frase completa.",
  wl_bossRulesPlain:"Examen de las unidades {a}–{b}. Sin pistas y con acentos. Tienes 2 corazones; cada acierto golpea al jefe y el golpe final es una frase completa.",
  wl_fight:"¡A luchar!", wl_bossWin:"¡Jefe derrotado!", wl_bossLose:"El jefe ganó esta vez", wl_bossLoseSub:"Repasa las unidades y vuelve a por la revancha.", wl_final:"¡GOLPE FINAL!", wl_beaten:"Derrotado"
});
const WL_ORDER = ["zh", "ar", "fr", "pt"];   // most speakers first

/* ---------- text helpers ---------- */
const WL_PUN = /[.,!?¿¡;:。，！？、،؟"«»“”…]/g;
const wlToks = s => String(s).split(/\s+/).map(x => x.replace(WL_PUN, "")).filter(Boolean);
const wlRomToks = s => String(s || "").split(/ +/).map(x => x.replace(WL_PUN, "")).filter(Boolean);
const wlShow = (P, s) => P.seg ? String(s).replace(/ +/g, "") : String(s);
const wlNorm = (s, keepAcc) => { let x = String(s).toLowerCase().replace(/[’`]/g, "'").replace(WL_PUN, " ");
  if(!keepAcc) x = x.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return x.replace(/\s+/g, " ").trim(); };
const wlShuf = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const wlPick = (a, n, not) => wlShuf(a.filter(x => !(not || []).includes(x))).slice(0, n);
const wlAttr = P => ` lang="${P.code}" dir="${P.dir}"`;
const WL_TONES = {a:"āáǎà", e:"ēéěè", i:"īíǐì", o:"ōóǒò", u:"ūúǔù", "ü":"ǖǘǚǜ"};
function wlToneVariants(p){
  const out = new Set();
  for(let i = 0; i < p.length; i++) for(const set of Object.values(WL_TONES)){
    const k = set.indexOf(p[i]); if(k < 0) continue;
    for(let j = 0; j < 4; j++) if(j !== k) out.add(p.slice(0, i) + set[j] + p.slice(i + 1));
  }
  out.delete(p); return [...out];
}

/* ---------- pack model ---------- */
function wlPack(code){
  const P = WL[code]; if(!P || P._ready) return P;
  P.units.forEach((u, ui) => {
    u.lv = u.lv || "A1";
    u.words = u.w.map(([t, en, r]) => ({t, en, r:r || "", ui}));
    u.sents = u.s.map(([en, t, r]) => ({en, t, r:r || "", ui, tk:wlToks(t), rk:wlRomToks(r)}));
  });
  P.allWords = P.units.flatMap(u => u.words);
  P.allSents = P.units.flatMap(u => u.sents);
  P._ready = true; return P;
}

/* ---------- progress ---------- */
let WP = {};
try{ WP = JSON.parse(localStorage.getItem("pgm-world") || "{}") || {}; }catch(e){ WP = {}; }
const wpSave = () => { try{ localStorage.setItem("pgm-world", JSON.stringify(WP)); }catch(e){} };
const wpOf = c => { const p = WP[c] || (WP[c] = {}); p.u = p.u || {}; p.b = p.b || {}; p.miss = p.miss || {}; if(p.rom === undefined) p.rom = true; p.xp = p.xp || 0; return p; };
const wlDoneCount = c => Object.keys(wpOf(c).u).length;
const wlUnlocked = (c, i) => i === 0 || (!!wpOf(c).u[i - 1] && (i % 4 !== 0 || !!wpOf(c).b[i / 4 - 1]));
const wlBossCount = P => Math.min(Math.floor(P.units.length / 4), (P.bosses || []).length);
const wlBossUnlocked = (c, k) => !!wpOf(c).u[4 * k + 3];

/* ---------- challenge generation ---------- */
function wlWordOpts(P, w, n, key){
  const same = P.units[w.ui].words.filter(x => x[key] !== w[key]).map(x => x[key]);
  const other = P.allWords.filter(x => x[key] !== w[key]).map(x => x[key]);
  const picks = wlPick([...new Set(same)], n);
  for(const o of wlShuf([...new Set(other)])) if(picks.length < n && !picks.includes(o)) picks.push(o);
  return wlShuf([w[key], ...picks]);
}
function wlMake(P, type, src){
  const w = src;
  if(type === "pick") return {type, w, prompt:w.en, opts:wlWordOpts(P, w, 3, "t"), ans:w.t};
  if(type === "rev" || type === "listen") return {type, w, prompt:w.t, opts:wlWordOpts(P, w, 3, "en"), ans:w.en};
  if(type === "read"){ return {type, w, prompt:w.t, opts:wlWordOpts(P, w, 3, "r"), ans:w.r}; }
  if(type === "tone"){
    const v = wlPick(wlToneVariants(w.r), 3);
    if(v.length < 2) return wlMake(P, "rev", w);
    return {type, w, prompt:w.t, opts:wlShuf([w.r, ...v]), ans:w.r};
  }
  if(type === "type") return {type, w, prompt:w.en, ans:w.t};
  if(type === "match"){
    const ws = src.slice(0, 4);
    return {type, pairs:ws, left:wlShuf(ws.map((x, i) => i)), right:wlShuf(ws.map((x, i) => i)), done:[]};
  }
  const s = src;
  if(type === "build"){
    const extra = wlPick([...new Set(P.allSents.flatMap(x => x.tk))].filter(t => !s.tk.some(k => wlNorm(k) === wlNorm(t))), Math.min(3, Math.max(2, 6 - s.tk.length)));
    const tiles = wlShuf(s.tk.map((t, i) => ({t, r:s.rk[i] || ""})).concat(extra.map(t => ({t, r:wlRomOf(P, t)}))));
    return {type, s, prompt:s.en, tiles, ans:s.tk};
  }
  if(type === "fill"){
    const unitWords = new Set(P.units[s.ui].words.map(x => wlNorm(x.t)));
    let idx = s.tk.findIndex(t => unitWords.has(wlNorm(t)));
    if(idx < 0){ const cands = s.tk.map((t, i) => i).filter(i => s.tk[i].length > 1 || P.seg); idx = cands[Math.floor(Math.random() * cands.length)] || 0; }
    const pool = [...new Set(P.allSents.flatMap(x => x.tk).concat(P.allWords.filter(x => !/\s/.test(x.t)).map(x => x.t)))].filter(t => wlNorm(t) !== wlNorm(s.tk[idx]));
    return {type, s, idx, prompt:s.en, opts:wlShuf([s.tk[idx], ...wlPick(pool, 3)]), ans:s.tk[idx]};
  }
}
function wlRomOf(P, tok){
  for(const s of P.allSents){ const i = s.tk.indexOf(tok); if(i >= 0 && s.rk[i]) return s.rk[i]; }
  const w = P.allWords.find(x => x.t === tok); return w ? w.r : "";
}
function wlLesson(P, ui){
  const u = P.units[ui], W = wlShuf(u.words), S = wlShuf(u.sents);
  const special = P.typing ? "type" : P.rom === "pinyin" ? "tone" : "read";
  const listen = typeof Narrator !== "undefined" && Narrator.available() ? "listen" : "rev";
  const plan = [["pick", W[0]], ["rev", W[1]], ["pick", W[2]], [listen, W[3]], ["build", S[0]], ["match", wlShuf(u.words).slice(0, 4)],
    ["pick", W[4]], [special, W[5]], ["build", S[1]], ["fill", S[2]], ["rev", W[6]], [special, W[7]], ["build", S[3]], ["pick", W[8] || W[0]]];
  return plan.filter(p => p[1]).map(([ty, src]) => wlMake(P, ty, src));
}
function wlReview(P){
  const pr = wpOf(P.code), done = P.units.map((u, i) => i).filter(i => pr.u[i]);
  const words = P.allWords.filter(w => done.includes(w.ui)), sents = P.allSents.filter(s => done.includes(s.ui));
  if(!words.length) return null;
  const weight = w => 1 + 3 * (pr.miss[w.t] || 0);
  const draw = n => { const bag = []; words.forEach(w => { for(let k = 0; k < Math.min(6, weight(w)); k++) bag.push(w); }); const out = []; for(const w of wlShuf(bag)) if(!out.includes(w) && out.length < n) out.push(w); return out; };
  const W = draw(9), S = wlShuf(sents);
  const special = P.typing ? "type" : P.rom === "pinyin" ? "tone" : "read";
  const plan = [["pick", W[0]], ["rev", W[1]], ["build", S[0]], [special, W[2]], ["pick", W[3]], ["match", wlShuf(words).slice(0, 4)], ["fill", S[1]], ["rev", W[4]], [special, W[5]], ["build", S[2]], ["pick", W[6]]];
  return plan.filter(p => p[1] && (!Array.isArray(p[1]) || p[1].length >= 3)).map(([ty, src]) => wlMake(P, ty, src));
}

function wlBossItems(P, k){
  const lo = 4 * k, hi = 4 * k + 3, inR = x => x.ui >= lo && x.ui <= hi;
  const W = wlShuf(P.allWords.filter(inR)), S = wlShuf(P.allSents.filter(inR));
  const special = P.typing ? "type" : P.rom === "pinyin" ? "tone" : "read";
  const plan = [["build", S[0]], ["rev", W[0]], [special, W[1]], ["fill", S[1]], ["build", S[2]], ["pick", W[2]], [special, W[3]], ["build", S[3]], ["fill", S[4]], ["rev", W[4]], ["build", S[5]], [special, W[5]]];
  return plan.filter(p => p[1]).map(([ty, src]) => wlMake(P, ty, src));
}
/* ---------- state ---------- */
let WV = {view:"home", pack:null, unit:-1, boss:-1, run:null};

/* ---------- page shell ---------- */
(() => {
  const css = document.createElement("style");
  css.textContent = `
.worldcard{display:flex;align-items:center;gap:14px;width:100%;text-align:left;border:0;border-radius:20px;padding:16px 18px;margin:0 0 22px;color:#fff;cursor:pointer;
  background:linear-gradient(120deg,#0E8A7A 0%,#1C9BB8 45%,#5B4BD6 100%);box-shadow:0 5px 0 #0B5F66,0 14px 30px -18px rgba(28,155,184,.9);position:relative;overflow:hidden}
.worldcard:active{transform:translateY(3px);box-shadow:0 2px 0 #0B5F66}
.worldcard .globe{font-size:2.3rem;line-height:1;animation:jxBob 3s ease-in-out infinite}
.worldcard b{display:block;font:800 1.25rem/1.15 "Bricolage Grotesque",sans-serif}
.worldcard small{display:block;opacity:.92;margin-top:2px}
.worldcard .flags{margin-left:auto;font-size:1.3rem;letter-spacing:2px;white-space:nowrap}
.worldcard::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 40%,rgba(255,255,255,.22) 50%,transparent 60%);background-size:220% 100%;animation:aShine 4s linear infinite}
#worldPage .wtop{display:flex;align-items:center;gap:10px;margin:4px 0 14px}
#worldPage .wtop h1{margin:0;font-size:1.6rem;flex:1}
#worldPage .wtop .sub{color:var(--muted);font-size:.9rem}
.wpacks{display:grid;gap:12px}
.wpack{display:flex;align-items:center;gap:14px;text-align:left;width:100%;background:var(--card);border:2px solid var(--line);border-radius:18px;padding:14px 16px;box-shadow:var(--shadow)}
.wpack .fl{font-size:2.4rem;line-height:1}
.wpack b{display:block;font:800 1.15rem/1.2 "Bricolage Grotesque",sans-serif}
.wpack .self{font-size:1.05rem;color:var(--violet)}
.wpack .bar,.wpath .bar{height:8px;border-radius:9px;background:var(--violet-soft);overflow:hidden;margin-top:6px}
.wpack .bar i,.wpath .bar i{display:block;height:100%;background:linear-gradient(90deg,#2EC48C,#7BE0B5);border-radius:9px}
.wpack .info{flex:1;min-width:0}
.wpack small{color:var(--muted)}
.wpath{display:flex;flex-direction:column;align-items:center;gap:6px;padding:6px 0 30px}
.wnode{display:flex;flex-direction:column;align-items:center;gap:4px;border:0;background:none;padding:4px;width:200px}
.wnode .c{width:74px;height:74px;border-radius:50%;display:grid;place-items:center;font-size:2rem;background:var(--violet);box-shadow:0 6px 0 var(--violet-deep);color:#fff;position:relative}
.wnode.done .c{background:var(--gold);box-shadow:0 6px 0 var(--gold-deep)}
.wnode.lock .c{background:var(--line);box-shadow:0 6px 0 rgba(0,0,0,.15);filter:grayscale(1);opacity:.7}
.wnode.cur .c{animation:wlPulse 1.6s ease-in-out infinite}
.wnode .c .st{position:absolute;bottom:-14px;font-size:.9rem;letter-spacing:-1px}
.wnode b{margin-top:12px;font-size:.98rem}
.wnode:nth-child(4n+2){transform:translateX(-50px)}.wnode:nth-child(4n){transform:translateX(50px)}
@keyframes wlPulse{0%,100%{box-shadow:0 6px 0 var(--violet-deep),0 0 0 0 rgba(91,75,214,.5)}50%{box-shadow:0 6px 0 var(--violet-deep),0 0 0 14px rgba(91,75,214,0)}}
.wsoon{color:var(--muted);text-align:center;font-size:.9rem;margin-top:10px}
.wlvl{align-self:stretch;display:flex;align-items:center;gap:10px;margin:14px 0 6px;font:800 1rem/1 "Bricolage Grotesque",sans-serif;color:var(--violet)}
.wlvl::before,.wlvl::after{content:"";flex:1;height:2px;background:var(--line)}
.wnode.boss .c{width:88px;height:88px;font-size:2.6rem;background:linear-gradient(140deg,#E5384F,#7A1020);box-shadow:0 6px 0 #4A0A14}
.wnode.boss.done .c{background:linear-gradient(140deg,#4FD195,#1F8A5B);box-shadow:0 6px 0 #145C3C}
.wnode.boss.lock .c{background:var(--line);box-shadow:0 6px 0 rgba(0,0,0,.15)}
.wnode.boss.cur .c{animation:wlBossPulse 1.2s ease-in-out infinite}
.wnode.boss small{color:var(--red);font-weight:700}
.wnode.boss.done small{color:var(--green)}
@keyframes wlBossPulse{0%,100%{transform:scale(1) rotate(0)}25%{transform:scale(1.06) rotate(-4deg)}75%{transform:scale(1.06) rotate(4deg)}}
.wbossintro{text-align:center;padding:10px 0}
.wbossintro .face{font-size:6rem;line-height:1;display:inline-block;animation:wlBossPulse 1.4s ease-in-out infinite;filter:drop-shadow(0 10px 18px rgba(229,56,79,.45))}
.wbossintro h2{font-size:1.7rem;margin:10px 0 6px}
.wbosshead{display:flex;align-items:center;gap:10px;flex:1}
.wbosshead .face{font-size:2.2rem;line-height:1;display:inline-block}
.wbosshead .face.hit{animation:jxShake .42s}
.wbosshead .hpbar{flex:1;height:14px;border-radius:9px;background:#3A1020;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.4)}
.wbosshead .hpbar i{display:block;height:100%;background:linear-gradient(90deg,#FF5A5F,#FF9A6B);transition:width .35s steps(6)}
.wtools{display:flex;gap:8px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:12px}
.wcard{background:var(--card);border-radius:20px;padding:18px;box-shadow:var(--shadow);margin-bottom:14px}
.wtip{background:var(--gold-soft);border-radius:14px;padding:12px 14px;margin:10px 0 14px}
.wtip b{unicode-bidi:isolate}
.wwords{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
.wword{text-align:left;background:var(--field);border:2px solid var(--line);border-radius:14px;padding:9px 11px}
.wword .t{display:block;font-size:1.25rem;font-weight:700}
.wword .r{display:block;color:var(--violet);font-size:.85rem}
.wword .e{display:block;color:var(--muted);font-size:.9rem}
.wplay .head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.wplay .head .bar{flex:1;height:14px;border-radius:9px;background:var(--violet-soft);overflow:hidden}
.wplay .head .bar i{display:block;height:100%;background:linear-gradient(90deg,#2EC48C,#7BE0B5);border-radius:9px;transition:width .35s cubic-bezier(.2,.8,.2,1);position:relative}
.wplay .head .hp{font-weight:800;white-space:nowrap}
.wq{font:800 1.2rem/1.3 "Bricolage Grotesque",sans-serif;margin:0 0 12px}
.wbig{font-size:2.3rem;font-weight:700;text-align:center;margin:8px 0 2px}
.wbig.cjk{font-size:3rem}
.wrom{text-align:center;color:var(--violet);margin-bottom:8px}
.wsay{display:block;margin:0 auto 12px}
.wopts{display:grid;gap:9px}
.wopt{text-align:left;background:var(--card);border:2px solid var(--line);border-bottom-width:4px;border-radius:14px;padding:12px 14px;font-size:1.08rem;display:flex;gap:10px;align-items:center}
.wopt .k{flex:none;width:24px;height:24px;border-radius:7px;border:2px solid var(--line);display:grid;place-items:center;font-size:.75rem;color:var(--muted)}
.wopt .r{display:block;font-size:.82rem;color:var(--violet)}
.wopt.ok{border-color:var(--green);background:var(--green-soft);animation:jxRight .5s cubic-bezier(.2,1.6,.4,1)}
.wopt.bad{border-color:var(--red);background:var(--red-soft);animation:jxShake .42s}
.wopt:disabled{cursor:default}
.wans{min-height:58px;border-bottom:2px solid var(--line);display:flex;flex-wrap:wrap;gap:6px;padding:6px 0;margin-bottom:12px;align-items:flex-start}
.wtiles{display:flex;flex-wrap:wrap;gap:7px;justify-content:center}
.wtile{background:var(--card);border:2px solid var(--line);border-bottom-width:4px;border-radius:12px;padding:7px 12px;font-size:1.15rem;line-height:1.15;text-align:center;animation:aSt .3s cubic-bezier(.2,.9,.3,1.2) backwards}
.wtile small{display:block;font-size:.72rem;color:var(--violet)}
.wtile.used{visibility:hidden}
.wmatch{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.wmatch button{background:var(--card);border:2px solid var(--line);border-bottom-width:4px;border-radius:12px;padding:11px 8px;font-size:1.05rem;min-height:56px}
.wmatch button small{display:block;font-size:.75rem;color:var(--violet)}
.wmatch button.sel{border-color:var(--violet);background:var(--violet-soft)}
.wmatch button.done{opacity:.25;border-color:var(--green);pointer-events:none}
.wmatch button.bad{animation:jxShake .42s;border-color:var(--red)}
.wplay{padding-bottom:170px}
.wfoot{position:fixed;left:0;right:0;bottom:0;z-index:7;margin:0;padding:14px 16px calc(14px + env(safe-area-inset-bottom,0px));background:var(--bg);border-top:2px solid var(--line);animation:aSlide .25s ease-out}
.wfoot > *{display:block;max-width:608px;margin-left:auto;margin-right:auto}
.wfoot.ok{background:var(--green-soft);border-color:var(--green)}
.wfoot.bad{background:var(--red-soft);border-color:var(--red)}
.wfoot .msg{font-weight:800;margin-bottom:8px;font-size:1.1rem}
.wfoot.ok .msg{color:var(--green)}.wfoot.bad .msg{color:var(--red)}
.wfoot .sol{margin:-4px 0 10px}
.wfoot .primary{width:100%}
.wtype{width:100%;font-size:1.15rem;padding:12px;border-radius:12px;border:2px solid var(--line);background:var(--field)}
.wend{text-align:center;padding:20px 0}
.wend .stars{font-size:3rem;letter-spacing:6px}
.wend .stars span{display:inline-block;animation:jxDropL .6s cubic-bezier(.2,1.4,.4,1) backwards}
.wend .stars span:nth-child(2){animation-delay:.2s}.wend .stars span:nth-child(3){animation-delay:.4s}
.wend h2{font-size:1.8rem;margin:10px 0 4px}
.wend .btns{display:grid;gap:10px;margin-top:20px}
[dir=rtl].wtiles,[dir=rtl].wans{direction:rtl}
`;
  document.head.appendChild(css);
  const page = document.createElement("main");
  page.id = "worldPage"; page.className = "wrap"; page.hidden = true;
  $("menu").after(page);
  const card = document.createElement("button");
  card.id = "worldBtn"; card.className = "worldcard";
  card.innerHTML = `<span class="globe" aria-hidden="true">🌍</span><span><b data-i18n="wl_title">${esc(t("wl_title"))}</b><small><span lang="zh">中文</span> · <span lang="ar">العربية</span> · Français · Português</small></span><span class="flags" aria-hidden="true">${WL_ORDER.map(c => WL[c] ? WL[c].flag : "").join("")}</span>`;
  const anchor = $("continueBtn");
  anchor.after(card);
  card.addEventListener("click", () => { Sound.unlock(); Sound.tap(); wlGo("home"); });
})();

showOnly = (orig => function(id){
  const pg = $("worldPage");
  if(pg) pg.hidden = id !== "worldPage";
  const r = orig.apply(this, arguments);
  if(id === "worldPage") try{ syncMood(); }catch(e){}
  return r;
})(showOnly);
showMenu = (orig => function(){ const pg = $("worldPage"); if(pg) pg.hidden = true; return orig.apply(this, arguments); })(showMenu);
syncMood = (orig => function(){
  const pg = $("worldPage");
  if(pg && !pg.hidden){
    const bossOn = (WV.view === "play" && WV.run && WV.run.boss) || WV.view === "bossIntro";
    Music.setMood(bossOn ? "boss" : WV.pack && WL[WV.pack] && WV.view !== "home" ? WL[WV.pack].music || "arcade" : "arcade"); return; }
  return orig.apply(this, arguments);
})(syncMood);

function wlGo(view, pack, unit){
  if(pack !== undefined) WV.pack = pack;
  if(unit !== undefined) WV.unit = unit;
  WV.view = view;
  if($("worldPage").hidden) showOnly("worldPage");
  Narrator.stop();
  wlRender();
  try{ syncMood(); }catch(e){}
  window.scrollTo(0, 0);
}

/* ---------- views ---------- */
function wlRender(){
  const el = $("worldPage"), v = WV.view;
  if(v === "home") return wlHome(el);
  const P = wlPack(WV.pack);
  if(v === "path") return wlPath(el, P);
  if(v === "intro") return wlIntro(el, P);
  if(v === "bossIntro") return wlBossIntro(el, P);
  if(v === "play") return wlPlay(el, P);
  if(v === "end") return wlEnd(el, P);
}
const wlBack = target => `<button class="iconbtn" data-wgo="${target}" aria-label="${esc(t("wl_back"))}">←</button>`;
function wlHome(el){
  el.innerHTML = `<div class="wtop">${wlBack("menu")}<div><h1 class="display">🌍 ${esc(t("wl_title"))}</h1><div class="sub">${esc(t("wl_sub"))}</div></div></div>
  <div class="wpacks">${WL_ORDER.filter(c => WL[c]).map(c => { const P = wlPack(c), n = wlDoneCount(c), m = P.units.length, pr = wpOf(c);
    return `<button class="wpack" data-wpack="${c}"><span class="fl" aria-hidden="true">${P.flag}</span><span class="info"><b>${esc(P.name)} <span class="self"${wlAttr(P)}>${esc(P.self)}</span></b>
      <small>${esc(t("wl_units", {n, m}))}${pr.xp ? ` · ⭐ ${pr.xp} XP` : ""}</small><span class="bar"><i style="width:${Math.round(100 * n / m)}%"></i></span></span></button>`; }).join("")}</div>`;
}
function wlPath(el, P){
  const pr = wpOf(P.code), cur = P.units.findIndex((u, i) => !pr.u[i]);
  el.innerHTML = `<div class="wtop">${wlBack("home")}<div><h1 class="display">${P.flag} ${esc(P.name)}</h1><div class="sub">${esc(t("wl_units", {n:wlDoneCount(P.code), m:P.units.length}))}</div></div></div>
  <div class="wtools">${P.rom ? `<label class="chip"><input type="checkbox" id="wlRom" ${pr.rom ? "checked" : ""}> ${esc(t("wl_rom", {r:P.rom}))}</label>` : "<span></span>"}
    <button class="ghost" id="wlPractice" ${wlDoneCount(P.code) ? "" : "disabled"}>🔁 ${esc(t("wl_practice"))}</button></div>
  <div class="wpath">${wlPathNodes(P)}</div>
  <p class="wsoon">✨ ${esc(t("wl_comingSoon"))}</p>`;
}
function wlPathNodes(P){
  const pr = wpOf(P.code), out = [];
  const cur = P.units.findIndex((u, i) => !pr.u[i] && wlUnlocked(P.code, i));
  const nb = wlBossCount(P);
  const curBoss = [...Array(nb).keys()].find(k => wlBossUnlocked(P.code, k) && !pr.b[k]);
  P.units.forEach((u, i) => {
    if(i === 0 || u.lv !== P.units[i - 1].lv) out.push(`<div class="wlvl">${esc(t("wl_level", {lv:u.lv}))}</div>`);
    const ok = wlUnlocked(P.code, i), st = pr.u[i] || 0;
    out.push(`<button class="wnode ${st ? "done" : ok ? "" : "lock"} ${i === cur && curBoss === undefined ? "cur" : ""}" data-wunit="${i}" ${ok ? "" : `aria-disabled="true" title="${esc(t(i % 4 === 0 && pr.u[i - 1] ? "wl_bossGate" : "wl_locked"))}"`}>
      <span class="c" aria-hidden="true">${ok ? u.ico : "🔒"}${st ? `<span class="st">${"⭐".repeat(st)}</span>` : ""}</span><b>${i + 1}. ${esc(u.t)}</b></button>`);
    if((i + 1) % 4 === 0 && (i + 1) / 4 - 1 < nb){
      const k = (i + 1) / 4 - 1, [face, name] = P.bosses[k], bok = wlBossUnlocked(P.code, k), won = !!pr.b[k];
      out.push(`<button class="wnode boss ${won ? "done" : bok ? "" : "lock"} ${curBoss === k ? "cur" : ""}" data-wboss="${k}" ${bok ? "" : `aria-disabled="true" title="${esc(t("wl_bossLocked"))}"`}>
        <span class="c" aria-hidden="true">${bok ? face : "🔒"}</span><b>👹 ${esc(t("wl_boss"))}: <span${wlAttr(P)}>${esc(name)}</span></b>${won ? `<small>✅ ${esc(t("wl_beaten"))}</small>` : ""}</button>`);
    }
  });
  return out.join("");
}
function wlBossIntro(el, P){
  const k = WV.boss, [face, name] = P.bosses[k];
  el.innerHTML = `<div class="wtop">${wlBack("path")}<div><h1 class="display">👹 ${esc(t("wl_boss"))}</h1><div class="sub">${P.flag} ${esc(P.name)}</div></div></div>
  <div class="wcard wbossintro"><div class="face" aria-hidden="true">${face}</div><h2 class="display">${esc(name)}</h2>
  <p class="lede">${esc(t(P.rom ? "wl_bossRules" : "wl_bossRulesPlain", {a:4 * k + 1, b:4 * k + 4, r:P.rom || ""}))}</p></div>
  <button class="primary" id="wlFight" style="width:100%">⚔️ ${esc(t("wl_fight"))}</button>`;
}
function wlIntro(el, P){
  const u = P.units[WV.unit], pr = wpOf(P.code);
  el.innerHTML = `<div class="wtop">${wlBack("path")}<div><h1 class="display">${u.ico} ${esc(u.t)}</h1><div class="sub">${P.flag} ${esc(P.name)} · ${WV.unit + 1}/${P.units.length}</div></div></div>
  <div class="wcard"><div class="wtip">💡 ${md(u.b)}</div>
  <div class="wwords">${u.words.map((w, i) => `<button class="wword" data-wsay="${i}"><span class="t"${wlAttr(P)}>${esc(w.t)}</span>${w.r && pr.rom ? `<span class="r">${esc(w.r)}</span>` : ""}<span class="e">${esc(w.en)}</span></button>`).join("")}</div></div>
  <button class="primary" id="wlGo" style="width:100%">${esc(t("wl_start"))} ▶</button>`;
}
function wlStart(P, ui, bossK){
  const isBoss = bossK !== undefined && bossK >= 0;
  const items = isBoss ? wlBossItems(P, bossK) : ui === -1 ? wlReview(P) : wlLesson(P, ui);
  if(!items || !items.length) return;
  WV.boss = isBoss ? bossK : -1;
  WV.run = {items, i:0, hp:isBoss ? 2 : 3, maxHp:isBoss ? 2 : 3, miss:0, xp:0, total:items.length, retried:new Set(), streak:0, state:"ask", picked:[], typed:"",
    boss:isBoss ? {k:bossK, hp:8, max:8} : null};
  wlGo("play", P.code, isBoss ? WV.unit : ui);
}
function wlRomOn(P){ return P.rom && wpOf(P.code).rom && !(WV.run && WV.run.boss && WV.view === "play"); }
function wlSayBtn(){ return Narrator.available() ? `<button class="ghost wsay" data-wsay="cur">🔊 ${esc(t("wl_hear"))}</button>` : ""; }
function wlPlay(el, P){
  const R = WV.run, c = R.items[R.i], rom = wlRomOn(P);
  const pct = Math.round(100 * R.i / (R.items.length || 1));
  let body = "";
  const big = (txt, r) => `<div class="wbig ${P.seg ? "cjk" : ""}"${wlAttr(P)}>${esc(txt)}</div>${r ? `<div class="wrom">${esc(r)}</div>` : ""}`;
  const opts = (list, isTarget, romOf) => `<div class="wopts">${list.map((o, i) => `<button class="wopt" data-wopt="${i}"><span class="k">${i + 1}</span><span${isTarget ? wlAttr(P) : ""}>${esc(o)}${romOf && rom && romOf(o) ? `<span class="r">${esc(romOf(o))}</span>` : ""}</span></button>`).join("")}</div>`;
  const romWord = o => { const w = P.allWords.find(x => x.t === o); return w ? w.r : ""; };
  if(c.type === "pick") body = `<p class="wq">${esc(t("wl_pick"))}</p><div class="wbig" style="font-size:1.8rem">“${esc(c.prompt)}”</div>${opts(c.opts, true, romWord)}`;
  else if(c.type === "rev") body = `<p class="wq">${esc(t("wl_rev"))}</p>${big(c.prompt, rom ? c.w.r : "")}${wlSayBtn()}${opts(c.opts)}`;
  else if(c.type === "listen") body = `<p class="wq">${esc(t("wl_listen"))}</p><div style="text-align:center"><button class="primary" data-wsay="cur" style="font-size:2rem;padding:18px 34px">🔊</button></div><p style="text-align:center"><button class="ghost" id="wlNoListen">🔇 ${esc(t("wl_skip"))}</button></p>${opts(c.opts)}`;
  else if(c.type === "tone") body = `<p class="wq">${esc(t("wl_tone"))}</p>${big(c.prompt, "")}<p style="text-align:center;color:var(--muted)">${esc(c.w.en)}</p>${wlSayBtn()}${opts(c.opts)}`;
  else if(c.type === "read") body = `<p class="wq">${esc(t("wl_read"))}</p>${big(c.prompt, "")}<p style="text-align:center;color:var(--muted)">${esc(c.w.en)}</p>${wlSayBtn()}${opts(c.opts)}`;
  else if(c.type === "type") body = `<p class="wq">${esc(t("wl_type", {lang:P.name}))}</p><div class="wbig" style="font-size:1.8rem">“${esc(c.prompt)}”</div>
    <input class="wtype" id="wlType" autocomplete="off" autocapitalize="off" spellcheck="false" lang="${P.code}" value="${esc(R.typed)}">`;
  else if(c.type === "fill"){
    const parts = c.s.tk.map((tk, i) => i === c.idx ? `<b style="border-bottom:3px solid var(--violet);padding:0 14px">${R.state === "ask" ? "&nbsp;" : esc(tk)}</b>` : esc(tk));
    body = `<p class="wq">${esc(t("wl_fill"))}</p><p style="color:var(--muted);margin:0 0 6px">“${esc(c.prompt)}”</p><div class="wbig" style="font-size:1.6rem;line-height:1.5"${wlAttr(P)}>${parts.join(P.seg ? "" : " ")}</div>${opts(c.opts, true, o => wlRomOf(P, o))}`;
  }
  else if(c.type === "build"){
    const t2 = (x, i) => `<button class="wtile ${R.picked.includes(i) ? "used" : ""}" data-wtile="${i}"${wlAttr(P)}>${esc(x.t)}${rom && x.r ? `<small dir="ltr">${esc(x.r)}</small>` : ""}</button>`;
    body = `<p class="wq">${esc(t("wl_build"))}</p><div class="wbig" style="font-size:1.4rem">“${esc(c.prompt)}”</div>
      <div class="wans" dir="${P.dir}">${R.picked.map(i => `<button class="wtile" data-wun="${i}"${wlAttr(P)}>${esc(c.tiles[i].t)}${rom && c.tiles[i].r ? `<small dir="ltr">${esc(c.tiles[i].r)}</small>` : ""}</button>`).join("")}</div>
      <div class="wtiles" dir="${P.dir}">${c.tiles.map(t2).join("")}</div>`;
  }
  else if(c.type === "match"){
    const L = c.left.map(i => `<button data-wml="${i}" class="${c.done.includes(i) ? "done" : ""}"><span${wlAttr(P)}>${esc(c.pairs[i].t)}</span>${rom && c.pairs[i].r ? `<small>${esc(c.pairs[i].r)}</small>` : ""}</button>`);
    const Rr = c.right.map(i => `<button data-wmr="${i}" class="${c.done.includes(i) ? "done" : ""}">${esc(c.pairs[i].en)}</button>`);
    body = `<p class="wq">${esc(t("wl_match"))}</p><div class="wmatch">${L.map((l, k) => l + Rr[k]).join("")}</div>`;
  }
  const needsCheck = (c.type === "build" || c.type === "type") && R.state === "ask";
  let foot = "";
  if(R.state !== "ask"){
    const ok = R.state === "ok";
    const sol = c.type === "build" ? c.s.t : c.type === "fill" ? c.s.t : c.ans;
    const solRom = c.type === "build" || c.type === "fill" ? c.s.r : (c.w && c.w.r && c.type !== "read" && c.type !== "tone" ? c.w.r : "");
    const target = !(c.type === "rev" || c.type === "listen" || c.type === "read" || c.type === "tone");
    foot = `<div class="wfoot ${ok ? "ok" : "bad"}"><div class="msg">${ok ? "✅ " + esc(R.note || t("wl_correct")) : "❌ " + esc(t("wl_wrong"))}</div>
      ${!ok || c.type === "build" || c.type === "fill" || c.type === "type" ? `<div class="sol">${ok ? "" : esc(t("wl_answer")) + " "}<b${target ? wlAttr(P) : ""}>${esc(target ? wlShow(P, sol) : sol)}</b>${rom && solRom ? `<br><small style="color:var(--violet)">${esc(solRom)}</small>` : ""}</div>` : ""}
      <button class="primary" id="wlNext">${esc(t("wl_continue"))}</button></div>`;
  } else if(needsCheck){
    foot = `<div class="wfoot"><button class="primary" id="wlCheck" ${c.type === "build" && !R.picked.length ? "disabled" : ""}>${esc(t("wl_check"))}</button></div>`;
  }
  const B = R.boss;
  const mid = B ? `<span class="wbosshead"><span class="face" id="wlBossFace" aria-hidden="true">${P.bosses[B.k][0]}</span><span class="hpbar" role="img" aria-label="${B.hp}/${B.max}"><i style="width:${Math.round(100 * B.hp / B.max)}%"></i></span></span>` : `<span class="bar"><i style="width:${pct}%"></i></span>`;
  el.innerHTML = `<div class="wplay"><div class="head"><button class="iconbtn" data-wgo="path" aria-label="${esc(t("wl_back"))}">✕</button>${mid}<span class="hp">${"❤️".repeat(Math.max(0, R.hp))}${"🖤".repeat(Math.max(0, R.maxHp - R.hp))}</span></div>
    <div class="wcard" id="wlCard">${body}</div>${foot}</div>`;
  if(c.type === "type" && R.state === "ask"){ const inp = $("wlType"); inp.focus(); inp.addEventListener("input", () => { R.typed = inp.value; }); }
  if(R.state === "ask" && (c.type === "listen" || (c.type === "rev" && R.autoSaid !== R.i))){ R.autoSaid = R.i; wlSayCur(P, true); }
}
function wlSayCur(P, quiet){
  const R = WV.run; if(!R) return;
  const c = R.items[R.i]; if(!c) return;
  let text = c.w ? c.w.t : c.s ? c.s.t : "";
  if(c.type === "match") return;
  if(R.state !== "ask" && c.s) text = c.s.t;
  if(text && typeof Narrator !== "undefined" && Narrator.available()) Narrator.say([{text:wlShow(P, text), lang:P.tts}]);
}

/* ---------- grading ---------- */
function wlGrade(P, ok, note){
  const R = WV.run, c = R.items[R.i];
  R.state = ok ? "ok" : "bad"; R.note = note || "";
  const firstTry = !R.retried.has(R.i);
  const key = c.w ? c.w.t : c.s ? c.s.t : "";
  const pr = wpOf(P.code);
  if(ok){
    R.streak++;
    const xp = firstTry ? 10 : 5; R.xp += xp;
    Sound.correct();
    try{ recordAnswer(true, xp); }catch(e){}
    if(R.boss){ R.boss.hp = Math.max(0, R.boss.hp - 1); setTimeout(() => { const f = $("wlBossFace"); if(f){ f.classList.add("hit"); try{ const c = juCenter(f); juBurst(c.x, c.y, 16, ["#FF5A5F", "#FFD45C", "#FFFFFF"], 70); }catch(e){} } }, 30); }
    try{ const p = juHere(); juBurst(p.x, p.y, 14, ["#4FD195", "#FFD45C", "#F2B01E", "#FFFFFF"]); juFloat(p.x, p.y - 10, t("wl_xp", {n:xp}), "#4FD195");
      if(R.streak === 3) juBanner(t("ju_nice")); else if(R.streak === 5) juBanner(t("ju_great"), "ok"); else if(R.streak === 8) juBanner(t("ju_awesome"), "lvl"); }catch(e){}
    if(key && pr.miss[key]) pr.miss[key] = Math.max(0, pr.miss[key] - 1);
  } else {
    R.streak = 0; R.miss++; R.hp--;
    Sound.wrong();
    try{ recordAnswer(false, 0); }catch(e){}
    try{ juVignette(); if(R.boss){ juFlash("#E5384F"); juShake($("worldPage"), "jx-quake"); } }catch(e){}
    if(key) pr.miss[key] = (pr.miss[key] || 0) + 1;
    if(!R.retried.has(R.i) && c.type !== "match"){ const copy = Object.assign({}, c); R.items.push(copy); R.retried.add(R.items.length - 1); }
  }
  wpSave();
  wlRender();
  if(!ok) try{ juShake($("wlCard")); }catch(e){}
  if(c.s || c.type === "type") wlSayCur(P, true);
}
function wlNext(P){
  const R = WV.run;
  if(R.hp <= 0) return wlFinish(P, false);
  if(R.boss && R.boss.hp <= 0) return wlFinish(P, true);
  R.i++; R.state = "ask"; R.picked = []; R.typed = ""; R.note = "";
  if(R.boss){
    if(R.i >= R.items.length) R.items.push(...wlBossItems(P, R.boss.k));
    if(R.boss.hp === 1){
      // the final blow is always a full sentence
      if(R.items[R.i].type !== "build"){
        const j = R.items.findIndex((x, n) => n > R.i && x.type === "build");
        if(j > 0) [R.items[R.i], R.items[j]] = [R.items[j], R.items[R.i]];
        else R.items.splice(R.i, 0, wlBossItems(P, R.boss.k).find(x => x.type === "build"));
      }
      setTimeout(() => { try{ juBanner(t("wl_final"), "boss"); }catch(e){} }, 120);
    }
    return wlRender();
  }
  if(R.i >= R.items.length) return wlFinish(P, true);
  wlRender();
}
function wlFinish(P, won){
  const R = WV.run, pr = wpOf(P.code);
  R.won = won;
  if(won){
    const stars = R.miss === 0 ? 3 : R.miss <= 2 ? 2 : 1;
    R.stars = stars;
    const bonus = 20 + (stars === 3 ? 10 : 0); R.xp += bonus;
    try{ profile.xp += bonus; saveProfile(); questAdd("xp", bonus); renderDaily(); }catch(e){}
    pr.xp += R.xp;
    if(R.boss){ R.xp += 30; pr.b[R.boss.k] = true; }
    else if(WV.unit >= 0){ R.firstClear = !pr.u[WV.unit]; pr.u[WV.unit] = Math.max(pr.u[WV.unit] || 0, stars); }
    wpSave();
    setTimeout(() => { try{ Sound.levelUp(); confetti(stars === 3 || R.boss ? 160 : 90); if(R.boss){ juFlash("#FFFFFF"); juBanner(t("ju_bossDown"), "ok"); } else if(stars === 3) juBanner(t("ju_perfect"), "ok"); }catch(e){} }, 250);
  } else { try{ Sound.gameOver(); }catch(e){} }
  wlGo("end");
}
function wlEnd(el, P){
  const R = WV.run;
  if(R.boss){
    const [face, name] = P.bosses[R.boss.k], nextU = 4 * R.boss.k + 4;
    el.innerHTML = R.won ? `<div class="wend"><div class="stars">🏆</div><h2 class="display">${esc(t("wl_bossWin"))}</h2><p class="lede">${face} <span${wlAttr(P)}>${esc(name)}</span> · <b>${esc(t("wl_xp", {n:R.xp}))}</b></p>
        <div class="btns">${nextU < P.units.length ? `<button class="primary" id="wlNextUnit" data-u="${nextU}">${esc(t("wl_next"))}: ${P.units[nextU].ico} ${esc(P.units[nextU].t)}</button>` : ""}
        <button class="${nextU < P.units.length ? "ghost" : "primary"}" data-wgo="path">${esc(t("wl_continue"))}</button></div></div>`
      : `<div class="wend"><div class="stars">${face}</div><h2 class="display">${esc(t("wl_bossLose"))}</h2><p class="lede">${esc(t("wl_bossLoseSub"))}</p>
        <div class="btns"><button class="primary" id="wlRetry">${esc(t("wl_retry"))}</button><button class="ghost" data-wgo="path">${esc(t("wl_back"))}</button></div></div>`;
    return;
  }
  const more = WV.unit >= 0 && WV.unit + 1 < P.units.length;
  el.innerHTML = R.won ? `<div class="wend"><div class="stars">${[0, 1, 2].map(i => `<span>${i < R.stars ? "⭐" : "☆"}</span>`).join("")}</div>
      <h2 class="display">${esc(WV.unit >= 0 ? t("wl_done") : t("wl_practice"))}</h2><p class="lede">${P.flag} ${esc(WV.unit >= 0 ? P.units[WV.unit].t : P.name)} · <b>${esc(t("wl_xp", {n:R.xp}))}</b></p>
      <div class="btns">${more ? `<button class="primary" id="wlNextUnit">${esc(t("wl_next"))}: ${P.units[WV.unit + 1].ico} ${esc(P.units[WV.unit + 1].t)}</button>` : ""}
      <button class="${more ? "ghost" : "primary"}" data-wgo="path">${esc(t("wl_continue"))}</button></div></div>`
    : `<div class="wend"><div class="stars">💔</div><h2 class="display">${esc(t("wl_fail"))}</h2><p class="lede">${esc(t("wl_failSub"))}</p>
      <div class="btns"><button class="primary" id="wlRetry">${esc(t("wl_retry"))}</button><button class="ghost" data-wgo="path">${esc(t("wl_back"))}</button></div></div>`;
}

/* ---------- input ---------- */
function wlAnswerOpt(P, i){
  const R = WV.run, c = R.items[R.i];
  if(R.state !== "ask" || !c.opts) return;
  const ok = c.opts[i] === c.ans;
  wlGrade(P, ok);
  const btns = document.querySelectorAll("#worldPage [data-wopt]");
  btns.forEach(b => { b.disabled = true; const o = c.opts[+b.dataset.wopt]; if(o === c.ans) b.classList.add("ok"); else if(+b.dataset.wopt === i) b.classList.add("bad"); });
}
function wlCheck(P){
  const R = WV.run, c = R.items[R.i];
  if(R.state !== "ask") return;
  if(c.type === "build"){
    const got = R.picked.map(i => wlNorm(c.tiles[i].t)).join(" "), want = c.ans.map(x => wlNorm(x)).join(" ");
    return wlGrade(P, got === want);
  }
  if(c.type === "type"){
    const got = (($("wlType") || {}).value || R.typed || "").trim(); if(!got) return;
    const wants = [c.ans].concat(c.ans.replace(/^(le|la|les|l'|o|a|os|as)\s*/i, "") !== c.ans ? [c.ans.replace(/^(le|la|les|l'|o|a|os|as)\s*/i, "")] : []);
    const exact = wants.some(w => wlNorm(w, true) === wlNorm(got, true));
    const loose = wants.some(w => wlNorm(w) === wlNorm(got));
    if(R.boss) return wlGrade(P, exact);
    return wlGrade(P, exact || loose, !exact && loose ? t("wl_accents", {a:c.ans}) : "");
  }
}
document.addEventListener("click", e => {
  const pg = $("worldPage"); if(!pg || pg.hidden || !pg.contains(e.target)) return;
  const P = WV.pack ? wlPack(WV.pack) : null;
  const go = e.target.closest("[data-wgo]");
  if(go){ Sound.tap(); const v = go.dataset.wgo; if(v === "menu"){ Narrator.stop(); showMenu(); } else wlGo(v); return; }
  const pk = e.target.closest("[data-wpack]"); if(pk){ Sound.unlock(); Sound.tap(); return wlGo("path", pk.dataset.wpack); }
  const un = e.target.closest("[data-wunit]");
  if(un){ const i = +un.dataset.wunit; if(!wlUnlocked(P.code, i)){ Sound.wrong(); toast("🔒 " + t(i % 4 === 0 && wpOf(P.code).u[i - 1] ? "wl_bossGate" : "wl_locked")); return; } Sound.tap(); return wlGo("intro", P.code, i); }
  if(e.target.closest("#wlPractice")){ Sound.tap(); return wlStart(P, -1); }
  if(e.target.closest("#wlGo")){ Sound.unlock(); Sound.start(); return wlStart(P, WV.unit); }
  const bs = e.target.closest("[data-wboss]");
  if(bs){ const k = +bs.dataset.wboss; if(!wlBossUnlocked(P.code, k)){ Sound.wrong(); toast("🔒 " + t("wl_bossLocked")); return; } Sound.unlock(); Sound.bossIntro(); WV.boss = k; return wlGo("bossIntro"); }
  if(e.target.closest("#wlFight")){ Sound.unlock(); return wlStart(P, WV.unit, WV.boss); }
  if(e.target.closest("#wlRetry")) return WV.run && WV.run.boss ? wlStart(P, WV.unit, WV.run.boss.k) : wlStart(P, WV.unit);
  const nu = e.target.closest("#wlNextUnit");
  if(nu){ Sound.tap(); const u = nu.dataset.u !== undefined ? +nu.dataset.u : WV.unit + 1; WV.run = null; return wlGo("intro", P.code, u); }
  const sw = e.target.closest("[data-wsay]");
  if(sw){ Sound.unlock(); if(sw.dataset.wsay === "cur") return wlSayCur(P); const w = P.units[WV.unit].words[+sw.dataset.wsay]; if(w && Narrator.available()) Narrator.say([{text:w.t, lang:P.tts}]); return; }
  if(e.target.closest("#wlNoListen")){ const R = WV.run, c = R.items[R.i]; R.items[R.i] = wlMake(P, "rev", c.w); return wlRender(); }
  if(!WV.run) return;
  const R = WV.run, c = R.items[R.i];
  const op = e.target.closest("[data-wopt]"); if(op) return wlAnswerOpt(P, +op.dataset.wopt);
  const tl = e.target.closest("[data-wtile]");
  if(tl && R.state === "ask"){ const i = +tl.dataset.wtile; if(!R.picked.includes(i)){ R.picked.push(i); Sound.tap(); if(Narrator.available()) Narrator.say([{text:c.tiles[i].t, lang:P.tts}]); wlRender(); } return; }
  const ut = e.target.closest("[data-wun]"); if(ut && R.state === "ask"){ R.picked = R.picked.filter(x => x !== +ut.dataset.wun); Sound.tap(); return wlRender(); }
  if(e.target.closest("#wlCheck")) return wlCheck(P);
  if(e.target.closest("#wlNext")){ Sound.tap(); return wlNext(P); }
  const ml = e.target.closest("[data-wml]"), mr = e.target.closest("[data-wmr]");
  if((ml || mr) && c.type === "match" && R.state === "ask"){
    const side = ml ? "l" : "r", idx = +(ml || mr).dataset[ml ? "wml" : "wmr"];
    if(side === "l" && Narrator.available()) Narrator.say([{text:c.pairs[idx].t, lang:P.tts}]);
    if(!c.sel || c.sel.side === side){ c.sel = {side, idx}; Sound.tap(); pg.querySelectorAll(".wmatch .sel").forEach(b => b.classList.remove("sel")); (ml || mr).classList.add("sel"); return; }
    if(c.sel.idx === idx){
      c.done.push(idx); c.sel = null; Sound.correct();
      try{ const p = juHere(); juBurst(p.x, p.y, 8, ["#4FD195", "#FFD45C"], 60); }catch(e){}
      if(c.done.length === c.pairs.length) return wlGrade(P, !c.missed);
      return wlRender();
    }
    c.missed = true; c.sel = null; Sound.wrong();
    const b = ml || mr; b.classList.add("bad"); setTimeout(() => wlRender(), 420);
  }
});
document.addEventListener("change", e => {
  if(e.target && e.target.id === "wlRom"){ const P = wlPack(WV.pack); wpOf(P.code).rom = e.target.checked; wpSave(); }
});
document.addEventListener("keydown", e => {
  const pg = $("worldPage"); if(!pg || pg.hidden || WV.view !== "play" || !WV.run) return;
  const P = wlPack(WV.pack), R = WV.run, c = R.items[R.i];
  if(e.key === "Enter"){ e.preventDefault(); if(R.state !== "ask") return wlNext(P); return wlCheck(P); }
  if(e.target && e.target.id === "wlType") return;
  const n = parseInt(e.key, 10);
  if(n >= 1 && n <= 9 && R.state === "ask"){
    if(c.opts && n <= c.opts.length){ e.preventDefault(); return wlAnswerOpt(P, n - 1); }
    if(c.type === "build"){ const free = c.tiles.map((x, i) => i).filter(i => !R.picked.includes(i)); const i = free[n - 1]; if(i !== undefined){ e.preventDefault(); R.picked.push(i); wlRender(); } }
  }
  if(e.key === "Backspace" && c.type === "build" && R.state === "ask" && R.picked.length){ e.preventDefault(); R.picked.pop(); wlRender(); }
});

if(window.__PGM_TEST) window.__world = {get WV(){ return WV; }, WL, WP, wlBossItems, wlUnlocked, wlBossUnlocked, wlPack, wlLesson, wlReview, wlStart, wlGo, wlGrade, wlNext, wlCheck, wlAnswerOpt, wlToneVariants, wlToks, wlRomToks, wlNorm, wpOf};
