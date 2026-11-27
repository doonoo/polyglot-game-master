/* ===================== Function wrappers (2.17) =====================
   Modules extend core functions (gradeLocal, generate, renderExtras, showOver…) by wrapping them.
   Every wrap goes through wrap(name, label, current, make): make(current) returns the new function,
   which gets a readable name in stack traces ("gradeLocal[typo]") and remembers what it wraps.
   wrapChain(fn) lists a chain from the innermost wrapper out; test24 checks every chain against the
   order written in CLAUDE.md, so a new wrapper or a moved module is a deliberate change.
   The label is the module's file name (plus #2 when one file wraps the same function twice). */
const WRAPS = {};
function wrap(name, label, orig, make){
  const fn = make(orig);
  if(typeof fn !== "function") throw new Error("wrap(" + name + ", " + label + ") did not return a function");
  try{ Object.defineProperty(fn, "name", {value:name + "[" + label + "]", configurable:true}); }catch(e){}
  fn.__wrap = {name, label, inner:orig};
  (WRAPS[name] = WRAPS[name] || []).push(label);
  return fn;
}
function wrapChain(fn){
  const out = [];
  for(let f = fn, n = 0; f && f.__wrap && n < 100; f = f.__wrap.inner, n++) out.push(f.__wrap.label);
  return out.reverse();
}
// every chain as it stands now (direct eval reads the current binding of each wrapped function in this scope)
function wrapChains(){ const o = {}; for(const n of Object.keys(WRAPS).sort()){ try{ o[n] = wrapChain(eval(n)); }catch(e){ o[n] = ["?"]; } } return o; }
if(window.__PGM_TEST) window.__wrapChains = wrapChains;
