export const MODES = ['clean', 'shorttitlehold', 'inconsistent-easing', 'competing-focals', 'crop-legibility', 'transition-jump', 'audio-offset', 'logo-matte'];
export const DEFAULTS = Object.freeze({
  duration: 20, fps: 30, width: 3840, height: 2160,
  palette: ['#101F24', '#DCECE7', '#D0FE6B', '#F19868'],
  copy: ['A clearer view', 'From signal to sequence', 'Evidence, in context', 'Make the next move'],
  mode: 'clean',
});
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const clamp = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
const hex = /^#[0-9a-fA-F]{6}$/;
export function validateConfig(input) {
  const c = {...DEFAULTS, ...input};
  if (!Number.isInteger(c.width) || c.width < 320 || c.width > 7680 || !Number.isInteger(c.height) || c.height < 180 || c.height > 4320) throw new Error('Invalid dimensions');
  if (!Number.isInteger(c.fps) || c.fps < 12 || c.fps > 60 || !Number.isInteger(c.duration) || c.duration < 4 || c.duration > 60) throw new Error('Invalid timing');
  if (!Array.isArray(c.palette) || c.palette.length !== 4 || !c.palette.every((v) => typeof v === 'string' && hex.test(v))) throw new Error('Palette needs four #RRGGBB colors');
  if (!Array.isArray(c.copy) || c.copy.length !== 4 || !c.copy.every((v) => typeof v === 'string' && v.length > 0 && v.length <= 70 && !/[\r\n]/.test(v))) throw new Error('Copy needs four short single-line strings');
  if (!MODES.includes(c.mode)) throw new Error('Unknown calibration mode');
  return c;
}
export function shotAt(frame, config) {
  const c = validateConfig(config);
  const total = c.duration * c.fps;
  if (!Number.isInteger(frame) || frame < 0 || frame >= total) throw new Error('Frame outside sequence');
  const q = frame / total * 4;
  return {shot: Math.min(3, Math.floor(q)), progress: q % 1, seconds: frame / c.fps};
}
export function transitionCue(config = {}) {
  const c = validateConfig(config);
  const frame = Math.ceil(c.duration * c.fps / 4);
  return {frame, seconds: frame / c.fps, event: 'workflow-beat-transition'};
}
export function titleOpacity(shot, progress, mode) {
  if (shot !== 0) return 1;
  const hold = mode === 'shorttitlehold' ? 0.17 : 0.82;
  const fadeEnd = mode === 'shorttitlehold' ? 0.32 : 0.98;
  return clamp((fadeEnd - progress) / (fadeEnd - hold));
}
export function titleLines(value) {
  const lines = [];
  for (const word of value.split(' ')) {
    if (word.length > 18) throw new Error('Title word too long for layout');
    const next = lines.length ? `${lines.at(-1)} ${word}` : word;
    if (lines.length && next.length > 18) lines.push(word);
    else if (lines.length) lines[lines.length - 1] = next;
    else lines.push(word);
  }
  if (lines.length > 3) throw new Error('Title exceeds three-line layout');
  return lines;
}
export function renderSvg(frame, config = {}) {
  const c = validateConfig(config);
  const {shot, progress: p} = shotAt(frame, c);
  const W = 1920, H = 1080;
  const dark = c.palette[0], light = c.palette[1], lime = c.palette[2], warm = c.palette[3];
  const entrance = c.mode === 'inconsistent-easing' && shot === 1 ? clamp(p * 2) : ease(p * 2.5);
  const opacity = titleOpacity(shot, p, c.mode);
  const jump = c.mode === 'transition-jump' && shot === 2 && p > .52 ? 130 : 0;
  const crop = c.mode === 'crop-legibility' && shot === 2 ? 1.65 : 1;
  const title = titleLines(c.copy[shot]).map((line, i) => `<tspan x="${shot === 2 && c.mode === 'crop-legibility' ? -35 : 144}" dy="${i === 0 ? 0 : 108}">${esc(line)}</tspan>`).join('');
  const label = esc(['01 / REVEAL', '02 / WORKFLOW', '03 / EVIDENCE LAYOUT', '04 / CLOSE'][shot]);
  const left = 144, titleY = 490;
  const titleSize = c.mode === 'crop-legibility' && shot === 2 ? 46 : 96;
  const titleX = c.mode === 'crop-legibility' && shot === 2 ? -35 : left;
  const line = `<line x1="144" y1="904" x2="1776" y2="904" stroke="${light}" opacity=".27"/><text x="144" y="967" font-size="25" letter-spacing="5" fill="${light}" opacity=".78">ILLUSTRATIVE CONCEPT · NOT PRODUCT UI</text><text x="1768" y="967" text-anchor="end" font-size="25" fill="${light}" opacity=".78">${label}</text>`;
  let motif = '';
  if (shot === 0) {
    const radius = 165 + 105 * entrance;
    motif = `<circle cx="1390" cy="500" r="${radius}" fill="none" stroke="${lime}" stroke-width="3"/><circle cx="1390" cy="500" r="${radius * .64}" fill="${lime}" opacity=".1"/><path d="M 1220 500 H 1560 M 1390 330 V 670" stroke="${lime}" stroke-width="2" opacity=".5"/>`;
  } else if (shot === 1) {
    const x = 1070 + 480 * entrance;
    motif = `<path d="M 1060 346 H 1730 M 1060 514 H 1730 M 1060 682 H 1730" stroke="${light}" opacity=".25" stroke-width="2"/><circle cx="${x}" cy="346" r="23" fill="${lime}"/><circle cx="${x-190}" cy="514" r="23" fill="${warm}"/><circle cx="${x-350}" cy="682" r="23" fill="${lime}"/><path d="M ${x} 346 L ${x-190} 514 L ${x-350} 682" fill="none" stroke="${lime}" stroke-width="4"/>`;
  } else if (shot === 2) {
    const dx = jump;
    motif = `<g transform="translate(${dx} 0) scale(${crop})"><rect x="1030" y="322" width="332" height="452" rx="12" fill="${light}" opacity=".08" stroke="${light}"/><rect x="1395" y="322" width="332" height="452" rx="12" fill="${light}" opacity=".08" stroke="${light}"/><path d="M 1080 700 L 1155 560 L 1230 620 L 1300 450" fill="none" stroke="${lime}" stroke-width="7"/><path d="M 1440 454 H 1674 M 1440 532 H 1600 M 1440 610 H 1640" stroke="${warm}" stroke-width="14" opacity=".75"/></g>`;
    if (c.mode === 'competing-focals') motif += `<circle cx="380" cy="300" r="125" fill="${warm}" opacity=".95"/><circle cx="810" cy="740" r="125" fill="${lime}" opacity=".95"/>`;
  } else {
    motif = `<circle cx="1420" cy="510" r="206" fill="none" stroke="${lime}" stroke-width="5"/><path d="M 1300 510 L 1390 600 L 1555 405" fill="none" stroke="${lime}" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (c.mode === 'logo-matte') motif = `<rect x="1170" y="260" width="500" height="500" fill="white"/>` + motif;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${c.width}" height="${c.height}" viewBox="0 0 ${W} ${H}"><rect width="1920" height="1080" fill="${dark}"/><path d="M 0 95 H 1920 M 0 855 H 1920" stroke="${light}" opacity=".08"/><text x="144" y="156" font-family="Avenir Next,sans-serif" font-size="28" letter-spacing="5" fill="${lime}">STUDIO / MOTION STUDY</text><g opacity="${opacity}"><text data-fit-title x="${titleX}" y="${titleY}" font-family="Motion Title,Iowan Old Style,Georgia,serif" font-size="${titleSize}" font-weight="600" fill="${light}" letter-spacing="-2">${title}</text><line x1="144" y1="${titleY+55+108*(titleLines(c.copy[shot]).length-1)}" x2="${144+440*entrance}" y2="${titleY+55+108*(titleLines(c.copy[shot]).length-1)}" stroke="${warm}" stroke-width="5"/></g>${motif}${line}</svg>`;
}
