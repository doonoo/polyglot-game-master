/* Feedback: shows the question, marks wrong/missing words, explains look-alikes and ser/estar; content regressions */
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; console.log("FAIL", ...a); };
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
  beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:true, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; }});
const w = dom.window, d = w.document, P = w.__pgm, $ = id => d.getElementById(id);
P.setup.mode = 1; $("startBtn").click();
function play(ch, ans){
  P.S.current.plan.boss = false; Object.assign(P.S.current.challenge, ch, {why:"", cw:[]});
  $("answer").value = ans; $("submitBtn").click();
  return $("judgeCard");
}
let jc = play({game:"Classic Mine", target:"I'm married.", acc:["Estoy casado.|Estoy casada.|Soy casado.|Soy casada."], k:"s", al:"es", answerKey:"Estoy casado."}, "Soy cansado");
if(!/Question:\s*I'm married\./.test(jc.textContent)) fail("question not shown", jc.textContent.slice(0, 200));
if(!jc.querySelector(".dx-del") || jc.querySelector(".dx-del").textContent !== "cansado") fail("wrong word not marked");
if(!jc.querySelector(".dx-add")) fail("right word not marked");
if(!/cansado.*casado/.test(jc.querySelector(".fbnotes") ? jc.querySelector(".fbnotes").textContent : "")) fail("look-alike note missing");
if(!jc.querySelector('[data-act="override"]') && P.canOverride && P.canOverride()) fail("override button lost");
if(/pixel/i.test(P.S.judgement.headline) === false && !/Close|pixel/.test(P.S.judgement.headline)) fail("near miss should get a 'close' headline", P.S.judgement.headline);
jc = play({game:"Classic Mine", target:"Where is the station?", acc:["¿Dónde está la estación?"], k:"s", al:"es", answerKey:"¿Dónde está la estación?"}, "donde es la estacion");
if(!/estar/.test(jc.querySelector(".fbnotes").textContent)) fail("ser/estar note missing");
if(!jc.querySelector(".dx-acc")) fail("accent not marked");
jc = play({game:"Reverse Mine", target:"Estoy casado.", acc:["I am married.|I'm married."], k:"s", al:"en", answerKey:"I'm married."}, "the weather is nice today");
if(/pixel|Close/i.test(P.S.judgement.headline)) fail("far miss got a 'close' headline", P.S.judgement.headline);
// the long lesson tip only shows when one of its phrases is in the answer
const tip = P.COURSE.es.A1.find(c => /me llamo/.test(c.b || "") && /soy de/.test(c.b || "")).b;
function playWhy(ch, ans){ P.S.current.plan.boss = false; Object.assign(P.S.current.challenge, ch, {cw:[], why:tip}); $("answer").value = ans; $("submitBtn").click(); return P.S.judgement.feedback; }
let fb = playWhy({game:"Classic Mine", target:"I'm married.", acc:["Estoy casado.|Soy casado."], k:"s", al:"es", answerKey:"Estoy casado."}, "Tengo cansado");
if(/me llamo/.test(fb) === /estoy casado/i.test(tip) ? false : /me llamo/.test(fb) && !/estoy casado/i.test(tip)) fail("irrelevant tip shown", fb);
fb = playWhy({game:"Classic Mine", target:"I live in Texas.", acc:["Vivo en Texas."], k:"s", al:"es", answerKey:"Vivo en Texas."}, "Vivo a Texas");
if(/me llamo/.test(fb)) fail("irrelevant tip shown for 'Vivo en Texas'", fb);
fb = playWhy({game:"Classic Mine", target:"Where are you from?", acc:["¿De dónde eres?"], k:"s", al:"es", answerKey:"¿De dónde eres?"}, "Donde eres de");
if(!/me llamo/.test(fb)) fail("relevant tip hidden for '¿De dónde eres?'", fb);
// grammar tips: every miss gets one that matches the sentence
jc = play({game:"Classic Mine", target:"I'm married.", acc:["Estoy casado.|Soy casado."], k:"s", al:"es", answerKey:"Estoy casado."}, "Tengo cansado");
if(!jc.querySelector(".fbtips")) fail("no grammar tip on a miss");
jc = play({game:"Classic Mine", target:"I want you to speak.", acc:["Quiero que hables."], k:"s", al:"es", answerKey:"Quiero que hables."}, "Quiero que hablas");
if(!/subjunctive/i.test(jc.querySelector(".fbtips") ? jc.querySelector(".fbtips").textContent : "")) fail("subjunctive tip missing", jc.textContent.slice(-300));
if(!/same word, different ending/.test(jc.querySelector(".fbnotes").textContent)) fail("ending note missing");
P.S.current.plan.boss = false; Object.assign(P.S.current.challenge, {game:"Classic Mine", target:"She works here.", acc:["She works here."], k:"s", al:"en", answerKey:"She works here.", why:"", cw:[]}); $("giveUpBtn").click();
if(!/he\/she\/it/.test($("judgeCard").textContent)) fail("tip missing after I don't know");
const cov = {es:[0,0], en:[0,0]};
for(const l of ["es","en"]) for(const lv in P.COURSE[l]) for(const c of P.COURSE[l][lv]) for(const it of c.it){ cov[l][1]++; if(P.tipsFor(P.first(it[1]), "", l, []).length) cov[l][0]++; }
for(const l of ["es","en"]) if(cov[l][0] / cov[l][1] < 0.95) fail("tip coverage too low", l, cov[l]);
// content regression: soy casado is accepted
const item = P.COURSE.es.A1.flatMap(c => c.it).find(it => it[0] === "I'm married.");
if(!item || !P.expand(item[1]).includes("Soy casado.")) fail("'Soy casado' not accepted");
console.log(fails ? fails + " FAILURES" : "ALL TESTS PASSED");
process.exit(fails ? 1 : 0);
