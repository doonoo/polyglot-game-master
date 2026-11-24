/* ===================== The new languages in every mode =====================
   French, Portuguese, Mandarin and Arabic get every mode, each fitted to the language:
   - Numbers: each language's own number words (French 70/80/90, Brazilian Portuguese, Chinese
     characters + pinyin, Arabic units-before-tens), with its own clock and money.
   - Vocab: the course words, grouped by unit.
   - Island Hopper: themed islands made from the course units (WL.<code>.islands).
   - Conjugation: real verb tables for French, Portuguese and Arabic (past / present / future
     by person). Chinese verbs don't change, so mode 7 drills measure words and particles there.
   - Tricky Pairs: each language's classic confusions (WL.<code>.tricky).
   - Stories: two per language (WL.<code>.stories).
   Mandarin and Arabic rounds that would need a new keyboard come with tap options; typing
   pinyin / transliteration always works. */
const XLM_CODES = ["fr", "pt", "zh", "ar"];
const xlmCode = name => (typeof xlCode === "function" ? xlCode(name) : null);
function xlmReg(code, tgt, rom){
  if(!rom || !(code === "zh" || code === "ar")) return;
  XL_ROM[xlKey(tgt)] = rom.replace(/ /g, " ");
  const tk = String(tgt).split(/\s+/).map(x => xlKey(x)).filter(Boolean), rk = String(rom).split(/ +/).map(x => xlKey(x));
  if(tk.length === rk.length) tk.forEach((x, i) => { if(rk[i]) XL_TOKROM[code][x] = rk[i].replace(/ /g, " "); });
}
const xlmW = w => w.map(([t, en, r]) => [r ? `${t} (${r})` : t, en]);
const xlmItem = (code, [en, tgt, cz, wrong, opts, rom]) => {
  xlmReg(code, tgt, rom);
  (XL_TOKENS[code] = XL_TOKENS[code] || []).push(...String(tgt).split(/\s+/).filter(x => !XL_TOKENS[code].includes(x)));
  const pat = tgt + (rom ? "|" + rom.replace(/ /g, " ") : "");
  return opts ? [en, pat, cz, wrong, opts] : [en, pat, cz, wrong];
};
const xlmConcepts = (code, lv) => lv.map(c => ({t:c.t, b:c.b, w:xlmW(c.w || []), o:c.o, it:c.it.map(x => xlmItem(code, x)), xl:code}));

/* ---------- Tricky Pairs ---------- */
for(const code of XLM_CODES){
  const P = WL[code]; if(!P || !P.tricky) continue;
  TRICKY[code] = {};
  for(const lv in P.tricky) TRICKY[code][lv] = xlmConcepts(code, P.tricky[lv]);
}

/* ---------- Stories ---------- */
for(const code of XLM_CODES){ const P = WL[code]; if(P && P.stories) for(const s of P.stories) STORIES.push(Object.assign({lang:code}, s)); }

/* ---------- Island Hopper: islands made of course units ---------- */
for(const code of XLM_CODES){
  const P = WL[code]; if(!P || !P.islands) continue;
  const lessons = []; for(const lv in COURSE[code]) lessons.push(...COURSE[code][lv]);
  for(const isl of P.islands){
    const it = [];
    for(const name of isl.units){ const L = lessons.find(l => l.t === name); if(L) it.push(...L.it.slice(0, 5).map(x => [x[0], x[1], null, x[2]])); }
    if(it.length >= 6) ISLANDS.push({id:isl.id, en:(isl.ico ? isl.ico + " " : "") + isl.en, es:(isl.ico ? isl.ico + " " : "") + isl.es, nav:[], it:it.slice(0, 15), lang:code});
  }
}

/* ---------- Vocab: the course words, by unit ---------- */
const XLV = {};
for(const code of XLM_CODES){
  const P = WL[code]; if(!P) continue;
  XLV[code] = {}; VMAP[code] = VMAP[code] || {};
  P.units.forEach((u, i) => {
    const cat = "xl_" + code + "_" + i;
    CATS[cat] = {en:(u.ico ? u.ico + " " : "") + u.t, es:(u.ico ? u.ico + " " : "") + u.t};
    const lv = u.lv || "A1";
    for(const [t, en, r] of u.w){
      const e = {en:String(en).replace(/\s*\(([^)]*)\)/g, ", $1").replace(/\|/g, "/"), cat, lv};
      e[code] = r ? `${t}|${r}` : t;
      (XLV[code][lv] = XLV[code][lv] || []).push(e);
      VMAP[code][first(e[code]).toLowerCase()] = e;
    }
  });
}
genVocab = (orig => function(st){
  const code = xlmCode(st && st.target);
  if(!code || !XLV[code]) return orig.apply(this, arguments);
  const saved = {};
  for(const lv of LEVELS){ saved[lv] = VLIST[lv]; VLIST[lv] = XLV[code][lv] || XLV[code].A1; }
  try{ return orig.apply(this, arguments); }
  finally{ for(const lv of LEVELS){ if(saved[lv] === undefined) delete VLIST[lv]; else VLIST[lv] = saved[lv]; } }
})(genVocab);
// French and Portuguese nouns are taught with their article; the bare word counts too
wordForms = (orig => function(v, lang){
  const out = orig.apply(this, arguments);
  if(lang === "fr"){ const m = String(v).trim().match(/^(le |la |les |l'|l’|un |une )(.+)$/i); if(m) out.push(m[2]); }
  if(lang === "pt"){ const m = String(v).trim().match(/^(o |a |os |as |um |uma )(.+)$/i); if(m) out.push(m[2]); }
  return out;
})(wordForms);

/* ---------- Numbers ---------- */
const FR_U = ["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"];
const FR_T = {2:"vingt", 3:"trente", 4:"quarante", 5:"cinquante", 6:"soixante"};
function fr100(n, be){
  if(n < 20) return FR_U[n];
  const t = Math.floor(n / 10), u = n % 10;
  if(t <= 6) return FR_T[t] + (u === 0 ? "" : u === 1 ? " et un" : "-" + FR_U[u]);
  if(be && (t === 7 || t === 9)){ const w = t === 7 ? "septante" : "nonante"; return w + (u === 0 ? "" : u === 1 ? " et un" : "-" + FR_U[u]); }
  if(t === 7){ const r = n - 60; return "soixante" + (r === 11 ? " et onze" : "-" + FR_U[r]); }
  const r = n - 80; return r === 0 ? "quatre-vingts" : "quatre-vingt-" + FR_U[r];
}
function frNum(n, be){
  if(n < 100) return fr100(n, be);
  if(n < 1000){ const h = Math.floor(n / 100), r = n % 100, hs = h === 1 ? "cent" : FR_U[h] + (r ? " cent" : " cents"); return r ? hs + " " + fr100(r, be) : hs; }
  const k = Math.floor(n / 1000), r = n % 1000;
  const ks = k === 1 ? "mille" : frNum(k, be).replace(/cents$/, "cent").replace(/quatre-vingts$/, "quatre-vingt") + " mille";
  return r ? ks + " " + frNum(r, be) : ks;
}
const PT_U = ["zero","um","dois","três","quatro","cinco","seis","sete","oito","nove","dez","onze","doze","treze","catorze","quinze","dezesseis","dezessete","dezoito","dezenove"];
const PT_T = ["","","vinte","trinta","quarenta","cinquenta","sessenta","setenta","oitenta","noventa"];
const PT_H = ["","cento","duzentos","trezentos","quatrocentos","quinhentos","seiscentos","setecentos","oitocentos","novecentos"];
const pt100 = n => n < 20 ? PT_U[n] : PT_T[Math.floor(n / 10)] + (n % 10 ? " e " + PT_U[n % 10] : "");
const pt1000 = n => n < 100 ? pt100(n) : n === 100 ? "cem" : PT_H[Math.floor(n / 100)] + (n % 100 ? " e " + pt100(n % 100) : "");
function ptNum(n, joinE){
  if(n < 1000) return pt1000(n);
  const k = Math.floor(n / 1000), r = n % 1000, ks = k === 1 ? "mil" : pt1000(k) + " mil";
  if(!r) return ks;
  return ks + (joinE || r < 100 || r % 100 === 0 ? " e " : " ") + pt1000(r);
}
const ZH_D = "零一二三四五六七八九";
const ZPY = {"零":"líng","一":"yī","二":"èr","三":"sān","四":"sì","五":"wǔ","六":"liù","七":"qī","八":"bā","九":"jiǔ","十":"shí","百":"bǎi","千":"qiān","万":"wàn","两":"liǎng",
  "点":"diǎn","钟":"zhōng","半":"bàn","分":"fēn","刻":"kè","差":"chà","块":"kuài","钱":"qián","元":"yuán","加":"jiā","减":"jiǎn","乘":"chéng","除":"chú","以":"yǐ","等":"děng","于":"yú"};
const zhPin = s => [...String(s)].map(c => ZPY[c] || c).join(" ");
function zhNum(n, liang){   // liang: say 两 before 百 / 千 / 万
  if(n < 10) return ZH_D[n];
  let out = "", started = false, zero = false;
  for(const [v, c] of [[10000, "万"], [1000, "千"], [100, "百"], [10, "十"]]){
    const d = Math.floor(n / v) % 10;
    if(d){
      if(zero){ out += "零"; zero = false; }
      if(!(v === 10 && d === 1 && !started)) out += d === 2 && liang && v >= 100 ? "两" : ZH_D[d];
      out += c; started = true;
    } else if(started) zero = true;
  }
  const u = n % 10;
  if(u){ if(zero) out += "零"; out += ZH_D[u]; }
  return out;
}
const AR_U = ["صفر","واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة","عشرة"];
const AR_UR = ["ṣifr","wāḥid","ithnān","thalātha","arbaʿa","khamsa","sitta","sabʿa","thamāniya","tisʿa","ʿashara"];
const AR_T = ["","","عشرون","ثلاثون","أربعون","خمسون","ستون","سبعون","ثمانون","تسعون"];
const AR_TR = ["","","ʿishrūn","thalāthūn","arbaʿūn","khamsūn","sittūn","sabʿūn","thamānūn","tisʿūn"];
const AR_H = ["","مئة","مئتان","ثلاثمئة","أربعمئة","خمسمئة","ستمئة","سبعمئة","ثمانمئة","تسعمئة"];
const AR_HR = ["","miʾa","miʾatān","thalāthumiʾa","arbaʿumiʾa","khamsumiʾa","sittumiʾa","sabʿumiʾa","thamānimiʾa","tisʿumiʾa"];
function ar100(n){
  if(n <= 10) return [AR_U[n], AR_UR[n]];
  if(n === 11) return ["أحد عشر", "aḥada ʿashar"];
  if(n === 12) return ["اثنا عشر", "ithnā ʿashar"];
  if(n < 20) return [AR_U[n - 10] + " عشر", AR_UR[n - 10] + "ta ʿashar"];
  const t = Math.floor(n / 10), u = n % 10;
  return u ? [AR_U[u] + " و" + AR_T[t], AR_UR[u] + " wa-" + AR_TR[t]] : [AR_T[t], AR_TR[t]];
}
function ar1000(n){
  if(n < 100) return ar100(n);
  const h = Math.floor(n / 100), r = n % 100;
  if(!r) return [AR_H[h], AR_HR[h]];
  const x = ar100(r); return [AR_H[h] + " و" + x[0], AR_HR[h] + " wa-" + x[1]];
}
function arNum(n){
  if(n < 1000) return ar1000(n);
  const k = Math.floor(n / 1000), r = n % 1000;
  const ks = k === 1 ? ["ألف", "alf"] : k === 2 ? ["ألفان", "alfān"] : [AR_U[k] + " آلاف", AR_UR[k] + "t ālāf"];
  if(!r) return ks;
  const x = ar1000(r); return [ks[0] + " و" + x[0], ks[1] + " wa-" + x[1]];
}
const AR_DIG = "٠١٢٣٤٥٦٧٨٩";
const arDigits = n => String(n).replace(/\d/g, d => AR_DIG[+d]);
const uniq = a => [...new Set(a.filter(Boolean))];
// every accepted way to say n (the first one is shown as the answer)
function xlNumWords(code, n){
  if(code === "fr"){ const a = frNum(n), b = frNum(n, true); return uniq([a, a.replace(/ /g, "-"), b, b.replace(/ /g, "-")]); }
  if(code === "pt"){
    const a = ptNum(n), b = ptNum(n, true), alt = s => s.replace(/catorze/g, "quatorze"), eu = s => s.replace(/dezesseis/g, "dezasseis").replace(/dezessete/g, "dezassete").replace(/dezenove/g, "dezanove");
    return uniq([a, b, alt(a), alt(b), eu(a), eu(b)]);
  }
  if(code === "zh"){ const a = zhNum(n, n >= 1000), b = zhNum(n, false), c = zhNum(n, true); return uniq([a, b, c, zhPin(a), zhPin(b), zhPin(c), n === 2 ? "两" : "", n === 2 ? "liǎng" : ""]); }
  if(code === "ar"){ const [w, r] = arNum(n); return uniq([w, w.replace(/مئة/g, "مائة"), w.replace(/ و/g, " و "), r, r.replace(/-/g, " "), r.replace(/-/g, "")]); }
  return [String(n)];
}
const xlNumMain = (code, n) => xlNumWords(code, n)[0];
const XL_OPW = {fr:{"+":"plus","-":"moins","x":"fois","/":"divisé par"}, pt:{"+":"mais","-":"menos","x":"vezes","/":"dividido por"},
  zh:{"+":"加","-":"减","x":"乘","/":"除以"}, ar:{"+":"زائد","-":"ناقص","x":"ضرب","/":"قسمة على"}};
const XL_OPM = {"+":"+","-":"−","x":"×","/":"÷"};
const AR_ORDF = ["","الواحدة","الثانية","الثالثة","الرابعة","الخامسة","السادسة","السابعة","الثامنة","التاسعة","العاشرة","الحادية عشرة","الثانية عشرة"];
const AR_ORDFR = ["","al-wāḥida","ath-thāniya","ath-thālitha","ar-rābiʿa","al-khāmisa","as-sādisa","as-sābiʿa","ath-thāmina","at-tāsiʿa","al-ʿāshira","al-ḥādiya ʿashra","ath-thāniya ʿashra"];
function xlTime(code, h, m){
  const h2 = h % 12 + 1;
  if(code === "fr"){
    const H = x => x === 1 ? "une heure" : x === 12 ? "douze heures" : frNum(x) + " heures";
    const N = x => x === 12 ? "midi" : H(x);
    let a = m === 0 ? [H(h), N(h)] : m === 30 ? [H(h) + " et demie", N(h) + " et demie", H(h) + " trente"]
      : m === 15 ? [H(h) + " et quart", N(h) + " et quart", H(h) + " quinze"] : [N(h2) + " moins le quart", H(h2) + " moins le quart", H(h) + " quarante-cinq"];
    return uniq(a.concat(a.map(x => "il est " + x)));
  }
  if(code === "pt"){
    const H = x => x === 1 ? "uma" : x === 2 ? "duas" : ptNum(x);
    const hr = x => x === 1 ? "uma hora" : H(x) + " horas";
    let a = m === 0 ? [hr(h), H(h) + " em ponto", h === 12 ? "meio-dia" : ""]
      : m === 30 ? [H(h) + " e meia", H(h) + " e trinta", h === 12 ? "meio-dia e meia" : ""]
      : m === 15 ? [H(h) + " e quinze", hr(h) + " e quinze"]
      : ["quinze para " + (h2 === 1 ? "a uma" : "as " + H(h2)), H(h) + " e quarenta e cinco"];
    a = a.filter(Boolean);
    return uniq(a.concat(a.map(x => (h === 1 && !/^quinze/.test(x) ? "é " : "são ") + x)));
  }
  if(code === "zh"){
    const H = x => x === 2 ? "两" : zhNum(x);
    let a = m === 0 ? [H(h) + "点", H(h) + "点钟"] : m === 30 ? [H(h) + "点半", H(h) + "点三十", H(h) + "点三十分"]
      : m === 15 ? [H(h) + "点一刻", H(h) + "点十五", H(h) + "点十五分"] : [H(h) + "点三刻", H(h) + "点四十五", H(h) + "点四十五分", "差一刻" + H(h2) + "点"];
    return uniq(a.concat(a.map(zhPin)));
  }
  if(code === "ar"){
    const H = x => "الساعة " + AR_ORDF[x], HR = x => "as-sāʿa " + AR_ORDFR[x];
    const a = m === 0 ? [[H(h), HR(h)]] : m === 30 ? [[H(h) + " والنصف", HR(h) + " wa-n-niṣf"]] : m === 15 ? [[H(h) + " والربع", HR(h) + " wa-r-rubʿ"]] : [[H(h2) + " إلا ربعا", HR(h2) + " illā rubʿan"]];
    const w = a[0][0], r = a[0][1];
    return uniq([w, w.replace(/^الساعة /, ""), r, r.replace(/^as-sāʿa /, ""), r.replace(/-/g, " ")]);
  }
}
function xlPrice(code, n){
  if(code === "fr") return n === 1 ? ["un euro"] : xlNumWords("fr", n).map(w => w + " euros");
  if(code === "pt") return n === 1 ? ["um real"] : xlNumWords("pt", n).map(w => w + " reais");
  if(code === "zh"){
    const ws = n === 2 ? ["两"] : uniq([zhNum(n, false), zhNum(n, true)]);
    const a = []; for(const w of ws) a.push(w + "块", w + "块钱", w + "元");
    return uniq(a.concat(a.map(zhPin)));
  }
  return xlNumWords(code, n);
}
const XLNUM = {
A1:[
 {ty:"int", a:0, b:10, en:"Numbers 0 to 10", es:"Números del 0 al 10", tip:"small"},
 {ty:"int", a:11, b:20, en:"Numbers 11 to 20", es:"Números del 11 al 20", tip:"teens"},
 {ty:"int", a:21, b:99, en:"Numbers 21 to 99", es:"Números del 21 al 99", tip:"tens"},
 {ty:"math", ops:"+-", b:20, en:"Adding and subtracting", es:"Sumar y restar", tip:"math"},
 {ty:"time", m:"hour", en:"Time: on the hour", es:"La hora en punto", tip:"time"}
],
A2:[
 {ty:"int", a:100, b:999, en:"Hundreds", es:"Centenas", tip:"hundreds"},
 {ty:"int", a:1000, b:9999, en:"Thousands", es:"Millares", tip:"thousands"},
 {ty:"math", ops:"x/", b:12, en:"Times and divided by", es:"Multiplicar y dividir", tip:"math"},
 {ty:"time", m:"half", en:"Half and quarter hours", es:"Medias y cuartos de hora", tip:"time"},
 {ty:"price", a:2, b:99, en:"Prices", es:"Precios", tip:"price"}
]};
const xlNumSyl = (code, lv) => (XLNUM[lv] || XLNUM.A1).filter(c => !(code === "ar" && c.ty === "price"));
const XNT = {
fr:{small:"**un, deux, trois…** Learn 0 to 16 by heart; **dix-sept, dix-huit, dix-neuf** are 'ten-seven, ten-eight, ten-nine'.",
  teens:"11 to 16 are single words: **onze, douze, treize, quatorze, quinze, seize**. Then **dix-sept**, **dix-huit**, **dix-neuf** and **vingt** (20).",
  tens:"Join tens and units with a hyphen (**vingt-deux**) but say **et un** for 21 to 71: **vingt et un**. 70 = **soixante-dix** (60 + 10), 80 = **quatre-vingts** (4 × 20), 90 = **quatre-vingt-dix**. In Belgium and Switzerland: **septante, nonante**.",
  hundreds:"**cent** = 100, **deux cents** = 200 (with s), but **deux cent un** = 201 (no s when a number follows).",
  thousands:"**mille** never takes an s or 'un': 1,000 = **mille**, 3,000 = **trois mille**.",
  math:"**plus** = plus, **moins** = minus, **fois** = times, **divisé par** = divided by.",
  time:"**Il est trois heures** = it's three o'clock. **et quart** = quarter past, **et demie** = half past, **moins le quart** = quarter to. 12:00 can be **midi**.",
  price:"Say the number, then **euros**: **douze euros**. One euro = **un euro**."},
pt:{small:"**um, dois, três…** 1 and 2 have feminine forms (**uma, duas**) used before feminine nouns, like **duas horas**.",
  teens:"**onze, doze, treze, catorze** (or quatorze), **quinze**, then in Brazil **dezesseis, dezessete, dezoito, dezenove**.",
  tens:"Join tens and units with **e**: **vinte e um**, **trinta e cinco**. Watch **sessenta** (60) against **setenta** (70).",
  hundreds:"100 is **cem**; from 101 it's **cento**: **cento e um**. Then **duzentos, trezentos, quatrocentos, quinhentos**…, with **e** before the rest: **duzentos e dez**.",
  thousands:"**mil** never takes 'um': 1,000 = **mil**, 2,000 = **dois mil**. Use **e** after mil when the rest is under 100 or a round hundred: **mil e cem**.",
  math:"**mais** = plus, **menos** = minus, **vezes** = times, **dividido por** = divided by.",
  time:"**São três horas** = it's three o'clock (but **é uma hora**). **e meia** = half past, **e quinze** = quarter past, **quinze para as…** = quarter to.",
  price:"Brazil's money is the **real**, plural **reais**: **doze reais**, **um real**."},
zh:{small:"**一 二 三 四 五 六 七 八 九 十** (yī èr sān sì wǔ liù qī bā jiǔ shí). 0 is **零** (líng). You can tap the answer or type it in pinyin.",
  teens:"11 to 19 are 'ten-one' to 'ten-nine': **十一** (shíyī), **十五**, **十九**. 20 is **二十** (two tens).",
  tens:"Numbers are built like a calculator: **三十五** = 3 × 10 + 5. **九十九** = 99.",
  hundreds:"**百** (bǎi) = hundred: **三百**. A zero inside is read as **零**: 105 = **一百零五**. 110 = **一百一十**.",
  thousands:"**千** (qiān) = thousand: **两千** (2,000). Each gap of zeros is one **零**: 1,005 = **一千零五**.",
  math:"**加** (jiā) = plus, **减** (jiǎn) = minus, **乘** (chéng) = times, **除以** (chúyǐ) = divided by.",
  time:"**点** (diǎn) = o'clock: **三点**. Say **两点** for 2:00. **半** (bàn) = half past, **一刻** (yí kè) = quarter past, **三刻** = quarter to the next hour.",
  price:"Prices use **块** (kuài) in speech or **元** (yuán) in writing: **十块** (钱) = ten yuan. 2 yuan is **两块**."},
ar:{small:"**واحد، اثنان، ثلاثة…** (wāḥid, ithnān, thalātha). Arabic digits look different: ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩. You can tap the answer or type the transliteration.",
  teens:"11 is **أحد عشر**, 12 is **اثنا عشر**; 13 to 19 are 'three ten': **ثلاثة عشر** (thalāthata ʿashar).",
  tens:"Arabic says the units **first**, then **و** (wa, and) and the tens: 25 = **خمسة وعشرون** ('five and twenty').",
  hundreds:"**مئة** (miʾa) = 100, **مئتان** = 200, then **ثلاثمئة, أربعمئة**… Join the rest with **و**: 125 = **مئة وخمسة وعشرون**.",
  thousands:"**ألف** (alf) = 1,000, **ألفان** = 2,000, then **ثلاثة آلاف** (3,000) up to **عشرة آلاف** (10,000).",
  math:"**زائد** (zāʾid) = plus, **ناقص** (nāqiṣ) = minus, **ضرب** (ḍarb) = times, **قسمة على** (qismat ʿalā) = divided by.",
  time:"**الساعة** (as-sāʿa) + a feminine ordinal: **الساعة الثالثة** = 3:00. **والنصف** = half past, **والربع** = quarter past, **إلا ربعا** = quarter to.",
  price:""}
};
const xlNumShow = (code, n) => code === "ar" ? `${fmt(n)}  (${arDigits(n)})` : fmt(n);
function xlNumQ(c, code, lastGame, plain){
  const W = n => xlNumWords(code, n), OP = XL_OPW[code], sp = code === "zh" ? "" : " ";
  const say = n => xlNumMain(code, n);
  switch(c.ty){
    case "int": {
      const n = rnd(c.a, c.b);
      if(!plain && c.b <= 100 && lastGame === "Digit Dictation" && n >= 2){
        const x = rnd(1, n - 1);
        return {game:"Linguistic Math", target:say(x) + sp + OP["+"] + sp + say(n - x), acc:W(n), n};
      }
      return {game:!plain && c.b > 100 && lastGame === "Digit Dictation" ? "Real-World Numbers" : "Digit Dictation", target:xlNumShow(code, n), acc:W(n), n};
    }
    case "math": {
      const op = pick(c.ops.split("")); let x, y, r;
      if(op === "+"){ x = rnd(0, c.b); y = rnd(0, c.b - x); r = x + y; }
      else if(op === "-"){ x = rnd(0, c.b); y = rnd(0, x); r = x - y; }
      else if(op === "x"){ x = rnd(2, 12); y = rnd(2, 12); r = x * y; }
      else { y = rnd(2, 12); r = rnd(2, 12); x = y * r; }
      return {game:"Linguistic Math", target:say(x) + sp + OP[op] + sp + say(y), acc:W(r), n:r};
    }
    case "time": {
      const h = rnd(1, 12), m = c.m === "half" ? pick([15, 30, 45]) : 0;
      return {game:"Clock Watcher", target:`${h}:${String(m).padStart(2, "0")}`, acc:xlTime(code, h, m), n:h * 100 + m};
    }
    default: {
      const n = rnd(c.a, c.b);
      return {game:"Real-World Numbers", target:code === "fr" ? `${n} €` : code === "pt" ? `R$ ${n}` : code === "zh" ? `¥${n}` : String(n), acc:xlPrice(code, n), n};
    }
  }
}
numChallenge = (orig => function(c, tgt, lastGame, plain){
  return XLM_CODES.includes(tgt) && c && c.tip ? xlNumQ(c, tgt, lastGame, plain) : orig.apply(this, arguments);
})(numChallenge);
function xlGenNumber(st, plan, c, review, res){
  const nat = LANG_CODE[st.native], code = LANG_CODE[st.target], L = GMT[nat], T = LN[nat][st.target];
  const q = xlNumQ(c, code, st.lastGame, false);
  if(q.game === st.lastGame && (q.game === "Real-World Numbers" || q.game === "Digit Dictation") && c.ty !== "price") q.game = q.game === "Digit Dictation" ? "Real-World Numbers" : "Digit Dictation";
  const taskBy = {"Digit Dictation":L.nDD, "Linguistic Math":L.nLM, "Real-World Numbers":L.nRW, "Clock Watcher":L.nCW, "Price Check":L.nPC};
  const why = XNT[code][c.tip] || "";
  const ch = {game:q.game, target:q.target, al:code, k:"n", nn:false, acc:q.acc, answerKey:q.acc[0], tests:c[nat], speak:"", cw:[], why,
    hint:plan.boss || code === "zh" || code === "ar" ? "" : L.hStart(q.acc[0].split(" ")[0], q.acc[0].split(" ").length)};
  Object.assign(ch, bossWrap(L, plan, taskBy[q.game](T)));
  // Mandarin and Arabic: tap the answer from four (typing pinyin / transliteration also works)
  if(code === "zh" || code === "ar"){
    const romOf = x => x.acc.find(a => /[a-zāīūʿ]/i.test(a));
    const opts = [q.acc[0]], seen = new Set([q.target]), rom = {[q.acc[0]]:romOf(q)};
    for(let i = 0; i < 40 && opts.length < 4; i++){ const o = xlNumQ(c, code, "", true); if(!seen.has(o.target) && !opts.includes(o.acc[0])){ seen.add(o.target); opts.push(o.acc[0]); rom[o.acc[0]] = romOf(o); } }
    if(opts.length >= 3) ch.opts = shuffle(opts);
    for(const o of opts) if(rom[o]){ XL_ROM[xlKey(o)] = rom[o]; XL_TOKROM[code][o] = rom[o]; }
  }
  let words = [];
  if(!review){
    if(c.ty === "math") words = c.ops.split("").map(o => ({w:XL_OPW[code][o], m:XL_OPM[o]}));
    else if(c.ty === "int" && c.b - c.a <= 11) for(let n = c.a; n <= c.b; n++) words.push({w:xlNumMain(code, n), m:fmt(n)});
    else { const seen = new Set(); for(let i = 0; i < 8 && words.length < 3; i++){ const s = xlNumQ(c, code, "", true); if(!seen.has(s.target)){ seen.add(s.target); words.push({w:s.acc[0], m:s.target}); } } }
  }
  res.lesson = {title:c[nat], body:why, words};
  res.challenge = ch;
  res.spotlight = null;
  return res;
}
genNumber = (orig => function(st, plan, c, review, res){
  const code = xlmCode(st && st.target);
  return code && c && c.tip ? xlGenNumber(st, plan, c, review, res) : orig.apply(this, arguments);
})(genNumber);
// Arabic number words get their transliteration under the tiles and on the answer card
for(let n = 0; n <= 100; n++){ const [w, r] = arNum(n); XL_ROM[xlKey(w)] = r; if(!/\s/.test(w)) XL_TOKROM.ar[w] = r; }
for(let n = 0; n <= 100; n++){ const w = zhNum(n); XL_ROM[xlKey(w)] = zhPin(w); }

/* ---------- Conjugation: French, Portuguese, Arabic verb tables ---------- */
const XCT = {fr:{pres:"présent", pc:"passé composé", fut:"futur simple", imp:"imparfait", fp:"futur proche"},
  pt:{pres:"presente", pp:"pretérito perfeito", imp:"pretérito imperfeito", fut:"futuro simples", fi:"futuro com ir"},
  ar:{past:"past (\u2068الماضي\u2069)", pres:"present (\u2068المضارع\u2069)", fut:"future (\u2068المستقبل\u2069)"}};   // isolates keep the Arabic from flipping the line
// French
const FR_PRON = ["je","tu","il","elle","nous","vous","ils"], FR_SLOT = [0,1,2,2,3,4,5];
const FRV = {parler:"to speak", aimer:"to like", habiter:"to live", travailler:"to work", regarder:"to watch", écouter:"to listen", jouer:"to play", manger:"to eat", arriver:"to arrive", rester:"to stay",
  finir:"to finish", choisir:"to choose", vendre:"to sell", attendre:"to wait", répondre:"to answer",
  être:"to be", avoir:"to have", aller:"to go", faire:"to do", prendre:"to take", vouloir:"to want", pouvoir:"can", venir:"to come", partir:"to leave"};
const FR_IRR = {
  être:["suis","es","est","sommes","êtes","sont"], avoir:["ai","as","a","avons","avez","ont"], aller:["vais","vas","va","allons","allez","vont"],
  faire:["fais","fais","fait","faisons","faites","font"], prendre:["prends","prends","prend","prenons","prenez","prennent"],
  vouloir:["veux","veux","veut","voulons","voulez","veulent"], pouvoir:["peux","peux","peut","pouvons","pouvez","peuvent"],
  venir:["viens","viens","vient","venons","venez","viennent"], partir:["pars","pars","part","partons","partez","partent"]};
const FR_PP = {être:"été", avoir:"eu", aller:"allé", faire:"fait", prendre:"pris", vouloir:"voulu", pouvoir:"pu", venir:"venu", partir:"parti"};
const FR_FUT = {être:"ser", avoir:"aur", aller:"ir", faire:"fer", vouloir:"voudr", pouvoir:"pourr", venir:"viendr"};
const FR_ETRE = new Set(["aller","venir","arriver","rester","partir"]);
const frGroup = v => FR_IRR[v] ? "irr" : /er$/.test(v) ? "er" : /ir$/.test(v) ? "ir" : "re";
function frPres(v, s){
  if(FR_IRR[v]) return FR_IRR[v][s];
  const g = frGroup(v), st = v.slice(0, -2);
  const end = g === "er" ? ["e","es","e","ons","ez","ent"][s] : g === "ir" ? ["is","is","it","issons","issez","issent"][s] : ["s","s","","ons","ez","ent"][s];
  return (/g$/.test(st) && /^[oa]/.test(end) ? st + "e" : st) + end;
}
const frPP = v => FR_PP[v] || (frGroup(v) === "er" ? v.slice(0, -2) + "é" : frGroup(v) === "ir" ? v.slice(0, -2) + "i" : v.slice(0, -2) + "u");
function frForm(v, ten, p){
  const s = FR_SLOT[p];
  if(ten === "pres") return [frPres(v, s)];
  if(ten === "fp") return [FR_IRR.aller[s] + " " + v];
  if(ten === "fut"){ const st = FR_FUT[v] || (frGroup(v) === "re" ? v.slice(0, -1) : v); return [st + ["ai","as","a","ons","ez","ont"][s]]; }
  if(ten === "imp"){
    let st = v === "être" ? "ét" : frPres(v, 3).replace(/ons$/, "");
    const end = ["ais","ais","ait","ions","iez","aient"][s];
    if(/ge$/.test(st) && end[0] === "i") st = st.slice(0, -1);
    return [st + end];
  }
  // passé composé
  const pp = frPP(v);
  if(!FR_ETRE.has(v)) return [FR_IRR.avoir[s] + " " + pp];
  const aux = FR_IRR.être[s] + " ";
  if(p === 3) return [aux + pp + "e"];
  if(p === 4 || p === 5) return [aux + pp + "s", aux + pp + "es", ...(p === 5 ? [aux + pp, aux + pp + "e"] : [])];
  if(p === 6) return [aux + pp + "s"];
  return [aux + pp, aux + pp + "e"];
}
const frWithPron = (p, f) => p === 0 && /^[aeéèêiouyhâîô]/i.test(f) ? "j'" + f : FR_PRON[p] + " " + f;
// Portuguese (Brazil)
const PT_PRON = ["eu","você","ele","ela","nós","vocês","eles"], PT_SLOT = [0,1,1,1,2,3,3];
const PTV = {falar:"to speak", morar:"to live", trabalhar:"to work", estudar:"to study", comprar:"to buy", gostar:"to like", chegar:"to arrive", viajar:"to travel",
  comer:"to eat", beber:"to drink", aprender:"to learn", vender:"to sell", abrir:"to open", partir:"to leave", assistir:"to watch",
  ser:"to be (permanent)", estar:"to be (state)", ter:"to have", ir:"to go", fazer:"to do", poder:"can", querer:"to want"};
const PT_IRR = {
  pres:{ser:["sou","é","somos","são"], estar:["estou","está","estamos","estão"], ter:["tenho","tem","temos","têm"], ir:["vou","vai","vamos","vão"],
    fazer:["faço","faz","fazemos","fazem"], poder:["posso","pode","podemos","podem"], querer:["quero","quer","queremos","querem"]},
  pp:{ser:["fui","foi","fomos","foram"], ir:["fui","foi","fomos","foram"], estar:["estive","esteve","estivemos","estiveram"], ter:["tive","teve","tivemos","tiveram"],
    fazer:["fiz","fez","fizemos","fizeram"], poder:["pude","pôde","pudemos","puderam"], querer:["quis","quis","quisemos","quiseram"]},
  imp:{ser:["era","era","éramos","eram"], ter:["tinha","tinha","tínhamos","tinham"]}};
const PT_FUT = {fazer:"far"};
function ptForm(v, ten, p){
  const s = PT_SLOT[p], g = v.slice(-2), st = v.slice(0, -2);
  if(ten === "fi") return [PT_IRR.pres.ir[s] + " " + v];
  if(PT_IRR[ten] && PT_IRR[ten][v]) return [PT_IRR[ten][v][s]];
  if(ten === "pres") return [st + (g === "ar" ? ["o","a","amos","am"] : g === "er" ? ["o","e","emos","em"] : ["o","e","imos","em"])[s]];
  if(ten === "pp"){
    if(g === "ar"){
      if(s === 0) return [(/c$/.test(st) ? st.slice(0, -1) + "qu" : /g$/.test(st) ? st + "u" : /ç$/.test(st) ? st.slice(0, -1) + "c" : st) + "ei"];
      return [st + ["ei","ou","amos","aram"][s]];
    }
    return [st + (g === "er" ? ["i","eu","emos","eram"] : ["i","iu","imos","iram"])[s]];
  }
  if(ten === "imp") return [st + (g === "ar" ? ["ava","ava","ávamos","avam"] : ["ia","ia","íamos","iam"])[s]];
  // futuro simples
  return [(PT_FUT[v] || v) + ["ei","á","emos","ão"][s]];
}
// Arabic (sound three-letter verbs: past root + ending, present prefix + root (+ ending))
const AR_PRON = ["أنا","أنتَ","أنتِ","هو","هي","نحن","هم"], AR_PRONR = ["anā","anta","anti","huwa","hiya","naḥnu","hum"];
const AR_PRONE = ["I","you (to a man)","you (to a woman)","he","she","we","they"];
const ARV = {"كتب":["k t b","a","u","to write"], "درس":["d r s","a","u","to study"], "شرب":["sh r b","i","a","to drink"], "ذهب":["dh h b","a","a","to go"], "فهم":["f h m","i","a","to understand"],
  "عمل":["ʿ m l","i","a","to work"], "لعب":["l ʿ b","i","a","to play"], "فتح":["f t ḥ","a","a","to open"], "سمع":["s m ʿ","i","a","to hear"], "جلس":["j l s","a","i","to sit"],
  "رجع":["r j ʿ","a","i","to return"], "طبخ":["ṭ b kh","a","u","to cook"], "غسل":["gh s l","a","i","to wash"], "دخل":["d kh l","a","u","to enter"], "خرج":["kh r j","a","u","to go out"], "ركب":["r k b","i","a","to ride"]};
function arForm(v, ten, p){
  const [rt, pv, iv] = ARV[v], [c1, c2, c3] = rt.split(" ");
  if(ten === "past"){
    const W = v + ["ت","ت","ت","","ت","نا","وا"][p], R = c1 + "a" + c2 + pv + c3 + ["tu","ta","ti","a","at","nā","ū"][p];
    return uniq([W, R, R.replace(/(tu|ta|ti)$/, "t").replace(/^(\S+?)a$/, "$1")]);
  }
  const pre = ["أ","ت","ت","ي","ت","ن","ي"][p], suf = ["","","ين","","","","ون"][p];
  const W = pre + v + suf, base = ["a","ta","ta","ya","ta","na","ya"][p] + c1 + c2 + iv + c3, R = base + ["","","īn","","","","ūn"][p];
  const Rfull = base + ["u","u","īna","u","u","u","ūna"][p];
  if(ten === "pres") return uniq([W, R, Rfull]);
  return uniq(["س" + W, "sa-" + R, "sa" + R, "sa " + R, "sa-" + Rfull, "سوف " + W, "sawfa " + R]);
}
const xlForm = (code, v, ten, p) => code === "fr" ? frForm(v, ten, p) : code === "pt" ? ptForm(v, ten, p) : arForm(v, ten, p);
const xlPronList = code => code === "fr" ? FR_PRON : code === "pt" ? PT_PRON : AR_PRON;
// Arabic labels read left to right in English, with the Arabic words isolated (U+2068 … U+2069)
const xlPronLabel = (code, p) => code === "ar" ? `${AR_PRONE[p]} (\u2068${AR_PRON[p]}\u2069 ${AR_PRONR[p]})` : xlPronList(code)[p];
const xlVerbLabel = (code, v) => code === "ar" ? `${ARV[v][3]} (\u2068${v}\u2069)` : v;
const xlVerbEn = (code, v) => code === "fr" ? FRV[v] : code === "pt" ? PTV[v] : ARV[v][3];
const XL_FRAMES = {
  fr:{pres:["… tous les jours.","… maintenant."], pc:["Hier, ….","… la semaine dernière."], fut:["Demain, ….","… l'année prochaine."], imp:["Avant, ….","Quand j'étais petit, …."], fp:["Ce soir, ….","… demain."]},
  pt:{pres:["… todos os dias.","… agora."], pp:["Ontem, ….","… na semana passada."], imp:["Antigamente, ….","Quando era criança, …."], fut:["Amanhã, ….","… no ano que vem."], fi:["Hoje à noite, ….","… amanhã."]},
  ar:{past:["أمس …","… في الأسبوع الماضي"], pres:["كل يوم …","… الآن"], fut:["غدا …","… في السنة القادمة"]}};
const xlFrame = (code, ten) => pick(XL_FRAMES[code][ten]);
const xlFill = (frame, s) => { const out = frame.replace("…", s); return /^[a-zà-ÿ]/.test(out) ? out.charAt(0).toUpperCase() + out.slice(1) : out; };
function xlWithPron(code, p, f){
  if(code === "fr") return frWithPron(p, f);
  if(code === "pt") return PT_PRON[p] + " " + f;
  return /[a-zāīū]/i.test(f) ? AR_PRONR[p] + " " + f : AR_PRON[p] + " " + f;
}
CONJ.fr = {
A1:[
 {t:"Présent: -er verbs", ten:["pres"], vb:["parler","aimer","habiter","travailler","regarder","écouter","jouer"], b:"Regular -er verbs: drop -er and add **-e, -es, -e, -ons, -ez, -ent**: je parle, nous parlons. Before a vowel **je** becomes **j'**: j'aime."},
 {t:"Être and avoir", ten:["pres"], vb:["être","avoir"], b:"**être**: je suis, tu es, il est, nous sommes, vous êtes, ils sont. **avoir**: j'ai, tu as, il a, nous avons, vous avez, ils ont."},
 {t:"Aller, faire, prendre", ten:["pres"], vb:["aller","faire","prendre"], b:"Three everyday irregulars: **je vais, je fais, je prends**; **ils vont, ils font, ils prennent**."},
 {t:"Futur proche", ten:["fp"], vb:["parler","manger","aller","faire","regarder","partir"], b:"**aller + infinitive** = going to: **je vais manger**, **nous allons partir**."}
],
A2:[
 {t:"Passé composé with avoir", ten:["pc"], vb:["parler","manger","finir","vendre","faire","prendre","regarder"], b:"**avoir + past participle**: j'ai parlé, tu as fini, il a vendu. Irregular participles: **fait, pris, eu, été**."},
 {t:"Passé composé with être", ten:["pc"], vb:["aller","venir","arriver","rester","partir"], b:"Movement verbs use **être**, and the participle agrees: **je suis allé(e)**, **elle est partie**, **nous sommes arrivés**."},
 {t:"Présent: -ir and -re verbs", ten:["pres"], vb:["finir","choisir","vendre","attendre","répondre"], b:"**-ir**: je finis, nous finissons. **-re**: je vends, il vend (no ending), nous vendons."},
 {t:"Vouloir, pouvoir, venir", ten:["pres"], vb:["vouloir","pouvoir","venir"], b:"**je veux, je peux, je viens**; **nous voulons, pouvons, venons**; **ils veulent, peuvent, viennent**."}
],
B1:[
 {t:"Futur simple", ten:["fut"], vb:["parler","finir","vendre","être","avoir","aller","faire","venir","pouvoir"], b:"Infinitive + **-ai, -as, -a, -ons, -ez, -ont** (-re verbs drop the e: vendr-). Irregular stems: **ser-, aur-, ir-, fer-, viendr-, pourr-, voudr-**."},
 {t:"Imparfait", ten:["imp"], vb:["parler","finir","faire","être","avoir","manger","prendre"], b:"Take the **nous** form, drop **-ons**, add **-ais, -ais, -ait, -ions, -iez, -aient**: nous parlons → je parlais. Only **être** is irregular: **j'étais**."},
 {t:"Imparfait or passé composé", ten:["imp","pc"], vb:["parler","faire","aller","manger","finir","prendre"], b:"**Passé composé** for one finished event (**hier, j'ai mangé**), **imparfait** for habits and background (**avant, je mangeais**)."},
 {t:"Final boss: every tense", ten:["pres","pc","fut","imp","fp"], vb:["parler","être","avoir","aller","faire","prendre","venir","finir"], b:"Any tense can come up. Read the label."}
]};
CONJ.pt = {
A1:[
 {t:"Presente: verbos em -ar", ten:["pres"], vb:["falar","morar","trabalhar","estudar","comprar","gostar"], b:"Drop **-ar** and add **-o, -a, -amos, -am**: eu falo, você fala, nós falamos, eles falam. **Você** uses the same form as ele / ela."},
 {t:"Ser e estar", ten:["pres"], vb:["ser","estar"], b:"**ser**: eu sou, você é, nós somos, eles são. **estar**: eu estou, você está, nós estamos, eles estão."},
 {t:"Ter, ir, fazer", ten:["pres"], vb:["ter","ir","fazer","querer","poder"], b:"Everyday irregulars: **eu tenho, eu vou, eu faço, eu quero, eu posso**."},
 {t:"Futuro com ir", ten:["fi"], vb:["falar","comer","viajar","trabalhar","estudar","fazer"], b:"**ir + infinitive** = going to: **eu vou viajar**, **nós vamos comer**."}
],
A2:[
 {t:"Pretérito perfeito: -ar", ten:["pp"], vb:["falar","morar","trabalhar","comprar","chegar","estudar"], b:"**-ei, -ou, -amos, -aram**: eu falei, ela falou. Spelling: chegar → **cheguei**."},
 {t:"Pretérito perfeito: -er e -ir", ten:["pp"], vb:["comer","beber","aprender","abrir","partir","assistir"], b:"**-er**: comi, comeu, comemos, comeram. **-ir**: abri, abriu, abrimos, abriram."},
 {t:"Perfeito irregular", ten:["pp"], vb:["ser","ir","estar","ter","fazer"], b:"**ser** and **ir** share the same past: **fui, foi, fomos, foram**. Also **estive, tive, fiz**."},
 {t:"Presente: -er e -ir", ten:["pres"], vb:["comer","beber","aprender","abrir","partir","assistir"], b:"**-er**: como, come, comemos, comem. **-ir**: abro, abre, abrimos, abrem."}
],
B1:[
 {t:"Pretérito imperfeito", ten:["imp"], vb:["falar","morar","comer","ser","ter","fazer","ir"], b:"**-ava, -ávamos, -avam** (-ar) and **-ia, -íamos, -iam** (-er / -ir). Irregular: **era** (ser), **tinha** (ter)."},
 {t:"Perfeito ou imperfeito", ten:["pp","imp"], vb:["falar","comer","ser","ter","ir","fazer"], b:"**Perfeito** for a finished event (ontem comi), **imperfeito** for habits and background (antigamente comia)."},
 {t:"Futuro simples", ten:["fut"], vb:["falar","comer","partir","fazer","viajar","estudar"], b:"Infinitive + **-ei, -á, -emos, -ão**: eu falarei, eles falarão. Irregular: **farei** (fazer). Brazilians mostly say **vou falar**."},
 {t:"Mistura final", ten:["pres","pp","imp","fi","fut"], vb:["falar","ser","estar","ter","ir","fazer","comer"], b:"Any tense can come up. Read the label."}
]};
CONJ.ar = {
A1:[
 {t:"Present: I, you, he, she", ten:["pres"], ps:[0,1,2,3,4], vb:["كتب","درس","شرب","ذهب","فهم"], b:"Present verbs add a prefix: **أ** (I), **ت** (you, she), **ي** (he). Talking to a woman, add **ين** at the end: **تكتبين** (taktubīn)."},
 {t:"Present: we and they", ten:["pres"], ps:[5,6], vb:["كتب","درس","شرب","ذهب","لعب","عمل"], b:"**ن** (na-) = we: **نكتب**. **يـ…ـون** (ya-…-ūn) = they: **يكتبون**."},
 {t:"Past: I and you", ten:["past"], ps:[0,1,2], vb:["كتب","درس","شرب","ذهب","فهم","فتح"], b:"Past = the verb + an ending: **-tu** (I), **-ta** (you, to a man), **-ti** (you, to a woman). Without vowel marks all three are written **كتبت**."},
 {t:"Past: he, she, we, they", ten:["past"], ps:[3,4,5,6], vb:["كتب","درس","شرب","ذهب","لعب","رجع"], b:"**كتب** (kataba) = he wrote, **كتبت** (katabat) = she wrote, **كتبنا** (katabnā) = we wrote, **كتبوا** (katabū) = they wrote."}
],
A2:[
 {t:"Present: all persons", ten:["pres"], vb:["كتب","درس","عمل","لعب","سمع","جلس","رجع"], b:"**أ / ت / ت…ين / ي / ت / ن / ي…ون**: the prefix tells you who."},
 {t:"Past: all persons", ten:["past"], vb:["كتب","درس","عمل","لعب","سمع","جلس","دخل"], b:"**-tu / -ta / -ti / -a / -at / -nā / -ū**: the ending tells you who."},
 {t:"Future with سـ", ten:["fut"], vb:["كتب","درس","ذهب","شرب","لعب","رجع"], b:"Future = **سـ** (sa-) + present: **سأكتب** (sa-aktub) = I will write, **سيذهبون** = they will go."},
 {t:"Past or present?", ten:["past","pres"], vb:["كتب","فهم","طبخ","غسل","خرج","ركب"], b:"Past has only an ending (**كتبنا**), the present has a prefix (**نكتب**). Read the label."}
],
B1:[
 {t:"All tenses", ten:["past","pres","fut"], vb:["كتب","درس","عمل","لعب","سمع","جلس","طبخ","غسل","دخل","خرج"], b:"Past, present and future with more verbs."},
 {t:"Final boss: any verb, any person", ten:["past","pres","fut"], vb:Object.keys(ARV), b:"Any verb, any person, any tense."}
]};
// Mandarin: measure words and particles instead of verb tables
if(WL.zh && WL.zh.measure){ CONJ.zh = {}; for(const lv in WL.zh.measure) CONJ.zh[lv] = xlmConcepts("zh", WL.zh.measure[lv]); }
// every Arabic form gets its transliteration (tiles and the answer card)
for(const v of Object.keys(ARV)) for(const ten of ["past","pres","fut"]) for(let p = 0; p < 7; p++){
  const f = arForm(v, ten, p); XL_ROM[xlKey(f[0])] = f[1]; if(!/\s/.test(f[0])) XL_TOKROM.ar[f[0]] = f[1];
}

conjQuestion = (orig => function(c, tgt, recent){
  if(!["fr", "pt", "ar"].includes(tgt)) return orig.apply(this, arguments);
  const n = xlPronList(tgt).length;
  for(let tries = 0; tries < 25; tries++){
    const inf = pick(c.vb), ten = pick(c.ten), p = pick(c.ps || [...Array(n).keys()]);
    const forms = xlForm(tgt, inf, ten, p), key = `${inf}|${ten}|${p}`;
    if(recent.has(key) && tries < 20) continue;
    return {inf, ten, p, pron:xlPronList(tgt)[p], forms, key};
  }
  return null;
})(conjQuestion);
conjWrongs = (orig => function(tgt, q){
  if(!["fr", "pt", "ar"].includes(tgt)) return orig.apply(this, arguments);
  const right = new Set(q.forms.map(f => norm(f, tgt, false))), out = new Set();
  for(let p = 0; p < xlPronList(tgt).length; p++) if(p !== q.p){ const f = xlForm(tgt, q.inf, q.ten, p)[0]; if(!right.has(norm(f, tgt, false))) out.add(f); }
  return [...out];
})(conjWrongs);
conjAccepted = (orig => function(tgt, forms, pIdx, pron){
  if(!["fr", "pt", "ar"].includes(tgt)) return orig.apply(this, arguments);
  return uniq(forms.concat(forms.map(f => xlWithPron(tgt, pIdx, f))));
})(conjAccepted);
function xlGenConj(st, plan, c, review, res){
  const nat = LANG_CODE[st.native], code = LANG_CODE[st.target], L = GMT[nat];
  const recent = new Set((st.recentK || []).map(k => String(k).replace(/^c:/, "")));
  const q = conjQuestion(c, code, recent);
  const games = ["Verb Forge", "Time Machine", "Slip Fixer"];
  let game = plan.boss ? "Verb Forge" : games.includes(plan.game) ? plan.game : pick(games);
  let wrong = null;
  if(game === "Slip Fixer"){ const ws = conjWrongs(code, q); if(ws.length) wrong = pick(ws); else game = "Time Machine"; }
  const tName = XCT[code][q.ten], form = q.forms[0];
  const acc = conjAccepted(code, q.forms, q.p, q.pron);
  const ch = {game, al:code, k:"c", acc, answerKey:form, tests:c.t, speak:"", cw:[], why:`**${form}** · ${q.inf} · ${tName}` + (c.b ? "\n" + c.b : "")};
  let task;
  if(game === "Verb Forge"){
    task = L.cForge(LN[nat][st.target]);
    ch.target = `${xlPronLabel(code, q.p)} · ${xlVerbLabel(code, q.inf)} · ${tName}`;
  } else {
    const frame = xlFrame(code, q.ten), blank = `___ (${xlPronList(code)[q.p]} · ${q.inf})`;
    ch.acc = uniq(acc.concat(q.forms.map(f => xlFill(frame, xlWithPron(code, q.p, f)))));
    if(game === "Time Machine"){ task = L.cTime(tName); ch.target = xlFill(frame, blank); }
    else { task = L.cSlip(tName); ch.target = xlFill(frame, xlWithPron(code, q.p, wrong)); }
  }
  const words = form.split(" ");
  ch.hint = plan.boss || code === "ar" ? "" : words.length > 1 ? L.hStart(words[0], words.length) : L.hLetter(form.slice(0, 2), form.length);
  Object.assign(ch, bossWrap(L, plan, task + " " + L.cHow));
  // Arabic: tap the right form (typing the transliteration works too)
  if(code === "ar"){ const ws = shuffle(conjWrongs(code, q)).slice(0, 3); if(ws.length >= 2) ch.opts = shuffle([form].concat(ws)); }
  const sample = c.vb[0], tableT = c.ten[0], ps = c.ps || [...Array(xlPronList(code).length).keys()];
  const table = ps.map(p => ({w:xlWithPron(code, p, xlForm(code, sample, tableT, p)[0]), m:`${sample} · ${xlVerbEn(code, sample)}`}));
  res.lesson = review ? {title:c.t, body:L.cRev + " " + c.b, words:[]} : {title:c.t, body:c.b, words:table};
  res.spotlight = {tense:`${XCT[code][tableT]} · ${sample}`, endings:table.map(x => x.w).join(" · "), irregular:""};
  res.challenge = ch;
  res._k = "c:" + q.key;
  return res;
}
genConj = (orig => function(st, plan, c, review, res){
  const code = xlmCode(st && st.target);
  if(code === "zh") return genSentence(Object.assign({}, st, {mode:8}), plan, c, review, res);   // measure words play like Tricky Pairs
  if(code) return xlGenConj(st, plan, c, review, res);
  return orig.apply(this, arguments);
})(genConj);
gamesFor = (orig => function(st){
  if(st && st.mode === 7 && xlmCode(st.target) === "zh") return ["Word Duel", "Cloze Combat", "Classic Mine", "Error Hunter"];
  return orig.apply(this, arguments);
})(gamesFor);
// Mandarin / Arabic number and verb rounds offer their options as tap tiles
tileItems = (orig => function(ch){
  if(ch && (ch.al === "zh" || ch.al === "ar") && (ch.k === "n" || ch.k === "c") && Array.isArray(ch.opts)) return {mode:"pick", items:ch.opts, keepScreen:true};
  return orig.apply(this, arguments);
})(tileItems);

/* ---------- levels, syllabus and lookups per language ---------- */
levelsFor = (orig => function(mode, target){
  const code = xlmCode(target);
  if(code){
    if(mode === 4) return Object.keys(XLNUM);
    if(mode === 5) return Object.keys(XLV[code] || {A1:1});
    if(mode === 7) return Object.keys(CONJ[code] || {A1:1});
    if(mode === 8) return Object.keys(TRICKY[code] || {A1:1});
  }
  return orig.apply(this, arguments);
})(levelsFor);
syllabusFor = (orig => function(st){
  const code = xlmCode(st && st.target);
  if(code && st.mode === 4) return xlNumSyl(code, st.level).map(c => c[LANG_CODE[st.native]]);
  return orig.apply(this, arguments);
})(syllabusFor);
conceptAt = (orig => function(st, idx){
  const code = xlmCode(st && st.target);
  if(code && st.mode === 4) return xlNumSyl(code, st.level)[idx];
  return orig.apply(this, arguments);
})(conceptAt);
findConcept = (orig => function(st, key){
  const code = xlmCode(st && st.target);
  if(code && st.mode === 4){
    const k = String(key || "").toLowerCase(), nat = LANG_CODE[st.native];
    for(const lv in XLNUM) for(const c of xlNumSyl(code, lv)) if(c[nat].toLowerCase() === k) return c;
    return null;
  }
  return orig.apply(this, arguments);
})(findConcept);

/* ---------- menu: Mandarin's mode 7 is about measure words ---------- */
Object.assign(I18N.en, {zh_m7n:"Measure Words", zh_m7d:"个, 本, 张… plus 了 and 过: the little words Chinese can't do without."});
Object.assign(I18N.es, {zh_m7n:"Clasificadores", zh_m7d:"个, 本, 张… y 了 y 过: las palabritas imprescindibles del chino."});
renderMenu = (orig => function(){
  const r = orig.apply(this, arguments);
  try{
    const TP8 = {fr:"tu or vous, c'est or il est, bon or bien…", pt:"ser or estar, por or para, mas or mais…", zh:"不 or 没, 二 or 两, 的 or 得…", ar:"هذا or هذه, ما or ماذا, في or إلى…"};
    const c8 = xlmCode(setup.target), b8 = document.querySelector('#modes [data-mode="8"] small');
    if(c8 && b8) b8.textContent = TP8[c8];
    if(xlmCode(setup.target) === "zh"){
      const b = document.querySelector('#modes [data-mode="7"]');
      if(b){ b.querySelector(".ico").textContent = "🧮"; b.querySelector("b").textContent = t("zh_m7n"); b.querySelector("small").textContent = t("zh_m7d"); }
    }
  }catch(e){}
  return r;
})(renderMenu);
if(window.__PGM_TEST) window.__xlm = {xlNumWords, xlTime, xlPrice, frNum, ptNum, zhNum, arNum, frForm, ptForm, arForm, XLV, XLNUM, xlNumSyl, WL, STORIES, ISLANDS, TRICKY, CONJ, levelsFor:(m, t) => levelsFor(m, t), renderMenu:() => renderMenu()};
(() => { const c = document.createElement("style"); c.textContent = ".sline .srom{display:block;color:var(--violet);font-size:.85rem;margin-top:2px}"; document.head.appendChild(c); })();
