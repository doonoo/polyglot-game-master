/* ===================== Juice: arcade-style life everywhere =====================
   Pixel bursts, floating +XP, combo banners, screen shake, boss flashes, a drifting
   letter background, beat-synced pulses from the soundtrack and a "now playing" tag.
   Everything is plain DOM + CSS (no canvas loop to freeze in a paused WebView), and
   all of it obeys the Animations switch and the system's reduced-motion setting. */
Object.assign(I18N.en, {ju_nice:"NICE!", ju_great:"GREAT!", ju_awesome:"AWESOME!", ju_combo:"COMBO ×{n}!", ju_level:"LEVEL UP!",
  ju_boss:"BOSS!", ju_bossDown:"BOSS DOWN!", ju_win:"VICTORY!", ju_perfect:"PERFECT!"});
Object.assign(I18N.es, {ju_nice:"¡BIEN!", ju_great:"¡GENIAL!", ju_awesome:"¡INCREÍBLE!", ju_combo:"¡COMBO ×{n}!", ju_level:"¡SUBES DE NIVEL!",
  ju_boss:"¡JEFE!", ju_bossDown:"¡JEFE DERROTADO!", ju_win:"¡VICTORIA!", ju_perfect:"¡PERFECTO!"});

(() => {
  const css = document.createElement("style");
  css.textContent = `
#bgfx{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none}
#bgfx span{position:absolute;bottom:-12vh;font:800 var(--sz,28px)/1 "Bricolage Grotesque",sans-serif;color:var(--violet);opacity:.09;animation:jxRise var(--d,24s) linear infinite;animation-delay:var(--dl,0s);will-change:transform}
@keyframes jxRise{from{transform:translateY(0) rotate(0)}to{transform:translateY(-125vh) rotate(var(--rot,180deg))}}
.jx-layer{position:fixed;inset:0;z-index:12;pointer-events:none;overflow:hidden}
.jx-px{position:absolute;width:var(--s,7px);height:var(--s,7px);background:var(--c);box-shadow:0 0 0 1px rgba(0,0,0,.15);animation:jxPx .75s steps(9) forwards}
@keyframes jxPx{0%{transform:translate(0,0) rotate(0);opacity:1}70%{opacity:1}100%{transform:translate(var(--dx),var(--dy)) rotate(var(--r));opacity:0}}
.jx-float{position:absolute;transform:translate(-50%,-50%);font:800 1.35rem/1 "Bricolage Grotesque",sans-serif;color:var(--c,#F2B01E);text-shadow:2px 2px 0 #1C1A33;white-space:nowrap;animation:jxFloat 1s cubic-bezier(.2,.8,.3,1) forwards}
@keyframes jxFloat{0%{transform:translate(-50%,-30%) scale(.4);opacity:0}20%{transform:translate(-50%,-60%) scale(1.25);opacity:1}100%{transform:translate(-50%,-260%) scale(1);opacity:0}}
.jx-banner{position:fixed;left:50%;top:38%;z-index:13;pointer-events:none;transform:translate(-50%,-50%);text-align:center;white-space:nowrap;
  font:800 clamp(2.2rem,11vw,4.2rem)/1 "Bricolage Grotesque",sans-serif;letter-spacing:.02em;color:#FFD45C;
  -webkit-text-stroke:2px #1C1A33;text-shadow:4px 4px 0 #1C1A33,8px 8px 0 rgba(91,75,214,.55);animation:jxBanner 1.35s cubic-bezier(.2,1.2,.3,1) forwards}
.jx-banner.boss{color:#FF5A5F}.jx-banner.ok{color:#4FD195}.jx-banner.lvl{color:#7FE3F5}
.jx-banner i{display:inline-block;font-style:normal;animation:jxWave .5s ease-in-out infinite alternate;animation-delay:calc(var(--i) * 45ms)}
@keyframes jxBanner{0%{transform:translate(-50%,-50%) scale(0) rotate(-12deg);opacity:0}18%{transform:translate(-50%,-50%) scale(1.15) rotate(3deg);opacity:1}30%{transform:translate(-50%,-50%) scale(1) rotate(0)}78%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-140%) scale(.8);opacity:0}}
@keyframes jxWave{from{transform:translateY(3px)}to{transform:translateY(-5px)}}
.jx-flash{position:fixed;inset:0;z-index:11;pointer-events:none;background:var(--c,#fff);animation:jxFlash .45s steps(4) forwards}
@keyframes jxFlash{0%{opacity:.55}100%{opacity:0}}
.jx-vig{position:fixed;inset:0;z-index:11;pointer-events:none;box-shadow:inset 0 0 90px 10px rgba(229,56,79,.55);animation:jxFlash .6s ease-out forwards}
.jx-shake{animation:jxShake .42s cubic-bezier(.36,.07,.19,.97)!important}
@keyframes jxShake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-8px)}40%,60%{transform:translateX(8px)}}
.jx-quake{animation:jxQuake .6s steps(12)!important}
@keyframes jxQuake{0%,100%{transform:none}20%{transform:translate(-6px,3px)}40%{transform:translate(5px,-4px)}60%{transform:translate(-4px,-2px)}80%{transform:translate(3px,4px)}}
.jx-np{position:fixed;left:12px;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:9;pointer-events:none;display:flex;align-items:center;gap:8px;
  background:#1C1A33;color:#FFD45C;border:2px solid #FFD45C;border-radius:4px;padding:6px 12px 6px 8px;font:700 .85rem/1.1 "Bricolage Grotesque",sans-serif;
  box-shadow:4px 4px 0 rgba(0,0,0,.35);animation:jxNp 3.2s steps(24) forwards;max-width:calc(100vw - 24px)}
.jx-np small{display:block;color:#B9B4E0;font-weight:500;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase}
.jx-np b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jx-np .eq{display:flex;gap:2px;align-items:flex-end;height:16px}
.jx-np .eq i{width:3px;background:#4FD195;animation:jxEq .5s steps(4) infinite alternate}
.jx-np .eq i:nth-child(2){animation-delay:.15s;background:#7FE3F5}.jx-np .eq i:nth-child(3){animation-delay:.3s;background:#FF8FB1}
@keyframes jxEq{from{height:3px}to{height:16px}}
@keyframes jxNp{0%{transform:translateX(-130%)}10%,85%{transform:translateX(0)}100%{transform:translateX(-130%)}}
.jx-beat{animation:jxBeat .22s ease-out}
.jx-beatbig{animation:jxBeatBig .3s ease-out}
@keyframes jxBeat{0%{transform:scale(1.04)}100%{transform:none}}
@keyframes jxBeatBig{0%{transform:scale(1.08);filter:brightness(1.15)}100%{transform:none;filter:none}}
.hero.jx-beat,.hero.jx-beatbig{animation:none}
.hero.jx-beat::after{animation:jxSun .25s ease-out}.hero.jx-beatbig::after{animation:jxSun .35s ease-out}
@keyframes jxSun{0%{transform:scale(1.07)}100%{transform:none}}
.hero .title .jx-l{display:inline-block;animation:jxTitle 6s ease-in-out infinite;animation-delay:calc(var(--i) * 70ms + 1s)}
@keyframes jxTitle{0%,10%,100%{transform:none}4%{transform:translateY(-9px) rotate(-4deg);color:#FFD45C}7%{transform:translateY(2px)}}
.hero::before{content:"";position:absolute;inset:0;background-image:radial-gradient(#fff 1px,transparent 1.5px),radial-gradient(rgba(255,255,255,.6) 1px,transparent 1.5px);
  background-size:60px 60px,37px 37px;background-position:0 0,18px 22px;opacity:.35;animation:jxStars 40s linear infinite;pointer-events:none}
@keyframes jxStars{to{background-position:-600px 0,-370px 22px}}
.mode .ico{animation:jxBob 2.6s ease-in-out infinite;animation-delay:calc(var(--i,0) * -.35s)}
@keyframes jxBob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-4px) rotate(-3deg)}}
@media (hover:hover){.mode:hover .ico{animation:jxWiggle .5s ease-in-out}}
@keyframes jxWiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg) scale(1.1)}75%{transform:rotate(10deg) scale(1.1)}}
.continue .go{animation:jxNudge 1.2s ease-in-out infinite}
@keyframes jxNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
#chIco{display:inline-block;animation:jxBob 2.2s ease-in-out infinite}
#hudBar{position:relative;overflow:hidden}
#hudBar::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(-45deg,rgba(255,255,255,.28) 0 6px,transparent 6px 12px);background-size:17px 17px;animation:jxStripes .8s linear infinite}
@keyframes jxStripes{to{background-position:17px 0}}
#hudStreak.jx-hot{display:inline-block;animation:jxFlame .35s steps(2) infinite alternate;text-shadow:0 0 8px rgba(255,140,0,.7)}
#hudStreak.jx-blaze{animation:jxFlame .2s steps(2) infinite alternate;text-shadow:0 0 6px #FFD45C,0 0 16px rgba(255,90,0,.9)}
@keyframes jxFlame{from{transform:scale(1) rotate(-2deg)}to{transform:scale(1.12) rotate(2deg)}}
.sopt.right{animation:jxRight .5s cubic-bezier(.2,1.6,.4,1)}
.sopt.wrong{animation:jxShake .42s}
@keyframes jxRight{0%{transform:scale(1)}40%{transform:scale(1.08)}100%{transform:scale(1)}}
.judge.ok .jx-star{display:inline-block;animation:jxSpin 1.2s steps(8) infinite}
@keyframes jxSpin{to{transform:rotate(360deg)}}
#overTitle .jx-l{display:inline-block;animation:jxDropL .6s cubic-bezier(.2,1.4,.4,1) backwards;animation-delay:calc(var(--i) * 70ms + .2s)}
#overTitle.win .jx-l{animation:jxDropL .6s cubic-bezier(.2,1.4,.4,1) backwards,jxWave .45s ease-in-out infinite alternate;animation-delay:calc(var(--i) * 70ms + .2s),calc(var(--i) * 60ms + 1s)}
@keyframes jxDropL{from{transform:translateY(-70px) rotate(-20deg);opacity:0}to{transform:none;opacity:1}}
body.noanim #bgfx,body.noanim .jx-layer,body.noanim .jx-banner,body.noanim .jx-flash,body.noanim .jx-vig,body.noanim .hero::before{display:none}
@media (prefers-reduced-motion: reduce){#bgfx,.jx-layer,.jx-banner,.hero::before{display:none}.hero .title .jx-l,.mode .ico,#chIco,.continue .go,#hudBar::after{animation:none!important}}
`;
  document.head.appendChild(css);
})();

const juOn = () => animOn && !reduceMotion && !window.__PGM_TEST;
const JU_COLS = ["#F2B01E", "#FFD45C", "#4FD195", "#2BB7D4", "#E5384F", "#9D91FF", "#FFFFFF"];
let juLayer = null;
function juLay(){
  if(!juLayer || !juLayer.isConnected){ juLayer = document.createElement("div"); juLayer.className = "jx-layer"; juLayer.setAttribute("aria-hidden", "true"); document.body.appendChild(juLayer); }
  return juLayer;
}
function juTemp(el, ms){ setTimeout(() => el.remove(), ms); return el; }

/* Square pixels flying out of a point */
function juBurst(x, y, n, cols, spread){
  if(!juOn()) return;
  const L = juLay(); cols = cols || JU_COLS; spread = spread || 110;
  if(L.childElementCount > 120) return;
  for(let i = 0; i < n; i++){
    const p = document.createElement("i"), a = Math.random() * Math.PI * 2, d = spread * (0.45 + Math.random() * 0.75);
    p.className = "jx-px";
    p.style.cssText = `left:${x}px;top:${y}px;--c:${cols[i % cols.length]};--s:${4 + Math.floor(Math.random() * 3) * 2}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d + 30}px;--r:${Math.round(Math.random() * 360)}deg`;
    L.appendChild(juTemp(p, 800));
  }
}
function juFloat(x, y, text, col){
  if(!juOn()) return;
  const f = document.createElement("span"); f.className = "jx-float"; f.textContent = text;
  f.style.cssText = `left:${x}px;top:${y}px;--c:${col || "#F2B01E"}`;
  juLay().appendChild(juTemp(f, 1050));
}
let juBannerEl = null;
function juBanner(text, kind){
  if(!juOn()) return;
  if(juBannerEl) juBannerEl.remove();
  const b = document.createElement("div"); b.className = "jx-banner " + (kind || ""); b.setAttribute("aria-hidden", "true");
  b.innerHTML = [...text].map((ch, i) => ch === " " ? " " : `<i style="--i:${i}">${esc(ch)}</i>`).join("");
  document.body.appendChild(juTemp(b, 1400)); juBannerEl = b;
}
function juFlash(col){
  if(!juOn()) return;
  const f = document.createElement("div"); f.className = "jx-flash"; f.style.setProperty("--c", col || "#fff");
  document.body.appendChild(juTemp(f, 500));
}
function juVignette(){ if(!juOn()) return; const v = document.createElement("div"); v.className = "jx-vig"; document.body.appendChild(juTemp(v, 650)); }
function juShake(el, cls){
  if(!juOn() || !el) return;
  cls = cls || "jx-shake"; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 650);
}
function juCenter(el){
  const r = el && el.getBoundingClientRect && el.getBoundingClientRect();
  return r && r.width ? {x:r.left + r.width / 2, y:r.top + Math.min(r.height / 2, 80)} : {x:window.innerWidth / 2, y:window.innerHeight * 0.4};
}

/* Where did the player last tap? Bursts come out of their finger. */
let juPt = null;
document.addEventListener("pointerdown", e => { juPt = {x:e.clientX, y:e.clientY, t:Date.now()}; }, {passive:true, capture:true});
function juHere(){
  if(juPt && Date.now() - juPt.t < 4000 && juPt.y > 0 && juPt.y < window.innerHeight) return juPt;
  return juCenter($("challengeCard"));
}

/* Drifting letters behind everything */
(() => {
  const g = ["ñ", "¿", "¡", "á", "é", "ü", "A", "Z", "Ñ", "?", "!", "ó", "abc", "é", "¿?", "í"];
  const box = document.createElement("div"); box.id = "bgfx"; box.setAttribute("aria-hidden", "true");
  box.innerHTML = g.map((c, i) => `<span style="left:${(i * 6.3 + (i % 3) * 7) % 96}%;--sz:${22 + (i * 7) % 30}px;--d:${20 + (i * 5) % 18}s;--dl:${-((i * 3.7) % 30)}s;--rot:${i % 2 ? 160 : -200}deg">${c}</span>`).join("");
  document.body.prepend(box);
})();

/* The title letters do a little wave every few seconds */
(() => {
  const h = document.querySelector(".hero .title"); if(!h) return;
  const tn = [...h.childNodes].find(n => n.nodeType === 3 && n.textContent.trim()); if(!tn) return;
  const word = tn.textContent, frag = document.createElement("span");
  frag.innerHTML = [...word].map((c, i) => `<span class="jx-l" style="--i:${i}">${esc(c)}</span>`).join("");
  frag.setAttribute("aria-label", word);
  h.replaceChild(frag, tn);
})();

/* Answers: pixels, +XP, combos, shakes */
let juXp = null, juBest = 0;
playOutcome = (orig => function(prevPlan){
  orig.apply(this, arguments);
  try{
    if(!prevPlan || !S || !S.judgement || !juOn()) { if(S) juXp = S.xp || 0; return; }
    const p = juHere(), xp = S.xp || 0, gain = juXp === null ? 0 : xp - juXp; juXp = xp;
    if(S.judgement.correct){
      juBurst(p.x, p.y, 16, ["#4FD195", "#FFD45C", "#F2B01E", "#FFFFFF"]);
      juFloat(p.x, p.y - 10, gain > 0 ? `+${gain} XP` : "✓", "#4FD195");
      const st = S.stats.streak;
      if(prevPlan.boss){ juFlash("#FFFFFF"); juBanner(t("ju_bossDown"), "ok"); juBurst(window.innerWidth / 2, window.innerHeight * 0.4, 40, null, 220); }
      else if(S.status === "conquered"){ juBanner(t("ju_win"), "ok"); }
      else if(st === 3) juBanner(t("ju_nice"));
      else if(st === 5) juBanner(t("ju_great"), "ok");
      else if(st === 8) juBanner(t("ju_awesome"), "lvl");
      else if(st >= 10 && st % 5 === 0) juBanner(t("ju_combo", {n:st}), "boss");
      const h = $("hudStreak"); if(h && st > 1) juBurst(...Object.values(juCenter(h)), 6, ["#FF8C00", "#FFD45C", "#E5384F"], 40);
    } else {
      juShake($("challengeCard")); juVignette();
      const hh = $("hudHearts"); if(hh && !hh.hidden) { const c = juCenter(hh); juBurst(c.x, c.y, 10, ["#E5384F", "#FF8FB1", "#7A1020"], 60); }
      if(S.status === "gameover") juFlash("#E5384F");
    }
  }catch(e){}
})(playOutcome);

/* Boss arrives: the screen flashes red and the floor shakes */
Sound.bossIntro = (orig => function(){ orig(); try{ juFlash("#E5384F"); juShake($("feed"), "jx-quake"); juBanner(t("ju_boss"), "boss"); }catch(e){} })(Sound.bossIntro);
/* Badges and loot sparkle at the top where their toast appears */
Sound.badge = (orig => function(){ orig(); try{ juBurst(window.innerWidth / 2, 96, 14, ["#FFD45C", "#9D91FF", "#FFFFFF"], 90); }catch(e){} })(Sound.badge);
Sound.loot = (orig => function(){ orig(); try{ juBurst(window.innerWidth / 2, 96, 14, ["#F2B01E", "#4FD195", "#FFFFFF"], 90); }catch(e){} })(Sound.loot);

/* HUD: streak catches fire, level ups get a banner */
let juBadge = "";
renderHud = (orig => function(){
  orig.apply(this, arguments);
  if(!S) return;
  const st = S.stats.streak || 0, h = $("hudStreak");
  if(h){ h.classList.toggle("jx-hot", st >= 5 && st < 10); h.classList.toggle("jx-blaze", st >= 10); }
  const b = $("hudBadge"), txt = b ? b.textContent : "";
  if(juBadge && txt && txt !== juBadge && !$("game").hidden){ juBanner(t("ju_level") + " " + txt, "lvl"); const c = juCenter(b); juBurst(c.x, c.y, 18, null, 90); }
  juBadge = txt;
})(renderHud);

/* The correct-answer verdict gets a spinning star */
renderExtras = (orig => function(fresh){
  orig.apply(this, arguments);
  const j = $("judgeCard");
  if(fresh && juOn() && j && !j.hidden && j.classList.contains("ok") && !j.querySelector(".jx-star")){
    const h = j.querySelector("h2, h3, .head, b"); if(h){ const s = document.createElement("span"); s.className = "jx-star"; s.setAttribute("aria-hidden", "true"); s.textContent = " ⭐"; h.appendChild(s); }
  }
})(renderExtras);

/* Results screen: letters drop in, wins rain pixels */
showOver = (orig => function(){
  orig.apply(this, arguments);
  juBadge = ""; juXp = null;
  if(!juOn()) return;
  try{
    const ti = $("overTitle"), word = ti.textContent, win = S && S.status === "conquered";
    ti.classList.toggle("win", !!win);
    ti.setAttribute("aria-label", word);
    ti.innerHTML = [...word].map((c, i) => c === " " ? " " : `<span class="jx-l" aria-hidden="true" style="--i:${i}">${esc(c)}</span>`).join("");
    if(win && juOn()){ const c = juCenter($("overEmoji")); [0, 350, 700].forEach(d => setTimeout(() => juBurst(c.x, c.y, 22, null, 160), d)); }
  }catch(e){}
})(showOver);

/* Pulse with the music */
document.addEventListener("pgm-beat", e => {
  if(!juOn()) return;
  const cls = e.detail && e.detail.big ? "jx-beatbig" : "jx-beat";
  for(const sel of [".hero", "#menuMusicBtn", "#hudBadge", "#overEmoji"]){
    const el = document.querySelector(sel); if(!el || !el.offsetParent) continue;
    el.classList.remove("jx-beat", "jx-beatbig"); void el.offsetWidth; el.classList.add(cls);
  }
});

/* "Now playing" cartridge tag */
let juNp = null;
document.addEventListener("pgm-track", e => {
  if(!e.detail || !Music.isOn()) return;
  if(juNp) juNp.remove();
  const n = document.createElement("div"); n.className = "jx-np"; n.setAttribute("role", "status");
  n.innerHTML = `<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span><small>♪ ${esc(t("nowPlaying"))}</small><b>${esc(e.detail.name)}</b></span>`;
  document.body.appendChild(n); juNp = n;
  setTimeout(() => { if(n === juNp){ n.remove(); juNp = null; } }, juOn() ? 3300 : 2500);
});
