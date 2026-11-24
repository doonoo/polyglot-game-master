/* Renders Leo (src/mascot.js) into every app icon: PWA icons, favicon, Android launcher icons,
   splash screens, the notification icon and the store icon.
   Usage: node tools/icons.js   (needs Playwright + Chrome, and python3 with Pillow) */
const fs = require("fs"), path = require("path"), os = require("os"), { execFileSync } = require("child_process");
let pw; try{ pw = require("playwright"); }catch(e){ pw = require("/opt/npm-tools/node_modules/playwright"); }
const root = path.join(__dirname, "..");
const lionSVG = new Function(fs.readFileSync(path.join(root, "src", "mascot.js"), "utf8") + ";return lionSVG")();
const BG = "linear-gradient(160deg,#7A57F5 0%,#5B3BE0 55%,#4426B8 100%)";
const N = 1024, tmp = fs.mkdtempSync(path.join(os.tmpdir(), "leo-"));
const lion = (pct, opts) => `<div style="position:absolute;left:${(100 - pct) / 2}%;top:${(100 - pct) / 2 + 2}%;width:${pct}%;height:${pct}%">${lionSVG("happy", opts).replace("<svg", '<svg width="100%" height="100%"')}</div>`;
const masters = {
  rounded: `<div style="position:absolute;inset:0;border-radius:22.5%;background:${BG}"></div>${lion(80)}`,
  full: `<div style="position:absolute;inset:0;background:${BG}"></div>${lion(80)}`,
  round: `<div style="position:absolute;inset:0;border-radius:50%;background:${BG}"></div>${lion(76)}`,
  maskable: `<div style="position:absolute;inset:0;background:${BG}"></div>${lion(64)}`,
  bg: `<div style="position:absolute;inset:0;background:${BG}"></div>`,
  fg: lion(88),
  notify: lion(96, {crown:false})
};
(async () => {
  const b = await pw.chromium.launch({executablePath:"/usr/bin/google-chrome"});
  const p = await b.newPage({viewport:{width:N, height:N}});
  for(const [k, html] of Object.entries(masters)){
    await p.setContent(`<html><body style="margin:0;background:transparent"><div style="position:relative;width:${N}px;height:${N}px">${html}</div></body></html>`);
    await p.screenshot({path:path.join(tmp, k + ".png"), omitBackground:true});
  }
  await b.close();
  execFileSync("python3", [path.join(__dirname, "icons.py"), tmp, root], {stdio:"inherit"});
})();
