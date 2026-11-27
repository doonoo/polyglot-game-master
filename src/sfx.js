/* ===================== 8-bit sound effects =====================
   Replaces the simple beeps with NES-style effects built from the same voices as the
   soundtrack (pulse waves, the stepped triangle and LFSR noise), and adds effects for
   everything that happens in a game: tiles, pairs, combos, lost hearts, boss hits,
   stage clear and stage failed fanfares, stars, unlocks and more.
   Every effect goes through Sound, so the existing 🔊 switch turns them all off.
   Big fanfares duck the music while they play. */
const SFX = (() => {
  let ctx = null, out = null, waves = {}, noiseBuf = null, muted = 0;
  const mf = m => 440 * Math.pow(2, (m - 69) / 12);
  function ensure(){
    if(ctx) { if(ctx.state === "suspended") ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext; if(!AC) return false;
    try{ ctx = new AC(); }catch(e){ return false; }
    out = ctx.createGain(); out.gain.value = 0.55;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 10000;
    out.connect(lp).connect(ctx.destination);
    const N = 40;
    for(const d of [.125, .25, .5]){
      const re = new Float32Array(N + 1), im = new Float32Array(N + 1);
      for(let n = 1; n <= N; n++) re[n] = 2 / (n * Math.PI) * Math.sin(n * Math.PI * d);
      waves[d] = ctx.createPeriodicWave(re, im);
    }
    { const M = 512, seq = [], re = new Float32Array(N + 1), im = new Float32Array(N + 1);
      for(let i = 15; i >= 0; i--) seq.push(i); for(let i = 0; i < 16; i++) seq.push(i);
      for(let n = 1; n <= N; n++){ let a = 0, b = 0; for(let k = 0; k < M; k++){ const x = seq[Math.floor(k * 32 / M)] / 7.5 - 1; a += x * Math.cos(2 * Math.PI * n * k / M); b += x * Math.sin(2 * Math.PI * n * k / M); } re[n] = 2 * a / M; im[n] = 2 * b / M; }
      waves.tri = ctx.createPeriodicWave(re, im); }
    { const len = ctx.sampleRate; noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate); const d = noiseBuf.getChannelData(0); let r = 1;
      for(let i = 0; i < len; i++){ const fb = (r ^ (r >> 1)) & 1; r = (r >> 1) | (fb << 14); d[i] = (r & 1) ? -0.8 : 0.8; } }
    return true;
  }
  const now = () => ctx.currentTime + 0.01;
  /* one pulse or triangle note: f = MIDI number (or Hz when > 200), with optional pitch sweep */
  function note(wave, f, at, dur, vol, o){
    o = o || {};
    const t0 = now() + at, hz = f > 200 ? f : mf(f);
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.setPeriodicWave(waves[wave]);
    osc.frequency.setValueAtTime(hz, t0);
    if(o.to) osc.frequency.exponentialRampToValueAtTime(o.to > 200 ? o.to : mf(o.to), t0 + dur);
    if(o.vib){ const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 7; lg.gain.value = o.vib; l.connect(lg).connect(osc.detune); l.start(t0); l.stop(t0 + dur + 0.05); }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.004);
    if(o.hold) g.gain.setValueAtTime(vol, t0 + dur * 0.7);
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(out); osc.start(t0); osc.stop(t0 + dur + 0.05);
  }
  const P = (f, at, dur, vol, duty, o) => note(duty || .5, f, at, dur, vol || 0.1, o);
  const T = (f, at, dur, vol, o) => note("tri", f, at, dur, vol || 0.25, Object.assign({hold:true}, o));
  function Nz(at, dur, vol, rate, hp, to){
    const t0 = now() + at, s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = noiseBuf; s.playbackRate.setValueAtTime(rate || 1, t0);
    if(to) s.playbackRate.exponentialRampToValueAtTime(to, t0 + dur);
    let n = s; if(hp){ const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = hp; s.connect(f); n = f; }
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0006, t0 + dur);
    n.connect(g).connect(out); s.start(t0, Math.random() * 0.5); s.stop(t0 + dur + 0.05);
  }
  const arp = (notes, step, dur, vol, duty, at) => notes.forEach((m, i) => P(m, (at || 0) + i * step, dur, vol, duty));
  function duck(ms){ try{ if(Music.isOn()){ Music.duck(true); clearTimeout(duck._t); duck._t = setTimeout(() => Music.duck(false), ms); } }catch(e){} }

  const FX = {
    tap(){ P(1568, 0, 0.035, 0.035, .125); },
    select(){ P(84, 0, 0.05, 0.06, .25); P(91, 0.035, 0.05, 0.05, .25); },
    start(){ arp([72, 79, 84], 0.06, 0.09, 0.09, .25); P(91, 0.18, 0.22, 0.08, .25, {vib:10}); },
    correct(){ P(83, 0, 0.07, 0.1, .5); P(88, 0.06, 0.32, 0.1, .5, {hold:false}); },
    wrong(){ P(150, 0, 0.22, 0.09, .5, {to:95}); P(147, 0.005, 0.22, 0.06, .25, {to:92}); Nz(0, 0.12, 0.12, 0.3); try{ navigator.vibrate && navigator.vibrate(120); }catch(e){} },
    heart(){ arp([76, 72, 67, 60], 0.07, 0.1, 0.08, .5); Nz(0.28, 0.25, 0.1, 0.25, 0, 0.08); try{ navigator.vibrate && navigator.vibrate([60, 40, 90]); }catch(e){} },
    combo(n){ const b = 72 + Math.min(12, Math.floor((n || 3) / 3) * 2); arp([b, b + 4, b + 7, b + 12, b + 16], 0.045, 0.09, 0.08, .25); },
    streak(){ FX.combo(5); },
    levelUp(){ arp([60, 64, 67, 72, 76, 79, 84, 88], 0.04, 0.08, 0.08, .25); T(48, 0, 0.32, 0.22); },
    stageClear(){
      duck(2300);
      const L = [[67, 0, .11], [72, .11, .11], [76, .22, .11], [79, .33, .33], [76, .66, .11], [79, .77, .9]];
      L.forEach(([m, a, d]) => { P(m, a, d, 0.1, .5, {vib:d > .5 ? 12 : 0, hold:true}); P(m - 4, a, d, 0.05, .125, {hold:true}); });
      [[48, 0, .33], [55, .33, .33], [48, .66, 1]].forEach(([m, a, d]) => T(m, a, d, 0.28));
      [0, .11, .22, .33].forEach(a => Nz(a, 0.06, 0.08, 1, 4000));
      Nz(0.66, 0.6, 0.12, 0.8, 1500);
    },
    stageFail(){
      duck(2300);
      [[71, 0, .22], [70, .24, .22], [69, .48, .22], [68, .72, .9]].forEach(([m, a, d]) => P(m, a, d, 0.09, .5, {vib:d > .5 ? 22 : 0, hold:true, to:d > .5 ? 64 : undefined}));
      [[52, 0, .46], [47, .48, 1.1]].forEach(([m, a, d]) => T(m, a, d, 0.26));
      Nz(0.72, 0.8, 0.1, 0.25, 0, 0.06);
    },
    gameOver(){ FX.stageFail(); },
    star(i){ const m = [88, 91, 96][Math.min(2, i || 0)]; P(m, 0, 0.18, 0.08, .25); P(m + 12, 0.05, 0.14, 0.04, .125); },
    unlocked(){ arp([72, 76, 80, 84], 0.08, 0.12, 0.08, .5); P(96, 0.34, 0.3, 0.05, .125, {vib:14}); },
    badge(){ arp([79, 83, 86, 91, 95], 0.06, 0.16, 0.07, .25); arp([91, 95, 98], 0.06, 0.12, 0.03, .125, 0.33); },
    loot(){ P(60, 0, 0.18, 0.08, .25, {to:84}); arp([88, 91, 96, 100], 0.05, 0.14, 0.07, .5, 0.18); },
    tile(){ P(79 + Math.floor(Math.random() * 3) * 2, 0, 0.05, 0.06, .25); },
    untile(){ P(72, 0, 0.06, 0.05, .25, {to:67}); },
    pick(){ P(86, 0, 0.04, 0.05, .125); },
    match(){ P(84, 0, 0.05, 0.07, .25); P(91, 0.05, 0.12, 0.07, .25); },
    bossIntro(){ duck(1600); P(45, 0, 0.9, 0.09, .5, {vib:40, hold:true}); P(46, 0.02, 0.9, 0.06, .25, {vib:35, hold:true}); T(33, 0, 1.1, 0.3); Nz(0, 1.2, 0.14, 0.4, 0, 0.05); },
    bossHit(){ Nz(0, 0.18, 0.2, 0.6, 0, 0.15); P(400, 0, 0.14, 0.08, .5, {to:120}); T(40, 0, 0.12, 0.3, {to:30}); },
    bossAttack(){ Nz(0, 0.35, 0.22, 0.25, 0, 0.05); T(36, 0, 0.3, 0.32, {to:28}); P(110, 0.05, 0.25, 0.06, .5, {to:70}); try{ navigator.vibrate && navigator.vibrate(200); }catch(e){} },
    bossBlock(){ P(1200, 0, 0.12, 0.06, .125, {to:900}); Nz(0, 0.08, 0.1, 1, 3000); },
    finalBlow(){ P(48, 0, 0.6, 0.08, .5, {to:84}); P(55, 0, 0.6, 0.05, .25, {to:91}); Nz(0, 0.6, 0.06, 0.2, 0, 1.2); },
    bossDefeat(){ duck(3200); Nz(0, 1.1, 0.25, 0.5, 0, 0.04); T(40, 0, 0.5, 0.32, {to:24}); [0.15, 0.35, 0.55].forEach((a, i) => Nz(a, 0.25, 0.16 - i * 0.03, 0.35)); setTimeout(() => FX.stageClear(), 900); },
    timeUp(){ [0, 0.16, 0.32].forEach(a => P(988, a, 0.1, 0.08, .5)); P(494, 0.48, 0.4, 0.08, .5, {to:330}); },
    tick(){ T(84, 0, 0.05, 0.18); },
    page(){ Nz(0, 0.07, 0.035, 1.2, 2500, 0.6); }
  };
  function play(name, arg){
    if(muted || (window.__PGM_TEST && !window.__SFX_FORCE)) return;
    try{ if(typeof Sound !== "undefined" && !Sound.isOn()) return; }catch(e){}
    if(!ensure()) return;
    try{ FX[name](arg); }catch(e){}
  }
  return {play, ensure, has:n => !!FX[n], mute(on){ muted += on ? 1 : -1; if(muted < 0) muted = 0; }, names:Object.keys(FX)};
})();

/* Every Sound effect now plays the 8-bit version; new names are added too */
(() => {
  const baseUnlock = Sound.unlock;
  Sound.unlock = function(){ try{ baseUnlock(); }catch(e){} try{ if(Sound.isOn()) SFX.ensure(); }catch(e){} };
  for(const n of SFX.names) Sound[n] = arg => SFX.play(n, arg);
  // these three also carry the arcade visuals juice.js used to add around the old beeps
  Sound.bossIntro = () => { SFX.play("bossIntro"); try{ juFlash("#E5384F"); juShake($("feed"), "jx-quake"); juBanner(t("ju_boss"), "boss"); }catch(e){} };
  Sound.badge = () => { SFX.play("badge"); try{ juBurst(window.innerWidth / 2, 96, 14, ["#FFD45C", "#9D91FF", "#FFFFFF"], 90); }catch(e){} };
  Sound.loot = () => { SFX.play("loot"); try{ juBurst(window.innerWidth / 2, 96, 14, ["#F2B01E", "#4FD195", "#FFFFFF"], 90); }catch(e){} };
})();

/* Main game: one clear sound per outcome instead of a generic beep */
playOutcome = wrap("playOutcome", "sfx", playOutcome, cur => function(prevPlan){
  SFX.mute(true);
  try{ cur.apply(this, arguments); } finally { SFX.mute(false); }
  if(!prevPlan || !S || !S.judgement) return;
  const j = S.judgement, just = prevPlan.boss ? S.bossJust : null;
  if(S.status === "gameover"){ Sound.heart(); setTimeout(() => Sound.stageFail(), 450); return; }
  if(just === "won"){ Sound.bossDefeat(); return; }
  if(S.status === "conquered"){ Sound.correct(); setTimeout(() => Sound.stageClear(), 250); return; }
  if(just === "hit"){ Sound.bossHit(); return; }
  if(just === "block"){ Sound.bossBlock(); return; }
  if(just === "lost"){ Sound.bossAttack(); return; }
  if(S.event){ Sound.levelUp(); return; }
  if(j.correct){
    const st = S.stats.streak || 0;
    if(st === 3 || st === 5 || st === 8 || (st >= 10 && st % 5 === 0)) Sound.combo(st); else Sound.correct();
  } else {
    Sound.wrong();
    if(S.mode === 3) setTimeout(() => Sound.heart(), 220);
  }
});

/* Tiles and pairs in the main game */
$("tiles").addEventListener("click", e => {
  const b = e.target.closest(".tile"); if(!b || b.disabled) return;
  if(b.dataset.undo) Sound.untile(); else Sound.tile();
});
$("pairs").addEventListener("click", e => {
  const b = e.target.closest(".pr"); if(!b) return;
  setTimeout(() => { if(b.classList.contains("done") && pairState && pairState.done.size < pairState.n) Sound.match(); }, 0);
});
/* Opening a page gets a soft swish */
showOnly = wrap("showOnly", "sfx", showOnly, orig => function(){ Sound.page(); return orig.apply(this, arguments); });

/* Over screen: the fanfare is the outcome sound, so the music comes back calmly instead of a second jingle */
syncMood = wrap("syncMood", "sfx", syncMood, orig => function(){
  const ov = $("over");
  if(ov && !ov.hidden){ Music.setMood("title"); return; }
  return orig.apply(this, arguments);
});

if(window.__PGM_TEST) window.__sfx = {SFX, Sound};
