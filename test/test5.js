const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
let fails = 0; const fail = (...a) => { fails++; console.log("FAIL", ...a); };
function boot(lang, native){
  const errors = [], sched = [], cancelled = [];
  const dom = new JSDOM(html, {runScripts:"dangerously", pretendToBeVisual:true, url:"https://example.test/",
    beforeParse(w){
      w.__PGM_TEST = true; w.matchMedia = () => ({matches:true, addEventListener(){}, removeEventListener(){}}); w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function(){};
      Object.defineProperty(w.navigator, "language", {value:lang, configurable:true});
      w.addEventListener("error", e => errors.push(e.error || e.message));
      if(native){
        let pending = [];
        w.Capacitor = {isNativePlatform:() => true, Plugins:{LocalNotifications:{
          requestPermissions: async () => ({display:"granted"}), createChannel: async () => {},
          getPending: async () => ({notifications:pending}),
          cancel: async o => { cancelled.push(...o.notifications.map(n => n.id)); pending = pending.filter(p => !o.notifications.some(n => n.id === p.id)); },
          schedule: async o => { sched.push(o.notifications); pending = pending.concat(o.notifications); },
          addListener(){}
        }}};
      }
    }});
  dom.errors = errors; dom.sched = sched; dom.cancelled = cancelled; return dom;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  for(const lang of ["en", "es"]){
    const dom = boot(lang, true), w = dom.window, P = w.__pgm, d = w.document;
    await sleep(900);
    // banner shows after a few answers
    P.profile.answered = 10; P.updateNotifyBanner();
    if(d.getElementById("notifyBanner").hidden) fail(lang, "banner hidden");
    d.getElementById("nBannerYes").click(); await sleep(50);
    if(!P.profile.notify.on) fail(lang, "not enabled");
    const last = dom.sched[dom.sched.length - 1] || [];
    if(!last.length) fail(lang, "nothing scheduled");
    const ids = last.map(n => n.id);
    if(new Set(ids).size !== ids.length) fail(lang, "duplicate ids");
    for(const n of last){ if(/[{}]|undefined|null/.test(n.title + n.body)) fail(lang, "bad text", n.title, n.body); if(n.schedule.at <= new w.Date()) fail(lang, "past"); }
    // with a streak and no practice today: streak saver today
    const now = new Date(); now.setHours(10, 0, 0, 0);
    P.profile.streak = 4; P.profile.last = (() => { const y = new Date(); y.setDate(y.getDate() - 1); return y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0"); })();
    let s = P.buildSchedule(now);
    if(!s.some(n => n.id === 1001)) fail(lang, "no streak saver today", JSON.stringify(s.map(n => n.title)));
    if(!s.some(n => n.id === 1000)) fail(lang, "no reminder today");
    // practiced today: nothing today, tomorrow's reminder mentions 5 days
    P.profile.last = P.profile.today;
    s = P.buildSchedule(now);
    if(s.some(n => n.id < 1010)) fail(lang, "reminder today after practice");
    if(!s.some(n => n.id === 1011 && /5/.test(n.title))) fail(lang, "tomorrow streak saver", JSON.stringify(s.slice(0, 3)));
    // reschedule replaces old ones
    await P.reschedule(); await P.reschedule();
    if(!dom.cancelled.length) fail(lang, "old reminders not cancelled");
    // settings page
    d.getElementById("notifyBtn").click();
    if(d.getElementById("notifyPage").hidden) fail(lang, "page hidden");
    const tm = d.getElementById("nTime"); tm.value = "08:15"; tm.dispatchEvent(new w.Event("change", {bubbles:true})); await sleep(50);
    if(P.profile.notify.time !== "08:15") fail(lang, "time not saved");
    s = P.buildSchedule(now);
    if(!s.filter(n => n.id % 10 === 0).every(n => { const x = new Date(n.at); return x.getHours() === 8 && x.getMinutes() === 15; })) fail(lang, "time not applied");
    // quests prediction matches the real quests for today
    P.profile.quests = {d:"", list:[]}; P.ensureQuests();
    const pred = P.questsForDay(P.profile.today).map(q => q.id).join(), real = P.profile.quests.list.map(q => q.id).join();
    if(pred !== real) fail(lang, "quest prediction", pred, real);
    d.querySelector('[data-nk="recap"]').click(); await sleep(30);
    if(P.profile.notify.recap) fail(lang, "toggle failed");
    d.getElementById("nOn").click(); await sleep(50);
    if(P.profile.notify.on || P.buildSchedule().length) fail(lang, "turn off failed");
    if(dom.errors.length) fail(lang, "errors", dom.errors);
    console.log(lang, "sample:", last.slice(0, 3).map(n => n.title + " | " + n.body).join("  //  "));
  }
  // browser without notifications: banner stays hidden, no errors
  { const dom = boot("en", false), w = dom.window; await sleep(900); w.__pgm.profile.answered = 10; w.__pgm.updateNotifyBanner();
    if(!w.document.getElementById("notifyBanner").hidden) fail("web banner without Notification API");
    if(dom.errors.length) fail("web errors", dom.errors); }
  console.log(fails ? fails + " FAILURES" : "ALL TESTS PASSED");
  process.exit(fails ? 1 : 0);
})();
