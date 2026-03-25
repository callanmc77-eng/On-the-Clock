import sharp from 'sharp';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/icons');

// Design: deep indigo background, white clock face with euro symbol hands
function buildSvg(size) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.38;          // clock circle radius
  const pad = s * 0.08;        // corner padding for rounded rect
  const stroke = s * 0.035;
  const tickLen = s * 0.07;
  const handW = s * 0.04;
  const shortHand = r * 0.45;
  const longHand = r * 0.68;

  // Hour hand pointing to ~10, minute hand pointing to ~2 (like 10:10 — classic clock pose)
  const hourAngle = -60  * (Math.PI / 180);  // 10 o'clock
  const minAngle  =  60  * (Math.PI / 180);  // 2 o'clock

  const hx = cx + shortHand * Math.sin(hourAngle);
  const hy = cy - shortHand * Math.cos(hourAngle);
  const mx = cx + longHand  * Math.sin(minAngle);
  const my = cy - longHand  * Math.cos(minAngle);

  // 12 hour tick marks
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 2 * Math.PI;
    const isMain = i % 3 === 0;
    const outer = r * 0.95;
    const inner = outer - (isMain ? tickLen * 1.2 : tickLen * 0.7);
    const x1 = cx + outer * Math.sin(a);
    const y1 = cy - outer * Math.cos(a);
    const x2 = cx + inner * Math.sin(a);
    const y2 = cy - inner * Math.cos(a);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
      stroke="white" stroke-width="${(isMain ? stroke * 1.2 : stroke * 0.7).toFixed(1)}" stroke-linecap="round" opacity="${isMain ? 0.9 : 0.5}"/>`;
  }

  // Euro sign size
  const euroSize = (r * 0.52).toFixed(1);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${s}" height="${s}" rx="${(s * 0.22).toFixed(1)}" fill="url(#bg)"/>

  <!-- Clock face -->
  <circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="url(#face)" stroke="white" stroke-width="${(stroke * 0.6).toFixed(1)}" stroke-opacity="0.25"/>

  <!-- Tick marks -->
  ${ticks}

  <!-- Hour hand -->
  <line x1="${cx}" y1="${cy}" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}"
    stroke="white" stroke-width="${(handW * 1.2).toFixed(1)}" stroke-linecap="round" opacity="0.95"/>

  <!-- Minute hand -->
  <line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}"
    stroke="white" stroke-width="${handW.toFixed(1)}" stroke-linecap="round" opacity="0.95"/>

  <!-- Centre dot -->
  <circle cx="${cx}" cy="${cy}" r="${(stroke * 1.2).toFixed(1)}" fill="white"/>

  <!-- Euro symbol bottom-right of clock -->
  <text
    x="${(cx + r * 0.38).toFixed(1)}"
    y="${(cy + r * 0.62).toFixed(1)}"
    font-family="-apple-system, 'Helvetica Neue', sans-serif"
    font-size="${euroSize}"
    font-weight="800"
    fill="#a5b4fc"
    text-anchor="middle"
    dominant-baseline="middle"
    opacity="0.9">€</text>
</svg>`;
}

async function makeIcon(size, filename) {
  const svg = Buffer.from(buildSvg(size));
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(path.join(outDir, filename));
  console.log(`✓ ${filename} (${size}x${size})`);
}

await makeIcon(512, 'icon-512.png');
await makeIcon(192, 'icon-192.png');
await makeIcon(180, 'apple-touch-icon.png');

console.log('Icons generated.');
