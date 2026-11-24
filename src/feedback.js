/* ===================== Clearer feedback: the question, your mistakes marked, what went wrong ===================== */
Object.assign(I18N.en, {
  fbQ:"Question:", fbWhat:"What went wrong", fbTip:"Grammar tip",
  fbPick:"You picked:", fbSent:"The sentence:", fbFix:"✏️ Correct version:", fbNoFix:"✓ Nothing to fix: it was already correct.",
  fbLook:"“{y}” is not “{b}”. They look alike, but they are different words.",
  fbLookM:"“{y}” ({ym}) is not “{b}” ({bm}). They look alike, but they mean different things.",
  fbSwap:"You wrote “{y}” where the answer has “{b}”.",
  fbMissing:"Missing: {w}.", fbExtra:"Not needed: {w}.", fbOrder:"Right words, wrong order.",
  fbAcc:"Check the accents: {w}.",
  fbEnd:"“{y}” should be “{b}”: same word, different ending. Check that it matches who is doing it (verbs) or the gender and number of the noun (adjectives, articles).",
  fbSerEstar:"Ser or estar: use estar for states and conditions (tired, sick, happy right now, where something is) and ser for what something is (identity, origin, job, time)."
});
Object.assign(I18N.es, {
  fbQ:"Pregunta:", fbWhat:"Qué falló", fbTip:"Consejo de gramática",
  fbPick:"Elegiste:", fbSent:"La frase:", fbFix:"✏️ Versión correcta:", fbNoFix:"✓ No hay nada que corregir: ya estaba bien.",
  fbLook:"«{y}» no es «{b}». Se parecen, pero son palabras distintas.",
  fbLookM:"«{y}» ({ym}) no es «{b}» ({bm}). Se parecen, pero significan cosas distintas.",
  fbSwap:"Escribiste «{y}» donde la respuesta tiene «{b}».",
  fbMissing:"Falta: {w}.", fbExtra:"Sobra: {w}.", fbOrder:"Las palabras están bien, pero el orden no.",
  fbAcc:"Revisa los acentos: {w}.",
  fbEnd:"«{y}» debería ser «{b}»: misma palabra, otra terminación. Comprueba la persona del verbo o el género y número del sustantivo.",
  fbSerEstar:"Ser o estar: estar para estados y condiciones (cansado, enfermo, contento ahora, dónde está algo) y ser para lo que algo es (identidad, origen, profesión, hora)."
});

const fbKey = w => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\p{L}\p{N}']/gu, "");
const fbRaw = w => w.toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");
const fbToks = s => String(s || "").replace(/\*\*/g, "").split(/\s+/).filter(Boolean);
const FB_SER = new Set(["soy","eres","es","somos","sois","son","era","eras","éramos","eran","fui","fue","fueron","sea","seas"]);
const FB_ESTAR = new Set(["estoy","estas","estás","esta","está","estamos","estais","estáis","estan","están","estaba","estabas","estaban","estuve","estuvo","este","esté"]);
function fbCharLev(a, b){
  const d = Array.from({length:a.length + 1}, (_, i) => [i]);
  for(let j = 1; j <= b.length; j++) d[0][j] = j;
  for(let i = 1; i <= a.length; i++) for(let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[a.length][b.length];
}
function fbMeaning(w, lang){
  const m = VMAP[lang] || {}, k = w.toLowerCase().replace(/[^\p{L}' ]/gu, "");
  const e = m[k] || m["el " + k] || m["la " + k] || m["to " + k] || m[k.replace(/a$/, "o")];
  if(!e) return "";
  return first(lang === "en" ? e.es : e.en);   // the new languages keep their meaning in e.en
}

/* Align your words with the best answer (longest common subsequence on letters only) */
function fbAlign(you, best){
  const A = fbToks(you), B = fbToks(best), a = A.map(fbKey), b = B.map(fbKey);
  const n = a.length, m = b.length, L = Array.from({length:n + 1}, () => new Array(m + 1).fill(0));
  for(let i = n - 1; i >= 0; i--) for(let j = m - 1; j >= 0; j--) L[i][j] = a[i] && a[i] === b[j] ? L[i+1][j+1] + 1 : Math.max(L[i+1][j], L[i][j+1]);
  const ya = [], ba = [], segs = []; let i = 0, j = 0, seg = {y:[], b:[]};
  const flush = () => { if(seg.y.length || seg.b.length) segs.push(seg); seg = {y:[], b:[]}; };
  while(i < n || j < m){
    if(i < n && j < m && a[i] && a[i] === b[j]){
      flush();
      const acc = fbRaw(A[i]) !== fbRaw(B[j]);
      ya.push({w:A[i], c:acc ? "acc" : "ok"}); ba.push({w:B[j], c:acc ? "acc" : "ok"});
      if(acc) segs.push({acc:B[j]});
      i++; j++;
    } else if(j < m && (i >= n || L[i][j+1] >= L[i+1][j])){ ba.push({w:B[j], c:"add"}); seg.b.push(B[j]); j++; }
    else { ya.push({w:A[i], c:"del"}); seg.y.push(A[i]); i++; }
  }
  flush();
  return {ya, ba, segs, sameBag: a.slice().sort().join(" ") === b.slice().sort().join(" ") && a.join(" ") !== b.join(" ")};
}
const fbHtml = list => list.map(x => x.c === "ok" ? esc(x.w) : `<span class="dx dx-${x.c}">${esc(x.w)}</span>`).join(" ");

function fbNotes(al, segs, sameBag){
  const notes = [], acc = [];
  if(sameBag) return [t("fbOrder")];
  let serEstar = false;
  for(const s of segs){
    if(s.acc){ acc.push(s.acc.replace(/[^\p{L}' ]/gu, "")); continue; }
    const k = Math.min(s.y.length, s.b.length);
    for(let q = 0; q < k; q++){
      const y = s.y[q].replace(/[^\p{L}\p{N}' ]/gu, ""), b = s.b[q].replace(/[^\p{L}\p{N}' ]/gu, "");
      const ky = fbKey(y), kb = fbKey(b);
      if((FB_SER.has(ky) && FB_ESTAR.has(kb)) || (FB_ESTAR.has(ky) && FB_SER.has(kb))){ serEstar = true; continue; }
      const d = fbCharLev(ky, kb);
      let pre = 0; while(pre < ky.length && pre < kb.length && ky[pre] === kb[pre]) pre++;
      if(d > 0 && pre >= 3 && pre >= Math.min(ky.length, kb.length) - 3){ notes.push(t("fbEnd", {y, b})); continue; }
      if(d > 0 && d <= 2 && Math.min(ky.length, kb.length) >= 4){
        const ym = fbMeaning(y, al), bm = fbMeaning(b, al);
        notes.push(ym && bm && ym !== bm ? t("fbLookM", {y, b, ym, bm}) : t("fbLook", {y, b}));
      } else notes.push(t("fbSwap", {y, b}));
    }
    if(s.b.length > k) notes.push(t("fbMissing", {w:s.b.slice(k).join(" ")}));
    if(s.y.length > k) notes.push(t("fbExtra", {w:s.y.slice(k).join(" ")}));
  }
  if(acc.length) notes.push(t("fbAcc", {w:acc.join(", ")}));
  if(serEstar && al === "es") notes.unshift(t("fbSerEstar"));
  return notes.slice(0, 4);
}

function renderFeedback(){
  const j = S && S.judgement, box = $("judgeCard").querySelector(".ans");
  if(!j || !box || box.dataset.fb === "1") return;
  box.dataset.fb = "1";
  if(j.rw && j.rw.fix){ renderCorrection(j, box); return; }
  const q = j.question && j.qgame !== "Match Madness" ? `<div class="fbq"><b>${esc(t("fbQ"))}</b> ${esc(j.question)}</div>` : "";
  let you = j.gaveUp ? "" : `<div><b>${esc(t("you"))}</b> ${esc(j.yours)}</div>`, best = `<div><b>${esc(t("best"))}</b> ${esc(j.answer)}</div>`, notes = "";
  const lang = j.qal || (S.target === "English" ? "en" : "es");
  let segs = [], skip = new Set();
  if(!j.correct && !j.gaveUp && j.qgame !== "Match Madness" && j.yours){
    const al = fbAlign(j.yours, j.answer);
    segs = al.segs;
    you = `<div><b>${esc(t("you"))}</b> ${fbHtml(al.ya)}</div>`;
    best = `<div><b>${esc(t("best"))}</b> ${fbHtml(al.ba)}</div>`;
    const ns = fbNotes(lang, al.segs, al.sameBag);
    if(ns.includes(t("fbSerEstar"))){ skip.add("ser"); skip.add("estar"); }
    if(ns.length) notes = `<div class="fbnotes"><b>${esc(t("fbWhat"))}</b><ul>${ns.map(n => `<li>${esc(n)}</li>`).join("")}</ul></div>`;
  }
  if(!j.correct && j.qgame !== "Match Madness" && j.answer){
    // a tip about the grammar this sentence uses, preferring the part you got wrong
    const already = String(j.feedback || "");
    const tips = tipsFor(j.answer, j.gaveUp ? "" : j.yours, lang, segs, skip).filter(x => !already.includes(x.slice(0, 40)));
    if(tips.length) notes += `<div class="fbnotes fbtips"><b>💡 ${esc(t("fbTip"))}</b><ul>${tips.map(n => `<li>${esc(n)}</li>`).join("")}</ul></div>`;
  }
  const btns = [...box.querySelectorAll("button")];
  box.innerHTML = q + you + best + notes;
  btns.forEach(b => box.appendChild(b));
}
/* Right or Wrong / Spot the Mistake: the sentence with its mistake crossed out, then the correct version */
function renderCorrection(j, box){
  const lang = j.qal || (S.target === "English" ? "en" : "es"), r = j.rw, sep = lang === "zh" ? "" : " ";
  const html = list => list.map(x => x.c === "ok" ? esc(x.w) : `<span class="dx dx-${x.c}">${esc(x.w)}</span>`).join(sep);
  const plain = s => lang === "zh" ? String(s).replace(/ /g, "") : String(s);
  let rows = j.gaveUp ? "" : `<div><b>${esc(t("fbPick"))}</b> ${esc(j.yours)}</div>`, notes = "";
  if(r.had && r.shown){
    const al = fbAlign(r.shown, r.fix), changed = al.ya.some(x => x.c !== "ok") || al.ba.some(x => x.c !== "ok");
    rows += `<div class="fbq"><b>${esc(t("fbSent"))}</b> ${changed ? html(al.ya) : esc(plain(r.shown))}</div>`;
    rows += `<div class="fbfix"><b>${esc(t("fbFix"))}</b> ${changed ? html(al.ba) : `<span class="dx dx-add">${esc(plain(r.fix))}</span>`}</div>`;
    const tips = tipsFor(r.fix, r.shown, lang, al.segs, new Set());
    if(tips.length) notes = `<div class="fbnotes fbtips"><b>💡 ${esc(t("fbTip"))}</b><ul>${tips.map(n => `<li>${esc(n)}</li>`).join("")}</ul></div>`;
  } else {
    rows += `<div class="fbq"><b>${esc(t("fbSent"))}</b> ${esc(plain(r.fix))}</div><div class="fbfix">${esc(t("fbNoFix"))}</div>`;
  }
  const btns = [...box.querySelectorAll("button")];
  box.innerHTML = rows + notes;
  btns.forEach(b => box.appendChild(b));
}
(() => { const c = document.createElement("style"); c.textContent = ".ans .fbfix{margin-top:4px;padding:6px 8px;border-radius:10px;background:rgba(46,196,140,.10)}"; document.head.appendChild(c); })();
renderExtras = (orig => function(fresh){ orig(fresh); renderFeedback(); })(renderExtras);
