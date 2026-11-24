/* ===================== Leo the lion: mascot and logo =====================
   lionSVG(mood) returns an inline SVG of Leo's head (viewBox 0 0 200 200).
   Moods: happy (default), cheer, sad, think, wow, wink.
   tools/icons.js renders the same function into the app, PWA and Android icons,
   so the logo and the in-game mascot always match. Keep this file free of app globals. */
function lionSVG(mood, o){
  mood = mood || "happy"; o = o || {};
  const C = {mane:"#F59E1B", maneD:"#DC7A12", maneL:"#FFB938", face:"#FFD45C", faceD:"#F5B935", muzzle:"#FFF4D6",
    ink:"#2D1B69", nose:"#4B2C8F", tongue:"#FF7A8A", mouth:"#7A2E4E", blush:"#FF8E6E", white:"#FFFFFF"};
  const lobes = [];
  for(let i = 0; i < 14; i++){
    const a = (i / 14) * Math.PI * 2 - Math.PI / 2 + 0.11, r = i % 2 ? 68 : 73;
    lobes.push(`<circle cx="${(100 + Math.cos(a) * r).toFixed(1)}" cy="${(108 + Math.sin(a) * r * 0.96).toFixed(1)}" r="${i % 2 ? 21 : 25}"${i % 2 ? ` fill="${C.maneD}"` : ""}/>`);
  }
  const eye = (x, side) => {
    const lx = x + (side < 0 ? 1.5 : -1.5);   // pupils lean in a little: friendly, focused
    if(mood === "cheer" || (mood === "wink" && side > 0))
      return `<path d="M${x - 11} 102 Q${x} 88 ${x + 11} 102" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
    const py = mood === "sad" ? 104 : mood === "think" ? 96 : 101, px = mood === "think" ? lx + 2.5 * (side < 0 ? 1 : 1) : lx;
    const ry = mood === "wow" ? 14.5 : 13;
    return `<ellipse cx="${x}" cy="99" rx="13" ry="${ry + 1.5}" fill="${C.white}"/>
      <circle cx="${px}" cy="${py}" r="${mood === "wow" ? 6.5 : 8}" fill="${C.ink}"/>
      <circle cx="${px + 2.4}" cy="${py - 3}" r="2.6" fill="${C.white}"/>`;
  };
  const brow = (x, side) => {
    let d;
    if(mood === "sad") d = side < 0 ? `M${x - 10} 82 Q${x - 2} 81 ${x + 8} 76` : `M${x - 8} 76 Q${x + 2} 81 ${x + 10} 82`;
    else if(mood === "think") d = side < 0 ? `M${x - 10} 81 Q${x} 79 ${x + 9} 81` : `M${x - 9} 76 Q${x} 70 ${x + 10} 75`;
    else if(mood === "wow" || mood === "cheer") d = `M${x - 9} 77 Q${x} 70 ${x + 9} 77`;
    else d = `M${x - 9} 80 Q${x} 75 ${x + 9} 80`;
    return `<path d="${d}" fill="none" stroke="${C.maneD}" stroke-width="4.5" stroke-linecap="round"/>`;
  };
  let mouth;
  if(mood === "cheer") mouth = `<path d="M84 137 Q100 135 116 137 Q114 158 100 159 Q86 158 84 137Z" fill="${C.mouth}"/><path d="M90 151 Q100 144 110 151 Q106 158 100 158.5 Q94 158 90 151Z" fill="${C.tongue}"/>`;
  else if(mood === "sad") mouth = `<path d="M89 146 Q100 137 111 146" fill="none" stroke="${C.ink}" stroke-width="3.6" stroke-linecap="round"/>`;
  else if(mood === "wow") mouth = `<ellipse cx="100" cy="146" rx="6.5" ry="8" fill="${C.mouth}"/>`;
  else if(mood === "think") mouth = `<path d="M92 143 Q100 141 109 139" fill="none" stroke="${C.ink}" stroke-width="3.6" stroke-linecap="round"/>`;
  else mouth = `<path d="M87 138 Q93 147 100 139 Q107 147 113 138" fill="none" stroke="${C.ink}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M95 143.5 Q100 152 105 143.5 Q100 141 95 143.5Z" fill="${C.tongue}"/>`;
  const tear = mood === "sad" ? `<path d="M128 108 Q133 117 128 121 Q123 117 128 108Z" fill="#7CC8FF"/>` : "";
  const label = o.title ? "<" + "title>" + o.title + "</" + "title>" : "";   // split: build.py expects one closing title tag in the page
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="${o.cls || "leo"}" ${o.title ? 'role="img"' : 'aria-hidden="true"'}>${label}
  <g fill="${C.mane}">${lobes.filter((x, i) => i % 2).join("")}${lobes.filter((x, i) => !(i % 2)).join("")}<circle cx="100" cy="108" r="70"/></g>
  <circle cx="100" cy="110" r="62" fill="${C.maneD}" opacity=".35"/>
  <g fill="${C.maneL}"><circle cx="50" cy="66" r="6"/><circle cx="36" cy="120" r="4.5"/><circle cx="160" cy="146" r="4.5"/></g>
  <circle cx="60" cy="62" r="17" fill="${C.faceD}"/><circle cx="140" cy="62" r="17" fill="${C.faceD}"/>
  <circle cx="60" cy="62" r="8.5" fill="${C.blush}" opacity=".85"/><circle cx="140" cy="62" r="8.5" fill="${C.blush}" opacity=".85"/>
  <path d="M100 54 C135 54 157 79 157 111 C157 143 133 166 100 166 C67 166 43 143 43 111 C43 79 65 54 100 54Z" fill="${C.face}"/>
  <path d="M84 56 Q90 70 100 61 Q110 70 116 56 Q100 50 84 56Z" fill="${C.mane}"/>
  ${o.crown === false ? "" : `<g transform="rotate(14 132 34)"><path d="M114 44 L112 24 L122 33 L132 18 L142 33 L152 24 L150 44Z" fill="#FFE07A" stroke="${C.maneD}" stroke-width="3" stroke-linejoin="round"/><circle cx="132" cy="36" r="3.6" fill="#7C5CFF"/><circle cx="121" cy="39" r="2.4" fill="#34C77B"/><circle cx="143" cy="39" r="2.4" fill="#FF6B8A"/></g>`}
  <circle cx="66" cy="124" r="8" fill="${C.blush}" opacity=".45"/><circle cx="134" cy="124" r="8" fill="${C.blush}" opacity=".45"/>
  <ellipse cx="88" cy="134" rx="17" ry="14" fill="${C.muzzle}"/><ellipse cx="112" cy="134" rx="17" ry="14" fill="${C.muzzle}"/>
  <ellipse cx="100" cy="148" rx="13" ry="9" fill="${C.muzzle}"/>
  <g fill="${C.faceD}"><circle cx="81" cy="133" r="1.8"/><circle cx="76" cy="138" r="1.8"/><circle cx="83" cy="140" r="1.8"/><circle cx="119" cy="133" r="1.8"/><circle cx="124" cy="138" r="1.8"/><circle cx="117" cy="140" r="1.8"/></g>
  ${mouth}
  <path d="M88 121 Q100 115 112 121 Q110 131 100 134 Q90 131 88 121Z" fill="${C.nose}"/>
  <ellipse cx="96" cy="121.5" rx="3.6" ry="2" fill="#fff" opacity=".45"/>
  ${brow(79, -1)}${brow(121, 1)}${eye(79, -1)}${eye(121, 1)}${tear}
</svg>`;
}
