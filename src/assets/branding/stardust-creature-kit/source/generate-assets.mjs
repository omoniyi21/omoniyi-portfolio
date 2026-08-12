import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SVG_DIR = path.join(ROOT, 'svg');
fs.mkdirSync(SVG_DIR, { recursive: true });

const C = {
  cream: '#F7F2ED',
  ink: '#1B1B1F',
  pink: '#FF8DB6',
  lavender: '#7C6CFF',
  peach: '#FFB26B',
  gray: '#A3A3A3',
};

const defs = `
  <defs>
    <filter id="soft-shadow" x="-30%" y="-50%" width="160%" height="200%">
      <feGaussianBlur stdDeviation="2.2"/>
    </filter>
  </defs>`;

const style = `
  <style>
    .ink { fill: none; stroke: ${C.ink}; stroke-width: 3.25; stroke-linecap: round; stroke-linejoin: round; }
    .fine { fill: none; stroke: ${C.ink}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .ghost { fill: none; stroke: ${C.gray}; stroke-width: 1.25; stroke-linecap: round; opacity: .42; }
    .pink { fill: none; stroke: ${C.pink}; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .lavender { fill: none; stroke: ${C.lavender}; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  </style>`;

function svgDoc(title, viewBox, content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">Omoniyi's hand-drawn Stardust Creature portfolio companion.</desc>
  ${defs}
  ${style}
  ${content}
</svg>\n`;
}

function spark(x, y, s = 1, color = C.pink) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 -13 C1 -4 4 -1 12 0 C4 1 1 4 0 13 C-1 4 -4 1 -12 0 C-4 -1 -1 -4 0 -13Z"/>
  </g>`;
}

function tinyStar(x, y, s = 1, color = C.ink) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round">
    <path d="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8Z"/>
  </g>`;
}

function orbitDots(x, y, flip = false) {
  const t = flip ? `translate(${x} ${y}) scale(-1 1)` : `translate(${x} ${y})`;
  return `<g transform="${t}" fill="none" stroke="${C.gray}" stroke-width="2" stroke-linecap="round" opacity=".8">
    <path d="M0 0 C35 -16 58 -12 84 7 S139 22 168 -2" stroke-dasharray="3 9"/>
  </g>`;
}

function shadow(x, y, w = 135, color = C.lavender) {
  return `<g transform="translate(${x} ${y})" opacity=".32">
    <ellipse cx="0" cy="0" rx="${w / 2}" ry="7" fill="${color}" filter="url(#soft-shadow)"/>
    <path d="M-${w / 2} 0 C-${w / 4} -5 ${w / 5} 6 ${w / 2} -1" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <path d="M-${w * .38} 5 C-${w * .12} 1 ${w * .16} 8 ${w * .38} 3" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>
  </g>`;
}

function creature({ x = 0, y = 0, s = 1, expression = 'curious', arms = 'down', legs = true, bodyTone = C.cream, rotate = 0 } = {}) {
  let eyes = `<ellipse cx="54" cy="83" rx="9" ry="15" fill="${C.ink}"/>
      <ellipse cx="116" cy="82" rx="9" ry="15" fill="${C.ink}"/>
      <ellipse cx="51" cy="78" rx="2.4" ry="4.6" fill="${C.cream}"/>
      <ellipse cx="113" cy="77" rx="2.4" ry="4.6" fill="${C.cream}"/>`;
  let mouth = `<path d="M83 106 q4 4 8 0" class="fine"/>`;
  if (expression === 'sleepy') {
    eyes = `<path d="M45 84 q9 8 18 0 M107 84 q9 8 18 0" class="ink"/>`;
    mouth = `<path d="M82 108 q6 -4 12 0" class="fine"/>`;
  } else if (expression === 'shy') {
    eyes = `<ellipse cx="58" cy="84" rx="7" ry="12" fill="${C.ink}"/>
      <ellipse cx="111" cy="84" rx="7" ry="12" fill="${C.ink}"/>
      <ellipse cx="56" cy="80" rx="2" ry="3.5" fill="${C.cream}"/>
      <ellipse cx="109" cy="80" rx="2" ry="3.5" fill="${C.cream}"/>`;
    mouth = `<path d="M83 108 q4 -3 8 0" class="fine"/>`;
  } else if (expression === 'excited') {
    mouth = `<path d="M81 105 q7 10 14 0 q-7 5 -14 0Z" fill="${C.ink}"/>`;
  } else if (expression === 'thinking') {
    mouth = `<path d="M83 108 q5 -3 10 0" class="fine"/>`;
  }

  let armMarkup = '';
  if (arms === 'down') armMarkup = `<path d="M27 105 q-10 10 -8 22 M143 104 q10 9 8 21" class="ink"/>`;
  if (arms === 'wave') armMarkup = `<path d="M27 105 q-10 9 -8 21 M143 103 q12 -13 7 -27 q-2 -7 4 -12 M150 76 q7 -3 9 4 M151 74 q2 -8 7 -8" class="ink"/>`;
  if (arms === 'point') armMarkup = `<path d="M27 105 q-10 10 -8 22 M143 103 C156 90 164 78 171 64" class="ink"/><circle cx="172" cy="63" r="2.2" fill="${C.ink}"/>`;
  if (arms === 'hug') armMarkup = '';
  if (arms === 'walk') armMarkup = `<path d="M31 103 q-12 -1 -18 -10 M141 105 q10 4 16 13" class="ink"/>`;

  const legMarkup = legs ? `<path d="M57 139 q-2 13 -1 21 M111 139 q2 12 1 21" class="ink"/>
      <path d="M50 161 q6 -3 13 0 M105 161 q7 -3 14 0" class="ink"/>` : '';

  return `<g transform="translate(${x} ${y}) rotate(${rotate} 85 85) scale(${s})">
    ${legMarkup}
    ${armMarkup}
    <path d="M17 97 C13 72 25 43 47 25 C64 11 88 8 110 16 C135 14 145 33 153 53 C168 74 158 112 140 129 C119 148 75 146 45 137 C25 131 17 116 17 97Z" fill="${bodyTone}" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 96 C17 69 30 43 49 28 C67 15 88 13 108 20 C131 18 143 36 150 55 C160 78 154 108 137 126" class="ghost"/>
    <path d="M23 113 C34 134 66 140 93 138 C118 138 137 130 147 116" fill="none" stroke="${C.gray}" stroke-width="1.1" stroke-linecap="round" opacity=".28"/>
    <ellipse cx="49" cy="43" rx="9" ry="5.5" transform="rotate(-20 49 43)" fill="none" stroke="${C.gray}" stroke-width="2"/>
    <ellipse cx="112" cy="31" rx="7" ry="4.5" transform="rotate(11 112 31)" fill="none" stroke="${C.gray}" stroke-width="1.8"/>
    <ellipse cx="143" cy="65" rx="5" ry="8" transform="rotate(-8 143 65)" fill="none" stroke="${C.gray}" stroke-width="1.8"/>
    <path d="M34 70 q4 -5 8 -1 M122 53 q4 -3 7 1 M70 29 q3 -2 5 0" class="ghost"/>
    <g fill="${C.gray}" opacity=".42">
      <circle cx="38" cy="120" r="1.4"/><circle cx="73" cy="130" r="1.1"/><circle cx="128" cy="117" r="1.2"/><circle cx="98" cy="42" r="1.2"/><circle cx="29" cy="89" r=".9"/><circle cx="137" cy="94" r="1"/>
    </g>
    ${eyes}
    ${mouth}
    ${arms === 'hug' ? `<path d="M25 104 C43 111 52 117 68 123 M145 104 C127 111 116 119 101 123" class="ink"/>` : ''}
    <g fill="${C.pink}" opacity=".82">
      <circle cx="34" cy="106" r="2.3"/><circle cx="40" cy="108" r="1.8"/><circle cx="130" cy="106" r="1.8"/><circle cx="136" cy="108" r="2.3"/>
    </g>
  </g>`;
}

const assets = [
  {
    name: 'stardust-mark', title: 'Stardust Creature logo mark', viewBox: '0 0 160 160',
    content: `<circle cx="80" cy="80" r="62" fill="${C.ink}"/>${spark(80, 80, 2.2, C.pink)}<circle cx="80" cy="80" r="4" fill="${C.pink}"/>`,
  },
  {
    name: 'hero-explorer', title: 'Stardust Creature exploring the hero', viewBox: '0 0 420 340',
    content: `${orbitDots(30, 265)}${shadow(203, 296, 210)}${creature({x:110,y:104,s:1.25,expression:'curious',arms:'point'})}${spark(350, 78, 1.28)}${tinyStar(64,87,.95,C.ink)}${tinyStar(319,42,.62,C.lavender)}<path d="M321 102 q19 -19 29 -24" class="pink" stroke-dasharray="1 8"/>`,
  },
  {
    name: 'nav-peek', title: 'Stardust Creature peeking over navigation', viewBox: '0 0 280 150',
    content: `<g transform="translate(64 15) scale(.88)">${creature({legs:false,arms:'down'})}</g><path d="M22 126 C84 123 188 129 258 125" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M28 130 C90 129 187 134 250 130" stroke="${C.gray}" stroke-width="1.2" opacity=".35" fill="none"/>${spark(225,36,.62)}<path d="M218 55 l9 6 M224 46 l3 10 M235 48 l-4 9" class="pink"/>`,
  },
  {
    name: 'project-curious', title: 'Stardust Creature beside a project card', viewBox: '0 0 300 280',
    content: `${shadow(149,245,145)}${creature({x:70,y:72,s:.92,expression:'curious',arms:'down'})}<path d="M232 59 C250 39 267 54 260 70 C256 82 236 93 225 101 C221 85 213 69 219 61 C222 56 227 56 232 59Z" fill="none" stroke="${C.pink}" stroke-width="3" stroke-linejoin="round"/>${tinyStar(56,48,.55,C.lavender)}`,
  },
  {
    name: 'observations-telescope', title: 'Stardust Creature observing patterns', viewBox: '0 0 380 280',
    content: `${shadow(151,243,160)}${creature({x:72,y:76,s:.88,expression:'thinking',arms:'down'})}<g transform="translate(184 142) rotate(-10)"><path d="M0 0 L91 -10 L98 14 L3 19Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M72 -8 L92 -14 L102 17 L80 14Z" fill="${C.lavender}" opacity=".88" stroke="${C.ink}" stroke-width="3"/><ellipse cx="101" cy="2" rx="8" ry="17" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><path d="M31 16 l-9 51 M46 14 l18 49" class="ink"/></g>${spark(327,66,.92,C.pink)}${tinyStar(300,108,.55,C.ink)}${tinyStar(343,123,.42,C.lavender)}`,
  },
  {
    name: 'insight-point', title: 'Stardust Creature pointing out an insight', viewBox: '0 0 340 280',
    content: `${shadow(133,244,155)}${creature({x:54,y:76,s:.92,expression:'excited',arms:'point'})}${spark(250,73,1.25,C.pink)}<path d="M221 124 C236 106 242 88 249 74" class="lavender" stroke-dasharray="3 8"/>${tinyStar(290,126,.6,C.lavender)}`,
  },
  {
    name: 'systems-trail', title: 'Stardust Creature moving through systems', viewBox: '0 0 560 260',
    content: `${orbitDots(35,194)}${shadow(137,220,135)}${creature({x:67,y:66,s:.86,expression:'curious',arms:'walk',rotate:-2})}${spark(446,186,.9,C.pink)}${tinyStar(294,177,.5,C.lavender)}${tinyStar(363,203,.42,C.ink)}<path d="M230 184 C265 151 293 157 321 180" class="ghost" stroke-dasharray="4 9"/>`,
  },
  {
    name: 'possibilities-flag', title: 'Stardust Creature discovering possibilities', viewBox: '0 0 340 320',
    content: `${shadow(143,283,155)}${creature({x:61,y:106,s:.95,expression:'excited',arms:'down'})}<path d="M153 115 L150 34" class="ink"/><circle cx="150" cy="31" r="5" fill="${C.cream}" stroke="${C.ink}" stroke-width="2.5"/><path d="M154 46 C182 38 202 64 231 51 L226 94 C198 106 181 80 153 88Z" fill="${C.pink}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>${tinyStar(277,63,.75,C.lavender)}${spark(285,130,.64,C.pink)}`,
  },
  {
    name: 'about-shy', title: 'Shy Stardust Creature for the about section', viewBox: '0 0 300 280',
    content: `${shadow(148,246,145)}${creature({x:70,y:74,s:.92,expression:'shy',arms:'hug'})}<path d="M235 78 q9 -12 18 0 q-9 12 -18 0Z" fill="${C.pink}" opacity=".82"/>${tinyStar(58,61,.55,C.lavender)}<path d="M221 56 q7 -9 14 0" class="pink"/>`,
  },
  {
    name: 'contact-wave', title: 'Stardust Creature waving hello', viewBox: '0 0 340 290',
    content: `${shadow(145,252,155)}${creature({x:62,y:82,s:.94,expression:'excited',arms:'wave'})}${spark(277,65,1.08,C.pink)}<path d="M245 113 q17 -12 20 -29" class="lavender" stroke-dasharray="2 8"/>${tinyStar(291,126,.55,C.ink)}`,
  },
  {
    name: 'footer-sleeping', title: 'Sleeping Stardust Creature at the end of the journey', viewBox: '0 0 600 250',
    content: `${shadow(292,217,185)}${creature({x:207,y:76,s:.88,expression:'sleepy',arms:'down',legs:false})}<path d="M125 213 C203 205 375 218 465 211" class="ghost"/><path d="M414 51 C392 65 399 91 425 93 C411 104 383 96 380 72 C377 49 396 34 414 32 C408 38 407 45 414 51Z" fill="${C.ink}"/>${tinyStar(120,72,.75,C.ink)}${tinyStar(485,119,.55,C.pink)}${tinyStar(502,57,.42,C.lavender)}<g fill="${C.lavender}" font-family="Arial, sans-serif" font-weight="700"><text x="342" y="91" font-size="21" transform="rotate(-7 342 91)">z</text><text x="367" y="72" font-size="25" transform="rotate(-5 367 72)">z</text><text x="397" y="48" font-size="30">z</text></g>`,
  },
  {
    name: 'decorative-sparkles', title: 'Stardust decorative sparkles', viewBox: '0 0 520 220',
    content: `${spark(55,72,1.1,C.pink)}${tinyStar(135,137,.75,C.ink)}${spark(222,55,.62,C.lavender)}${tinyStar(298,118,1.05,C.ink)}${spark(395,69,1.35,C.pink)}${tinyStar(468,145,.55,C.lavender)}<circle cx="98" cy="46" r="3" fill="${C.peach}"/><circle cx="185" cy="158" r="2.6" fill="${C.pink}"/><circle cx="349" cy="169" r="3" fill="${C.lavender}"/><path d="M70 174 C168 146 251 196 346 166 S456 159 491 179" fill="none" stroke="${C.gray}" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 10" opacity=".7"/>`,
  },
];

for (const asset of assets) {
  fs.writeFileSync(path.join(SVG_DIR, `${asset.name}.svg`), svgDoc(asset.title, asset.viewBox, asset.content));
}

fs.writeFileSync(path.join(ROOT, 'asset-manifest.json'), JSON.stringify({
  name: 'Omoniyi Stardust Creature Kit',
  version: '1.0.0',
  palette: C,
  assets: assets.map(({ name, title, viewBox }) => ({ name, title, viewBox, formats: ['svg', 'png-512', 'png-1024'] })),
}, null, 2) + '\n');

console.log(`Generated ${assets.length} SVG assets.`);
