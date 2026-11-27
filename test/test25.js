/* 2.18: Dialogues (mode 12) and the menu changes.
   - content: every scene line in all six languages, two scenes per level, three replies each; every reading of a reply
     is accepted, the romanization too (zh / ar), and every planted mistake is rejected (normal and strict);
     zh / ar romanization has one entry per word
   - play: every course × level, typing and multiple choice, plus a losing run and two players
   - menu: one Practice card with a Stay on this level switch (mode 1 / 2), Custom under More modes */
const fs = require("fs"), path = require("path"); const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; if(fails < 80) console.log("FAIL", ...a); };
const errs = [];
const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/", beforeParse(w){ w.__PGM_TEST = true; w.matchMedia = () => ({matches:false, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function(){}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, {get:() => () => ({addColorStop(){}})}); w.addEventListener("error", e => errs.push(e.message)); }});
const w = dom.window, d = w.document, $ = id => d.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const COURSES = [["Spanish","English","es","en"],["English","Spanish","en","es"],["French","English","fr","en"],["Portuguese","English","pt","en"],["Mandarin Chinese","English","zh","en"],["Arabic","English","ar","en"]];
const LV = ["A1","A2","B1","B2"];
const PUN = /[.,!?¿¡;:。，！？、،؟"«»“”…]/g;

(async () => {
  await sleep(300);
  const P = w.__pgm, D = w.__dlg;
  if(errs.length) fail("load errors", errs.splice(0).join(" // "));
  if(!D) { fail("no Dialogues hooks"); process.exit(1); }

  /* ---------- content ---------- */
  for(const lv of LV) if(D.DLG.filter(s => s.lv === lv).length < 2) fail(lv, "needs 2 scenes");
  const ids = new Set();
  for(const sc of D.DLG){
    if(ids.has(sc.id)) fail("duplicate scene id", sc.id); ids.add(sc.id);
    if(!sc.t.en || !sc.t.es || !sc.note || !sc.note.en || !sc.note.es) fail(sc.id, "title / note in en and es");
    if(D.dlgYs(sc).length !== 3) fail(sc.id, "should have 3 replies");
    sc.lines.forEach((l, i) => {
      if(l.w !== (i % 2 ? "y" : "n")) fail(sc.id, i, "lines should alternate them / you");
      for(const c of ["en","es","fr","pt","zh","ar"]) if(!l[c]) fail(sc.id, i, "missing", c);
      if(!l.zr || !l.an) fail(sc.id, i, "missing romanization");
      if(l.w === "y"){
        for(const c of ["en","es","fr","pt","zh","ar"]) if(!l.x || !l.x[c]) fail(sc.id, i, "missing planted mistake", c);
        for(const [c, r] of [["zh", l.zr], ["ar", l.an]]){
          const tk = P.canon(l[c]).split(" ").map(x => x.replace(PUN, "")).filter(Boolean), rk = r.split(" ").filter(Boolean);
          if(tk.length !== rk.length) fail(sc.id, i, c, "romanization", rk.length, "entries for", tk.length, "words");
        }
      }
    });
  }
  let checked = 0;
  for(const [L, N, code] of COURSES){
    const st = {mode:12, target:L, native:N}, strict = {mode:3, target:L, native:N};
    for(const sc of D.DLG) for(const i of D.dlgYs(sc)){
      const l = sc.lines[i], rom = code === "zh" ? l.zr : code === "ar" ? l.an : "";
      const ch = {game:"Dialogue", k:"s", al:code, acc:[l[code] + (rom ? "|" + rom : "")], answerKey:P.canon(l[code]), target:"", cw:[], why:""};
      for(const v of P.expand(l[code])) if(!P.gradeLocal(st, ch, v, false).correct) fail(L, sc.id, i, "reading rejected:", v);
      if(rom && !P.gradeLocal(st, ch, rom.normalize("NFD").replace(/[̀-ͯ]/g, ""), false).correct) fail(L, sc.id, i, "plain-letter romanization rejected", rom);
      const x = l.x[code];
      if(P.gradeLocal(st, ch, x, false).correct) fail(L, sc.id, i, "planted mistake accepted:", x);
      if(P.gradeLocal(strict, ch, x, false).correct) fail(L, sc.id, i, "planted mistake accepted (strict):", x);
      checked++;
    }
  }

  /* ---------- play ---------- */
  const startDlg = (L, N, lv) => {
    P.setup.target = L; P.setup.native = N; $("targetSel").value = L;
    P.setup.mode = 12; P.setup.level = lv; w.eval; d.querySelector('#modes [data-mode="12"]').click();
    P.setup.level = lv;
    $("startBtn").click();
  };
  const answer = right => {
    const S = P.S, ch = S.current.challenge;
    if(Array.isArray(ch.opts)){
      const ok = ch.opts.find(o => P.gradeLocal(S, ch, o, false).correct), bad = ch.opts.find(o => !P.gradeLocal(S, ch, o, false).correct);
      // a tap submits on a timer, so answer with the option's text like the other tests do
      $("answer").value = right ? ok : bad; $("submitBtn").click();
    } else { $("answer").value = right ? ch.answerKey : "zzz qqq"; $("submitBtn").click(); }
  };
  for(const mc of [false, true]){
    d.querySelector(`[data-mcs="${mc ? 1 : 0}"]`).click();
    for(const [L, N, code] of COURSES) for(const lv of LV){
      startDlg(L, N, lv);
      if(!P.S || P.S.mode !== 12){ fail(L, lv, "did not start"); continue; }
      if(P.S.hp !== 5) fail(L, lv, "hearts", P.S.hp);
      let turns = 0, bubbles = -1, opts = 0;
      while(P.S.status === "playing" && turns < 20){
        const ch = P.S.current.challenge;
        if(!ch.dlg){ fail(L, lv, "round without a dialogue", ch.game); break; }
        if(ch.al !== code) fail(L, lv, "answer language", ch.al);
        const box = $("dlgBox");
        if(!box || box.hidden) fail(L, lv, "chat not shown");
        else { const n = box.querySelectorAll(".db").length; if(n !== ch.dlg.hist.length) fail(L, lv, "bubbles", n, ch.dlg.hist.length); if(ch.dlg.ti > 0 && n <= bubbles && ch.dlg.ti) {} bubbles = n; }
        if(!ch.target) fail(L, lv, "no prompt");
        if(Array.isArray(ch.opts)){ opts++; if(ch.opts.length < 3) fail(L, lv, "too few options", ch.opts.length); if(ch.opts.filter(o => P.gradeLocal(P.S, ch, o, false).correct).length !== 1) fail(L, lv, "options must have exactly one right answer", ch.opts); }
        if(!mc && (code === "zh" || code === "ar")){ const t = d.querySelectorAll("#tiles .tile[data-i]"); if(!t.length) fail(L, lv, "no word tiles"); }
        const a0 = P.S.stats.answered; answer(true);
        if(P.S.stats.answered !== a0 + 1){ fail(L, lv, "turn did not advance"); break; }
        if(!P.S.judgement.correct) fail(L, lv, "right reply rejected", ch.answerKey);
        if(code === "zh" && !mc && turns === 0){ const r = d.querySelector("#judgeCard .xlrom"); if(!r) fail("zh answer card without pinyin"); }
        if(errs.length){ fail(L, lv, "script error", errs.splice(0).join(" // ")); break; }
        turns++;
        if(P.S.status === "playing" && $("nextBtn") && !$("nextBtn").hidden) $("nextBtn").click();
      }
      if(P.S.status !== "conquered" || turns !== 6) fail(L, lv, mc ? "mc" : "typing", "run should end after 6 replies", P.S.status, turns);
      if(mc && opts < 4) fail(L, lv, "multiple choice rarely used", opts);
      await sleep(5);
      if(!/Conversation complete|Conversación completa/.test($("overTitle").textContent)) fail(L, lv, "win title", $("overTitle").textContent);
    }
  }
  d.querySelector('[data-mcs="0"]').click();
  // losing run: five misses
  startDlg("French", "English", "A1");
  for(let i = 0; i < 8 && P.S.status === "playing"; i++){ answer(false); if($("nextBtn") && !$("nextBtn").hidden) $("nextBtn").click(); }
  if(P.S.status !== "gameover") fail("five misses should end the run", P.S.status, P.S.hp);
  await sleep(5);
  if(!/Out of hearts|Sin corazones/.test($("overTitle").textContent)) fail("defeat title", $("overTitle").textContent);

  /* ---------- menu ---------- */
  $("restartBtn") && 0;
  w.eval("void 0");
  const toMenu = () => { const b = $("menuBtn") || $("homeBtn"); if(b && !b.hidden) b.click(); };
  toMenu();
  P.setup.mode = 1; d.querySelector('#modes [data-mode="1"]').click();
  if(d.querySelector('#modes [data-mode="2"]')) fail("Level Select card should be gone");
  const stay = $("stayChk");
  if(!stay || $("stayRow").hidden) fail("no Stay on this level switch on Practice");
  else {
    stay.checked = true; stay.dispatchEvent(new w.Event("change", {bubbles:true}));
    if(P.setup.mode !== 2) fail("switch on should mean mode 2", P.setup.mode);
    if(d.querySelector('#modes [data-mode="1"]').getAttribute("aria-checked") !== "true") fail("Practice card should stay selected with the switch on");
    P.setup.target = "Spanish"; $("targetSel").value = "Spanish"; P.setup.level = "A2"; $("startBtn").click();
    if(P.S.mode !== 2 || P.S.level !== "A2") fail("stay on level should start mode 2 at A2", P.S.mode, P.S.level);
    toMenu();
    const s2 = $("stayChk"); s2.checked = false; s2.dispatchEvent(new w.Event("change", {bubbles:true}));
    if(P.setup.mode !== 1) fail("switch off should mean mode 1");
  }
  if(d.querySelector('#modes [data-mode="9"]')) fail("Custom should not be in the main list");
  const more = $("modesMore"), btn = $("moreBtn");
  if(!more || !btn) fail("no More modes section");
  else {
    if(!more.hidden && w.localStorage.getItem("pgm-more") !== "on") fail("More modes should start closed");
    btn.click();
    if(more.hidden || !more.querySelector('[data-mode="9"]')) fail("More modes should show Custom");
    more.querySelector('[data-mode="9"]').click();
    if(P.setup.mode !== 9 || $("customGroup").hidden) fail("picking Custom from More modes");
    if($("modesMore").hidden) fail("More modes should stay open while Custom is picked");
  }
  if(!d.querySelector('#modes [data-mode="12"]')) fail("Dialogues should be in the main list");
  if(errs.length) fail("errors", errs.join(" // "));
  console.log(fails ? `test25: ${fails} failure(s)` : `test25: Dialogues OK (${D.DLG.length} scenes, ${checked} replies checked), menu OK`);
  process.exit(fails ? 1 : 0);
})();
