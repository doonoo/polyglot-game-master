"""Resizes the Leo masters from tools/icons.js into every icon file in the repo."""
import sys, os, glob
from PIL import Image
src, root = sys.argv[1], sys.argv[2]
M = {k: Image.open(os.path.join(src, k + ".png")).convert("RGBA") for k in ["rounded", "full", "round", "maskable", "bg", "fg", "notify"]}
def save(img, size, out):
    img.resize((size, size), Image.LANCZOS).save(os.path.join(root, out), optimize=True)
# PWA, favicon, store
save(M["rounded"], 192, "www/icons/icon-192.png")
save(M["rounded"], 512, "www/icons/icon-512.png")
save(M["full"], 180, "www/icons/apple-touch-icon.png")
save(M["maskable"], 512, "www/icons/maskable-512.png")
save(M["rounded"], 512, "fastlane/metadata/android/en-US/images/icon.png")
# Android launcher icons
res = os.path.join(root, "android/app/src/main/res")
for d in sorted(glob.glob(os.path.join(res, "mipmap-*dpi"))):
    for name, key in [("ic_launcher", "rounded"), ("ic_launcher_round", "round"), ("ic_launcher_background", "bg"), ("ic_launcher_foreground", "fg")]:
        f = os.path.join(d, name + ".png")
        if not os.path.exists(f): continue
        s = Image.open(f).size[0]
        img = M[key]
        if name == "ic_launcher":   # legacy icon keeps the old 8/192 margin
            m = round(s * 8 / 192); canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
            canvas.paste(img.resize((s - 2 * m, s - 2 * m), Image.LANCZOS), (m, m)); canvas.save(f, optimize=True)
        else:
            img.resize((s, s), Image.LANCZOS).save(f, optimize=True)
# notification icon: white silhouette, dark features cut out
n = M["notify"].copy(); px = n.load()
for y in range(n.size[1]):
    for x in range(n.size[0]):
        r, g, b, a = px[x, y]
        if a < 40: px[x, y] = (0, 0, 0, 0)
        elif (r * .3 + g * .59 + b * .11) < 95: px[x, y] = (0, 0, 0, 0)
        elif r > 235 and 190 < g < 225 and b < 120: px[x, y] = (0, 0, 0, 0)   # the gold face becomes a window: mane ring + muzzle + eyes
        else: px[x, y] = (255, 255, 255, 255)
for f in glob.glob(os.path.join(res, "drawable-*dpi/ic_stat_notify.png")):
    s = Image.open(f).size[0]; n.resize((s, s), Image.LANCZOS).save(f, optimize=True)
# splash screens: same background, new icon at the old icon's size and place
for f in glob.glob(os.path.join(res, "drawable*/splash.png")):
    old = Image.open(f).convert("RGBA"); w, h = old.size; bgc = old.getpixel((2, 2))
    diff = Image.new("RGBA", old.size, bgc); box = None
    from PIL import ImageChops
    box = ImageChops.difference(old.convert("RGB"), diff.convert("RGB")).getbbox()
    side = int(min(w, h) * (0.427 if h > w else 0.6)) if not box else max(box[2] - box[0], box[3] - box[1])
    side = min(side, int(min(w, h) * 0.8))
    out = Image.new("RGBA", old.size, bgc)
    ic = M["rounded"].resize((side, side), Image.LANCZOS)
    out.alpha_composite(ic, ((w - side) // 2, (h - side) // 2))
    out.save(f, optimize=True)
print("icons written")
