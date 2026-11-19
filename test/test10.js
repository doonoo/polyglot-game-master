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
// content regression: soy casado is accepted
const item = P.COURSE.es.A1.flatMap(c => c.it).find(it => it[0] === "I'm married.");
if(!item || !P.expand(item[1]).includes("Soy casado.")) fail("'Soy casado' not accepted");
console.log(fails ? fails + " FAILURES" : "ALL TESTS PASSED");
process.exit(fails ? 1 : 0);
