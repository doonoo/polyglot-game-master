/* Also-right answers (alts.js): equivalent phrases accepted with the lesson's phrase shown,
   "My answer was right" remembered, planted mistakes never accepted, and the real game flow. */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 60) console.log("FAIL", ...a); };
const errs = [];
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:() => () => ({addColorStop(){}})}); w.addEventListener("error", e => errs.push(e.message)); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id), P = w.__pgm;
const mk = (acc, al, game) => ({k:"s", al, acc:[acc], game:game || "Classic Mine", target:"x", answerKey:P.canon(acc), cw:[], why:""});

setTimeout(() => {
  const st = {mode:1, target:"Spanish", native:"English", level:"A1"};
  const cases = [
    ["Adiós, hasta luego.", "es", "Adiós, nos vemos.", true],
    ["Adiós, hasta luego.", "es", "Adiós, hasta luegos.", false],
    ["Goodbye, see you later.", "en", "Bye, see you soon.", true],
    ["Thank you for the coffee.", "en", "Thanks for the coffee.", true],
    ["Thank you for the coffee.", "en", "Thanks for the tea.", false],
    ["I'll see you at noon.", "en", "I'll see you later at noon.", false],
    ["Hola, ¿qué tal?", "es", "Hola, ¿cómo estás?", true],
    ["Muchas gracias, adiós.", "es", "Gracias, chao.", true],
    ["Obrigado, até logo.", "pt", "Valeu, até mais.", true],
    ["Merci, au revoir.", "fr", "Merci beaucoup, salut.", true]
  ];
  for(const [a, al, ans, exp] of cases){
    const r = P.gradeLocal(st, mk(a, al), ans, false);
    if(r.correct !== exp) fail("grading", a, "<-", ans, r.correct);
    if(exp && !r.correct === false && !(r.feedback || "").includes(a.replace(/ ([!?])/g, "$1").slice(0, 8))) fail("lesson phrase not shown", a, r.feedback);
  }
  // gap / scramble / tap rounds and Tricky Pairs are left alone
  if(P.gradeLocal(st, mk("Adiós, hasta luego.", "es", "Cloze Combat"), "Adiós, nos vemos.", false).correct) fail("cloze accepted an equivalent");
  if(P.gradeLocal({...st, mode:8}, mk("Adiós, hasta luego.", "es"), "Adiós, nos vemos.", false).correct) fail("Tricky Pairs accepted an equivalent");
  const tap = mk("Adiós, hasta luego.", "es"); tap.opts = ["Adiós, hasta luego.", "Adiós, hasta luegos."];
  if(P.gradeLocal(st, tap, "Adiós, nos vemos.", false).correct) fail("tap round accepted an equivalent");

  // "My answer was right" is remembered for that question only
  const ch = mk("Tengo veinte años.", "es"), mine = "Yo tengo veinte años de edad.";
  if(P.gradeLocal(st, ch, mine, false).correct) fail("own answer accepted before override");
  P.gradeLocal(st, ch, mine, true);
  const again = P.gradeLocal(st, ch, mine, false);
  if(!again.correct) fail("override not remembered");
  if(!/Tengo veinte años/.test(again.feedback)) fail("remembered answer hides the lesson version", again.feedback);
  if(P.gradeLocal(st, mk("Tengo treinta años.", "es"), mine, false).correct) fail("override leaked to another question");

  // no planted mistake anywhere in the courses becomes acceptable
  let checked = 0;
  for(const code in P.COURSE) for(const lv in P.COURSE[code]) for(const L of P.COURSE[code][lv]) for(const it of (L.it || [])){
    if(!it[3]) continue;
    const al = ["es","en","fr","pt","zh","ar"].includes(code) ? code : "es";
    const c = {k:"s", al, acc:[it[1]], game:"Classic Mine", target:it[0], answerKey:P.canon(it[1]), cw:[], why:""};
    checked++;
    if(P.gradeLocal({mode:1, target:"x", native:"English"}, c, it[3], false).correct) fail("planted mistake accepted", code, lv, L.t, it[3]);
  }
  if(checked < 1000) fail("too few planted mistakes checked", checked);

  // the real flow: a Practice turn answered with an equivalent
  P.setup.target = "Spanish"; P.setup.native = "English"; $("targetSel").value = "Spanish"; P.setup.mode = 1; P.setup.level = "A1";
  d.querySelector('#modes [data-mode="1"]').click();
  P.startNew();
  for(let i = 0; i < 30; i++){
    const c = P.S.current.challenge;
    if(c.k === "s" && !Array.isArray(c.opts) && c.game === "Classic Mine") break;
    if(c.k === "p") $("giveUpBtn").click();
    else { const ok = Array.isArray(c.opts) ? c.opts.find(o => P.gradeLocal(P.S, c, o, false).correct) : P.variantsOf(c)[0]; $("answer").value = ok || "x"; $("submitBtn").click(); }
  }
  const c = P.S.current.challenge;
  if(c.game !== "Classic Mine") fail("no typed round found", c.game);
  else {
    c.acc = ["Adiós, hasta luego."]; c.answerKey = P.canon(c.acc[0]); c.al = "es";
    $("answer").value = "Adiós, nos vemos."; $("submitBtn").click();
    if(!P.S.judgement.correct) fail("game turn rejected the equivalent", JSON.stringify({strict:c.strict, mode:P.S.mode, boss:c.boss, nn:c.nn, opts:c.opts, k:c.k, fb:P.S.judgement.feedback}));
    if(!/hasta luego/.test($("feed").textContent)) fail("lesson phrase not shown in the feed");
    if(!P.S.judgement.alt) fail("judgement lost the also-right flag");
  }
  if(errs.length) fail("errors", errs.join(" // "));
  console.log(fails ? `test21: ${fails} failure(s)` : `test21: also-right answers OK (${checked} planted mistakes checked)`);
  process.exit(fails ? 1 : 0);
}, 500);
