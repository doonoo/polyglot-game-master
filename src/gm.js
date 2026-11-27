/* ===================== Local Game Master (pre-built, no AI) ===================== */
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const LN = {en:{English:"English", Spanish:"Spanish"}, es:{English:"inglés", Spanish:"español"}};

const GMT = {
en:{
  ok:["Critical hit!","Clean combo.","Nailed it.","Flawless execution.","GG, that was textbook.","Loot-worthy answer.","You cooked that one.","No notes. Well, one note: nice."],
  bad:["Respawn and try again.","Ouch. That one cost you.","The grammar goblin wins this round.","Close, hero, but no.","Missed by a pixel.","Wasted. Lesson incoming.","That answer needs a patch."],
  idk:["Tactical retreat noted.","Skipping is not a strategy, but fine."],
  bossWin:["Boss down! The crowd goes wild.","Fatality. Grammar wins."], bossLose:["The boss laughs in conjugations.","Boss fight lost. Train and return."],
  over:"Out of hearts. The run ends here.", won:"Island conquered. Plant your flag.",
  okFb:["Exactly right.","That is how a native speaker would say it.","Clean and correct.","Nothing to fix here.","Spot on."],
  accent:"Correct, but mind the accent marks:", accentStrict:"Survivor is strict: accent marks count.",
  fix:"The right answer:", idkFb:"Here is what it should be:", forced:"Override accepted. The Game Master tips his hat and fixes the scoreboard.",
  tMine:T => `Translate into ${T}:`, tRev:N => `Translate into ${N}:`, tScr:"Put the words in the right order:",
  tCloze:N => `Fill in the blank. It should mean: “${N}”`,
  tErr:N => `One mistake is hiding in this sentence. Rewrite it correctly. It should mean: “${N}”`,
  tErrS:"One mistake is hiding in this sentence. Rewrite the whole sentence correctly.",
  hStart:(w, n) => `Starts with “${w}” · ${n} words`, hMeans:N => `It means: “${N}”`, hLetter:(l, n) => `Starts with “${l}” · ${n} letters`, hTopic:x => `Think about: ${x}`,
  vMine:T => `How do you say this in ${T}?`, vRev:N => `What does this mean in ${N}?`, vScr:m => `Unscramble the letters. It means: “${m}”`,
  vOdd:"Three of these belong together. Type the odd one out:", hOdd:c => `Three of them are: ${c}`,
  swarm:"Three new words join your party. Get each one right twice in review to lock it in.", vrev:"Review round. No peeking: this word has already been taught.",
  islTeach:"New phrase for your island. Study it, say it out loud, then hide it and answer from memory. It only counts as conquered once you recall it twice in later rounds.", islNav:"Navigation phrase: use it to steer any conversation back to your island.", islRev:"Island review. Answer without the phrasebook.",
  nDD:T => `Write this number in words in ${T}:`, nLM:T => `Solve it and write the answer in words in ${T}:`, nRW:T => `Write it out in words in ${T}:`,
  nCW:T => `Write this time in words in ${T}:`, nPC:T => `Read the scene and answer in words in ${T}:`,
  bossTask:"blocks your path! Beat this one for +50 XP.",
  tDuel:"Pick the right word:", tEcho:T => `Listen and type exactly what you hear in ${T}:`, vEcho:T => `Listen and type the word you hear in ${T}:`, hWords:n => `${n} words`,
  vMatch:"Match each word with its meaning. You can slip once.", vMatch2:"Match each word with its meaning. Big board: you can slip twice.",
  bosses:["The Grammar Goblin","The Conjugation Kraken","Lord Typo","The Accent Assassin","The Syntax Serpent","Baron von Verb","The Preposition Phantom","Count Cloze"]
},
es:{
  ok:["¡Golpe crítico!","Combo limpio.","Clavado.","Ejecución impecable.","GG, de manual.","Respuesta digna de botín.","La rompiste.","Sin notas. Bueno, una: bien hecho."],
  bad:["Reaparece e inténtalo otra vez.","Auch. Esa dolió.","El duende de la gramática gana esta ronda.","Casi, pero no.","Fallaste por un píxel.","Eliminado. Ahí va la lección.","Esa respuesta necesita un parche."],
  idk:["Retirada táctica anotada.","Rendirse no es estrategia, pero bueno."],
  bossWin:["¡Jefe derrotado! El público enloquece.","Fatality. Gana la gramática."], bossLose:["El jefe se ríe en conjugaciones.","Perdiste contra el jefe. Entrena y vuelve."],
  over:"Sin corazones. La partida termina aquí.", won:"Isla conquistada. Planta tu bandera.",
  okFb:["Exactamente.","Así lo diría un hablante nativo.","Limpio y correcto.","Nada que corregir.","En el blanco."],
  accent:"Correcto, pero cuida los acentos:", accentStrict:"Supervivencia es estricto: los acentos cuentan.",
  fix:"La respuesta correcta:", idkFb:"Así debía quedar:", forced:"Reclamo aceptado. El Game Master se quita el sombrero y corrige el marcador.",
  tMine:T => `Traduce al ${T}:`, tRev:N => `Traduce al ${N}:`, tScr:"Ordena las palabras:",
  tCloze:N => `Completa el hueco. Debe significar: “${N}”`,
  tErr:N => `Hay un error escondido en esta frase. Escríbela bien. Debe significar: “${N}”`,
  tErrS:"Hay un error escondido en esta frase. Escribe la frase completa correctamente.",
  hStart:(w, n) => `Empieza con “${w}” · ${n} palabras`, hMeans:N => `Significa: “${N}”`, hLetter:(l, n) => `Empieza con “${l}” · ${n} letras`, hTopic:x => `Piensa en: ${x}`,
  vMine:T => `¿Cómo se dice esto en ${T}?`, vRev:N => `¿Qué significa esto en ${N}?`, vScr:m => `Ordena las letras. Significa: “${m}”`,
  vOdd:"Tres de estas van juntas. Escribe la que sobra:", hOdd:c => `Tres son de: ${c}`,
  swarm:"Tres palabras nuevas se unen a tu equipo. Acierta cada una dos veces en repaso para asegurarla.", vrev:"Ronda de repaso. Sin mirar: esta palabra ya se enseñó.",
  islTeach:"Frase nueva para tu isla. Estúdiala, dila en voz alta y luego escóndela y responde de memoria. Solo cuenta como conquistada cuando la recuerdes dos veces en rondas posteriores.", islNav:"Frase de navegación: úsala para llevar cualquier conversación de vuelta a tu isla.", islRev:"Repaso de la isla. Responde sin el libro de frases.",
  nDD:T => `Escribe este número con palabras en ${T}:`, nLM:T => `Resuelve y escribe la respuesta con palabras en ${T}:`, nRW:T => `Escríbelo con palabras en ${T}:`,
  nCW:T => `Escribe esta hora con palabras en ${T}:`, nPC:T => `Lee la escena y responde con palabras en ${T}:`,
  bossTask:"te cierra el paso. Gánale y llévate +50 XP.",
  tDuel:"Elige la palabra correcta:", tEcho:T => `Escucha y escribe exactamente lo que oyes en ${T}:`, vEcho:T => `Escucha y escribe la palabra que oyes en ${T}:`, hWords:n => `${n} palabras`,
  vMatch:"Une cada palabra con su significado. Puedes fallar una vez.", vMatch2:"Une cada palabra con su significado. Tablero grande: puedes fallar dos veces.",
  bosses:["El Duende de la Gramática","El Kraken de las Conjugaciones","Lord Errata","El Asesino de Acentos","La Serpiente de la Sintaxis","El Barón del Verbo","El Fantasma de las Preposiciones","El Conde Hueco"]
}
};

/* ---------- Answer patterns ---------- */
const _exp = new Map();
function expand(p){
  if(_exp.has(p)) return _exp.get(p);
  let depth = 0, cur = ""; const parts = [];
  for(const ch of p){
    if(ch === "[" || ch === "(" || ch === "{") depth++;
    else if(ch === "]" || ch === ")" || ch === "}") depth--;
    if(ch === "|" && depth === 0){ parts.push(cur); cur = ""; } else cur += ch;
  }
  parts.push(cur);
  let out;
  if(parts.length > 1) out = parts.flatMap(expand);
  else {
    const m = p.match(/\(([^()\[\]{}]*)\)|\[([^()\[\]{}]*)\]|\{([^()\[\]{}]*)\}/);
    if(!m) out = [p];
    else {
      const pre = p.slice(0, m.index), post = p.slice(m.index + m[0].length);
      const opts = m[1] !== undefined ? ["", m[1]] : m[2] !== undefined ? m[2].split("|") : [m[3], ""];
      out = opts.flatMap(o => expand(pre + o + post));
    }
  }
  _exp.set(p, out);
  return out;
}
function tidy(s){
  s = s.replace(/\s+/g, " ").replace(/([¿¡])\s+/g, "$1").replace(/\s+([?.!,;:])/g, "$1").trim();
  s = s.replace(/([.?!]\s+[¿¡]?)(\p{Ll})/gu, (m, a, b) => a + b.toLocaleUpperCase());
  return s.replace(/^([¿¡"“]*)(\p{Ll})/u, (m, a, b) => a + b.toLocaleUpperCase());
}
const canon = p => tidy(expand(p)[0]);
const first = p => expand(p)[0].replace(/\s+/g, " ").trim();

/* ---------- Normalizing and grading ---------- */
function deacc(s){ return s.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC"); }
function norm(s, lang, strict){
  s = String(s).toLowerCase().normalize("NFC").replace(/[’‘`´]/g, "'");
  if(lang === "en"){
    s = s.replace(/\bcan't\b/g, "can not").replace(/\bcannot\b/g, "can not").replace(/\bwon't\b/g, "will not")
      .replace(/n't\b/g, " not").replace(/'m\b/g, " am").replace(/'re\b/g, " are").replace(/'ve\b/g, " have").replace(/'ll\b/g, " will").replace(/'d\b/g, " would")
      .replace(/\b(he|she|it|that|there|what|where|who|how|here)'s\b/g, "$1 is");
  }
  s = s.replace(/['.,;:!?¿¡"“”«»()\[\]{}…\/·-]|–|—/g, " ");
  if(!strict) s = deacc(s);
  return s.replace(/\s+/g, " ").trim();
}
function numNorm(s, lang){
  s = " " + s + " ";
  if(lang === "en"){
    s = s.replace(/^ it is /, " ").replace(/ (in the (morning|afternoon|evening)|at night) $/, " ").replace(/ (a m|p m|am|pm) $/, " ")
      .replace(/ per cent /g, " percent ").replace(/ bucks /g, " dollars ").replace(/ buck /g, " dollar ")
      .replace(/ a (hundred|thousand|million|half|third|quarter|fourth|fifth|eighth|tenth|dollar) /g, " one $1 ");
    for(let i = 0; i < 2; i++) s = s.replace(/ (and|minutes|minute|the) /g, " ");
  } else {
    s = s.replace(/^ (son|es) /, " ").replace(/^ a /, " ").replace(/^ (las|la|el) /, " ").replace(/ de la (manana|tarde|noche|madrugada) $/, " ")
      .replace(/ centimos /g, " centavos ").replace(/ centimo /g, " centavo ").replace(/ (minutos|minuto) /g, " ");
  }
  return s.replace(/\s+/g, " ").trim();
}
function wordForms(v, lang){
  v = v.trim();
  if(lang === "es"){
    const m = v.match(/^(el|la|los|las) (.+)$/i);
    if(!m) return [v];
    return [v, m[2], {el:"un", la:"una", los:"unos", las:"unas"}[m[1].toLowerCase()] + " " + m[2]];
  }
  const m = v.match(/^to (.+)$/i);
  if(m) return [v, m[1]];
  return [v, "the " + v, "a " + v, "an " + v];
}
function variantsOf(ch){
  let out = [];
  for(const p of ch.acc) for(const v of expand(p)) out.push(ch.k === "s" ? tidy(v) : v.replace(/\s+/g, " ").trim());
  if(ch.k === "w") out = out.flatMap(v => wordForms(v, ch.al));
  return out;
}
function nrm(s, ch, strict){ const x = norm(s, ch.al, strict); return ch.nn ? numNorm(deacc(x), ch.al) : x; }
function lev(a, b){
  const d = Array.from({length:a.length + 1}, (_, i) => [i]);
  for(let j = 1; j <= b.length; j++) d[0][j] = j;
  for(let i = 1; i <= a.length; i++) for(let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[a.length][b.length];
}
function boldDiff(best, answer, ch, strict){
  const have = new Set(nrm(answer || "", ch, strict).split(" "));
  return best.split(" ").map(w => { const k = nrm(w, ch, strict); return k && !k.split(" ").every(x => have.has(x)) ? "**" + w + "**" : w; }).join(" ").replace(/\*\* \*\*/g, " ");
}
function gradeLocal(st, ch, answer, force){
  const L = GMT[LANG_CODE[st.native]] || GMT.en;
  if(ch.k === "p"){
    let ok = answer !== null && /^✓/.test(answer);
    const forced = !!force && !ok; if(forced) ok = true;
    const list = (ch.pairs || []).map(([a, b]) => `**${a}** = ${b}`).join(" · ");
    return {correct:ok, headline: ok ? pick(L.ok) : answer === null ? pick(L.idk) : pick(L.bad),
      feedback: answer === null ? `${L.idkFb} ${list}` : forced ? L.forced : ok ? pick(L.okFb) : `${L.fix} ${list}`,
      answer:(ch.pairs || []).map(([a, b]) => a + " = " + b).join(" · "), struggled: ok ? [] : [{w:ch.wk, m:ch.wm}], al:ch.al};
  }
  const strict = st.mode === 3 || st.mode === 8;
  const vars = variantsOf(ch);
  let correct = false, accentMiss = false, best = vars[0] || ch.answerKey;
  if(answer !== null){
    const al = nrm(answer, ch, false), as = nrm(answer, ch, true);
    const exact = vars.find(v => nrm(v, ch, true) === as);
    const loose = exact || vars.find(v => nrm(v, ch, false) === al);
    if(exact){ correct = true; best = exact; }
    else if(loose){ best = loose; accentMiss = true; correct = !strict; }
    else if(ch.k !== "w"){
      const at = al.split(" "); let bd = 1e9;
      for(const v of vars){ const d = lev(at, nrm(v, ch, false).split(" ")); if(d < bd){ bd = d; best = v; } }
    }
  }
  const forced = !!force && !correct;
  if(forced) correct = true;
  // The lesson tip lists many phrases; only show it when one of them is actually in this answer
  let why = ch.why || "";
  const terms = (why.match(/\*\*([^*]+)\*\*/g) || []).map(x => x.slice(2, -2));
  if(terms.length >= 3){
    const have = new Set(nrm(best || ch.answerKey || "", ch, false).split(" "));
    const hit = terms.some(tm => { const ws = nrm(tm.replace(/\/[a-záéíóúñ]+/gi, "").replace(/\.\.\.|…|\+/g, " "), ch, false).split(" ").filter(Boolean); return ws.length && ws.every(w => have.has(w)); });
    if(!hit) why = "";
  }
  const isCloze = ch.game === "Cloze Combat" || ch.game === "Word Duel";
  const shown = isCloze ? ch.answerKey : best;
  let feedback;
  if(answer === null) feedback = `${L.idkFb} **${shown}**` + (why ? `\n${why}` : "");
  else if(forced) feedback = L.forced;
  else if(correct && accentMiss) feedback = `${L.accent} ${boldDiff(best, answer, ch, true)}`;
  else if(correct) feedback = pick(L.okFb);
  else feedback = `${L.fix} ${isCloze ? "**" + shown + "**" : boldDiff(best, answer, ch, accentMiss)}` + (accentMiss ? ` ${L.accentStrict}` : "") + (why ? `\n${why}` : "");
  const struggled = [];
  if(!correct || forced){
    if(ch.k === "w" && ch.wk) struggled.push({w:ch.wk, m:ch.wm});
    else if(ch.k === "s" && !forced){
      const bt = new Set(nrm(best, ch, false).split(" ")), at = new Set(nrm(answer || "", ch, false).split(" "));
      for(const [w, m] of (ch.cw || [])){
        const ws = norm(w, ch.al, false).split(" ").filter(Boolean);
        if(struggled.length < 3 && ws.length && ws.every(x => bt.has(x)) && !ws.every(x => at.has(x))) struggled.push({w, m});
      }
    }
  }
  const boss = !!ch.boss;
  // "Missed by a pixel" only when it really was close; otherwise a plain miss line
  let badPool = L.bad;
  if(!correct && answer !== null && !boss){
    const a = nrm(answer, ch, false), b = nrm(best || "", ch, false), mx = Math.max(a.length, b.length) || 1;
    const near = 1 - lev([...a], [...b]) / mx >= 0.8;
    badPool = L.bad.filter((x, i) => near ? (i === 3 || i === 4) : (i !== 3 && i !== 4));
  }
  const headline = correct ? pick(boss ? L.bossWin : L.ok) : answer === null ? pick(L.idk) : pick(boss ? L.bossLose : badPool);
  return {correct, headline, feedback, answer:shown, struggled: forced ? [] : struggled, al:ch.al};
}

/* ---------- Number words ---------- */
const EN_U = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const EN_T = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
function en999(n){
  const s = [];
  if(n >= 100){ s.push(EN_U[Math.floor(n / 100)] + " hundred"); n %= 100; }
  if(n >= 20){ const u = n % 10; s.push(EN_T[Math.floor(n / 10)] + (u ? "-" + EN_U[u] : "")); }
  else if(n > 0) s.push(EN_U[n]);
  return s.join(" ");
}
function enNum(n){
  if(n === 0) return "zero";
  const m = Math.floor(n / 1e6), k = Math.floor(n % 1e6 / 1000), r = n % 1000, p = [];
  if(m) p.push(en999(m) + " million");
  if(k) p.push(en999(k) + " thousand");
  if(r) p.push(en999(r));
  return p.join(" ");
}
const EN_O = ["","first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth","eleventh","twelfth","thirteenth","fourteenth","fifteenth","sixteenth","seventeenth","eighteenth","nineteenth"];
function enOrd(n){ if(n < 20) return EN_O[n]; const u = n % 10, tn = EN_T[Math.floor(n / 10)]; return u ? tn + "-" + EN_O[u] : tn.slice(0, -1) + "ieth"; }
const enSuffix = n => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th","st","nd","rd"][n % 10] || "th");

const ES_U = ["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve","veinte","veintiuno","veintidós","veintitrés","veinticuatro","veinticinco","veintiséis","veintisiete","veintiocho","veintinueve"];
const ES_T = ["","","","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"];
const ES_H = ["","ciento","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];
function es999(n){
  if(n === 100) return "cien";
  const s = [];
  if(n >= 100){ s.push(ES_H[Math.floor(n / 100)]); n %= 100; }
  if(n >= 30){ const u = n % 10; s.push(ES_T[Math.floor(n / 10)] + (u ? " y " + ES_U[u] : "")); }
  else if(n > 0) s.push(ES_U[n]);
  return s.join(" ");
}
const apoc = s => s.replace(/veintiuno$/, "veintiún").replace(/uno$/, "un");
function esNum(n){
  if(n === 0) return "cero";
  const m = Math.floor(n / 1e6), k = Math.floor(n % 1e6 / 1000), r = n % 1000, p = [];
  if(m) p.push(m === 1 ? "un millón" : apoc(es999(m)) + " millones");
  if(k) p.push(k === 1 ? "mil" : apoc(es999(k)) + " mil");
  if(r) p.push(es999(r));
  return p.join(" ");
}
const ES_O = ["",["primero","primer","primera"],["segundo","segunda"],["tercero","tercer","tercera"],["cuarto","cuarta"],["quinto","quinta"],["sexto","sexta"],["séptimo","séptima","sétimo"],["octavo","octava"],["noveno","novena"],["décimo","décima"]];
const FRACS = [
  ["1/2",["one half","half"],["un medio","medio","la mitad","una mitad"]],
  ["1/3",["one third"],["un tercio","una tercera parte","la tercera parte"]],
  ["2/3",["two thirds"],["dos tercios","dos terceras partes"]],
  ["1/4",["one quarter","one fourth"],["un cuarto","una cuarta parte","la cuarta parte"]],
  ["3/4",["three quarters","three fourths"],["tres cuartos","tres cuartas partes"]],
  ["1/5",["one fifth"],["un quinto","una quinta parte","la quinta parte"]],
  ["2/5",["two fifths"],["dos quintos","dos quintas partes"]],
  ["1/8",["one eighth"],["un octavo","una octava parte"]],
  ["1/10",["one tenth"],["un décimo","una décima parte","la décima parte"]]
];
function enTime(h, m, h24){
  const h12 = h % 12 || 12, H = enNum(h12), NH = enNum(h12 % 12 + 1), M = enNum(m), out = [];
  if(m === 0) out.push(`${H} o'clock`, H);
  else {
    if(m === 15) out.push(`a quarter past ${H}`, `quarter past ${H}`, `quarter after ${H}`, `a quarter after ${H}`, `fifteen past ${H}`);
    if(m === 30) out.push(`half past ${H}`);
    if(m === 45) out.push(`a quarter to ${NH}`, `quarter to ${NH}`, `quarter till ${NH}`, `fifteen to ${NH}`);
    out.push(m < 10 ? `${H} oh ${M}` : `${H} ${M}`);
    if(m < 30 && m !== 15) out.push(`${M} past ${H}`, `${M} after ${H}`);
    if(m > 30 && m !== 45) out.push(`${enNum(60 - m)} to ${NH}`, `${enNum(60 - m)} till ${NH}`);
  }
  if(h24 && h > 12) out.push(m === 0 ? `${enNum(h)} hundred` : `${enNum(h)} ${m < 10 ? "oh " + M : M}`, `${enNum(h)} hundred hours`);
  return out;
}
function esTime(h, m, h24){
  const h12 = h % 12 || 12, nh = h12 % 12 + 1;
  const hw = x => x === 1 ? "una" : esNum(x), art = x => x === 1 ? "la" : "las";
  const A = `${art(h12)} ${hw(h12)}`, N = `${art(nh)} ${hw(nh)}`, M = esNum(m), R = esNum(60 - m), out = [];
  if(m === 0) out.push(A, `${A} en punto`);
  else if(m === 15) out.push(`${A} y cuarto`, `${A} y quince`, `${A} quince`);
  else if(m === 30) out.push(`${A} y media`, `${A} y treinta`, `${A} treinta`);
  else if(m === 45) out.push(`${N} menos cuarto`, `${A} y cuarenta y cinco`, `${A} cuarenta y cinco`, `cuarto para ${N}`, `un cuarto para ${N}`, `quince para ${N}`);
  else if(m < 30){ out.push(`${A} y ${M}`, `${A} ${M}`); if(m < 10) out.push(`${A} cero ${M}`); }
  else out.push(`${A} y ${M}`, `${A} ${M}`, `${N} menos ${R}`, `${R} para ${N}`);
  if(h24 && h > 12){ const H = `las ${esNum(h)}`; out.push(m === 0 ? H : `${H} ${M}`, `${H} y ${M}`, m === 0 ? `${H} horas` : `${H} horas ${M}`); }
  return out;
}
function enPrice(d, c){
  const D = `${enNum(d)} ${d === 1 ? "dollar" : "dollars"}`;
  if(!c) return [D, enNum(d)];
  const C = `${enNum(c)} ${c === 1 ? "cent" : "cents"}`, cc = c < 10 ? "oh " + enNum(c) : enNum(c);
  return [`${D} and ${C}`, `${enNum(d)} ${cc}`, `${D} ${enNum(c)}`, `${enNum(d)} ${enNum(c)}`, `${D} ${cc}`, `${enNum(d)} ${C}`];
}
function esPrice(d, c){
  const D = d === 1 ? "un dólar" : `${apoc(esNum(d))} dólares`;
  if(!c) return [D, esNum(d), apoc(esNum(d))];
  const C = c === 1 ? "un centavo" : `${apoc(esNum(c))} centavos`;
  return [`${D} con ${C}`, `${D} y ${C}`, `${D} ${C}`, `${D} con ${esNum(c)}`, `${esNum(d)} con ${esNum(c)}`, `${esNum(d)} ${esNum(c)}`, `${D} ${esNum(c)}`, `${esNum(d)} con ${C}`];
}
function enYear(y){
  const hi = Math.floor(y / 100), lo = y % 100, out = [];
  if(y >= 2000 && y < 2010){ out.push(enNum(y)); if(lo) out.push(`twenty oh ${enNum(lo)}`); }
  else { out.push(lo === 0 ? `${enNum(hi)} hundred` : lo < 10 ? `${enNum(hi)} oh ${enNum(lo)}` : `${enNum(hi)} ${enNum(lo)}`); out.push(enNum(y)); }
  return out;
}
const NTIP = {
es:{ // learning Spanish, explained in English
  small:"0 to 15 are unique words you simply memorize. 16 to 19 fuse *diez y…* into one word with its own spelling: **dieciséis**, **diecisiete**. 20 is **veinte**.",
  tens:"The tens: **diez, veinte, treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa**, and 100 is **cien**. Watch **sesenta** (60) against **setenta** (70).",
  int:"16 to 29 are single words (**dieciséis**, **veintidós**); from 31 up, join with **y**: **treinta y uno**. Exactly 100 is **cien**; above that it becomes **ciento**, with no *y* after it: **ciento dos**.",
  big:"**Mil** never takes *un*: 1,000 = **mil**. Millions do: **un millón**, **dos millones**. Before mil and millones, uno shortens: **veintiún mil**.",
  math:"**más** = plus, **menos** = minus, **por** = times, **dividido entre** = divided by.",
  time:"Use **la una** for one o'clock and **las** for every other hour. **y cuarto** = quarter past, **y media** = half past, **menos cuarto** = quarter to.",
  price:"Say the dollars, then **con** and the cents: **tres dólares con cincuenta centavos**. One dollar is **un dólar**.",
  shop:"**cuesta** = it costs. **¿Cuánto es en total?** asks for the total, and **el cambio** is the change you get back.",
  ord:"**primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, décimo**. Primero and tercero drop the -o before a masculine noun: **el primer día**.",
  year:"Years are read as plain numbers: 1999 = **mil novecientos noventa y nueve**, 2024 = **dos mil veinticuatro**.",
  pct:"Percent is **por ciento**: 25% = **veinticinco por ciento**.",
  dec:"The decimal point is read **punto** (or **coma** in Spain): 3.5 = **tres punto cinco**.",
  frac:"**un medio** (or **la mitad**), **un tercio**, **un cuarto**; from fifths on, use the ordinal: **un quinto**. Plurals add -s: **tres cuartos**."
},
en:{ // learning English, explained in Spanish
  small:"Del 0 al 12 son palabras únicas. Del 13 al 19 terminan en **-teen**: thirteen, fourteen. Ojo con **fifteen** y **eighteen**. 20 es **twenty**.",
  tens:"Las decenas terminan en **-ty**: twenty, thirty, forty (sin *u*), fifty. No confundas **thirteen** (13) con **thirty** (30). 100 es **one hundred**.",
  int:"Del 13 al 19 terminan en **-teen** y las decenas en **-ty**: **thirteen** / **thirty**. Del 21 al 99 llevan guion: **twenty-one**. Después de hundred no hace falta *and*: **one hundred five**.",
  big:"**Thousand** y **million** no llevan -s después de un número: **two thousand**, **three million**. Se lee por grupos de tres cifras.",
  math:"**plus** = más, **minus** = menos, **times** = por, **divided by** = dividido entre.",
  time:"**o'clock** solo para horas en punto. **a quarter past** = y cuarto, **half past** = y media, **a quarter to** = menos cuarto. También puedes leer los números: **three fifteen**.",
  price:"Primero los dólares y luego los centavos: **three dollars and fifty cents**, o más corto: **three fifty**.",
  shop:"**It costs** = cuesta. **How much is it in total?** pide el total y **change** es el cambio que te devuelven.",
  ord:"**first, second, third**; después casi todos terminan en **-th**: fourth, fifth, sixth. Ojo con **fifth**, **eighth**, **ninth** y **twelfth**.",
  year:"Los años se leen en dos partes: 1999 = **nineteen ninety-nine**. Del 2000 al 2009: **two thousand five**. Después: **twenty twenty-four**.",
  pct:"Porcentaje se dice **percent** y no lleva plural: 25% = **twenty-five percent**.",
  dec:"El punto decimal se lee **point** y después cada cifra: 3.5 = **three point five**.",
  frac:"**one half**, **one third**, **one quarter** (o one fourth); después se usa el ordinal: **one fifth**. En plural llevan -s: **three quarters**."
}
};
const SHOP = {
  es:["un café","un taco","un libro","una camisa","una pizza","un jugo","un sombrero","una sopa"],
  en:["a coffee","a sandwich","a book","a shirt","a pizza","a juice","a hat","a soup"]
};
const OPW = {es:{"+":"más","-":"menos","x":"por","/":"dividido entre"}, en:{"+":"plus","-":"minus","x":"times","/":"divided by"}};
const fmt = n => n.toLocaleString("en-US");
const cap = s => s.charAt(0).toLocaleUpperCase() + s.slice(1);

const intTip = c => c.step === 10 && c.b === 100 ? "tens" : c.b <= 20 ? "small" : c.b >= 1000 ? "big" : "int";
// Build one generated number challenge: {game, target, acc, tip}
function numChallenge(c, tgt, lastGame, plain){
  const W = tgt === "es" ? esNum : enNum;
  switch(c.ty){
    case "int": {
      const n = c.step ? rnd(c.a / c.step, c.b / c.step) * c.step : rnd(c.a, c.b);
      if(!plain && c.b <= 100 && lastGame === "Digit Dictation" && n >= 2){
        const x = rnd(1, n - 1);
        return {game:"Linguistic Math", target:`${W(x)} ${OPW[tgt]["+"]} ${W(n - x)}`, acc:[W(n)], tip:intTip(c)};
      }
      return {game: !plain && c.b > 100 && lastGame === "Digit Dictation" ? "Real-World Numbers" : "Digit Dictation", target:fmt(n), acc:[W(n)], tip:intTip(c)};
    }
    case "math": {
      const op = pick(c.ops.split("")); let x, y, r;
      if(op === "+"){ x = rnd(0, c.b); y = rnd(0, c.b - x); r = x + y; }
      else if(op === "-"){ x = rnd(0, c.b); y = rnd(0, x); r = x - y; }
      else if(op === "x"){ x = rnd(2, 12); y = rnd(2, 12); r = x * y; }
      else { y = rnd(2, 12); r = rnd(2, 12); x = y * r; }
      return {game:"Linguistic Math", target:`${W(x)} ${OPW[tgt][op]} ${W(y)}`, acc:[W(r)], tip:"math"};
    }
    case "time": {
      let h = rnd(1, 12), m = 0;
      if(c.m === "half") m = pick([15, 30, 45]);
      else if(c.m === "min") m = rnd(1, 11) * 5;
      else if(c.m === "24"){ h = rnd(13, 23); m = rnd(0, 11) * 5; }
      return {game:"Clock Watcher", target:`${h}:${String(m).padStart(2, "0")}`, acc:(tgt === "es" ? esTime : enTime)(h, m, c.m === "24"), tip:"time"};
    }
    case "price": {
      const d = rnd(c.a, c.b), cents = c.cents ? pick([5, 10, 25, 50, 75, 99, rnd(1, 99)]) : 0;
      return {game:"Real-World Numbers", target:"$" + fmt(d) + (cents ? "." + String(cents).padStart(2, "0") : ""), acc:(tgt === "es" ? esPrice : enPrice)(d, cents), tip:"price"};
    }
    case "shop": {
      const items = shuffle(SHOP[tgt]).slice(0, c.n || 2), prices = items.map(() => rnd(1, c.b)), total = prices.reduce((a, b) => a + b, 0);
      const and = tgt === "es" ? " y " : " and ", costs = tgt === "es" ? "cuesta" : "costs";
      const list = items.map((it, i) => `${it} ${costs} $${prices[i]}`);
      let text = cap(list.length > 2 ? list.slice(0, -1).join(", ") + and + list[list.length - 1] : list.join(and)) + ". ", ans = total;
      if(c.change){
        const pay = [10, 20, 50, 100, 200, 500].find(p => p > total);
        ans = pay - total;
        text += tgt === "es" ? `Pagas con $${pay}. ¿Cuánto es el cambio?` : `You pay with $${pay}. How much change do you get?`;
      } else text += tgt === "es" ? "¿Cuánto es en total?" : "How much is it in total?";
      return {game:"Price Check", target:text, acc:(tgt === "es" ? esPrice : enPrice)(ans, 0), tip:"shop"};
    }
    case "year": { const y = rnd(c.a, c.b); return {game:"Real-World Numbers", target:String(y), acc: tgt === "es" ? [esNum(y)] : enYear(y), tip:"year"}; }
    case "ord": {
      if(tgt === "es"){ const n = c.b <= 10 ? rnd(c.a, c.b) : rnd(1, 10); return {game:"Real-World Numbers", target:n + ".º", acc:ES_O[n], tip:"ord"}; }
      const n = rnd(c.a, c.b);
      return {game:"Real-World Numbers", target:enSuffix(n), acc:[enOrd(n)], tip:"ord"};
    }
    case "pct": {
      const n = rnd(c.a, c.b), d = c.dec ? rnd(1, 9) : 0;
      const acc = tgt === "es"
        ? (d ? [`${esNum(n)} punto ${esNum(d)} por ciento`, `${esNum(n)} coma ${esNum(d)} por ciento`, `${esNum(n)} con ${esNum(d)} por ciento`] : [`${esNum(n)} por ciento`, `${apoc(esNum(n))} por ciento`])
        : [d ? `${enNum(n)} point ${enNum(d)} percent` : `${enNum(n)} percent`];
      return {game:"Real-World Numbers", target:n + (d ? "." + d : "") + "%", acc, tip:"pct"};
    }
    case "dec": {
      const n = rnd(0, c.b), d = rnd(1, 9);
      const acc = tgt === "es" ? [`${esNum(n)} punto ${esNum(d)}`, `${esNum(n)} coma ${esNum(d)}`, `${esNum(n)} con ${esNum(d)}`] : [`${enNum(n)} point ${enNum(d)}`];
      return {game:"Real-World Numbers", target:`${n}.${d}`, acc, tip:"dec"};
    }
    default: { const f = pick(FRACS); return {game:"Real-World Numbers", target:f[0], acc:f[tgt === "es" ? 2 : 1], tip:"frac"}; }
  }
}

/* ---------- Syllabus lookups ---------- */
function islandConcept(st, isl, i){
  const tgt = LANG_CODE[st.target], nat = LANG_CODE[st.native], L = GMT[nat];
  const raw = isl.it[i];
  const N = raw[nat === "en" ? 0 : 1], T = raw[tgt === "en" ? 0 : 1], cz = raw[tgt === "es" ? 2 : 3];
  return {t:canon(N), b:L.islTeach + (isl.nav.includes(i) ? " 🧭 " + L.islNav : ""), w:[[canon(T), canon(N)]], it:[[N, T, cz]], island:true};
}
const curIsland = st => ISLANDS.find(i => i.id === st.islandId) || ISLANDS[0];
function conceptAt(st, idx){
  const tgt = LANG_CODE[st.target];
  if(st.mode === 7) return (CONJ[tgt][st.level] || CONJ[tgt].A1)[idx];
  if(st.mode === 8) return (TRICKY[tgt][st.level] || TRICKY[tgt].A1)[idx];
  if(st.mode === 4) return (NUMSYL[st.level] || NUMSYL.A1)[idx];
  if(st.mode === 6) return islandConcept(st, curIsland(st), idx);
  return (COURSE[tgt][st.level] || COURSE[tgt].A1)[idx];
}
function findConcept(st, key){
  const k = String(key || "").toLowerCase(), tgt = LANG_CODE[st.target], nat = LANG_CODE[st.native];
  if(st.mode === 7){ for(const lv in CONJ[tgt]) for(const c of CONJ[tgt][lv]) if(c.t.toLowerCase() === k) return c; return null; }
  if(st.mode === 8){ for(const lv in TRICKY[tgt]) for(const c of TRICKY[tgt][lv]) if(c.t.toLowerCase() === k) return c; return null; }
  if(st.mode === 4){ for(const lv in NUMSYL) for(const c of NUMSYL[lv]) if(c[nat].toLowerCase() === k) return c; return null; }
  if(st.mode === 6){
    for(const isl of (typeof islandsFor === "function" ? islandsFor(st.target) : ISLANDS)) for(let i = 0; i < isl.it.length; i++){ const c = islandConcept(st, isl, i); if(c.t.toLowerCase() === k) return c; }
    return null;
  }
  for(const lv in COURSE[tgt]) for(const c of COURSE[tgt][lv]) if(c.t.toLowerCase() === k) return c;
  return null;
}
function syllabusFor(st){
  const tgt = LANG_CODE[st.target], nat = LANG_CODE[st.native];
  if(st.mode === 4) return (NUMSYL[st.level] || NUMSYL.A1).map(c => c[nat]);
  if(st.mode === 7) return (CONJ[tgt][st.level] || CONJ[tgt].A1).map(c => c.t);
  if(st.mode === 8) return (TRICKY[tgt][st.level] || TRICKY[tgt].A1).map(c => c.t);
  if(st.mode === 6){ const isl = curIsland(st); return isl.it.map((_, i) => islandConcept(st, isl, i).t); }
  return (COURSE[tgt][st.level] || COURSE[tgt].A1).map(c => c.t);
}

/* ---------- Vocab bank ---------- */
const VLIST = {}, VMAP = {en:{}, es:{}};
for(const lv in VOCAB){
  VLIST[lv] = [];
  for(const cat in VOCAB[lv]) for(const [es, en] of VOCAB[lv][cat]){
    const e = {es, en, cat, lv};
    VLIST[lv].push(e);
    VMAP.es[first(es).toLowerCase()] = e; VMAP.en[first(en).toLowerCase()] = e;
  }
}
const coreWord = (w, lang) => lang === "es" ? w.replace(/^(el|la|los|las) /i, "") : w.replace(/^to /i, "");

/* ---------- Challenge generation ---------- */
const bare = w => w.toLowerCase().replace(/[.,!?¿¡;:"“”]/g, "");
function blank(T, cz){
  const toks = T.split(" "), cw = cz.toLowerCase().split(" ");
  for(let i = 0; i + cw.length <= toks.length; i++){
    if(cw.every((w, k) => bare(toks[i + k]) === w)){
      const lead = (toks[i].match(/^[¿¡"“]+/) || [""])[0], tail = (toks[i + cw.length - 1].match(/[.,!?;:"”]+$/) || [""])[0];
      return toks.slice(0, i).concat(lead + "___" + tail, toks.slice(i + cw.length)).join(" ");
    }
  }
  return null;
}
function scramble(T){
  const words = T.split(" ").map(w => w.replace(/[.,!?¿¡;:"“”]/g, "")).filter(Boolean);
  if(words[0] !== "I" && !/^I'/.test(words[0])) words[0] = words[0].charAt(0).toLocaleLowerCase() + words[0].slice(1);
  let out = words;
  for(let i = 0; i < 12; i++){ out = shuffle(words); if(out.join(" ") !== words.join(" ")) break; }
  return out.join(" / ");
}

function generate(st, plan){
  if(st.mode === 5) return genVocab(st, plan);
  const res = {};
  if(!st.syllabus){
    res.syllabus = syllabusFor(st);
    st = Object.assign({}, st, {syllabus:res.syllabus, done:res.syllabus.map(() => false)});
    plan = Object.assign({}, plan, {kind:"syllabus", idx:0, boss:false});
  }
  const review = plan.kind !== "syllabus";
  let c = review ? findConcept(st, plan.key) : conceptAt(st, plan.idx);
  if(!c) c = conceptAt(st, Math.max(0, st.done.findIndex(d => !d)));
  if(st.mode === 7) return genConj(st, plan, c, review, res);
  return st.mode === 4 ? genNumber(st, plan, c, review, res) : genSentence(st, plan, c, review, res);
}

function bossWrap(L, plan, task){
  if(!plan.boss) return {boss:"", task};
  const boss = pick(L.bosses);
  return {boss, task:`👹 ${boss} ${L.bossTask} ${task}`};
}

function genSentence(st, plan, c, review, res){
  const nat = LANG_CODE[st.native], tgt = LANG_CODE[st.target], L = GMT[nat], surv = st.mode === 3;
  const recent = new Set(st.recentK || []);
  let combos = [];
  for(const it of c.it){
    const T = canon(it[1]), n = T.split(" ").length;
    combos.push({g:"Classic Mine", it}, {g:"Reverse Mine", it});
    if(n >= 3 && n <= 10) combos.push({g:"Syntax Scramble", it});
    if(it[2] && !surv && blank(T, it[2])) combos.push({g:"Cloze Combat", it});
    if(it[3] && !(surv && it[3][0] === "~")) combos.push({g:"Error Hunter", it});
  }
  if(st.mode === 8){
    combos = combos.filter(x => x.g === "Classic Mine" || x.g === "Error Hunter" || x.g === "Cloze Combat");
    for(const it of c.it) if((it[4] || c.o) && it[2] && blank(canon(it[1]), it[2])) combos.push({g:"Word Duel", it});
  }
  let pool = combos.filter(x => !recent.has(x.g + "|" + x.it[1]));
  if(!pool.length) pool = combos;
  if(plan.boss){
    const hard = pool.filter(x => x.g === "Classic Mine" || x.g === "Error Hunter"); if(hard.length) pool = hard;
    const fresh = pool.filter(x => x.g !== st.lastGame); if(fresh.length) pool = fresh;
  }
  else {
    const want = pool.filter(x => x.g === plan.game);
    if(want.length) pool = want;
    else { const notLast = pool.filter(x => x.g !== st.lastGame); if(notLast.length) pool = notLast; }
  }
  const sel = pick(pool), it = sel.it, N = canon(it[0]), T = canon(it[1]);
  const ch = {game:sel.g, al:tgt, k:"s", acc:[it[1]], answerKey:T, hint:"", tests:c.t, speak:"", cw:(c.w || []).slice(0, 6), why: c.island ? `**${T}** = ${N}` : c.b};
  let task;
  if(sel.g === "Classic Mine"){ task = L.tMine(LN[nat][st.target]); ch.target = N; ch.hint = L.hStart(T.split(" ")[0].replace(/^[¿¡]/, ""), T.split(" ").length); }
  else if(sel.g === "Reverse Mine"){ task = L.tRev(LN[nat][st.native]); ch.target = T; ch.acc = [it[0]]; ch.al = nat; ch.answerKey = N; ch.cw = []; }
  else if(sel.g === "Syntax Scramble"){ task = L.tScr; ch.target = scramble(T); ch.hint = L.hMeans(N); }
  else if(sel.g === "Cloze Combat"){ task = L.tCloze(N); ch.target = blank(T, it[2]); ch.acc = [it[2], it[1]]; ch.hint = L.hLetter(it[2].charAt(0), it[2].length); }
  else if(sel.g === "Word Duel"){
    task = L.tDuel; ch.target = blank(T, it[2]); ch.acc = [it[2], it[1]];
    ch.opts = shuffle([...new Set((it[4] || c.o).concat([it[2]]))]);
    ch.hint = L.hMeans(N);
  }
  else { task = surv ? L.tErrS : L.tErr(N); ch.target = it[3].replace(/^~/, ""); ch.hint = L.hTopic(c.t); }
  if(c.island && review && sel.g === "Classic Mine") ch.hint = L.hWords(T.split(" ").length);
  if(plan.boss) ch.hint = "";
  Object.assign(ch, bossWrap(L, plan, task));
  res.lesson = review
    ? {title:c.t, body: c.island ? L.islRev : c.b, words:[]}
    : {title:c.t, body:c.b, words: surv ? [] : (c.w || []).map(([w, m]) => ({w, m}))};
  res.challenge = ch;
  res.spotlight = surv ? null : (c.sp || null);
  res._k = sel.g + "|" + it[1];
  return res;
}

function genNumber(st, plan, c, review, res){
  const nat = LANG_CODE[st.native], tgt = LANG_CODE[st.target], L = GMT[nat], T = LN[nat][st.target];
  const q = numChallenge(c, tgt, st.lastGame, false);
  // Digit Dictation and Real-World Numbers are both "write it in words", so swap labels to avoid back-to-back repeats
  if(q.game === st.lastGame && (q.game === "Real-World Numbers" || q.game === "Digit Dictation") && c.ty !== "price") q.game = q.game === "Digit Dictation" ? "Real-World Numbers" : "Digit Dictation";
  const taskBy = {"Digit Dictation":L.nDD, "Linguistic Math":L.nLM, "Real-World Numbers":L.nRW, "Clock Watcher":L.nCW, "Price Check":L.nPC};
  const ch = {game:q.game, target:q.target, al:tgt, k:"n", nn:true, acc:q.acc, answerKey:q.acc[0], tests:c[nat], speak:"", cw:[], why:NTIP[tgt][q.tip],
    hint: plan.boss ? "" : L.hStart(q.acc[0].split(" ")[0], q.acc[0].split(" ").length)};
  Object.assign(ch, bossWrap(L, plan, taskBy[q.game](T)));
  let words = [];
  if(!review){
    if(c.ty === "math") words = c.ops.split("").map(o => ({w:OPW[tgt][o], m:{"+":"+","-":"−","x":"×","/":"÷"}[o]}));
    else if(c.ty === "shop") words = tgt === "es" ? [{w:"cuesta",m:"it costs"},{w:"en total",m:"in total"},{w:"el cambio",m:"the change"}] : [{w:"it costs",m:"cuesta"},{w:"in total",m:"en total"},{w:"change",m:"el cambio"}];
    else if(c.ty === "int" && (c.b - c.a) / (c.step || 1) <= 11){ const W = tgt === "es" ? esNum : enNum; for(let n = c.a; n <= c.b; n += c.step || 1) words.push({w:W(n), m:fmt(n)}); }
    else if(c.ty === "ord" && tgt === "es"){ const lo = c.b <= 10 ? c.a : 1, hi = Math.min(c.b, 10); for(let n = lo; n <= hi; n++) words.push({w:ES_O[n][0], m:n + ".º"}); }
    else if(c.ty === "ord" && c.b - c.a <= 11){ for(let n = c.a; n <= c.b; n++) words.push({w:enOrd(n), m:enSuffix(n)}); }
    else if(c.ty === "frac") words = FRACS.map(f => ({w:f[tgt === "es" ? 2 : 1][0], m:f[0]}));
    else { const seen = new Set(); for(let i = 0; i < 8 && words.length < 3; i++){ const s = numChallenge(c, tgt, "", true); if(!seen.has(s.target)){ seen.add(s.target); words.push({w:s.acc[0], m:s.target}); } } }
  }
  res.lesson = {title:c[nat], body:NTIP[tgt][c.ty === "int" ? intTip(c) : c.ty], words};
  res.challenge = ch;
  res.spotlight = null;
  return res;
}

/* Match Madness grows with difficulty: 4 rows at A1, +1 per level, +1 on a hot streak, up to 8 */
function matchRows(st){
  const lv = Math.max(0, LEVELS.indexOf(st.level));
  const hot = st.stats && st.stats.streak >= 5 ? 1 : 0;
  return Math.min(8, 4 + lv + hot);
}
function genVocab(st, plan){
  const nat = LANG_CODE[st.native], tgt = LANG_CODE[st.target], L = GMT[nat], res = {};
  const list = VLIST[st.level] || VLIST.A1;
  const key = e => first(e[tgt]), mean = e => first(e[nat]);
  const inSrs = new Set(st.srs.map(x => x.k.toLowerCase()));
  let entry, taught = (st.seenW || []).slice();
  if(plan.swarm){
    const group = arr => { const g = {}; for(const e of arr) (g[e.cat] = g[e.cat] || []).push(e); return g; };
    const seen = new Set(taught.map(x => x.toLowerCase()));
    let g = group(list.filter(e => !seen.has(key(e).toLowerCase()) && !inSrs.has(key(e).toLowerCase())));
    let cats = Object.keys(g).filter(c => g[c].length >= 3);
    if(!cats.length){ g = group(list.filter(e => !inSrs.has(key(e).toLowerCase()))); cats = Object.keys(g).filter(c => g[c].length >= 3); res._reset = true; }
    if(!cats.length){ g = group(list); cats = Object.keys(g); }
    const cat = pick(cats), three = shuffle(g[cat]).slice(0, 3);
    res.lesson = {title:CATS[cat][nat], body:L.swarm, words:three.map(e => ({w:key(e), m:mean(e)}))};
    entry = pick(three);
    res._seen = three.map(key);
    taught = taught.concat(res._seen);
  } else {
    entry = VMAP[tgt][String(plan.key || "").toLowerCase()] || pick(list);
    res.lesson = {title:CATS[entry.cat][nat], body:L.vrev, words:[]};
  }
  const k = key(entry), m = mean(entry), core = coreWord(k, tgt);
  // Odd One Out needs three already-taught words from one other category
  const known = [...new Set(taught.concat(st.srs.map(x => x.k)).map(x => x.toLowerCase()))].map(x => VMAP[tgt][x]).filter(e => e && e.cat !== entry.cat);
  const byCat = {}; for(const e of known) (byCat[e.cat] = byCat[e.cat] || []).push(e);
  const oddCats = Object.keys(byCat).filter(c => byCat[c].length >= 3);
  const games = ["Classic Mine", "Reverse Mine"];
  if(!/\s/.test(core) && core.length >= 4) games.push("Syntax Scramble");
  if(oddCats.length) games.push("Odd One Out");
  if(known.length >= 3) games.push("Match Madness");
  let game = games.includes(plan.game) ? plan.game : pick(games.filter(x => x !== st.lastGame).length ? games.filter(x => x !== st.lastGame) : games);
  if(plan.boss) game = "Classic Mine";
  const ch = {game, al:tgt, k:"w", acc:[entry[tgt]], answerKey:k, hint:"", tests:plan.swarm ? k : (plan.key || k), speak:"", cw:[], wk:k, wm:m, why:`**${k}** = ${m}`};
  let task;
  if(game === "Classic Mine"){ task = L.vMine(LN[nat][st.target]); ch.target = m; ch.hint = L.hLetter(core.charAt(0), core.length); }
  else if(game === "Reverse Mine"){ task = L.vRev(LN[nat][st.native]); ch.target = k; ch.acc = [entry[nat]]; ch.al = nat; ch.answerKey = m; }
  else if(game === "Syntax Scramble"){
    let letters = core.split("");
    for(let i = 0; i < 12; i++){ letters = shuffle(core.split("")); if(letters.join("") !== core) break; }
    task = L.vScr(m); ch.target = letters.join(" ");
  } else if(game === "Match Madness"){
    const others = shuffle(known).filter((e, i, a) => a.findIndex(x => mean(x) === mean(e)) === i && mean(e) !== m && key(e) !== k).slice(0, matchRows(st) - 1);
    ch.pairs = shuffle([[k, m]].concat(others.map(e => [key(e), mean(e)])));
    ch.k = "p"; ch.acc = ["✓"]; ch.target = ch.pairs.map(p => p[0]).join(" · "); ch.answerKey = ch.pairs.map(p => p[0] + " = " + p[1]).join(" · ");
    task = ch.pairs.length >= 6 ? L.vMatch2 : L.vMatch;
  } else {
    const oc = pick(oddCats), others = shuffle(byCat[oc]).slice(0, 3).map(key);
    task = L.vOdd; ch.target = shuffle(others.concat(k)).join("  ·  "); ch.hint = L.hOdd(CATS[oc][nat]);
  }
  if(plan.boss) ch.hint = "";
  Object.assign(ch, bossWrap(L, plan, task));
  res.challenge = ch;
  res.spotlight = null;
  return res;
}

/* ===================== Turn runner ===================== */
let undo = null;
function canOverride(){ return !!(undo && S && S.status === "playing" && S.mode !== 3 && S.judgement && !S.judgement.correct && !S.judgement.gaveUp); }
function runTurn(answer, force){
  hideError();
  const prev = S.current ? S.current.challenge : null;
  const prevPlan = S.current ? S.current.plan : null;
  const rolls = rollDice();
  lastPayload = {answer};
  undo = prev && prevPlan && !force && answer !== null ? {state:clone(S), answer} : null;
  const st2 = clone(S);
  let j = null;
  if(prev && prevPlan){
    j = gradeLocal(S, prev, answer, force);
    applyResult(st2, j.correct, prevPlan);
    const L = GMT[LANG_CODE[S.native]] || GMT.en;
    if(st2.status === "gameover") j.headline = L.over;
    else if(st2.status === "conquered") j.headline = L.won;
  }
  const res = {judgement:j};
  if(st2.status === "playing") Object.assign(res, generate(st2, makePlan(st2, rolls, prevPlan)));
  const xp0 = S.xp || 0;
  absorb(res, answer, rolls, prevPlan);
  if(j) recordAnswer(j.correct, (S.xp || 0) - xp0, !!force);
  recordTurn(prev, j && Object.assign({gaveUp: answer === null}, j));
  if(S.status === "playing"){
    if(res._k) S.recentK = (S.recentK || []).concat(res._k).slice(-12);
    if(res._seen) S.seenW = (res._reset ? [] : (S.seenW || [])).concat(res._seen).slice(-400);
    save();
  }
}
