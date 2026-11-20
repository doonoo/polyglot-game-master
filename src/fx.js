/* ===================== Confetti that can never freeze on screen =====================
   On Android the WebView can pause animation frames (app switch, keyboard, battery saver).
   The old loop then stayed "running" forever, and every later confetti call re-showed the
   last frozen frame as a stripe across the screen. This version is time-based, has a
   watchdog, and always wipes and hides the canvas when it stops. */
let fxParts = [], fxLoop = 0, fxLast = 0, fxWatch = 0;
function fxCanvas(){ const c = $("fx"); return c && c.getContext ? c : null; }
function fxStop(){
  const c = fxCanvas();
  fxParts = []; if(fxLoop) cancelAnimationFrame(fxLoop); fxLoop = 0; clearTimeout(fxWatch); fxWatch = 0;
  if(c){ const g = c.getContext("2d"); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); c.style.visibility = "hidden"; }
}
confetti = function(n){
  if(reduceMotion || (typeof animOn !== "undefined" && !animOn)) return;
  const c = fxCanvas(); if(!c) return;
  const w = window.innerWidth, h = window.innerHeight, cols = ["#F2B01E","#5B4BD6","#2BB7D4","#E5384F","#4FD195","#FFD45C"];
  const now = performance.now();
  for(let i = 0; i < n; i++) fxParts.push({x: Math.random() * w, y: -10 - Math.random() * h * 0.25, vx: (Math.random() - 0.5) * 180, vy: 120 + Math.random() * 240,
    r: Math.random() * 6, s: 5 + Math.random() * 6, c: cols[i % cols.length], born: now});
  if(fxParts.length > 400) fxParts.splice(0, fxParts.length - 400);
  clearTimeout(fxWatch); fxWatch = setTimeout(fxStop, 4500);          // hard stop no matter what
  // a loop that hasn't drawn for a while is dead (paused WebView): start a fresh one
  if(fxLoop && now - fxLast < 250) return;
  if(fxLoop) cancelAnimationFrame(fxLoop);
  c.style.visibility = "visible"; fxLast = now;
  const g = c.getContext("2d");
  const frame = t => {
    const dt = Math.min(0.05, Math.max(0, (t - fxLast) / 1000)); fxLast = t;
    const dpr = window.devicePixelRatio || 1, W = Math.round(window.innerWidth * dpr), H = Math.round(window.innerHeight * dpr);
    if(c.width !== W || c.height !== H){ c.width = W; c.height = H; }
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const vh = window.innerHeight;
    for(const p of fxParts){
      p.vy = Math.min(p.vy + 650 * dt, 540); p.vx = p.vx * (1 - 0.6 * dt) + Math.sin((t - p.born) / 150 + p.r) * 9 * dt * 60 * 0.15;
      p.x += p.vx * dt; p.y += p.vy * dt; p.r += 9 * dt;
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore();
    }
    fxParts = fxParts.filter(p => p.y < vh + 40 && t - p.born < 3800);
    if(fxParts.length) fxLoop = requestAnimationFrame(frame); else fxStop();
  };
  fxLoop = requestAnimationFrame(frame);
};
// leaving the app or switching screens never leaves pieces behind
document.addEventListener("visibilitychange", () => { if(document.hidden) fxStop(); });
window.addEventListener("pagehide", fxStop);
