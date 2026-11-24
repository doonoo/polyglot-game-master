/* ===================== Leo in the app =====================
   Leo (lionSVG in mascot.js) is the logo and reacts to play:
   - menu hero: Leo sits on the sun; tap him for a hello in one of the course languages;
   - answer card: Leo replaces the ✓ / ✕ stamp (cheer, wink for a typo, sad, thinking when you give up);
   - end screen: Leo replaces the big emoji (cheer on a win, sad on game over, wow when time runs out).
   Motion follows the Animations switch and reduced motion (anim.js adds .noanim to <html>). */
Object.assign(I18N.en, {leo_name:"Leo, your Game Master"});
Object.assign(I18N.es, {leo_name:"Leo, tu Game Master"});
const LEO_HI = ["¡Hola!", "Hello!", "Bonjour !", "Olá!", "你好！", "مرحبا!", "¡Vamos!", "Let's go!", "Allez !", "Bora!", "加油！", "يلا!"];
(() => {
  const css = document.createElement("style");
  css.textContent = `
.leoHero{position:absolute;right:4px;bottom:-6px;width:132px;height:132px;z-index:1;border:0;padding:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent}
.leoHero svg{width:100%;height:100%;display:block;filter:drop-shadow(0 6px 8px rgba(30,10,90,.35));transform-origin:50% 90%;animation:leoBob 3.2s ease-in-out infinite}
.leoHero:active svg{transform:scale(.94)}
.leoHero .leoSay{position:absolute;right:92%;top:6px;background:#fff;color:#2D1B69;font-weight:800;font-size:1rem;padding:6px 11px;border-radius:14px 14px 4px 14px;white-space:nowrap;box-shadow:0 4px 0 rgba(0,0,0,.12);opacity:0;transform:translateY(6px) scale(.9);transition:opacity .2s,transform .2s;pointer-events:none}
.leoHero .leoSay.on{opacity:1;transform:none}
.hero .glyphs{max-width:calc(100% - 118px)}
.hero .lede{max-width:min(30ch,calc(100% - 96px))}
@keyframes leoBob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-5px) rotate(2deg)}}
@keyframes leoHop{0%{transform:translateY(0)}35%{transform:translateY(-16px) rotate(-6deg)}70%{transform:translateY(0) rotate(4deg)}100%{transform:none}}
.leoHero.hop svg{animation:leoHop .5s ease-out}
.judge .stamp.leoStamp{background:none;box-shadow:none;width:56px;height:56px;padding:0;overflow:visible}
.judge .stamp.leoStamp svg{width:56px;height:56px;display:block}
.judge.ok .stamp.leoStamp svg{animation:leoHop .5s ease-out}
.judge .stamp.leoStamp::after{content:attr(data-mark);position:absolute;margin:38px 0 0 38px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:.8rem;font-weight:900;color:#fff;background:var(--green);box-shadow:0 0 0 2px #fff}
.judge.bad .stamp.leoStamp::after{background:var(--red)}
.judge .stamp.leoStamp{position:relative}
.over .emoji.leoOver{width:150px;height:150px;margin-left:auto;margin-right:auto;position:relative;font-size:2.2rem;line-height:1}
.over .emoji.leoOver svg{width:100%;height:100%;display:block}
.over .emoji.leoOver .leoBadge{position:absolute;right:-6px;bottom:4px}
.noanim .leoHero svg,.noanim .judge .stamp.leoStamp svg{animation:none!important}
@media (prefers-reduced-motion:reduce){.leoHero svg,.judge .stamp.leoStamp svg{animation:none!important}}
@media (max-width:360px){.leoHero{width:104px;height:104px}.hero .glyphs{max-width:calc(100% - 92px)}}
`;
  document.head.appendChild(css);
  const hero = document.querySelector(".hero");
  if(hero){
    const b = document.createElement("button");
    b.type = "button"; b.className = "leoHero"; b.id = "leoHero";
    b.innerHTML = lionSVG("happy") + `<span class="leoSay" id="leoSay"></span>`;
    hero.appendChild(b);
    let k = 0, tm = null;
    b.addEventListener("click", () => {
      const say = $("leoSay"), mood = ["cheer", "wink", "wow", "happy"][k % 4];
      b.querySelector("svg").outerHTML = lionSVG(mood);
      say.textContent = LEO_HI[Math.floor(Math.random() * LEO_HI.length)];
      say.classList.add("on");
      b.classList.remove("hop"); void b.offsetWidth; b.classList.add("hop");
      try{ Sound.select(); }catch(e){}
      k++; clearTimeout(tm);
      tm = setTimeout(() => { say.classList.remove("on"); const s = b.querySelector("svg"); if(s) s.outerHTML = lionSVG("happy"); }, 1600);
    });
  }
})();
function leoLabel(){ const b = $("leoHero"); if(b) b.setAttribute("aria-label", t("leo_name")); }
renderMenu = (orig => function(){ const r = orig.apply(this, arguments); try{ leoLabel(); }catch(e){} return r; })(renderMenu);

renderGame = (orig => function(){
  const r = orig.apply(this, arguments);
  try{
    const st = document.querySelector("#judgeCard .stamp"), j = S && S.judgement;
    if(st && j){
      const mood = j.gaveUp ? "think" : j.correct ? (j.typo ? "wink" : "cheer") : "sad";
      st.className = "stamp leoStamp";
      st.dataset.mark = j.correct ? "✓" : "✕";
      st.innerHTML = lionSVG(mood);
    }
  }catch(e){}
  return r;
})(renderGame);

showOver = (orig => function(){
  const r = orig.apply(this, arguments);
  try{
    const el = $("overEmoji"), e = (el.textContent || "").trim();
    if(e && !el.querySelector("svg")){
      const mood = e === "💀" ? "sad" : e === "⏱️" ? "wow" : "cheer";
      el.classList.add("leoOver");
      el.innerHTML = lionSVG(mood) + (mood === "cheer" ? "" : `<span class="leoBadge">${esc(e)}</span>`);
    }
  }catch(e){}
  return r;
})(showOver);
