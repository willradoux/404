// Um único requestAnimationFrame para toda a página. Os componentes se inscrevem
// com useFrame; o loop para quando ninguém está inscrito ou a aba fica oculta.

export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const subscribers = new Set();
let raf = 0;
let last = 0;

function tick(t) {
  const dt = Math.min((t - last) / 16.67 || 1, 3); // 1 = um quadro a 60 fps
  last = t;
  for (const fn of subscribers) fn(t, dt);
  raf = reduceMotion ? 0 : requestAnimationFrame(tick); // movimento reduzido: só um quadro
}

function start() {
  if (!raf && subscribers.size && !document.hidden) raf = requestAnimationFrame(tick);
}

function stop() {
  cancelAnimationFrame(raf);
  raf = 0;
}

document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

export function subscribe(fn) {
  subscribers.add(fn);
  start();
  return () => {
    subscribers.delete(fn);
    if (!subscribers.size) stop();
  };
}
