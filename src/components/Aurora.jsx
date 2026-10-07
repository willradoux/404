import { useEffect, useRef } from 'react';
import { useFrame } from '../hooks/useFrame.js';

// Aurora ondulando: textura pequena do céu noturno desenhada em faixas horizontais
// deslocadas em onda. Leve; um filtro SVG de turbulência travava a página.
export default function Aurora({ src, active }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const frame = useRef(0);

  const draw = t => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext('2d');
    const { width: w, height: h } = img;
    ctx.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y += 2) {
      const dx = Math.sin(y * 0.018 + t * 0.0005) * w * 0.008 + Math.sin(y * 0.047 - t * 0.0009) * w * 0.004;
      ctx.drawImage(img, 0, y, w, 2, dx, y, w, 2);
    }
  };

  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => {
      if (!alive || !canvasRef.current) return;
      imgRef.current = img;
      canvasRef.current.width = img.width;
      canvasRef.current.height = img.height;
      draw(0);
    };
    img.src = src;
    return () => { alive = false; };
  }, [src]);

  useFrame(t => {
    if (active && ++frame.current % 2 === 0) draw(t); // a cada 2 quadros, só quando a noite aparece
  });

  return <canvas ref={canvasRef} className="aurora" />;
}
