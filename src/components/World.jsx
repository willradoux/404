import { useRef } from 'react';
import { DATA, SCENES, auroraUrl, imageUrl } from '../scenes.js';
import { useFrame } from '../hooks/useFrame.js';
import Aurora from './Aurora.jsx';

// As três cenas empilhadas; o peso de cada uma (pela hora) vira a opacidade.
// Cada foto tem duas camadas: céu e chão, que se movem em velocidades diferentes.
export default function World({ worldRef, weights, ratio, decoded, motion }) {
  const mistRef = useRef(null);
  const mistX = useRef(0);

  // neve soprada no horizonte acompanha o vento
  useFrame((t, dt) => {
    mistX.current += (0.35 + motion.wind * 0.6) * dt;
    if (mistRef.current) mistRef.current.style.backgroundPosition = `${mistX.current.toFixed(1)}px 0`;
  });

  return (
    <div className="world" ref={worldRef} aria-hidden="true">
      {SCENES.map(scene => {
        const d = DATA[scene][ratio];
        const url = imageUrl(scene, ratio);
        const bg = decoded.has(url) ? { backgroundImage: `url("${url}")` } : undefined;
        const style = { opacity: weights[scene], '--hz': `${d.hz * 100}%` };
        if (d.sun) {
          style['--sunx'] = `${d.sun[0] * 100}%`;
          style['--suny'] = `${d.sun[1] * 100}%`;
        }
        return (
          <div key={scene} className="scene" data-s={scene} style={style}>
            <div className="pl ground" style={bg} />
            <div className="pl sky" style={bg}>{d.sun && <span className="sun" />}</div>
            {scene === 'noite' && (
              <div className="pl aurora-wrap">
                <Aurora src={auroraUrl(ratio)} active={weights.noite > 0.01} />
              </div>
            )}
          </div>
        );
      })}
      <div className="mist" ref={mistRef} />
    </div>
  );
}
