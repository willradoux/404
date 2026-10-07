import { useLayoutEffect, useState } from 'react';

const FONT = fs => `700 ${fs}px 'Inter Tight', sans-serif`;
const SPACING = -0.05; // letter-spacing em em

function context(fs, width = 300, height = 150) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.font = FONT(fs);
  ctx.letterSpacing = `${SPACING * fs}px`;
  ctx.textAlign = 'left';
  return ctx;
}

// Largura e início do desenho das letras (sem o espaçamento que sobra no fim do texto)
function inkBox(fs) {
  const m = context(fs).measureText('404');
  return { left: m.actualBoundingBoxLeft, width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight };
}

function layoutType(W, H) {
  const portrait = W < H;
  const perPx = inkBox(100).width / 100;
  const fs = Math.round(Math.min((W * (portrait ? 0.88 : 0.6)) / perPx, H * 0.62));
  const ink = inkBox(fs);
  const capH = fs * 0.72;
  const center = H * (portrait ? 0.4 : 0.44);
  return {
    fs,
    x: (W - ink.width) / 2 + ink.left, // centralizado pelo desenho real das letras
    base: Math.max(center + capH / 2, H * 0.05 + capH),
  };
}

// Contorno superior das letras por coluna de pixels, para a neve pousar em cima do 404
function topProfile(W, type) {
  const h = Math.ceil(type.base + 4);
  const ctx = context(type.fs, W, h);
  ctx.fillText('404', type.x, type.base);
  const data = ctx.getImageData(0, 0, W, h).data;
  const profile = new Float32Array(W).fill(Infinity);
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < h; y++) {
      if (data[(y * W + x) * 4 + 3] > 128) { profile[x] = y; break; }
    }
  }
  return profile;
}

// "404" de vidro fosco: um bloco com backdrop-filter recortado no formato do texto,
// mais um tom branco suave e sombra. Fica parado; só o fundo se move.
export default function Glass404({ W, H, fontsReady, shared }) {
  const [type, setType] = useState(() => layoutType(W, H));

  useLayoutEffect(() => {
    const next = layoutType(W, H);
    setType(next);
    shared.type = next;
    shared.profile = topProfile(W, next);
  }, [W, H, fontsReady, shared]);

  const textProps = { x: type.x, y: type.base, fontSize: type.fs, className: 't404' };

  return (
    <>
      <svg width="0" height="0" className="defs" aria-hidden="true">
        <clipPath id="clip404" clipPathUnits="userSpaceOnUse">
          <text {...textProps}>404</text>
        </clipPath>
      </svg>
      <div className="frost" aria-hidden="true" />
      <svg className="glyphs" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id="fill404" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".6" stopColor="#fff" stopOpacity=".07" />
            <stop offset="1" stopColor="#fff" stopOpacity=".12" />
          </linearGradient>
          <filter id="soft" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="24" stdDeviation="30" floodColor="#00103A" floodOpacity=".18" />
          </filter>
        </defs>
        <text {...textProps} fill="url(#fill404)" filter="url(#soft)">404</text>
      </svg>
      <p className="phrase" style={{ top: type.base + type.fs * 0.12 }}>Acho que esfriou…</p>
    </>
  );
}
