import { useEffect, useRef } from 'react';
import { DATA, SCENES } from '../scenes.js';
import { useFrame } from '../hooks/useFrame.js';

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);

function newFlake(W, H, anywhere) {
  const z = Math.pow(Math.random(), 1.5); // mais flocos ao fundo
  return {
    x: rand(-50, W + 50), y: anywhere ? rand(-H, H) : rand(-30, -5),
    z, r: 0.5 + z * 2.6, vx: 0, vy: 0.3 + z * 1.15, p: rand(0, TAU), settled: 0, onType: false,
  };
}

// Tudo o que é partícula, num canvas por cima da cena: neve caindo (pousa no chão e
// acumula em cima do 404), brilhos na neve e nas estrelas, a respiração do urso no
// frio e os punhados de neve levantados por cliques.
export default function Snow({ vp, weights, hzPx, motion, shared }) {
  const canvasRef = useRef(null);
  const props = useRef(null);
  props.current = { vp, weights, hzPx };
  const sim = useRef({ flakes: [], glints: [], vapor: [], puffs: [], nextBreath: 0 }).current;

  // ponto da foto (u, v) → tela, com a paralaxe da camada e o zoom lento
  const toScreen = (u, v, layer) => {
    const { box, W, H } = props.current.vp;
    const o = motion.off[layer];
    const q = motion.kb.transformPoint(new DOMPoint(box.x + u * box.w + o.x - W * 0.5, box.y + v * box.h + o.y - H * 0.6));
    return { x: q.x + W * 0.5, y: q.y + H * 0.6 };
  };

  // tamanho do canvas e quantidade de flocos acompanham a tela
  useEffect(() => {
    const { W, H } = vp;
    const canvas = canvasRef.current;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(340, Math.round((W * H) / 6500));
    if (sim.flakes.length !== count) sim.flakes = Array.from({ length: count }, () => newFlake(W, H, true));
    if (!sim.glints.length) {
      sim.glints = Array.from({ length: 90 }, () => ({ u: Math.random(), v: Math.random(), p: rand(0, TAU), s: rand(0.4, 1.4), k: Math.random() }));
    }
  }, [vp, sim]);

  // clique levanta um punhado de neve
  useEffect(() => {
    const onDown = e => {
      if (e.target.closest('a')) return;
      const power = e.clientY > props.current.hzPx ? 1 : 0.5;
      for (let i = 0; i < 18; i++) {
        sim.puffs.push({ x: e.clientX + rand(-8, 8), y: e.clientY, vx: rand(-2.2, 2.2) * power, vy: -rand(1.5, 4) * power, r: rand(1, 3), life: 1, floor: e.clientY });
      }
    };
    addEventListener('pointerdown', onDown);
    return () => removeEventListener('pointerdown', onDown);
  }, [sim]);

  useFrame((t, dt) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { vp: { W, H, ratio }, weights: w, hzPx } = props.current;
    const wind = motion.wind;
    const hzU = SCENES.reduce((a, s) => a + DATA[s][ratio].hz * w[s], 0);
    ctx.clearRect(0, 0, W, H);

    /* brilhos: neve cintilando ao sol, gelo e estrelas à noite */
    for (const g of sim.glints) {
      const tw = Math.pow(Math.max(0, Math.sin(g.p + t * 0.001 * g.s)), 14);
      if (tw < 0.02) continue;
      let pt, color, size, a;
      if (g.k < 0.35 && w.noite > 0.02) {
        pt = toScreen(g.u, g.v * (hzU - 0.25), 'sky');
        color = '220,240,255'; size = 2 + g.s * 2; a = tw * w.noite;
      } else {
        pt = toScreen(g.u, hzU + 0.03 + g.v * (0.95 - hzU), 'ground');
        color = w.noite > 0.5 ? '190,255,235' : w['por-do-sol'] > 0.5 ? '255,226,190' : '255,255,255';
        size = 2.5 + g.s * 3.5; a = tw * (w.dia + w['por-do-sol'] * 0.9 + w.noite * 0.7);
      }
      ctx.globalAlpha = a;
      ctx.strokeStyle = ctx.fillStyle = `rgb(${color})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(pt.x - size, pt.y); ctx.lineTo(pt.x + size, pt.y);
      ctx.moveTo(pt.x, pt.y - size); ctx.lineTo(pt.x, pt.y + size);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 1, 0, TAU); ctx.fill();
    }

    /* respiração do urso (pôr do sol e noite) */
    if (t > sim.nextBreath) {
      sim.nextBreath = t + rand(3200, 4600);
      for (const s of ['noite', 'por-do-sol']) {
        if (w[s] < 0.1) continue;
        const [u, v] = DATA[s][ratio].bear;
        for (let i = 0; i < 7; i++) sim.vapor.push({ u, v, dx: rand(-3, 3), dy: 0, r: rand(3, 6), life: 1, delay: i * 4, w: w[s] });
      }
    }
    sim.vapor = sim.vapor.filter(p => p.life > 0);
    for (const p of sim.vapor) {
      if (p.delay > 0) { p.delay -= dt; continue; }
      p.dy -= 0.35 * dt; p.dx += (wind * 0.25 + rand(-0.1, 0.1)) * dt; p.r += 0.25 * dt; p.life -= 0.012 * dt;
      const b = toScreen(p.u, p.v, 'ground');
      const x = b.x + p.dx;
      const y = b.y + p.dy;
      const g = ctx.createRadialGradient(x, y, 0, x, y, p.r);
      g.addColorStop(0, `rgba(255,255,255,${0.22 * p.life * p.w})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = 1; ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, p.r, 0, TAU); ctx.fill();
    }

    /* neve caindo */
    ctx.fillStyle = '#fff';
    const profile = shared.profile;
    const { mouse } = motion;
    for (const f of sim.flakes) {
      if (f.settled) {
        f.settled -= (f.onType ? 0.0018 : 0.006) * dt;
        if (f.settled <= 0) Object.assign(f, newFlake(W, H, false));
        ctx.globalAlpha = Math.max(0, f.settled) * (0.55 + f.z * 0.45);
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, TAU); ctx.fill();
        continue;
      }
      f.vx += (wind * (0.35 + f.z) + Math.sin(f.p + t * 0.0014) * 0.3 - f.vx) * 0.05;
      if (f.z > 0.45) { // o ponteiro abre caminho na neve mais próxima
        const dx = f.x - mouse.x, dy = f.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 6400) { const d = Math.sqrt(d2) || 1; f.vx += (dx / d) * 0.5; f.y += (dy / d) * 0.3; }
      }
      const prevY = f.y;
      f.x += f.vx * dt; f.y += f.vy * dt;
      if (f.x < -60) f.x = W + 50; else if (f.x > W + 60) f.x = -50;
      const col = Math.round(f.x);
      const top = f.z > 0.4 && profile && col >= 0 && col < profile.length ? profile[col] : Infinity;
      if (top !== Infinity && prevY < top && f.y >= top) {
        f.y = top - f.r * 0.4; f.settled = 1; f.onType = true; // acumula em cima do 404
      } else {
        // perspectiva: flocos distantes pousam perto do horizonte, os próximos lá embaixo
        const land = hzPx + (H - hzPx) * (0.06 + 0.94 * Math.pow(f.z, 0.8));
        if (f.y >= land) { f.y = land; f.settled = 1; f.onType = false; }
      }
      ctx.globalAlpha = 0.3 + f.z * 0.6;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, TAU); ctx.fill();
    }

    /* punhados de neve */
    sim.puffs = sim.puffs.filter(p => p.life > 0);
    for (const p of sim.puffs) {
      p.vy += 0.14 * dt; p.vx *= 0.98; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= 0.018 * dt;
      if (p.y > p.floor + 4) { p.y = p.floor + 4; p.vy *= -0.2; p.vx *= 0.6; }
      ctx.globalAlpha = Math.max(0, p.life) * 0.9;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  });

  return <canvas ref={canvasRef} className="fx" aria-hidden="true" />;
}
