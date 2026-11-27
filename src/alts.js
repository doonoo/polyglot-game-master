/* ===================== Also-right answers (2.13.1) =====================
   A sentence can be said more than one way. Two things make the grading accept a valid answer
   that isn't the one the lesson is drilling, while still showing the lesson's phrase:
   1. ALT_EQ: phrases that are interchangeable when they make up a whole clause (between
      punctuation), e.g. "Adiós, nos vemos." for "Adiós, hasta luego." A group with lead:true
      may also start a longer clause ("Thanks for the coffee" = "Thank you for the coffee").
   2. "My answer was right" is remembered per question: once you overrule the grade, that exact
      answer counts next time too (profile.okAns).
   Only typed full answers: tap rounds, gap / scramble games, numbers and Tricky Pairs are left
   alone, and planted mistakes are never touched (they differ in a word, not a whole phrase). */
const ALT_EQ = {
  es:[
    ["hasta luego", "nos vemos", "hasta pronto", "hasta la vista"],
    ["adiós", "chao", "chau"],
    ["hola", "buenas"],
    ["gracias", "muchas gracias", "mil gracias"],
    ["de nada", "no hay de qué", "con gusto", "a la orden"],
    ["¿cómo estás?", "¿qué tal?", "¿cómo te va?", "¿cómo andas?"],
    ["¿cómo está usted?", "¿cómo está?"],
    ["muy bien", "muy bien, gracias", "bien, gracias"],
    ["perdón", "disculpa", "perdona"],
    ["disculpe", "perdone"],
    ["lo siento", "lo siento mucho"],
    ["encantado", "mucho gusto", "encantada"],
    ["por favor", "porfa"],
    ["vale", "de acuerdo", "está bien", "ok"],
    ["claro", "por supuesto", "claro que sí"],
    ["buenas noches", "que descanses"],
    ["¡salud!", "¡chin chin!"]
  ],
  en:[
    ["see you later", "see you", "see you soon", "bye for now", "catch you later"],
    ["goodbye", "bye", "bye-bye"],
    ["hello", "hi", "hey"],
    ["thank you", "thanks", "thank you very much", "thanks a lot", "many thanks", {lead:true}],
    ["you're welcome", "no problem", "my pleasure", "don't mention it", "not at all", "no worries"],
    ["how are you?", "how are you doing?", "how's it going?", "how are things?"],
    ["very well", "very well, thanks", "fine, thanks", "very well, thank you"],
    ["sorry", "i'm sorry", "excuse me", "pardon me"],
    ["i'm very sorry", "i'm so sorry", "i'm really sorry"],
    ["nice to meet you", "pleased to meet you", "it's nice to meet you", "it's a pleasure to meet you"],
    ["okay", "ok", "all right", "alright", "fine"],
    ["of course", "sure", "certainly", "of course!"],
    ["good night", "night", "sleep well"],
    ["cheers!", "cheers"]
  ],
  fr:[
    ["à plus tard", "à tout à l'heure", "à bientôt", "à plus", "à la prochaine"],
    ["au revoir", "salut", "ciao"],
    ["bonjour", "salut"],
    ["merci", "merci beaucoup", "merci bien", "mille mercis"],
    ["de rien", "je vous en prie", "je t'en prie", "pas de quoi", "avec plaisir"],
    ["comment ça va ?", "ça va ?", "comment vas-tu ?", "comment allez-vous ?"],
    ["pardon", "excusez-moi", "excuse-moi", "désolé", "désolée"],
    ["enchanté", "enchantée", "ravi de vous rencontrer"],
    ["d'accord", "ok", "ça marche", "entendu"],
    ["bien sûr", "évidemment", "bien sûr que oui"]
  ],
  pt:[
    ["até logo", "até mais", "até breve", "a gente se vê", "até já"],
    ["tchau", "adeus", "tchau tchau"],
    ["oi", "olá"],
    ["obrigado", "obrigada", "muito obrigado", "muito obrigada", "valeu"],
    ["de nada", "por nada", "imagina", "não há de quê"],
    ["como vai?", "tudo bem?", "como você está?", "tudo bom?", "como vai você?"],
    ["desculpa", "desculpe", "com licença", "perdão"],
    ["prazer", "muito prazer", "prazer em conhecer você"],
    ["tá bom", "está bem", "ok", "beleza", "combinado"],
    ["claro", "com certeza", "claro que sim"]
  ]
};
/* loose clause form: lower case, no accents, apostrophes unified, no ¿¡ */
const altLoose = (s, keepAcc) => { let x = String(s).toLowerCase().normalize("NFD"); if(!keepAcc) x = x.replace(/[\u0300-\u036f]/g, ""); return x.normalize("NFC").replace(/[\u2019\u2018`\u00b4]/g, "'").replace(/[\u00bf\u00a1"\u201c\u201d\u00ab\u00bb]/g, "").replace(/\s+/g, " ").trim(); };
const ALT_IDX = {};   // lang → [{set:Set(loose phrases), lead, id}]
for(const lang in ALT_EQ) ALT_IDX[lang] = ALT_EQ[lang].map((g, id) => {
  const lead = g.some(x => typeof x === "object" && x.lead);
  return {id, lead, set:new Set(g.filter(x => typeof x === "string").map(x => altLoose(x).replace(/[?!.,]+$/g, "").trim()))};
});
/* split into clauses on punctuation and swap any whole-clause phrase for its group id */
function altKey(s, lang, strict){
  const groups = ALT_IDX[lang] || [];
  // strict modes (Survivor, bosses) keep accents in the rest of the clause
  return altLoose(s, strict).split(/[,.;:!?…]+/).map(c => c.trim()).filter(Boolean).map(c => {
    for(const g of groups){
      const cl = strict ? altLoose(c) : c;
      if(g.set.has(cl)) return strict && !ALT_ACC.has(c) ? c : "§" + g.id;
      if(g.lead) for(const p of g.set){ if(cl.startsWith(p + " ")) return "§" + g.id + " " + c.slice(p.length + 1); }
    }
    return c;
  }).join(" | ");
}
const ALT_SKIP = new Set(["Cloze Combat", "Word Duel", "Syntax Scramble", "Order Up", "Gap Fill", "Match Madness", "Odd One Out", "Letter Scramble"]);
const altOk = (st, ch) => ch && ch.k !== "p" && !ch.nn && !Array.isArray(ch.opts) && !ALT_SKIP.has(ch.game) && st.mode !== 8;
const altItemKey = (ch, vars) => (ch.al || "") + "|" + altLoose(vars[0] || ch.answerKey || "");
profile.okAns = {};
/* every phrase as written in ALT_EQ (accents kept), so strict modes still require the accents */
const ALT_ACC = new Set(Object.values(ALT_EQ).flat(2).filter(x => typeof x === "string").map(x => altLoose(x, true).replace(/[?!.,]+$/g, "").trim()));
/* planted mistakes are never accepted, whatever was overruled before */
let ALT_BAD = null;
function altBad(a){
  if(!ALT_BAD){ ALT_BAD = new Set(); for(const code in COURSE) for(const lv in COURSE[code]) for(const L of COURSE[code][lv]) for(const it of (L.it || [])) if(it[3]) ALT_BAD.add(altLoose(it[3])); }
  return ALT_BAD.has(altLoose(a));
}
/* an overruled answer is only remembered when it shares real words with the lesson's sentence */
function altClose(answer, vars){
  const ws = x => new Set(altLoose(x).replace(/[^\p{L}\p{N}' ]/gu, " ").split(" ").filter(Boolean));
  const a = ws(answer);
  return vars.some(v => { const w = [...ws(v)]; return w.filter(x => a.has(x)).length >= Math.max(1, Math.ceil(w.length / 3)); });
}
function altRemember(ch, vars, answer){
  const k = altItemKey(ch, vars), a = altLoose(answer); if(!a || a.length > 200) return;
  const m = profile.okAns || (profile.okAns = {});
  const list = m[k] || (m[k] = []);
  if(!list.includes(a)) list.push(a);
  if(list.length > 5) list.shift();
  const keys = Object.keys(m); if(keys.length > 400) delete m[keys[0]];
  saveProfile();
}
const ALT_TXT = {
  en:{ok:"That works too! This lesson is practising:", mine:"Accepted: you marked this answer right before. The lesson's version:"},
  es:{ok:"¡También vale! Esta lección practica:", mine:"Aceptada: ya marcaste esta respuesta como correcta. La versión de la lección:"}
};
gradeLocal = wrap("gradeLocal", "alts", gradeLocal, orig => function(st, ch, answer, force){
  const res = orig(st, ch, answer, force);
  if(answer === null || answer === undefined || !altOk(st, ch)) return res;
  const vars = variantsOf(ch);
  // "My answer was right": remember it for this question (only for the live turn, not a preview)
  if(force && res && res.correct && typeof answer === "string" && answer.trim()){
    const own = vars.some(v => altLoose(v) === altLoose(answer));
    if(!own && !altBad(answer) && altClose(answer, vars)) altRemember(ch, vars, answer);
    return res;
  }
  if(!res || res.correct || altBad(answer)) return res;
  const strict = st.mode === 3 || !!ch.strict || !!(st.mode === 9 && st.custom && st.custom.strict);
  const T = ALT_TXT[LANG_CODE[st.native]] || ALT_TXT.en, lesson = vars[0] || ch.answerKey || res.answer;
  const L = GMT[LANG_CODE[st.native]] || GMT.en;
  const yes = how => Object.assign({}, res, {correct:true, headline:pick(L.ok), feedback:`${how} **${lesson}**`, answer:lesson, struggled:[], alt:true});
  const mine = (profile.okAns || {})[altItemKey(ch, vars)];
  if(mine && mine.includes(altLoose(answer))) return yes(T.mine);
  const lang = ch.al;
  if(ALT_IDX[lang]){
    const a = altKey(answer, lang, strict);
    if(vars.some(v => altKey(v, lang, strict) === a)) return yes(T.ok);
  }
  return res;
});

if(window.__PGM_TEST) window.__alts = {altKey, ALT_EQ, altLoose, ALT_ACC};
