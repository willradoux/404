import { useEffect, useRef, useState } from 'react';
import { DATA, LQIP, SCENES, imageUrl, mainScene } from './scenes.js';
import { useSceneWeights } from './hooks/useSceneWeights.js';
import { useViewport } from './hooks/useViewport.js';
import { useMotion } from './hooks/useMotion.js';
import { useDecodedImages } from './hooks/useDecodedImages.js';
import World from './components/World.jsx';
import Glass404 from './components/Glass404.jsx';
import Snow from './components/Snow.jsx';
import RepoLink from './components/RepoLink.jsx';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export default function App() {
  const rootRef = useRef(null);
  const worldRef = useRef(null);
  const weights = useSceneWeights();
  const vp = useViewport();
  const motion = useMotion(rootRef, worldRef);
  const shared = useRef({ type: null, profile: null }).current; // layout do 404, lido pela neve

  /* ---------- Abertura ----------
     Prévia minúscula e desfocada na hora; a cena nítida, o 404 e a frase só aparecem
     quando a foto foi decodificada e a fonte carregou. As outras cenas vêm depois. */
  const [fontsReady, setFontsReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [preloadAll, setPreloadAll] = useState(false);

  const visible = SCENES.filter(s => weights[s] > 0.001);
  const wanted = preloadAll ? SCENES : visible;
  const decoded = useDecodedImages(wanted.map(s => imageUrl(s, vp.ratio)));
  const visibleLoaded = visible.every(s => decoded.has(imageUrl(s, vp.ratio)));

  useEffect(() => {
    let alive = true;
    Promise.race([document.fonts.load("700 100px 'Inter Tight'"), wait(2500)]).then(() => alive && setFontsReady(true));
    const id = setTimeout(() => setTimedOut(true), 6000); // nunca fica presa na prévia
    return () => { alive = false; clearTimeout(id); };
  }, []);

  useEffect(() => {
    if (ready || !((visibleLoaded && fontsReady) || timedOut)) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [ready, visibleLoaded, fontsReady, timedOut]);

  useEffect(() => {
    if (!ready) return;
    const a = setTimeout(() => setShowPreview(false), 1600);
    const b = setTimeout(() => setPreloadAll(true), 2500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [ready]);

  /* ---------- Layout ---------- */
  const { W, H, ratio, box } = vp;
  const hz = SCENES.reduce((sum, s) => sum + DATA[s][ratio].hz * weights[s], 0);
  const hzPx = box.y + hz * box.h;
  const theme = weights.dia > 0.5 ? 'light' : weights.noite > 0.5 ? 'night' : '';
  const style = {
    '--fx': `${box.x}px`, '--fy': `${box.y}px`, '--fw': `${box.w}px`, '--fh': `${box.h}px`,
    '--hzpx': `${hzPx}px`,
  };

  return (
    <div ref={rootRef} className={['app', theme, ready && 'ready'].filter(Boolean).join(' ')} style={style}>
      {showPreview && (
        <div className="preview" aria-hidden="true"
          style={{ backgroundImage: `url("${LQIP[`${mainScene(weights)}-${ratio}`]}")` }} />
      )}
      <World worldRef={worldRef} weights={weights} ratio={ratio} decoded={decoded} motion={motion} />
      <main>
        <h1 className="sr-only">Erro 404: página não encontrada</h1>
        <Glass404 W={W} H={H} fontsReady={fontsReady} shared={shared} />
      </main>
      <Snow vp={vp} weights={weights} hzPx={hzPx} motion={motion} shared={shared} />
      <RepoLink />
    </div>
  );
}
