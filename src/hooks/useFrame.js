import { useEffect, useRef } from 'react';
import { subscribe } from '../ticker.js';

// Roda `callback(t, dt)` a cada quadro, sempre com a versão mais recente da função.
export function useFrame(callback) {
  const ref = useRef(callback);
  ref.current = callback;
  useEffect(() => subscribe((t, dt) => ref.current(t, dt)), []);
}
