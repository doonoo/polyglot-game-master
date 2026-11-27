/* ===================== More mini-games (2.11) =====================
   Seven tap games that join the rotation, each built from a base round like mcgames.js:
   - Gap Fill 🧩       (from Cloze Combat): pick the missing word.            Practice, Level Select, Islands
   - Order Up 🔀       (from Syntax Scramble): pick the sentence in the right order. + Survivor
   - Meaning Check ⚖️  (from Reverse Mine): does it mean this? yes / no.        Practice, Level Select, Vocab, Islands
   - Number Pick 🔢    (from the number games): digits shown, pick the words.  Numbers
   - Number Match 🔣   (from the number games): words shown, pick the digits.  Numbers
   - Who's Doing It? 👤 (from Verb Forge): a verb form, pick who does it.      Conjugation
   - Tense Detective 🕵️ (from Verb Forge): a verb form, pick its tense.        Conjugation
   Every option set is checked with gradeLocal so exactly one option is accepted; when a round
   can't be made honestly it stays the base game. The judging games keep what the card needs
   in ch.info (in the copy list), and the grade turns it into j.rw.rows for feedback.js. */
const MG2 = ["Gap Fill", "Order Up", "Meaning Check", "Number Pick", "Number Match", "Who's Doing It?", "Tense Detective"];
for(const g of MG2) MCG.add(g);
Object.assign(I18N.en, {"game.Gap Fill":"Gap Fill", "game.Order Up":"Order Up", "game.Meaning Check":"Meaning Check", "game.Number Pick":"Number Pick", "game.Number Match":"Number Match", "game.Who's Doing It?":"Who's Doing It?", "game.Tense Detective":"Tense Detective"});
Object.assign(I18N.es, {"game.Gap Fill":"Rellena el hueco", "game.Order Up":"Ordénalo", "game.Meaning Check":"¿Significa eso?", "game.Number Pick":"Elige el número", "game.Number Match":"¿Qué número es?", "game.Who's Doing It?":"¿Quién lo hace?", "game.Tense Detective":"Detective de tiempos"});
Object.assign(GAME_ICO, {"Gap Fill":"🧩", "Order Up":"🔀", "Meaning Check":"⚖️", "Number Pick":"🔢", "Number Match":"🔣", "Who's Doing It?":"👤", "Tense Detective":"🕵️"});
const MG2T = {
  en:{gap:"Pick the missing word.", ord:"These words are mixed up. Which sentence has them in the right order?", mc:m => `Does it mean “${m}”?`, yes:"✓ Yes", no:"✗ No",
      np:T => `Pick the ${T} words for this.`, nm:"Which number is this?", who:"Who is doing it? Pick the person for this verb form.", ten:"Which tense is this verb form?",
      sent:"The sentence:", means:"✏️ It means:", notThat:"✗ Not:", form:"The verb form:", whoIs:"✏️ Who:", tenseIs:"✏️ Tense:",
      okY:"Yes, that's what it means.", okN:"Right, it means something else.", badY:"It did mean that.", badN:"No, it means something else.", ok:"Right!", bad:"Not quite."},
  es:{gap:"Elige la palabra que falta.", ord:"Estas palabras están desordenadas. ¿Qué frase las tiene en el orden correcto?", mc:m => `¿Significa «${m}»?`, yes:"✓ Sí", no:"✗ No",
      np:T => `Elige cómo se dice en ${T}.`, nm:"¿Qué número es?", who:"¿Quién lo hace? Elige la persona de esta forma verbal.", ten:"¿Qué tiempo verbal es esta forma?",
      sent:"La frase:", means:"✏️ Significa:", notThat:"✗ No significa:", form:"La forma verbal:", whoIs:"✏️ Quién:", tenseIs:"✏️ Tiempo:",
      okY:"Sí, eso significa.", okN:"Exacto, significa otra cosa.", badY:"Sí significaba eso.", badN:"No, significa otra cosa.", ok:"¡Bien!", bad:"Casi."}
};
const mg2T = st => MG2T[LANG_CODE[st.native]] || MG2T.en;
const MG2_BASE = {"Gap Fill":"Cloze Combat", "Order Up":"Syntax Scramble", "Meaning Check":"Reverse Mine"};
const MG2_MODES = {1:["Gap Fill", "Order Up", "Meaning Check"], 2:["Gap Fill", "Order Up", "Meaning Check"], 3:["Order Up"], 5:["Meaning Check"],
  6:["Gap Fill", "Order Up", "Meaning Check"], 4:["Number Pick", "Number Match"], 7:["Who's Doing It?", "Tense Detective"]};
gamesFor = wrap("gamesFor", "mcgames2", gamesFor, orig => function(st){
  const g = orig.apply(this, arguments);
  let add = (MG2_MODES[st && st.mode] || []).filter(x => !g.includes(x));
  if(st && st.mode === 7 && st.target && LANG_CODE[st.target] === "zh") add = [];   // Mandarin's mode 7 is measure words
  if(st && st.mode === 6 && st.target && !["es", "en"].includes(LANG_CODE[st.target])) add = add.filter(x => x !== "Gap Fill");   // their islands have no gaps
  return g.concat(add);
});

const mg2Ok = (st, ch, a) => { try{ return gradeLocal(st, ch, a, false).correct; }catch(e){ return false; } };
const mg2Key = (ch, x) => norm(String(x), ch.al, false);
// up to n wrong options from list: distinct, and none of them accepted
function mg2Wrongs(st, ch, right, list, n){
  const seen = new Set([mg2Key(ch, right)]), out = [];
  for(const x of list){
    if(out.length >= n) break;
    if(!x) continue;
    const k = mg2Key(ch, x);
    if(!k || seen.has(k) || mg2Ok(st, ch, x)) continue;
    seen.add(k); out.push(String(x));
  }
  return out;
}
const mg2Bare = w => w.replace(/[.,!?¿¡;:"“”«»。？！，]/g, "");

/* ---------- sentence and vocab games ---------- */
function mg2Gap(st, ch){
  // islands teach one phrase at a time: borrow the missing words of the island's other phrases
  if(st.mode === 6 && ch.mcx && (ch.mcx.s || []).length < 4){
    const tgt = LANG_CODE[st.target], i = tgt === "es" ? 2 : tgt === "en" ? 3 : -1, isl = curIsland(st);
    if(i > 0) ch.mcx.s = (ch.mcx.s || []).concat(shuffle((isl.it || []).map(x => x[i]).filter(x => x && !/\s/.test(x))), shuffle(ISLANDS.filter(x => x !== isl && !x.lang).flatMap(x => x.it.map(y => y[i]))).filter(x => x && !/\s/.test(x)).slice(0, 20));
  }
  mcBuild(st, ch);                       // built as Cloze Combat, so the answer is the missing word
  if(!Array.isArray(ch.opts) || ch.opts.some(o => /\s/.test(o) !== /\s/.test(first(ch.acc[0])))){ delete ch.opts; return false; }
  ch.game = "Gap Fill"; ch.task = mg2T(st).gap;
  return true;
}
function mg2Order(st, ch){
  const T = String(ch.answerKey || ""), toks = T.split(" ").map(mg2Bare).filter(Boolean);
  if(toks.length < 3 || toks.length > 10) return false;
  const capF = a => { const b = a.slice(); if(b[0] && b[0] !== "I" && !/^I'/.test(b[0])) b[0] = b[0].charAt(0).toLocaleUpperCase() + b[0].slice(1); return b.join(" "); };
  const low = toks.slice(); if(low[0] !== "I" && !/^I'/.test(low[0])) low[0] = low[0].charAt(0).toLocaleLowerCase() + low[0].slice(1);
  const right = capF(low);
  if(!mg2Ok(st, ch, right)) return false;
  const cands = [];
  // neighbours trading places first (the hardest to spot), then full shuffles
  for(let i = 0; i + 1 < low.length; i++){ const a = low.slice(); [a[i], a[i + 1]] = [a[i + 1], a[i]]; cands.push(capF(a)); }
  for(let i = 0; i < 12; i++) cands.push(capF(shuffle(low)));
  const wr = mg2Wrongs(st, ch, right, shuffle(cands.slice(0, low.length - 1)).concat(cands.slice(low.length - 1)), 3);
  if(wr.length < 2) return false;
  ch.game = "Order Up"; ch.task = mg2T(st).ord;
  ch.opts = shuffle([right].concat(wr)); ch.hint = "";
  return true;
}
function mg2Mean(st, ch, mcx){
  const L = mg2T(st), N = String(ch.answerKey || ""), sibs = shuffle(((mcx && mcx.s) || []).slice());
  if(!N || !mg2Ok(st, ch, N)) return false;
  const other = mg2Wrongs(st, ch, N, sibs, 1)[0];
  const showRight = !other || Math.random() < 0.5;
  if(!showRight && !other) return false;
  const prop = showRight ? N : other;
  ch.game = "Meaning Check"; ch.task = L.mc(prop);
  ch.info = {kind:"mean", shown:String(ch.target || ""), fix:N, prop, right:showRight};
  ch.acc = [showRight ? L.yes : L.no]; ch.answerKey = ch.acc[0];
  ch.opts = [L.yes, L.no]; ch.hint = ""; ch.cw = [];
  return true;
}
function mg2Wrap(orig){
  return function(st, plan){
    const name = plan && plan.game;
    if(!plan || plan.boss || !MG2_BASE[name]) return orig.apply(this, arguments);
    const args = [...arguments], base = MG2_BASE[name];
    args[1] = Object.assign({}, plan, {game:base, mcg:true});
    const res = orig.apply(this, args), ch = res && res.challenge;
    if(!ch) return res;
    try{
      const mcx = ch.mcx;
      let ok = false;
      if(name === "Gap Fill" && ch.game === "Cloze Combat") ok = mg2Gap(st, ch);
      else if(name === "Order Up" && ch.game === "Syntax Scramble" && ch.k !== "w") ok = mg2Order(st, ch);
      else if(name === "Meaning Check" && ch.game === "Reverse Mine") ok = mg2Mean(st, ch, mcx);
      if(ok){ delete ch.mcx; if(res._k) res._k = res._k.replace(/^[^|]*/, ch.game); }
      else { if(ch.game === "Gap Fill") ch.game = "Cloze Combat"; delete ch.opts; delete ch.info; }
    }catch(e){}
    return res;
  };
}
genSentence = wrap("genSentence", "mcgames2", genSentence, mg2Wrap);
genVocab = wrap("genVocab", "mcgames2", genVocab, mg2Wrap);

/* ---------- number games ---------- */
const MG2_NUMW = new Set(["Digit Dictation", "Real-World Numbers", "Clock Watcher"]);
genNumber = wrap("genNumber", "mcgames2", genNumber, orig => function(st, plan, c){
  const res = orig.apply(this, arguments);
  const name = plan && plan.game, ch = res && res.challenge;
  if(!ch || !plan || plan.boss || (name !== "Number Pick" && name !== "Number Match") || !MG2_NUMW.has(ch.game) || !c) return res;
  try{
    const tgt = LANG_CODE[st.target], sam = [];
    for(let i = 0; i < 40 && sam.length < 10; i++){
      const q = numChallenge(c, tgt, "", true);
      if(q && q.target && q.acc && q.acc[0] && q.target !== ch.target && !sam.some(x => x.target === q.target)) sam.push(q);
    }
    if(name === "Number Pick"){
      const right = first(ch.acc[0]);
      if(!mg2Ok(st, ch, right)) return res;
      const wr = Array.isArray(ch.opts) ? ch.opts.filter(o => mg2Key(ch, o) !== mg2Key(ch, right) && !mg2Ok(st, ch, o)).slice(0, 3) : mg2Wrongs(st, ch, right, sam.map(q => q.acc[0]), 3);
      if(wr.length < 2) return res;
      ch.game = "Number Pick"; ch.task = mg2T(st).np(LN[LANG_CODE[st.native]][st.target]);
      ch.opts = shuffle([right].concat(wr)); ch.hint = "";
    } else {
      const digits = String(ch.target), words = first(ch.acc[0]);
      const m = Object.assign({}, ch, {target:words, acc:[digits], answerKey:digits, nn:false, k:"s"});
      const wr = mg2Wrongs(st, m, digits, sam.map(q => q.target), 3);
      if(wr.length < 2 || !mg2Ok(st, m, digits)) return res;
      Object.assign(ch, m, {game:"Number Match", task:mg2T(st).nm, opts:shuffle([digits].concat(wr)), hint:"", why:`**${words}** = ${digits}`});
    }
    delete ch.mcx;
    if(res._k) res._k = res._k.replace(/^[^|]*/, ch.game);
  }catch(e){}
  return res;
});

/* ---------- conjugation games ---------- */
const MG2_XL = ["fr", "pt", "ar"];
const mg2Form = (tgt, inf, ten, p) => {
  try{
    if(tgt === "es") return esForm(inf, ten, p)[0];
    if(tgt === "en") return enForm(inf, ten, p, EN_PRON[p][0])[0];
    if(MG2_XL.includes(tgt)) return xlForm(tgt, inf, ten, p)[0];
  }catch(e){}
  return "";
};
const mg2Persons = tgt => tgt === "es" || tgt === "en" ? 5 : MG2_XL.includes(tgt) ? xlPronList(tgt).length : 0;
const mg2PLabel = (tgt, p) => tgt === "es" ? ES_PLABEL[p] : tgt === "en" ? EN_PRON[p].join(" / ") : xlPronLabel(tgt, p);
const mg2TName = (tgt, ten) => tgt === "es" || tgt === "en" ? CT_NAME[tgt][ten] : XCT[tgt][ten];
const mg2Show = (tgt, q) => tgt === "ar" && q.forms[1] ? `\u2068${q.forms[0]}\u2069 (${q.forms[1]})` : q.forms[0];
const mg2Inf = (tgt, inf) => MG2_XL.includes(tgt) ? xlVerbLabel(tgt, inf) : inf;
// the tenses this course has taught up to this level (the distractors for Tense Detective)
function mg2Tenses(st, tgt){
  const out = new Set(), C = CONJ[tgt] || {}, top = LEVELS.indexOf(st.level);
  for(const lv of Object.keys(C)) if(LEVELS.indexOf(lv) <= Math.max(top, 1)) for(const c of C[lv]) for(const t of c.ten || []) out.add(t);
  return [...out];
}
genConj = wrap("genConj", "mcgames2", genConj, orig => function(st, plan, c){
  const name = plan && plan.game;
  if(!plan || plan.boss || (name !== "Who's Doing It?" && name !== "Tense Detective")) return orig.apply(this, arguments);
  const tgt = LANG_CODE[st.target];
  const res = orig.call(this, st, Object.assign({}, plan, {game:"Verb Forge"}), ...[...arguments].slice(2));
  const ch = res && res.challenge, q = mcLastQ;
  if(!ch || !q || !q.forms || !q.forms[0] || /Q$|Neg$/.test(q.ten) || !mg2Persons(tgt)) return res;
  try{
    const L = mg2T(st), shown = q.forms[0], k = x => norm(x, tgt, true);
    const sameForm = (inf, ten, p) => k(mg2Form(tgt, inf, ten, p)) === k(shown);
    let right, labels, rowL, rowV;
    if(name === "Who's Doing It?"){
      const ps = [...Array(mg2Persons(tgt)).keys()];
      if(ps.some(p => p !== q.p && sameForm(q.inf, q.ten, p))) return res;   // another person has this form too
      right = mg2PLabel(tgt, q.p);
      labels = shuffle(ps.filter(p => p !== q.p)).map(p => mg2PLabel(tgt, p));
      ch.target = `${mg2Show(tgt, q)} · ${mg2Inf(tgt, q.inf)} · ${mg2TName(tgt, q.ten)}`;
      ch.task = L.who; rowL = L.whoIs; rowV = right;
    } else {
      const ts = mg2Tenses(st, tgt).filter(t => t !== q.ten && !/Q$|Neg$/.test(t) && (tgt !== "en" || isBeTense(t) === isBeTense(q.ten)));
      if(ts.some(t => sameForm(q.inf, t, q.p))) return res;   // the same form in another taught tense
      right = mg2TName(tgt, q.ten);
      labels = shuffle(ts).map(t => mg2TName(tgt, t));
      ch.target = `${mg2PLabel(tgt, q.p)} · ${mg2Show(tgt, q)} · ${mg2Inf(tgt, q.inf)}`;
      ch.task = L.ten; rowL = L.tenseIs; rowV = right;
    }
    const m = Object.assign({}, ch, {acc:[right], answerKey:right, k:"s", al:LANG_CODE[st.native]});
    const wr = mg2Wrongs(st, m, right, labels, 3);
    if(wr.length < 2 || !mg2Ok(st, m, right)) return res;
    Object.assign(ch, m, {game:name, opts:shuffle([right].concat(wr)), hint:"",
      info:{kind:"conj", rows:[[L.form, `${mg2Show(tgt, q)} (${q.inf})`], [rowL, rowV]]}});
  }catch(e){}
  return res;
});

/* ---------- the answer card for the judging games ---------- */
gradeLocal = wrap("gradeLocal", "mcgames2", gradeLocal, orig => function(st, ch, answer){
  const j = orig.apply(this, arguments);
  try{
    if(!ch || !st || !ch.info || answer === null || (ch.game !== "Meaning Check" && ch.game !== "Who's Doing It?" && ch.game !== "Tense Detective")) return j;
    const L = mg2T(st), I = ch.info;
    if(I.kind === "mean"){
      const rows = [[L.sent, I.shown], [L.means, I.fix]];
      if(!I.right) rows.push([L.notThat, I.prop, "del"]);
      return Object.assign({}, j, {feedback:j.correct ? (I.right ? L.okY : L.okN) : (I.right ? L.badY : L.badN), struggled:[], rw:{rows}});
    }
    return Object.assign({}, j, {feedback:j.correct ? L.ok : L.bad, struggled:[], rw:{rows:I.rows}});
  }catch(e){ return j; }
});
renderExtras = wrap("renderExtras", "mcgames2", renderExtras, orig => function(){
  const r = orig.apply(this, arguments);
  try{
    const ch = S && S.current && S.current.challenge, tl = $("tiles");
    if(ch && (ch.game === "Who's Doing It?" || ch.game === "Tense Detective" || ch.game === "Meaning Check" || ch.game === "Number Match")){ tl.dir = "ltr"; tl.querySelectorAll(".tile").forEach(t => t.dir = "ltr"); }
  }catch(e){}
  return r;
});
if(window.__PGM_TEST) window.__mg2 = {MG2, gamesFor:st => gamesFor(st), gen:(st, plan) => generate(st, plan)};
