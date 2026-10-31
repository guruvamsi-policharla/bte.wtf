// The landscape of practical batched threshold encryption schemes, extending the DAG in
// https://commonware.xyz/blogs/pick-your-poisons
// Box centers are in pixels on a DESIGN_WIDTH x DESIGN_HEIGHT canvas that is scaled to fit the page.

const DESIGN_WIDTH = 1200;
const DESIGN_HEIGHT = 680;
const SVG_NS = 'http://www.w3.org/2000/svg';

const BOXES = [
  { id: 'bte', title: 'Batched Threshold Encryption', papers: 'CGPP24', x: 470, y: 45 },
  { id: 'ste', title: 'Silent Threshold Encryption', papers: 'GKPW24, WW25', x: 1000, y: 45 },
  { id: 'beat', title: 'BEAT-MEV(++)', papers: 'BFOQ25, ABDGMPRY25', x: 760, y: 160 },
  { id: 'pol26c', title: 'Weighted Silent TE', papers: 'Pol26c', x: 1095, y: 160 },
  { id: 'pfbte', title: 'Partial Fraction-BTE', papers: 'BNRT26', x: 130, y: 275 },
  { id: 'btibe', title: 'Batched Threshold IBE', papers: 'SAS24, CGPW25, AFP25, GWWW25', x: 520, y: 275 },
  { id: 'tree', title: 'Tree-BTE', papers: 'ADGPR26', x: 740, y: 275 },
  { id: 'simple', title: 'Simple BTE, BTX', papers: 'Pol26a, ADGRS26', x: 330, y: 390 },
  { id: 'trx', title: 'TrX', papers: 'FPTX25', x: 520, y: 390 },
  { id: 'sbtibe', title: 'Silent Batched (T)IBE', papers: 'GWWW25', x: 720, y: 390 },
  { id: 'beast', title: 'BEAST-MEV', papers: 'BCFGOPQW25', x: 950, y: 390 },
  { id: 'fprt', title: 'Weighted BTE', papers: 'FPRT26', x: 120, y: 505 },
  { id: 'dkg', title: 'DKG Is All You Need', papers: 'Pol26d', x: 360, y: 505 },
  { id: 'pol26b', title: 'Labeled Multi-Key Batched IBE', papers: 'Pol26b', x: 650, y: 505 },
  { id: 'acadg', title: 'Batched Weighted Silent TE', papers: 'ACADG26', x: 1010, y: 505 },
  { id: 'isbte', title: 'Indexed Simple BTE', papers: 'Pol26a', x: 130, y: 620 },
  { id: 'lee', title: 'Outsourced Silent TBIBE', papers: 'Lee26', x: 900, y: 620 },
];

const ARROWS = [
  ['bte', 'simple'],
  ['bte', 'pfbte'],
  ['bte', 'btibe'],
  ['bte', 'beat'],
  ['btibe', 'trx'],
  ['btibe', 'sbtibe'],
  ['ste', 'sbtibe'],
  ['ste', 'beast'],
  ['ste', 'pol26c'],
  ['beat', 'beast'],
  ['beat', 'tree'],
  ['simple', 'isbte'],
  ['simple', 'fprt'],
  ['pfbte', 'fprt'],
  ['simple', 'dkg'],
  ['trx', 'pol26b'],
  ['sbtibe', 'pol26b'],
  ['sbtibe', 'lee'],
  ['beast', 'acadg'],
];

const EPRINT = {
  SAS24: '2024/762',
  ADGPR26: '2026/2463',
  Pol26c: '2026/2148',
  Pol26d: '2026/2205',
  ACADG26: '2026/2087',
  FPRT26: '2026/2053',
  Lee26: '2026/1558',
  CGPP24: '2024/669',
  GKPW24: '2024/263',
  WW25: '2025/1547',
  BFOQ25: '2024/1533',
  ABDGMPRY25: '2025/2115',
  BNRT26: '2026/674',
  CGPW25: '2024/1516',
  AFP25: '2024/1575',
  GWWW25: '2025/2103',
  Pol26a: '2026/760',
  ADGRS26: '2026/754',
  FPTX25: '2025/2032',
  BCFGOPQW25: '2025/1419',
  Pol26b: '2026/1452',
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;

function svg(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

function createBox(box) {
  const el = document.createElement('div');
  el.className = 'map-box';
  el.style.left = `${box.x}px`;
  el.style.top = `${box.y}px`;

  const title = document.createElement('span');
  title.className = 'map-box-title';
  title.textContent = box.title;

  const papers = document.createElement('span');
  box.papers.split(', ').forEach((paper, index) => {
    if (index > 0) papers.append(', ');
    const link = document.createElement('a');
    link.href = `https://eprint.iacr.org/${EPRINT[paper]}`;
    link.textContent = paper;
    papers.append(link);
  });

  el.append(title, papers);
  return el;
}

// Point where the ray from one box center towards another leaves the box.
function edgePoint(from, to, size) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const dist = Math.min(
    ux !== 0 ? size.w / 2 / Math.abs(ux) : Infinity,
    uy !== 0 ? size.h / 2 / Math.abs(uy) : Infinity,
  );
  return { x: from.x + ux * dist, y: from.y + uy * dist };
}

function arrowHead(tip, from, length = 8, width = 7) {
  const len = Math.hypot(tip.x - from.x, tip.y - from.y) || 1;
  const ux = (tip.x - from.x) / len;
  const uy = (tip.y - from.y) / len;
  const base = { x: tip.x - ux * length, y: tip.y - uy * length };
  const half = width / 2;
  const points = [
    [tip.x, tip.y],
    [base.x - uy * half, base.y + ux * half],
    [base.x + uy * half, base.y - ux * half],
  ];
  return { base, points: points.map(p => p.join(',')).join(' ') };
}

function sample(from, control, to, count = 32) {
  return Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count;
    if (!control) return { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) };
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    return { x: a * from.x + b * control.x + c * to.x, y: a * from.y + b * control.y + c * to.y };
  });
}

function segments(points) {
  return points.slice(1).map((point, i) => [points[i], point]);
}

function orientation(a, b, c) {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
}

function intersects([a, b], [c, d]) {
  return orientation(a, b, c) * orientation(a, b, d) < 0 && orientation(c, d, a) * orientation(c, d, b) < 0;
}

// Picks a straight line or a curve bent to either side, whichever passes
// through the fewest other boxes and crosses the fewest earlier arrows.
function route(from, to, obstacles, routed) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const controls = [null, 60, -60, 105, -105, 150, -150].map(offset => offset === null ? null : {
    x: clamp(mid.x - (dy / len) * offset, 20, DESIGN_WIDTH - 20),
    y: clamp(mid.y + (dx / len) * offset, 20, DESIGN_HEIGHT - 20),
  });

  return controls
    .map(control => {
      const points = sample(from, control, to);
      const boxHits = points.reduce((n, p) => n + obstacles.filter(r =>
        p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom).length, 0);
      const crossings = segments(points).reduce((n, s) => n + routed.filter(o => intersects(s, o)).length, 0);
      return { control, points, score: boxHits * 1000 + crossings * 40 + (control ? 8 : 0) };
    })
    .sort((a, b) => a.score - b.score)[0];
}

function drawArrows(layer, boxEls) {
  layer.replaceChildren();
  const center = {};
  const size = {};
  for (const { box, el } of boxEls) {
    center[box.id] = { x: box.x, y: box.y };
    size[box.id] = { w: el.offsetWidth, h: el.offsetHeight };
  }

  const routed = [];
  for (const [fromId, toId] of ARROWS) {
    const start = edgePoint(center[fromId], center[toId], size[fromId]);
    const tip = edgePoint(center[toId], center[fromId], size[toId]);
    const obstacles = boxEls
      .filter(({ box }) => box.id !== fromId && box.id !== toId)
      .map(({ box }) => ({
        left: center[box.id].x - size[box.id].w / 2 - 8,
        right: center[box.id].x + size[box.id].w / 2 + 8,
        top: center[box.id].y - size[box.id].h / 2 - 8,
        bottom: center[box.id].y + size[box.id].h / 2 + 8,
      }));
    const best = route(start, tip, obstacles, routed);
    const head = arrowHead(tip, best.control ?? start);
    const d = best.control
      ? `M ${start.x} ${start.y} Q ${best.control.x} ${best.control.y} ${head.base.x} ${head.base.y}`
      : `M ${start.x} ${start.y} L ${head.base.x} ${head.base.y}`;
    layer.append(svg('path', { class: 'map-arrow', d }), svg('polygon', { class: 'map-arrow-head', points: head.points }));
    routed.push(...segments(best.points));
  }
}

function initMap(mount) {
  mount.replaceChildren();
  mount.style.aspectRatio = `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}`;
  const canvas = document.createElement('div');
  canvas.className = 'map-canvas';
  canvas.style.width = `${DESIGN_WIDTH}px`;
  canvas.style.height = `${DESIGN_HEIGHT}px`;
  const layer = svg('svg', { class: 'map-arrows', viewBox: `0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`, 'aria-hidden': 'true' });
  canvas.append(layer);
  mount.append(canvas);

  const boxEls = BOXES.map(box => {
    const el = createBox(box);
    canvas.append(el);
    return { box, el };
  });

  const update = () => {
    canvas.style.transform = `scale(${mount.clientWidth / DESIGN_WIDTH})`;
    drawArrows(layer, boxEls);
  };
  window.addEventListener('resize', update);
  if (document.fonts) document.fonts.ready.then(update);
  update();
}

const mount = document.getElementById('map');
if (mount) initMap(mount);
