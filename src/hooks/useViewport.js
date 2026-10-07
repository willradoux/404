import { useEffect, useState } from 'react';
import { RATIOS, pickRatio } from '../scenes.js';

const OVERSCAN = 1.03; // sobra mínima para a paralaxe não mostrar bordas

function measure() {
  const W = innerWidth;
  const H = innerHeight;
  const ratio = pickRatio(W, H);
  const ar = RATIOS[ratio];
  const h = Math.max(W / ar, H) * OVERSCAN;
  const w = h * ar;
  // caixa "cover" da imagem: todas as camadas usam a mesma, então pontos da foto viram pontos da tela
  return { W, H, ratio, box: { x: (W - w) / 2, y: (H - h) / 2, w, h } };
}

export function useViewport() {
  const [vp, setVp] = useState(measure);
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp(measure()));
    };
    addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
    };
  }, []);
  return vp;
}
