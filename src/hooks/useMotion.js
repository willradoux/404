import { useEffect, useRef } from 'react';
import { reduceMotion } from '../ticker.js';
import { useFrame } from './useFrame.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Paralaxe (ponteiro ou giroscópio), vento e posição do ponteiro.
// Fica num objeto mutável lido pelos canvas a cada quadro, sem re-renderizar o React;
// as camadas recebem o deslocamento como variáveis CSS em `rootRef`.
export function useMotion(rootRef, worldRef) {
  const motion = useRef({
    off: { sky: { x: 0, y: 0 }, ground: { x: 0, y: 0 } },
    kb: new DOMMatrix(), // zoom lento (Ken Burns) da camada da paisagem
    wind: 0,
    mouse: { x: -999, y: -999 },
  }).current;

  const input = useRef({ target: { x: 0, y: 0 }, par: { x: 0, y: 0 }, gust: 0, lastX: null }).current;

  useEffect(() => {
    const onMove = e => {
      if (!reduceMotion) input.target = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 };
      if (input.lastX !== null) input.gust = clamp(input.gust + (e.clientX - input.lastX) * 0.006, -4, 4);
      input.lastX = e.clientX;
      motion.mouse = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      motion.mouse = { x: -999, y: -999 };
      input.lastX = null;
    };
    const onTilt = e => {
      if (e.gamma == null || reduceMotion) return;
      input.target = { x: clamp(e.gamma / 25, -1, 1), y: clamp((e.beta - 45) / 25, -1, 1) };
    };
    addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    addEventListener('deviceorientation', onTilt);
    return () => {
      removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      removeEventListener('deviceorientation', onTilt);
    };
  }, [input, motion]);

  useFrame((t, dt) => {
    const { par, target } = input;
    par.x += (target.x - par.x) * 0.05;
    par.y += (target.y - par.y) * 0.05;
    motion.off.sky = { x: -par.x * 6, y: -par.y * 4 };
    motion.off.ground = { x: -par.x * 16, y: -par.y * 8 };

    input.gust *= Math.pow(0.965, dt);
    motion.wind = 0.3 * Math.sin(t * 0.00023) + 0.45 * Math.sin(t * 0.00071) * Math.sin(t * 0.00013) + input.gust;

    const root = rootRef.current;
    if (root) {
      const set = (k, v) => root.style.setProperty(k, `${v.toFixed(2)}px`);
      set('--sx', motion.off.sky.x);
      set('--sy', motion.off.sky.y);
      set('--gx', motion.off.ground.x);
      set('--gy', motion.off.ground.y);
    }
    const tf = worldRef.current ? getComputedStyle(worldRef.current).transform : 'none';
    motion.kb = new DOMMatrix(tf === 'none' ? undefined : tf);
  });

  return motion;
}
