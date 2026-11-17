/* ===================== Conjugation Gym (mode 7) ===================== */
MODES.push({id:7, name:"Conjugation Gym", ico:"🏋️", color:"#FFC48C", desc:"Drill verb forms tense by tense."});

/* ---------- Spanish engine ---------- */
const ESV = {};
[
 // regular -ar
 ["hablar","to speak"],["trabajar","to work"],["estudiar","to study"],["comprar","to buy"],["caminar","to walk"],["cocinar","to cook"],
 ["escuchar","to listen"],["llamar","to call"],["bailar","to dance"],["viajar","to travel"],["terminar","to finish"],
 ["buscar","to look for"],["llegar","to arrive"],["pagar","to pay"],["tocar","to touch / play"],
 ["empezar","to begin",{ch:"ie"}],["jugar","to play",{ch:"uj"}],["pensar","to think",{ch:"ie"}],["cerrar","to close",{ch:"ie"}],["encontrar","to find",{ch:"ue"}],
 // regular -er / -ir
 ["comer","to eat"],["beber","to drink"],["aprender","to learn"],["correr","to run"],["vender","to sell"],
 ["leer","to read",{pret:"leí,leíste,leyó,leímos,leyeron",part:"leído",ger:"leyendo"}],
 ["creer","to believe",{pret:"creí,creíste,creyó,creímos,creyeron",part:"creído",ger:"creyendo"}],
 ["vivir","to live"],["escribir","to write",{part:"escrito"}],["abrir","to open",{part:"abierto"}],["recibir","to receive"],
 // stem changers and irregulars
 ["querer","to want",{ch:"ie",strong:"quis",fut:"querr"}],
 ["poder","to be able to",{ch:"ue",strong:"pud",fut:"podr",ger:"pudiendo"}],
 ["volver","to return",{ch:"ue",part:"vuelto"}],
 ["dormir","to sleep",{ch:"ue"}],
 ["pedir","to ask for",{ch:"i"}],["servir","to serve",{ch:"i"}],["repetir","to repeat",{ch:"i"}],
 ["ser","to be",{pres:"soy,eres,es,somos,son",pret:"fui,fuiste,fue,fuimos,fueron",impf:"era,eras,era,éramos,eran",subj:"sea,seas,sea,seamos,sean",part:"sido",ger:"siendo"}],
 ["estar","to be",{pres:"estoy,estás,está,estamos,están",strong:"estuv",subj:"esté,estés,esté,estemos,estén"}],
 ["ir","to go",{pres:"voy,vas,va,vamos,van",pret:"fui,fuiste,fue,fuimos,fueron",impf:"iba,ibas,iba,íbamos,iban",subj:"vaya,vayas,vaya,vayamos,vayan",part:"ido",ger:"yendo"}],
 ["tener","to have",{yo:"tengo",ch:"ie",strong:"tuv",fut:"tendr"}],
 ["venir","to come",{yo:"vengo",ch:"ie",strong:"vin",fut:"vendr",ger:"viniendo"}],
 ["dar","to give",{pres:"doy,das,da,damos,dan",pret:"di,diste,dio,dimos,dieron",subj:"dé,des,dé,demos,den"}],
 ["hacer","to do / make",{yo:"hago",pret:"hice,hiciste,hizo,hicimos,hicieron",fut:"har",part:"hecho"}],
 ["poner","to put",{yo:"pongo",strong:"pus",fut:"pondr",part:"puesto"}],
 ["salir","to leave",{yo:"salgo",fut:"saldr"}],
 ["traer","to bring",{yo:"traigo",strong:"traj",j:1,part:"traído",ger:"trayendo"}],
 ["decir","to say",{yo:"digo",ch:"i",strong:"dij",j:1,fut:"dir",part:"dicho",ger:"diciendo"}],
 ["saber","to know",{yo:"sé",strong:"sup",fut:"sabr",subj:"sepa,sepas,sepa,sepamos,sepan"}],
 ["conocer","to know (be familiar with)",{yo:"conozco"}],
 ["ver","to see",{pres:"veo,ves,ve,vemos,ven",pret:"vi,viste,vio,vimos,vieron",impf:"veía,veías,veía,veíamos,veían",subj:"vea,veas,vea,veamos,vean",part:"visto"}]
].forEach(([v, en, o]) => { ESV[v] = Object.assign({v, en, cls:v.slice(-2), stem:v.slice(0, -2)}, o || {}); });

const ES_END = {
  pres:{ar:["o","as","a","amos","an"], er:["o","es","e","emos","en"], ir:["o","es","e","imos","en"]},
  pret:{ar:["é","aste","ó","amos","aron"], er:["í","iste","ió","imos","ieron"], ir:["í","iste","ió","imos","ieron"]},
  impf:{ar:["aba","abas","aba","ábamos","aban"], er:["ía","ías","ía","íamos","ían"], ir:["ía","ías","ía","íamos","ían"]},
  subj:{ar:["e","es","e","emos","en"], er:["a","as","a","amos","an"], ir:["a","as","a","amos","an"]}
};
const ES_AUX = {
  haberPres:["he","has","ha","hemos","han"], haberImpf:["había","habías","había","habíamos","habían"],
  haberFut:["habré","habrás","habrá","habremos","habrán"], haberCond:["habría","habrías","habría","habríamos","habrían"],
  haberSubj:["haya","hayas","haya","hayamos","hayan"], haberImpSubj:["hubiera","hubieras","hubiera","hubiéramos","hubieran"],
  estarPres:["estoy","estás","está","estamos","están"], estarImpf:["estaba","estabas","estaba","estábamos","estaban"]
};
function esChange(stem, ch){
  const sw = (s, a, b) => { const i = s.lastIndexOf(a); return i < 0 ? s : s.slice(0, i) + b + s.slice(i + a.length); };
  if(ch === "ie") return sw(stem, "e", "ie");
  if(ch === "ue") return sw(stem, "o", "ue");
  if(ch === "i") return sw(stem, "e", "i");
  if(ch === "uj") return sw(stem, "u", "ue");
  return stem;
}
function esWeak(V){ // -ir stem changers in preterite 3rd person, gerund, subjunctive nosotros
  if(V.cls !== "ir" || !V.ch) return V.stem;
  const i = V.ch === "ue" ? V.stem.lastIndexOf("o") : V.stem.lastIndexOf("e");
  return i < 0 ? V.stem : V.stem.slice(0, i) + (V.ch === "ue" ? "u" : "i") + V.stem.slice(i + 1);
}
const esSpell = s => s.replace(/c$/, "qu").replace(/g$/, "gu").replace(/z$/, "c");
const esList = s => s.split(",");
function esPres(V){
  if(V.pres) return esList(V.pres);
  return ES_END.pres[V.cls].map((e, i) => i === 0 && V.yo ? V.yo : (V.ch && i !== 3 ? esChange(V.stem, V.ch) : V.stem) + e);
}
function esPret(V){
  if(V.pret) return esList(V.pret);
  if(V.strong) return ["e","iste","o","imos", V.j ? "eron" : "ieron"].map(e => V.strong + e);
  return ES_END.pret[V.cls].map((e, i) => {
    if(i === 0 && V.cls === "ar") return esSpell(V.stem) + e;
    if((i === 2 || i === 4) && V.cls === "ir") return esWeak(V) + e;
    return V.stem + e;
  });
}
const esImpf = V => V.impf ? esList(V.impf) : ES_END.impf[V.cls].map(e => V.stem + e);
const esFut = V => ["é","ás","á","emos","án"].map(e => (V.fut || V.v) + e);
const esCond = V => ["ía","ías","ía","íamos","ían"].map(e => (V.fut || V.v) + e);
function esSubj(V){
  if(V.subj) return esList(V.subj);
  return ES_END.subj[V.cls].map((e, i) => {
    let base;
    if(V.yo) base = V.yo.slice(0, -1);
    else if(i !== 3) base = V.ch ? esChange(V.stem, V.ch) : V.stem;
    else base = esWeak(V);
    if(V.cls === "ar") base = esSpell(base);
    return base + e;
  });
}
function esImpSubj(V){
  const base = esPret(V)[4].replace(/ron$/, ""), acc = base.slice(0, -1) + ({a:"á", e:"é"}[base.slice(-1)] || base.slice(-1));
  return ["ra","ras","ra","ramos","ran"].map((e, i) => (i === 3 ? acc : base) + e);
}
const esPart = V => V.part || V.stem + (V.cls === "ar" ? "ado" : "ido");
const esGer = V => V.ger || (V.cls === "ar" ? V.stem + "ando" : esWeak(V) + "iendo");
const ES_TENSE = {
  pres:esPres, pret:esPret, impf:esImpf, fut:esFut, cond:esCond, subj:esSubj, impSubj:esImpSubj,
  perf:V => ES_AUX.haberPres.map(a => a + " " + esPart(V)), plup:V => ES_AUX.haberImpf.map(a => a + " " + esPart(V)),
  futPerf:V => ES_AUX.haberFut.map(a => a + " " + esPart(V)), condPerf:V => ES_AUX.haberCond.map(a => a + " " + esPart(V)),
  perfSubj:V => ES_AUX.haberSubj.map(a => a + " " + esPart(V)), plupSubj:V => ES_AUX.haberImpSubj.map(a => a + " " + esPart(V)),
  prog:V => ES_AUX.estarPres.map(a => a + " " + esGer(V)), pastProg:V => ES_AUX.estarImpf.map(a => a + " " + esGer(V))
};
const esForm = (inf, ten, p) => [ES_TENSE[ten](ESV[inf])[p]];
const ES_PRON = [["yo"],["tú"],["él","ella","usted"],["nosotros","nosotras"],["ellos","ellas","ustedes"]];
const ES_PLABEL = ["yo","tú","él / ella / usted","nosotros","ellos / ellas / ustedes"];

/* ---------- English engine ---------- */
const ENV = {};
[
 "work,works,worked,worked,working,trabajar","play,plays,played,played,playing,jugar","live,lives,lived,lived,living,vivir",
 "watch,watches,watched,watched,watching,mirar","listen,listens,listened,listened,listening,escuchar","open,opens,opened,opened,opening,abrir",
 "close,closes,closed,closed,closing,cerrar","dance,dances,danced,danced,dancing,bailar","wash,washes,washed,washed,washing,lavar",
 "enjoy,enjoys,enjoyed,enjoyed,enjoying,disfrutar","fix,fixes,fixed,fixed,fixing,arreglar","like,likes,liked,liked,liking,gustar",
 "study,studies,studied,studied,studying,estudiar","try,tries,tried,tried,trying,intentar","carry,carries,carried,carried,carrying,llevar",
 "stop,stops,stopped,stopped,stopping,parar","plan,plans,planned,planned,planning,planear",
 "travel,travels,traveled|travelled,traveled|travelled,traveling|travelling,viajar","finish,finishes,finished,finished,finishing,terminar",
 "call,calls,called,called,calling,llamar","help,helps,helped,helped,helping,ayudar","wait,waits,waited,waited,waiting,esperar",
 "talk,talks,talked,talked,talking,hablar (conversar)","visit,visits,visited,visited,visiting,visitar",
 "go,goes,went,gone,going,ir","have,has,had,had,having,tener","do,does,did,done,doing,hacer","make,makes,made,made,making,hacer (fabricar)",
 "eat,eats,ate,eaten,eating,comer","drink,drinks,drank,drunk,drinking,beber","see,sees,saw,seen,seeing,ver","take,takes,took,taken,taking,tomar",
 "come,comes,came,come,coming,venir","write,writes,wrote,written,writing,escribir","speak,speaks,spoke,spoken,speaking,hablar",
 "buy,buys,bought,bought,buying,comprar","bring,brings,brought,brought,bringing,traer","think,thinks,thought,thought,thinking,pensar",
 "teach,teaches,taught,taught,teaching,enseñar","sleep,sleeps,slept,slept,sleeping,dormir","leave,leaves,left,left,leaving,irse / salir",
 "get,gets,got,gotten|got,getting,conseguir","run,runs,ran,run,running,correr","swim,swims,swam,swum,swimming,nadar",
 "begin,begins,began,begun,beginning,empezar","forget,forgets,forgot,forgotten,forgetting,olvidar","know,knows,knew,known,knowing,saber",
 "give,gives,gave,given,giving,dar","say,says,said,said,saying,decir","read,reads,read,read,reading,leer","put,puts,put,put,putting,poner",
 "cut,cuts,cut,cut,cutting,cortar","sing,sings,sang,sung,singing,cantar","fly,flies,flew,flown,flying,volar","choose,chooses,chose,chosen,choosing,elegir",
 "break,breaks,broke,broken,breaking,romper","lose,loses,lost,lost,losing,perder","win,wins,won,won,winning,ganar",
 "drive,drives,drove,driven,driving,manejar","build,builds,built,built,building,construir","tell,tells,told,told,telling,contar / decir",
 "be,is,was,been,being,ser / estar"
].forEach(line => { const [b, s, p, pp, ing, es] = line.split(","); ENV[b] = {b, s, p, pp, ing, es}; });

const EN_BE = ["am","are","is","are","are"], EN_WAS = ["was","were","was","were","were"], EN_HAVE = ["have","have","has","have","have"], EN_DO = ["do","do","does","do","do"];
const alts = s => s.split("|");
const comb = (...parts) => parts.reduce((acc, p) => acc.flatMap(a => (Array.isArray(p) ? p : [p]).map(x => a ? a + " " + x : x)), [""]);
const EN_TENSE = {
  bePres:(V, p) => [EN_BE[p]], beNeg:(V, p) => [EN_BE[p] + " not"], bePast:(V, p) => [EN_WAS[p]],
  pres:(V, p) => alts(p === 2 ? V.s : V.b), presNeg:(V, p) => comb(EN_DO[p], "not", alts(V.b)),
  presQ:(V, p, pron) => comb(EN_DO[p], pron.toLowerCase(), alts(V.b)),
  past:(V, p) => alts(V.p), pastNeg:(V, p) => comb("did", "not", alts(V.b)), pastQ:(V, p, pron) => comb("did", pron.toLowerCase(), alts(V.b)),
  prog:(V, p) => comb(EN_BE[p], alts(V.ing)), goingTo:(V, p) => comb(EN_BE[p], "going to", alts(V.b)), will:(V, p) => comb("will", alts(V.b)),
  presPerf:(V, p) => comb(EN_HAVE[p], alts(V.pp)), presPerfNeg:(V, p) => comb(EN_HAVE[p], "not", alts(V.pp)),
  pastProg:(V, p) => comb(EN_WAS[p], alts(V.ing)), would:(V, p) => comb("would", alts(V.b)), usedTo:(V, p) => comb("used to", alts(V.b)),
  pastPerf:(V, p) => comb("had", alts(V.pp)), presPerfProg:(V, p) => comb(EN_HAVE[p], "been", alts(V.ing)),
  futProg:(V, p) => comb("will be", alts(V.ing)), futPerf:(V, p) => comb("will have", alts(V.pp)),
  condPerf:(V, p) => comb("would have", alts(V.pp)), pastPerfProg:(V, p) => comb("had been", alts(V.ing))
};
const enForm = (inf, ten, p, pron) => EN_TENSE[ten](ENV[inf], p, pron || "");
const EN_PRON = [["I"],["you"],["he","she"],["we"],["they"]];
const isBeTense = t => /^be[A-Z]/.test(t);

/* ---------- Tense names, frames and texts ---------- */
const CT_NAME = {
  es:{pres:"present",pret:"preterite",impf:"imperfect",fut:"future",cond:"conditional",subj:"present subjunctive",impSubj:"imperfect subjunctive",
      perf:"present perfect",plup:"pluperfect",futPerf:"future perfect",condPerf:"conditional perfect",perfSubj:"present perfect subjunctive",
      plupSubj:"pluperfect subjunctive",prog:"present progressive",pastProg:"past progressive"},
  en:{bePres:"presente",beNeg:"negativo",bePast:"pasado",pres:"presente simple",presNeg:"presente negativo",presQ:"pregunta en presente",
      past:"pasado simple",pastNeg:"pasado negativo",pastQ:"pregunta en pasado",prog:"presente continuo",goingTo:"futuro con going to",
      will:"futuro con will",presPerf:"presente perfecto",presPerfNeg:"presente perfecto negativo",pastProg:"pasado continuo",
      would:"condicional (would)",usedTo:"used to",pastPerf:"pasado perfecto",presPerfProg:"presente perfecto continuo",
      futProg:"futuro continuo",futPerf:"futuro perfecto",condPerf:"condicional perfecto",pastPerfProg:"pasado perfecto continuo"}
};
const CT_FRAME = {
  es:{pres:["Todos los días","Normalmente","Los lunes"],pret:["Ayer","Anoche","La semana pasada","El año pasado"],impf:["Antes","De pequeños","En aquella época"],
      prog:["Ahora mismo","En este momento"],fut:["Mañana","El próximo año","Algún día"],cond:["Con más dinero","Con más tiempo"],
      perf:["Hoy","Este año","Esta semana"],plup:["Cuando llegué, ya","Para entonces, ya"],subj:["Es importante que","Ojalá que","Es posible que"],
      impSubj:["Era necesario que","Ojalá","Me sorprendió que"],perfSubj:["Me alegra que","Es posible que","Ojalá que"],plupSubj:["Ojalá","Si"],
      futPerf:["Para mañana","Para el viernes"],condPerf:["Con más tiempo","Con más ayuda"],pastProg:["A las ocho","Anoche a esta hora"]},
  en:{bePres:"happy today",beNeg:"at home now",bePast:"tired yesterday",pres:"every day",presNeg:"on Sundays",past:"yesterday",pastNeg:"last night",
      prog:"right now",goingTo:"tomorrow",will:"next year",presPerf:"already",presPerfNeg:"yet",pastProg:"at eight last night",would:"with more money",
      usedTo:"as a child",pastPerf:"before the party",presPerfProg:"for two hours",futProg:"at this time tomorrow",futPerf:"by Friday",
      condPerf:"with more time",pastPerfProg:"for an hour"}
};
Object.assign(GMT.en, {
  cForge:T => `Conjugate the verb in ${T}.`, cTime:t => `Fill in the verb in the ${t}.`, cSlip:t => `One verb form is wrong. It should be in the ${t}. Type the correct form.`,
  cRev:"Review round: this tense is back because you missed it.", cHow:"Answer with the verb form only, or with the pronoun in front."
});
Object.assign(GMT.es, {
  cForge:T => `Conjuga el verbo en ${T}.`, cTime:t => `Completa con el verbo en ${t}.`, cSlip:t => `Una forma verbal está mal. Debe ir en ${t}. Escribe la forma correcta.`,
  cRev:"Ronda de repaso: este tiempo vuelve porque lo fallaste.", cHow:"Responde solo con el verbo, o con el pronombre delante."
});

/* ---------- Syllabus ---------- */
const ESR_AR = ["hablar","trabajar","estudiar","comprar","caminar","cocinar","escuchar","llamar","bailar","viajar"];
const ESR_ER = ["comer","beber","aprender","correr","vender"], ESR_IR = ["vivir","escribir","abrir","recibir"];
const ES_IRR = ["ser","estar","ir","tener","venir","hacer","poner","salir","decir","querer","poder","dormir","pedir","saber","conocer","ver","dar"];
const ALL_ES_T = ["pres","pret","impf","fut","cond","perf","plup","subj","impSubj","prog"];
const CONJ = {es:{
A1:[
 {t:"Present: regular -ar verbs",ten:["pres"],vb:ESR_AR,b:"Drop -ar and add **-o, -as, -a, -amos, -an**: hablo, hablas, habla, hablamos, hablan."},
 {t:"Present: regular -er verbs",ten:["pres"],vb:ESR_ER.concat(["leer","creer"]),b:"Drop -er and add **-o, -es, -e, -emos, -en**: como, comes, come, comemos, comen."},
 {t:"Present: regular -ir verbs",ten:["pres"],vb:ESR_IR,b:"Same as -er verbs except nosotros ends in **-imos**: vivimos."},
 {t:"Present: ser",ten:["pres"],vb:["ser"],b:"Fully irregular: **soy, eres, es, somos, son**."},
 {t:"Present: estar",ten:["pres"],vb:["estar"],b:"**estoy, estás, está, estamos, están**. Mind the accents."},
 {t:"Present: tener and venir",ten:["pres"],vb:["tener","venir"],b:"Yo ends in **-go** (tengo, vengo), and **e → ie** in tú, él and ellos: tienes, viene."},
 {t:"Present: ir and dar",ten:["pres"],vb:["ir","dar"],b:"ir: **voy, vas, va, vamos, van**. dar: **doy, das, da, damos, dan**."},
 {t:"Present: yo-go verbs",ten:["pres"],vb:["hacer","poner","salir","traer"],b:"Only yo is irregular: **hago, pongo, salgo, traigo**. Everything else is regular."},
 {t:"Present: e → ie",ten:["pres"],vb:["querer","pensar","empezar","cerrar"],b:"The stem e becomes **ie**, except in nosotros: quiero, queremos."},
 {t:"Present: o → ue",ten:["pres"],vb:["poder","dormir","volver","encontrar"],b:"The stem o becomes **ue**, except in nosotros: puedo, podemos."},
 {t:"Present: e → i",ten:["pres"],vb:["pedir","servir","repetir","decir"],b:"In these -ir verbs e becomes **i**, except in nosotros: pido, pedimos. decir also has yo **digo**."},
 {t:"Present: jugar",ten:["pres"],vb:["jugar"],b:"The only **u → ue** verb: juego, juegas, juega, jugamos, juegan."},
 {t:"Present: saber, conocer, ver",ten:["pres"],vb:["saber","conocer","ver"],b:"Irregular yo forms: **sé, conozco, veo**. The rest follow the pattern."},
 {t:"Present review: regular verbs",ten:["pres"],vb:ESR_AR.concat(ESR_ER, ESR_IR),b:"Mixed regular verbs. Watch the ending: -ar, -er or -ir."},
 {t:"Present review: irregular verbs",ten:["pres"],vb:ES_IRR,b:"Every irregular you have met so far, mixed together."}
],
A2:[
 {t:"Preterite: regular -ar",ten:["pret"],vb:ESR_AR,b:"**-é, -aste, -ó, -amos, -aron**. The accent matters: hablo (I speak) vs **habló** (he spoke)."},
 {t:"Preterite: regular -er and -ir",ten:["pret"],vb:ESR_ER.concat(ESR_IR),b:"**-í, -iste, -ió, -imos, -ieron**: comí, comiste, comió, comimos, comieron."},
 {t:"Preterite: spelling changes in yo",ten:["pret"],vb:["buscar","llegar","pagar","tocar","empezar","jugar"],b:"To keep the sound, yo changes spelling: **busqué, llegué, empecé, jugué**. The other forms are regular."},
 {t:"Preterite: ser and ir",ten:["pret"],vb:["ser","ir"],b:"They share one set: **fui, fuiste, fue, fuimos, fueron**. Context tells you which verb it is."},
 {t:"Preterite: tener, estar, poder, poner",ten:["pret"],vb:["tener","estar","poder","poner"],b:"Irregular stems **tuv-, estuv-, pud-, pus-** + -e, -iste, -o, -imos, -ieron. No accents."},
 {t:"Preterite: hacer, querer, venir, saber",ten:["pret"],vb:["hacer","querer","venir","saber"],b:"Stems **hic-** (hizo), **quis-, vin-, sup-**. No accents."},
 {t:"Preterite: decir and traer",ten:["pret"],vb:["decir","traer"],b:"j-stems: **dije, traje**. Ellos ends in **-eron**, not -ieron: dijeron, trajeron."},
 {t:"Preterite: dar and ver",ten:["pret"],vb:["dar","ver"],b:"**di, diste, dio, dimos, dieron**. **vi, viste, vio, vimos, vieron**. No accents."},
 {t:"Preterite: -ir stem changers",ten:["pret"],vb:["pedir","dormir","servir","repetir"],b:"Only él and ellos change: **pidió, pidieron, durmió, durmieron**."},
 {t:"Preterite: leer and creer",ten:["pret"],vb:["leer","creer"],b:"The i becomes **y** in él and ellos: **leyó, leyeron, creyó, creyeron**."},
 {t:"Imperfect: -ar verbs",ten:["impf"],vb:["hablar","trabajar","jugar","estudiar","caminar","escuchar"],b:"**-aba, -abas, -aba, -ábamos, -aban**."},
 {t:"Imperfect: -er and -ir verbs",ten:["impf"],vb:["comer","vivir","tener","hacer","querer","poder","salir"],b:"**-ía, -ías, -ía, -íamos, -ían**. Almost no irregulars."},
 {t:"Imperfect: ser, ir, ver",ten:["impf"],vb:["ser","ir","ver"],b:"The only three irregulars: **era, iba, veía**."},
 {t:"Present progressive",ten:["prog"],vb:["hablar","comer","escribir","leer","dormir","pedir","decir","trabajar"],b:"**estar + gerund**: estoy hablando. -ando for -ar, -iendo for -er/-ir. Watch **leyendo, durmiendo, pidiendo, diciendo**."},
 {t:"Past review: preterite and imperfect",ten:["pret","impf"],vb:["hablar","comer","vivir","ser","ir","tener","hacer","estar","decir","poder"],b:"Both past tenses mixed. Read the tense label carefully."}
],
B1:[
 {t:"Future: regular",ten:["fut"],vb:["hablar","comer","vivir","trabajar","viajar","escribir","aprender","ir","ser","estar"],b:"Add **-é, -ás, -á, -emos, -án** to the whole infinitive: hablaré, comerás, vivirá."},
 {t:"Future: irregular stems",ten:["fut"],vb:["tener","hacer","decir","poder","salir","venir","poner","saber","querer"],b:"**tendr-, har-, dir-, podr-, saldr-, vendr-, pondr-, sabr-, querr-** + the usual endings."},
 {t:"Conditional: regular",ten:["cond"],vb:["hablar","comer","vivir","trabajar","viajar","escribir","aprender","ir","ser","estar"],b:"Infinitive + **-ía, -ías, -ía, -íamos, -ían**: hablaría."},
 {t:"Conditional: irregular stems",ten:["cond"],vb:["tener","hacer","decir","poder","salir","venir","poner","saber","querer"],b:"Same stems as the future: **tendría, haría, diría, podría**."},
 {t:"Present perfect: regular",ten:["perf"],vb:["hablar","comer","vivir","trabajar","aprender","llegar","terminar"],b:"**he, has, ha, hemos, han** + -ado / -ido: he hablado, han comido."},
 {t:"Present perfect: irregular participles",ten:["perf"],vb:["hacer","decir","ver","escribir","abrir","volver","poner"],b:"**hecho, dicho, visto, escrito, abierto, vuelto, puesto**."},
 {t:"Present subjunctive: regular",ten:["subj"],vb:["hablar","comer","vivir","trabajar","escribir","aprender","llamar"],b:"Swap the vowel: -ar → **-e** (hable), -er/-ir → **-a** (coma, viva)."},
 {t:"Present subjunctive: yo-based stems",ten:["subj"],vb:["tener","hacer","decir","salir","venir","poner","conocer","traer"],b:"Start from the yo form: tengo → **tenga**, hago → **haga**, conozco → **conozca**."},
 {t:"Present subjunctive: stem changers",ten:["subj"],vb:["querer","poder","pensar","volver","dormir","pedir"],b:"Same change as the present. -ir verbs also change in nosotros: **durmamos, pidamos**."},
 {t:"Present subjunctive: spelling changes",ten:["subj"],vb:["buscar","llegar","pagar","empezar","jugar","tocar"],b:"Before e: c → **qu**, g → **gu**, z → **c**: busque, llegue, empiece."},
 {t:"Present subjunctive: ser, estar, ir, saber, dar",ten:["subj"],vb:["ser","estar","ir","saber","dar"],b:"**sea, esté, vaya, sepa, dé**."},
 {t:"Pluperfect",ten:["plup"],vb:["hablar","comer","hacer","ver","decir","escribir","volver"],b:"**había, habías, había, habíamos, habían** + participle: había comido."},
 {t:"Future and conditional review",ten:["fut","cond"],vb:["tener","hacer","decir","poder","hablar","vivir","salir","venir"],b:"Both tenses share their stems. Check the label: future or conditional."},
 {t:"Subjunctive review",ten:["subj"],vb:["hablar","comer","tener","hacer","decir","querer","dormir","pedir","buscar","ser","ir","estar","saber"],b:"Every kind of present subjunctive, mixed."},
 {t:"B1 review: everything so far",ten:["fut","cond","perf","subj"],vb:["hablar","comer","vivir","tener","hacer","decir","ir","ser","poder","venir"],b:"Future, conditional, present perfect and subjunctive, mixed."}
],
B2:[
 {t:"Imperfect subjunctive: regular",ten:["impSubj"],vb:["hablar","comer","vivir","trabajar","llegar","escribir"],b:"Take ellos in the preterite, drop **-ron**, add **-ra**: hablaron → hablara. Nosotros takes an accent: **habláramos**."},
 {t:"Imperfect subjunctive: irregular stems",ten:["impSubj"],vb:["tener","hacer","decir","poder","estar","venir","saber","querer","poner"],b:"Same stems as the preterite: **tuviera, hiciera, dijera, pudiera**."},
 {t:"Imperfect subjunctive: ser, ir, dar, ver",ten:["impSubj"],vb:["ser","ir","dar","ver"],b:"**fuera** (for both ser and ir), **diera, viera**."},
 {t:"Imperfect subjunctive: stem changers",ten:["impSubj"],vb:["pedir","dormir","servir","leer","creer"],b:"From the preterite: pidieron → **pidiera**, durmieron → **durmiera**, leyeron → **leyera**."},
 {t:"Future perfect",ten:["futPerf"],vb:["hablar","comer","hacer","ver","terminar","volver","decir"],b:"**habré, habrás, habrá, habremos, habrán** + participle."},
 {t:"Conditional perfect",ten:["condPerf"],vb:["hablar","comer","hacer","ver","terminar","volver","decir"],b:"**habría, habrías, habría, habríamos, habrían** + participle."},
 {t:"Present perfect subjunctive",ten:["perfSubj"],vb:["hablar","comer","hacer","ver","llegar","decir","volver"],b:"**haya, hayas, haya, hayamos, hayan** + participle."},
 {t:"Pluperfect subjunctive",ten:["plupSubj"],vb:["hacer","decir","ver","saber","llegar","tener","poder"],b:"**hubiera, hubieras, hubiera, hubiéramos, hubieran** + participle."},
 {t:"Past progressive",ten:["pastProg"],vb:["hablar","trabajar","leer","dormir","decir","comer","escribir"],b:"**estaba, estabas, estaba, estábamos, estaban** + gerund."},
 {t:"Preterite irregulars review",ten:["pret"],vb:["ser","ir","tener","estar","poder","poner","hacer","querer","venir","saber","decir","traer","dar","ver","pedir","dormir"],b:"Every irregular preterite, mixed."},
 {t:"Subjunctive: present vs imperfect",ten:["subj","impSubj"],vb:["tener","hacer","decir","ser","ir","poder","venir","hablar","comer"],b:"Read the label: present subjunctive (tenga) or imperfect (tuviera)."},
 {t:"Compound tenses review",ten:["perf","plup","futPerf","condPerf","perfSubj","plupSubj"],vb:["hacer","decir","ver","volver","hablar","comer"],b:"Pick the right form of haber, then the participle."},
 {t:"Indicative review",ten:["pres","pret","impf","fut","cond"],vb:["ir","ser","tener","hacer","decir","poder","venir","querer","hablar","vivir"],b:"All the simple indicative tenses, mixed."},
 {t:"Subjunctive review",ten:["subj","impSubj","perfSubj","plupSubj"],vb:["ir","ser","tener","hacer","decir","poder","venir","querer","hablar","vivir"],b:"All four subjunctive tenses, mixed."},
 {t:"Final boss: every tense",ten:ALL_ES_T.concat(["futPerf","condPerf","perfSubj","plupSubj","pastProg"]),vb:["ser","ir","tener","hacer","decir","poder","venir","estar","hablar","comer","vivir"],b:"Anything can show up. Read the label and go."}
]
}, en:{
A1:[
 {t:"To be: presente",ten:["bePres"],vb:["be"],b:"**I am, you are, he / she is, we are, they are**."},
 {t:"To be: negativo",ten:["beNeg"],vb:["be"],b:"Agrega **not**: I am not, she is not (isn't), they are not (aren't)."},
 {t:"Presente simple: I, you, we, they",ten:["pres"],ps:[0,1,3,4],vb:["work","play","live","eat","drink","speak","read","like"],b:"Con I, you, we y they el verbo no cambia: **I work, they eat**."},
 {t:"Presente simple: la -s de he / she",ten:["pres"],ps:[2],vb:["work","play","live","eat","drink","speak","read","like","sing","open"],b:"Con he, she e it se añade **-s**: she works, he plays."},
 {t:"Presente simple: -es",ten:["pres"],ps:[2],vb:["watch","go","do","wash","fix","teach","finish"],b:"Los verbos en -o, -ch, -sh, -x añaden **-es**: goes, watches, washes, fixes."},
 {t:"Presente simple: -ies",ten:["pres"],ps:[2],vb:["study","try","carry","fly"],b:"Consonante + y cambia a **-ies**: studies, tries, flies."},
 {t:"Have y has",ten:["pres"],vb:["have"],b:"**have** con I, you, we, they; **has** con he, she, it."},
 {t:"Negativo: don't y doesn't",ten:["presNeg"],vb:["work","like","eat","live","speak","play","have","go"],b:"**do not / does not + verbo base**: she does not work. Nunca *doesn't works*."},
 {t:"Preguntas: do y does",ten:["presQ"],vb:["work","like","live","speak","play","have"],b:"**Do / Does + sujeto + verbo base**: does she work? do they live here?"},
 {t:"Repaso del presente",ten:["pres","presNeg","bePres"],vb:["be","work","go","have","study","watch","eat","like"],b:"Presente afirmativo, negativo y to be, mezclados."}
],
A2:[
 {t:"To be: pasado (was / were)",ten:["bePast"],vb:["be"],b:"**I was, you were, he / she was, we were, they were**."},
 {t:"Pasado simple: regulares (-ed)",ten:["past"],vb:["work","play","watch","listen","open","close","wash","enjoy","fix","call","help","talk"],b:"Se añade **-ed** y es igual para todas las personas: worked, played."},
 {t:"Pasado: cambios de ortografía",ten:["past"],vb:["study","try","carry","stop","plan","live","dance","travel"],b:"study → **studied**, stop → **stopped**, live → **lived**. travel → traveled (o travelled)."},
 {t:"Pasado irregular I",ten:["past"],vb:["go","have","do","make","eat","see","come","take"],b:"**went, had, did, made, ate, saw, came, took**."},
 {t:"Pasado irregular II",ten:["past"],vb:["write","speak","buy","bring","think","sleep","leave","get","give","say"],b:"**wrote, spoke, bought, brought, thought, slept, left, got, gave, said**."},
 {t:"Pasado irregular III",ten:["past"],vb:["run","swim","begin","forget","know","read","put","cut","sing","fly","choose","break","lose","win","teach","drink","drive","build","tell"],b:"Más irregulares: **ran, swam, began, forgot, knew, read, put**…"},
 {t:"Pasado negativo: didn't",ten:["pastNeg"],vb:["go","eat","see","work","buy","come","play","like"],b:"**did not + verbo base**: I did not go. Nunca *didn't went*."},
 {t:"Preguntas en pasado: did",ten:["pastQ"],vb:["go","eat","see","work","buy","like","call"],b:"**Did + sujeto + verbo base**: did you go? did she call?"},
 {t:"Presente continuo",ten:["prog"],vb:["work","eat","read","play","watch","study","listen","talk"],b:"**am / is / are + -ing**: I am working, she is reading."},
 {t:"-ing: ortografía",ten:["prog"],vb:["run","swim","stop","plan","make","write","dance","live","begin","get"],b:"run → **running**, make → **making**, write → **writing**, stop → **stopping**."},
 {t:"Futuro con going to",ten:["goingTo"],vb:["eat","go","buy","see","study","travel","visit","call"],b:"**am / is / are + going to + verbo base**: she is going to travel."},
 {t:"Futuro con will",ten:["will"],vb:["come","go","give","buy","write","win","see","help"],b:"**will + verbo base** para todas las personas: they will help."},
 {t:"Repaso del pasado",ten:["past","pastNeg","bePast"],vb:["be","go","eat","see","work","buy","study","write"],b:"Pasado afirmativo, negativo y was / were, mezclados."},
 {t:"Repaso del futuro",ten:["goingTo","will"],vb:["go","eat","buy","see","help","call","travel","come"],b:"going to y will, mezclados. Mira la etiqueta."}
],
B1:[
 {t:"Presente perfecto: regulares",ten:["presPerf"],vb:["work","play","watch","live","study","travel","open","fix","finish","visit"],b:"**have / has + participio**: I have worked, she has studied."},
 {t:"Participios irregulares I",ten:["presPerf"],vb:["go","eat","see","take","write","speak","do","drink","give","drive"],b:"**gone, eaten, seen, taken, written, spoken, done, drunk, given, driven**."},
 {t:"Participios irregulares II",ten:["presPerf"],vb:["buy","bring","think","teach","leave","lose","win","make","say","have","build","tell"],b:"Participio igual al pasado: **bought, brought, thought, taught, left, lost, won, made, said, had**."},
 {t:"Participios irregulares III",ten:["presPerf"],vb:["run","swim","begin","forget","know","fly","choose","break","sing","get","come"],b:"**run, swum, begun, forgotten, known, flown, chosen, broken, sung, gotten**."},
 {t:"Presente perfecto negativo",ten:["presPerfNeg"],vb:["eat","see","go","do","write","read","finish","call"],b:"**have not / has not + participio**: she has not eaten yet."},
 {t:"Pasado continuo",ten:["pastProg"],vb:["work","sleep","read","watch","run","eat","study","drive"],b:"**was / were + -ing**: I was sleeping, they were working."},
 {t:"Would",ten:["would"],vb:["buy","go","travel","live","say","eat","choose","help"],b:"**would + verbo base** para todas las personas: I would travel."},
 {t:"Used to",ten:["usedTo"],vb:["live","play","work","go","eat","have"],b:"**used to + verbo base**: we used to live in Texas."},
 {t:"Pasado simple o presente perfecto",ten:["past","presPerf"],vb:["go","eat","see","write","buy","lose","win","make"],b:"Mira la etiqueta: pasado (ate) o presente perfecto (has eaten)."},
 {t:"Repaso de irregulares",ten:["past","presPerf"],vb:["go","eat","see","take","write","speak","buy","bring","run","swim","begin","forget","know","fly","choose","break"],b:"Pasado y participio de los irregulares, mezclados."},
 {t:"Repaso B1",ten:["presPerf","pastProg","would","usedTo","will"],vb:["go","eat","work","live","see","buy","travel","study"],b:"Todo lo de B1, mezclado."}
],
B2:[
 {t:"Pasado perfecto",ten:["pastPerf"],vb:["eat","leave","see","go","forget","write","do","lose"],b:"**had + participio** para todas las personas: she had left."},
 {t:"Presente perfecto continuo",ten:["presPerfProg"],vb:["work","study","wait","run","read","sleep","watch","live"],b:"**have / has been + -ing**: I have been waiting."},
 {t:"Pasado perfecto continuo",ten:["pastPerfProg"],vb:["work","study","run","sleep","travel","read","wait"],b:"**had been + -ing**: they had been working."},
 {t:"Futuro continuo",ten:["futProg"],vb:["work","travel","sleep","watch","fly","eat","drive"],b:"**will be + -ing**: I will be working."},
 {t:"Futuro perfecto",ten:["futPerf"],vb:["write","read","leave","eat","do","make","fly","finish","build"],b:"**will have + participio**: she will have finished."},
 {t:"Condicional perfecto",ten:["condPerf"],vb:["go","buy","say","choose","win","do","tell","help"],b:"**would have + participio**: I would have gone."},
 {t:"Irregulares: pasado y participio",ten:["past","presPerf","pastPerf"],vb:["run","swim","begin","forget","know","fly","choose","break","sing","drink","take","write","speak","drive","build"],b:"Las tres formas de los irregulares difíciles."},
 {t:"Repaso de tiempos perfectos",ten:["presPerf","pastPerf","futPerf","condPerf"],vb:["go","eat","see","write","finish","leave","do","make"],b:"have, had, will have, would have: elige el auxiliar correcto."},
 {t:"Repaso de tiempos continuos",ten:["prog","pastProg","futProg","presPerfProg","pastPerfProg"],vb:["work","study","run","sleep","read","travel"],b:"Todas las formas con -ing, mezcladas."},
 {t:"Jefe final: todos los tiempos",ten:["pres","past","prog","will","presPerf","pastProg","would","pastPerf","presPerfProg","futPerf","condPerf"],vb:["go","eat","work","see","write","study","buy","run"],b:"Cualquier tiempo puede salir. Lee la etiqueta."}
]
}};

/* ---------- Challenge generation ---------- */
function conjAccepted(tgt, forms, pIdx, pron){
  const prons = tgt === "es" ? ES_PRON[pIdx] : [pron];
  const out = forms.slice();
  for(const f of forms) for(const pr of prons) if(!f.toLowerCase().startsWith(pr.toLowerCase() + " ")) out.push(pr + " " + f);
  return out;
}
function conjFrame(tgt, ten, pron, filler){
  if(tgt === "es") return tidy(`${pick(CT_FRAME.es[ten])} ${pron} ${filler}.`);
  const P = pron === "I" ? "I" : pron.charAt(0).toUpperCase() + pron.slice(1);
  return `${P} ${filler} ${CT_FRAME.en[ten]}.`;
}
function conjQuestion(c, tgt, recent){
  for(let tries = 0; tries < 25; tries++){
    const inf = pick(c.vb);
    let tens = c.ten.filter(t => tgt === "es" || (inf === "be") === isBeTense(t));
    if(!tens.length) continue;
    const ten = pick(tens), p = pick(c.ps || [0,1,2,3,4]);
    const pron = pick(tgt === "es" ? ES_PRON[p] : EN_PRON[p]);
    const forms = tgt === "es" ? esForm(inf, ten, p) : enForm(inf, ten, p, pron);
    const key = `${inf}|${ten}|${p}`;
    if(recent.has(key) && tries < 20) continue;
    return {inf, ten, p, pron, forms, key};
  }
  return null;
}
function conjWrongs(tgt, q){
  const right = new Set(q.forms.map(f => deacc(f.toLowerCase())));
  const out = new Set();
  const add = f => { if(f && !right.has(deacc(f.toLowerCase()))) out.add(f); };
  for(let p = 0; p < 5; p++) if(p !== q.p){
    const fs = tgt === "es" ? esForm(q.inf, q.ten, p) : enForm(q.inf, q.ten, p, q.pron);
    add(fs[0]);
  }
  if(tgt === "en" && q.inf !== "be"){
    const V = ENV[q.inf];
    for(const k of ["p","pp","ing","s","b"]) for(const alt of ["b","p","pp","s"]){
      if(k === alt) continue;
      const W = Object.assign({}, V, {[k]:alts(V[alt])[0]});
      add(EN_TENSE[q.ten](W, q.p, q.pron)[0]);
    }
  }
  return [...out];
}
function genConj(st, plan, c, review, res){
  const nat = LANG_CODE[st.native], tgt = LANG_CODE[st.target], L = GMT[nat];
  const recent = new Set((st.recentK || []).map(k => String(k).replace(/^c:/, "")));
  const q = conjQuestion(c, tgt, recent);
  const games = ["Verb Forge","Time Machine","Slip Fixer"];
  let game = plan.boss ? "Verb Forge" : games.includes(plan.game) ? plan.game : pick(games);
  if(/Q$/.test(q.ten) && game !== "Verb Forge") game = "Verb Forge";
  let wrong = null;
  if(game === "Slip Fixer"){ const ws = conjWrongs(tgt, q); if(ws.length) wrong = pick(ws); else game = "Time Machine"; }
  const tName = CT_NAME[tgt][q.ten], form = q.forms[0];
  const verbHint = tgt === "en" && /Neg$/.test(q.ten) ? "(not / " + q.inf + ")" : "(" + q.inf + ")";
  const acc = conjAccepted(tgt, q.forms, q.p, q.pron);
  const ch = {game, al:tgt, k:"c", acc, answerKey:form, tests:c.t, speak:"", cw:[],
    why:`**${form}** · ${q.inf} · ${tName}` + (c.b ? "\n" + c.b : "")};
  let task;
  if(game === "Verb Forge"){
    task = L.cForge(LN[nat][st.target]);
    ch.target = `${tgt === "es" ? ES_PLABEL[q.p] : q.pron} · ${q.inf} · ${tName}`;
  } else {
    const blankS = conjFrame(tgt, q.ten, q.pron, "___ " + verbHint);
    const full = conjFrame(tgt, q.ten, q.pron, form);
    ch.acc = acc.concat(q.forms.map(f => blankS.replace("___ " + verbHint, f)));
    if(game === "Time Machine"){ task = L.cTime(tName); ch.target = blankS; }
    else { task = L.cSlip(tName); ch.target = blankS.replace("___ " + verbHint, wrong); }
    void full;
  }
  const words = form.split(" ");
  ch.hint = plan.boss ? "" : words.length > 1 ? L.hStart(words[0], words.length) : L.hLetter(form.slice(0, 2), form.length);
  Object.assign(ch, bossWrap(L, plan, task + " " + L.cHow));
  // lesson: the full table for one verb of this concept
  const sample = c.vb.find(v => tgt === "es" || (v === "be") === isBeTense(c.ten[0])) || c.vb[0];
  const tableT = c.ten.find(t => tgt === "es" || (sample === "be") === isBeTense(t)) || c.ten[0];
  const ps = c.ps || [0,1,2,3,4];
  const table = ps.map(p => {
    const pr = tgt === "es" ? ES_PRON[p][0] : EN_PRON[p][0];
    const f = (tgt === "es" ? esForm(sample, tableT, p) : enForm(sample, tableT, p, pr))[0];
    return {w: /Q$/.test(tableT) ? f + "?" : pr + " " + f, m: sample + " · " + (tgt === "es" ? ESV[sample].en : ENV[sample].es)};
  });
  res.lesson = review ? {title:c.t, body:L.cRev + " " + c.b, words:[]} : {title:c.t, body:c.b, words:table};
  res.spotlight = {tense:`${CT_NAME[tgt][tableT]} · ${sample}`, endings:table.map(x => x.w).join(" · "), irregular:""};
  res.challenge = ch;
  res._k = "c:" + q.key;
  return res;
}
