/* ===================== Reminders and notifications =====================
   Android/iOS app: real scheduled notifications through @capacitor/local-notifications
   (they fire even when the app is closed, and survive a reboot).
   Browser / installed PC app: notifications while the app is open or minimized, plus a
   background check where the browser supports Periodic Background Sync (installed Chrome/Edge).
   Every time progress changes the whole schedule for the next two weeks is rebuilt, so a
   reminder never nags about something already done. */
profile.notify = {on:false, asked:false, time:"19:00", streak:true, quests:false, recap:true, comeback:true};

const NCap = () => { const C = window.Capacitor; return C && C.isNativePlatform && C.isNativePlatform() ? C : null; };
const NPlug = () => { const C = NCap(); return C && ((C.Plugins && C.Plugins.LocalNotifications) || (C.registerPlugin && C.registerPlugin("LocalNotifications"))); };
const NID0 = 1000, NID1 = 1999, NSTATE = "pgm-state", NSTATE_URL = "./__reminders.json";
const webNotifyOk = () => !NCap() && "Notification" in window;

function hm(s){ const m = /^(\d{1,2}):(\d{2})$/.exec(s || ""); return m ? [Math.min(23, +m[1]), Math.min(59, +m[2])] : [19, 0]; }
function atDay(base, d, h, m){ const x = new Date(base); x.setDate(x.getDate() + d); x.setHours(h, m, 0, 0); return x; }
function questsForDay(day){
  const orig = Math.random;
  Math.random = seeded(hashStr(day + "|quests"));
  try{
    const core = pick(QUESTS.filter(q => q.core));
    return [core].concat(shuffle(QUESTS.filter(q => !q.core && (!q.ear || canEcho()))).slice(0, 2));
  } finally { Math.random = orig; }
}
function pickBy(arr, key){ return arr.length ? arr[hashStr(key) % arr.length] : null; }

// Build every notification for the next 14 days from the current progress.
function buildSchedule(now){
  now = now || new Date();
  const N = profile.notify, list = [];
  if(!N.on) return list;
  rollDay();
  const [h, m] = hm(N.time);
  const did = profile.last === profile.today;
  const streak = liveStreak();
  const lang = langLabel(setup.target);
  let next = null, story = null;
  try{
    const tl = TL(), live = typeof S !== "undefined" && S && S.cefr && S.syllabus && S.target === setup.target ? S : null;
    if(live){ const i = live.done.findIndex(d => !d); next = i >= 0 ? live.syllabus[i] : null; }
    const lv = live ? live.level : (setup.level || "A1");
    const s = STORIES.find(x => !profile.stories[x.id] && x.lv === lv) || STORIES.find(x => !profile.stories[x.id]);
    story = s ? s.t[tl] : null;
  }catch(e){}
  const add = (d, hh, mm, kind, title, body) => {
    const at = atDay(now, d, hh, mm);
    if(at.getTime() <= now.getTime() + 60000) return;
    list.push({id:NID0 + d * 10 + kind, at:at.getTime(), title, body, tag:dayStr(at) + ":" + kind});
  };
  // 1) daily practice reminder: today (if not done yet) and the next 3 days
  for(let d = did ? 1 : 0; d <= 3; d++){
    const day = dayStr(atDay(now, d, 12, 0));
    const alive = streak > 0 && (d === 0 || (d === 1 && did));
    const qs = questsForDay(day).map(q => { const x = t("q_" + q.id, {g:q.g}); return x.charAt(0).toLowerCase() + x.slice(1); });
    const opts = [
      [t("n_r1t", {lang}), next ? t("n_r1b", {x:next}) : t("n_r1b0")],
      [t("n_r2t"), t("n_r2b", {lang})],
      [t("n_r4t"), t("n_r4b", {a:qs[0], b:qs[1], c:qs[2]})],
      [t("n_r5t"), t("n_r5b")],
      [t("n_r7t"), t("n_r7b")]
    ];
    if(next) opts.push(["📘 " + next, t("n_r3b", {lang})]);
    if(story) opts.push([t("n_r6t"), t("n_r6b", {x:story, lang})]);
    let o = pickBy(opts, day + "|r");
    if(alive) o = d === 0 ? [t("n_s1t", {n:streak}), o[1]] : [t("n_s2t", {n:streak + 1}), o[1]];
    else if(streak > 0 && d >= 2 && d === (did ? 2 : 1)) o = [t("n_lostt"), t("n_lostb", {n:streak})];
    add(d, h, m, 0, o[0], o[1]);
    // 2) streak saver later the same evening
    if(N.streak && alive){
      const sh = Math.min(22, Math.max(h + 3, 20)), sm = sh === 22 ? 0 : 30;
      add(d, sh, sm, 1, t("n_savet", {n:d === 0 ? streak : streak + 1}), t("n_saveb"));
    }
    // 3) morning heads-up about the day's quests
    if(N.quests && d >= 1) add(d, 8, 30, 2, t("n_qt"), t("n_qb", {a:qs[0], b:qs[1], c:qs[2]}));
  }
  // 4) come-back nudges if the app is not opened for a while
  if(N.comeback){
    const base = did ? 0 : -1;
    [[5, "n_c1"], [8, "n_c2"], [15, "n_c3"]].forEach(([d, k], i) => add(d + base, h, m, 3 + i, t(k + "t"), t(k + "b", {lang})));
  }
  // 5) weekly recap, Sunday evening
  if(N.recap){
    for(let d = 0; d <= 7; d++){
      const at = atDay(now, d, 18, 0);
      if(at.getDay() !== 0) continue;
      const keys = Object.keys(profile.days).sort().slice(-7), wk = keys.filter(k => profile.days[k].c > 0);
      add(d, 18, 0, 7, t("n_wkt"), wk.length ? t("n_wkb", {d:wk.length, c:wk.reduce((s, k) => s + profile.days[k].c, 0)}) : t("n_wkb0"));
      break;
    }
  }
  return list.sort((a, b) => a.at - b.at);
}

let nTimer = null;
function rescheduleSoon(){ clearTimeout(nTimer); nTimer = setTimeout(reschedule, 1500); }
async function reschedule(){
  const list = buildSchedule();
  const P = NPlug();
  if(P){
    try{
      const pend = await P.getPending();
      const mine = ((pend && pend.notifications) || []).filter(n => n.id >= NID0 && n.id <= NID1).map(n => ({id:n.id}));
      if(mine.length) await P.cancel({notifications:mine});
      if(list.length) await P.schedule({notifications:list.map(n => ({id:n.id, title:n.title, body:n.body, schedule:{at:new Date(n.at), allowWhileIdle:true}, channelId:"reminders", smallIcon:"ic_stat_notify", iconColor:"#5B3FD9", extra:{tag:n.tag}}))});
    }catch(e){}
    return;
  }
  // browser: keep the list where the service worker can read it
  try{
    if("caches" in window){
      const c = await caches.open(NSTATE);
      const old = await c.match(NSTATE_URL).then(r => r ? r.json() : null).catch(() => null);
      await c.put(NSTATE_URL, new Response(JSON.stringify({list, shown:(old && old.shown) || []}), {headers:{"Content-Type":"application/json"}}));
    }
  }catch(e){}
}
// browser: show whatever is due while the page is open (also catches up after the PC wakes up)
async function webTick(){
  if(!webNotifyOk() || !profile.notify.on || Notification.permission !== "granted") return;
  try{
    const c = await caches.open(NSTATE);
    const st = await c.match(NSTATE_URL).then(r => r ? r.json() : null);
    if(!st) return;
    const now = Date.now(), due = st.list.filter(n => n.at <= now && now - n.at < 6 * 3600e3 && !st.shown.includes(n.tag));
    if(!due.length) return;
    const n = due[due.length - 1];
    st.shown = st.shown.concat(due.map(x => x.tag)).slice(-60);
    await c.put(NSTATE_URL, new Response(JSON.stringify(st), {headers:{"Content-Type":"application/json"}}));
    const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
    if(reg) reg.showNotification(n.title, {body:n.body, tag:n.tag, icon:"icons/icon-192.png", badge:"icons/icon-192.png"});
    else new Notification(n.title, {body:n.body, tag:n.tag, icon:"icons/icon-192.png"});
  }catch(e){}
}
async function askPermission(){
  const P = NPlug();
  if(P){
    try{
      await P.createChannel({id:"reminders", name:t("n_channel"), description:t("n_channelD"), importance:4, visibility:1}).catch(() => {});
      const r = await P.requestPermissions();
      return r && r.display === "granted";
    }catch(e){ return false; }
  }
  if(!webNotifyOk()) return false;
  if(Notification.permission === "granted") return true;
  try{ return (await Notification.requestPermission()) === "granted"; }catch(e){ return false; }
}
async function registerBackgroundCheck(){
  try{
    const reg = navigator.serviceWorker && await navigator.serviceWorker.ready;
    if(reg && "periodicSync" in reg){
      const st = await navigator.permissions.query({name:"periodic-background-sync"}).catch(() => ({state:"denied"}));
      if(st.state === "granted") await reg.periodicSync.register("pgm-reminders", {minInterval:3 * 3600e3});
    }
  }catch(e){}
}
async function setNotify(on){
  profile.notify.asked = true;
  if(on){
    const ok = await askPermission();
    if(!ok){ profile.notify.on = false; saveProfile(); renderNotify(); toast("🔕 " + t("n_denied")); return false; }
    profile.notify.on = true;
    if(!NCap()) registerBackgroundCheck();
  } else profile.notify.on = false;
  saveProfile(); await reschedule(); renderNotify(); updateNotifyBanner();
  return true;
}
async function testNotify(){
  const title = t("n_testt"), body = t("n_testb", {lang:langLabel(setup.target)});
  const P = NPlug();
  if(P){
    if(!(await askPermission())) return toast("🔕 " + t("n_denied"));
    await P.schedule({notifications:[{id:NID1, title, body, schedule:{at:new Date(Date.now() + 5000), allowWhileIdle:true}, channelId:"reminders", smallIcon:"ic_stat_notify", iconColor:"#5B3FD9"}]}).catch(() => {});
    toast("🔔 " + t("n_testSoon"), "badge");
    return;
  }
  if(!(await askPermission())) return toast("🔕 " + t("n_denied"));
  const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration().catch(() => null);
  if(reg) reg.showNotification(title, {body, icon:"icons/icon-192.png"}); else new Notification(title, {body, icon:"icons/icon-192.png"});
}

/* ---------- Reminders screen ---------- */
function openNotify(){ showOnly("notifyPage"); renderNotify(); }
function renderNotify(){
  const N = profile.notify, el = $("notifyBody"); if(!el) return;
  const where = NCap() ? t("n_whereApp") : t("n_whereWeb");
  const perm = NCap() ? "" : !webNotifyOk() ? t("n_noSupport") : Notification.permission === "denied" ? t("n_blocked") : "";
  el.innerHTML = `
    <label class="nrow big"><span><b>🔔 ${esc(t("n_master"))}</b><small>${esc(t("n_masterD"))}</small></span><input type="checkbox" id="nOn" ${N.on ? "checked" : ""}></label>
    <div class="ngroup" ${N.on ? "" : "data-off"}>
      <label class="nrow"><span><b>⏰ ${esc(t("n_time"))}</b><small>${esc(t("n_timeD"))}</small></span><input type="time" id="nTime" value="${esc(N.time)}"></label>
      <label class="nrow"><span><b>🔥 ${esc(t("n_streak"))}</b><small>${esc(t("n_streakD"))}</small></span><input type="checkbox" data-nk="streak" ${N.streak ? "checked" : ""}></label>
      <label class="nrow"><span><b>🎯 ${esc(t("n_quests"))}</b><small>${esc(t("n_questsD"))}</small></span><input type="checkbox" data-nk="quests" ${N.quests ? "checked" : ""}></label>
      <label class="nrow"><span><b>📊 ${esc(t("n_recap"))}</b><small>${esc(t("n_recapD"))}</small></span><input type="checkbox" data-nk="recap" ${N.recap ? "checked" : ""}></label>
      <label class="nrow"><span><b>👋 ${esc(t("n_comeback"))}</b><small>${esc(t("n_comebackD"))}</small></span><input type="checkbox" data-nk="comeback" ${N.comeback ? "checked" : ""}></label>
      <button class="ghost" id="nTest">🔔 ${esc(t("n_test"))}</button>
    </div>
    ${perm ? `<p class="note warn">${esc(perm)}</p>` : ""}
    <p class="note">${esc(where)}</p>
    ${N.on ? `<p class="note">${esc(nextLine())}</p>` : ""}`;
}
function nextLine(){
  const l = buildSchedule(); if(!l.length) return "";
  const d = new Date(l[0].at), loc = UI.code || "en";
  return t("n_next", {w:d.toLocaleString(loc, {weekday:"long", hour:"numeric", minute:"2-digit"}), x:l[0].title});
}
$("notifyBody").addEventListener("change", async e => {
  const N = profile.notify;
  if(e.target.id === "nOn"){ await setNotify(e.target.checked); return; }
  if(e.target.id === "nTime"){ N.time = e.target.value || "19:00"; }
  else if(e.target.dataset.nk) N[e.target.dataset.nk] = e.target.checked;
  saveProfile(); await reschedule(); renderNotify();
});
$("notifyBody").addEventListener("click", e => { if(e.target.closest("#nTest")){ Sound.unlock(); testNotify(); } });
$("notifyBtn").addEventListener("click", openNotify);
$("notifyBack").addEventListener("click", () => showMenu());

/* ---------- Gentle opt-in after the first few answers ---------- */
function updateNotifyBanner(){
  const b = $("notifyBanner"); if(!b) return;
  const show = !profile.notify.asked && !profile.notify.on && profile.answered >= 6 && (NCap() || webNotifyOk());
  b.hidden = !show;
  if(show) b.innerHTML = `<span>🔔 ${esc(t("n_banner"))}</span><button class="primary" id="nBannerYes">${esc(t("n_bannerYes"))}</button><button class="ghost" id="nBannerNo">${esc(t("n_bannerNo"))}</button>`;
}
$("notifyBanner").addEventListener("click", async e => {
  if(e.target.closest("#nBannerYes")){ Sound.unlock(); const ok = await setNotify(true); if(ok) toast("🔔 " + t("n_onToast", {x:profile.notify.time}), "badge"); }
  else if(e.target.closest("#nBannerNo")){ profile.notify.asked = true; saveProfile(); updateNotifyBanner(); }
});

/* ---------- Hooks ---------- */
recordAnswer = (orig => function(correct, xp, forced){ const was = profile.last; orig(correct, xp, forced); if(profile.notify.on && (profile.last !== was || correct)) rescheduleSoon(); })(recordAnswer);
renderDaily = (orig => function(){ orig(); try{ updateNotifyBanner(); }catch(e){} })(renderDaily);
document.addEventListener("visibilitychange", () => { if(profile.notify.on){ if(document.hidden) reschedule(); else { rescheduleSoon(); webTick(); } } });
setInterval(webTick, 60000);
setTimeout(() => {
  if(profile.notify.on){ reschedule().then(webTick); if(!NCap()) registerBackgroundCheck(); }
  const P = NPlug();
  if(P && P.addListener) try{ P.addListener("localNotificationActionPerformed", () => { try{ showMenu(); }catch(e){} }); }catch(e){}
}, 800);
$("uiSel").addEventListener("change", () => { if(profile.notify.on) rescheduleSoon(); });
