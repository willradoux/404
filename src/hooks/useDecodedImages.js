import { useEffect, useState } from 'react';

// Decodifica as imagens fora da thread principal antes de usá-las, para a página
// não engasgar quando uma foto grande entra.
const cache = new Map();

function decode(url) {
  if (!cache.has(url)) {
    const img = new Image();
    img.src = url;
    cache.set(url, img.decode().then(() => url, () => url));
  }
  return cache.get(url);
}

// Devolve o conjunto de URLs já prontas para aparecer.
export function useDecodedImages(urls) {
  const [ready, setReady] = useState(() => new Set());
  const key = urls.join('|');
  useEffect(() => {
    let alive = true;
    for (const url of urls) {
      decode(url).then(done => {
        if (alive) setReady(prev => (prev.has(done) ? prev : new Set(prev).add(done)));
      });
    }
    return () => { alive = false; };
  }, [key]);
  return ready;
}
