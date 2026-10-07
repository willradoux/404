import { useEffect, useState } from 'react';
import { hourNow, sceneWeights } from '../scenes.js';

// Peso de cada cena pelo relógio, recalculado a cada 30 s.
export function useSceneWeights() {
  const [weights, setWeights] = useState(() => sceneWeights(hourNow()));
  useEffect(() => {
    const id = setInterval(() => setWeights(sceneWeights(hourNow())), 30000);
    return () => clearInterval(id);
  }, []);
  return weights;
}
